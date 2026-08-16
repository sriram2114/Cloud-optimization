package com.cloudcostx.service.impl;

import com.cloudcostx.dto.ForecastDto;
import com.cloudcostx.entity.CostRecord;
import com.cloudcostx.entity.Provider;
import com.cloudcostx.repository.CostRecordRepository;
import com.cloudcostx.service.CostService;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CostServiceImpl implements CostService {

    @Autowired
    private CostRecordRepository costRecordRepository;

    @Override
    public Map<String, Object> getCosts(
            String provider,
            String service,
            String region,
            String project,
            String department,
            String environment,
            LocalDate startDate,
            LocalDate endDate,
            String search
    ) {
        // Compile dynamic Specification filters
        Specification<CostRecord> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (provider != null && !provider.equalsIgnoreCase("All")) {
                predicates.add(cb.equal(root.get("provider"), Provider.valueOf(provider.toUpperCase())));
            }
            if (service != null && !service.equalsIgnoreCase("All")) {
                predicates.add(cb.equal(root.get("serviceName"), service));
            }
            if (region != null && !region.equalsIgnoreCase("All")) {
                predicates.add(cb.equal(root.get("region"), region));
            }
            if (project != null && !project.equalsIgnoreCase("All")) {
                predicates.add(cb.equal(root.get("project"), project));
            }
            if (department != null && !department.equalsIgnoreCase("All")) {
                predicates.add(cb.equal(root.get("department"), department));
            }
            if (environment != null && !environment.equalsIgnoreCase("All")) {
                predicates.add(cb.equal(root.get("environment"), environment));
            }
            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("costDate"), startDate));
            }
            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("costDate"), endDate));
            }
            if (search != null && !search.trim().isEmpty()) {
                String pattern = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("resourceId")), pattern),
                        cb.like(cb.lower(root.get("serviceName")), pattern),
                        cb.like(cb.lower(root.get("project")), pattern)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        List<CostRecord> records = costRecordRepository.findAll(spec);

        // Sum overall total cost
        BigDecimal totalCost = records.stream()
                .map(CostRecord::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate daily averages
        long distinctDays = records.stream().map(CostRecord::getCostDate).distinct().count();
        BigDecimal averageDailyCost = BigDecimal.ZERO;
        if (distinctDays > 0) {
            averageDailyCost = totalCost.divide(BigDecimal.valueOf(distinctDays), 2, RoundingMode.HALF_UP);
        }

        // 1. Compile costTrendDaily: Group by date and list spends split by AWS, Azure, GCP
        Map<LocalDate, Map<Provider, BigDecimal>> dailyGroups = new TreeMap<>();
        for (CostRecord r : records) {
            dailyGroups.putIfAbsent(r.getCostDate(), new HashMap<>());
            Map<Provider, BigDecimal> provMap = dailyGroups.get(r.getCostDate());
            provMap.put(r.getProvider(), provMap.getOrDefault(r.getProvider(), BigDecimal.ZERO).add(r.getAmount()));
        }

        List<Map<String, Object>> costTrendDaily = new ArrayList<>();
        for (Map.Entry<LocalDate, Map<Provider, BigDecimal>> entry : dailyGroups.entrySet()) {
            Map<String, Object> dayMap = new HashMap<>();
            dayMap.put("date", entry.getKey().toString());
            
            BigDecimal awsVal = entry.getValue().getOrDefault(Provider.AWS, BigDecimal.ZERO);
            BigDecimal azureVal = entry.getValue().getOrDefault(Provider.AZURE, BigDecimal.ZERO);
            BigDecimal gcpVal = entry.getValue().getOrDefault(Provider.GCP, BigDecimal.ZERO);
            BigDecimal dayTotal = awsVal.add(azureVal).add(gcpVal);

            dayMap.put("cost", dayTotal);
            dayMap.put("aws", awsVal);
            dayMap.put("azure", azureVal);
            dayMap.put("gcp", gcpVal);
            costTrendDaily.add(dayMap);
        }

        // 2. Compile costBreakdown: Group by service category name
        Map<String, BigDecimal> categoryGroups = records.stream().collect(
                Collectors.groupingBy(
                        CostRecord::getServiceName,
                        Collectors.reducing(BigDecimal.ZERO, CostRecord::getAmount, BigDecimal::add)
                )
        );

        List<Map<String, Object>> costBreakdown = new ArrayList<>();
        for (Map.Entry<String, BigDecimal> entry : categoryGroups.entrySet()) {
            Map<String, Object> item = new HashMap<>();
            item.put("category", entry.getKey());
            item.put("cost", entry.getValue());
            costBreakdown.add(item);
        }

        // Assemble Final Map response payload
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalCost", totalCost);
        summary.put("averageDailyCost", averageDailyCost);
        summary.put("forecast", totalCost.multiply(BigDecimal.valueOf(1.09))); // projected budget forecast

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("summary", summary);
        responseData.put("costTrendDaily", costTrendDaily);
        responseData.put("costBreakdown", costBreakdown);
        responseData.put("detailedCosts", records);

        return responseData;
    }

    @Override
    public List<ForecastDto> getForecast() {
        List<CostRecord> records = costRecordRepository.findAll();
        if (records.isEmpty()) {
            return Collections.emptyList();
        }

        // Group past costs by date
        Map<LocalDate, BigDecimal> dailySpend = records.stream()
                .collect(Collectors.groupingBy(
                        CostRecord::getCostDate,
                        TreeMap::new,
                        Collectors.reducing(BigDecimal.ZERO, CostRecord::getAmount, BigDecimal::add)
                ));

        List<ForecastDto> result = new ArrayList<>();
        List<LocalDate> sortedDates = new ArrayList<>(dailySpend.keySet());

        // Append historical actual data
        for (LocalDate date : sortedDates) {
            BigDecimal actual = dailySpend.get(date);
            result.add(ForecastDto.builder()
                    .date(date)
                    .actualCost(actual)
                    .forecastedCost(actual)
                    .isForecast(false)
                    .build());
        }

        // Simple moving average calculation (7-day window) for next 15 days
        LocalDate lastDate = sortedDates.isEmpty() ? LocalDate.now() : sortedDates.get(sortedDates.size() - 1);
        int window = Math.min(7, sortedDates.size());
        
        BigDecimal windowSum = BigDecimal.ZERO;
        if (window > 0) {
            for (int i = sortedDates.size() - window; i < sortedDates.size(); i++) {
                windowSum = windowSum.add(dailySpend.get(sortedDates.get(i)));
            }
        }
        BigDecimal movingAverage = window > 0 
                ? windowSum.divide(BigDecimal.valueOf(window), 2, RoundingMode.HALF_UP) 
                : BigDecimal.ZERO;

        for (int i = 1; i <= 15; i++) {
            LocalDate forecastDate = lastDate.plusDays(i);
            // simulated small variations for realistic graph curves
            double modifier = 1.0 + (Math.sin(i) * 0.05); // +/- 5% wave fluctuation
            BigDecimal variation = movingAverage.multiply(BigDecimal.valueOf(modifier));

            result.add(ForecastDto.builder()
                    .date(forecastDate)
                    .actualCost(null)
                    .forecastedCost(variation)
                    .isForecast(true)
                    .build());
        }

        return result;
    }
}
