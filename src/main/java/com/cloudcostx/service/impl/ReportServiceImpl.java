package com.cloudcostx.service.impl;

import com.cloudcostx.entity.*;
import com.cloudcostx.repository.*;
import com.cloudcostx.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private CostRecordRepository costRecordRepository;

    @Autowired
    private CloudResourceRepository resourceRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private OptimizationRecommendationRepository recommendationRepository;

    @Autowired
    private PolicyViolationRepository violationRepository;

    @Override
    public Map<String, Object> getMonthlyCostReport(LocalDate startDate, LocalDate endDate) {
        List<CostRecord> records = filterByDateRange(startDate, endDate);
        BigDecimal totalCost = sumCosts(records);

        Map<String, Object> report = new LinkedHashMap<>();
        report.put("reportType", "Monthly Cost Report");
        report.put("startDate", startDate);
        report.put("endDate", endDate);
        report.put("totalCost", totalCost);
        report.put("totalRecords", records.size());
        report.put("costByProvider", costRecordRepository.getCostByProvider());
        report.put("costByService", costRecordRepository.getCostByService());
        report.put("monthlyTrend", costRecordRepository.getMonthlyCostTrend());
        return report;
    }

    @Override
    public Map<String, Object> getProviderCostReport(LocalDate startDate, LocalDate endDate) {
        List<CostRecord> records = filterByDateRange(startDate, endDate);
        Map<String, BigDecimal> byProvider = records.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getProvider().name(),
                        Collectors.reducing(BigDecimal.ZERO, CostRecord::getAmount, BigDecimal::add)
                ));

        Map<String, Object> report = new LinkedHashMap<>();
        report.put("reportType", "Cloud Provider Report");
        report.put("startDate", startDate);
        report.put("endDate", endDate);
        report.put("providers", byProvider);
        report.put("totalCost", sumCosts(records));
        return report;
    }

    @Override
    public Map<String, Object> getDepartmentCostReport(LocalDate startDate, LocalDate endDate) {
        List<CostRecord> records = filterByDateRange(startDate, endDate);
        Map<String, BigDecimal> byDept = records.stream()
                .collect(Collectors.groupingBy(
                        CostRecord::getDepartment,
                        Collectors.reducing(BigDecimal.ZERO, CostRecord::getAmount, BigDecimal::add)
                ));

        Map<String, Object> report = new LinkedHashMap<>();
        report.put("reportType", "Department Cost Report");
        report.put("startDate", startDate);
        report.put("endDate", endDate);
        report.put("departments", byDept);
        report.put("totalCost", sumCosts(records));
        return report;
    }

    @Override
    public Map<String, Object> getOptimizationReport() {
        List<OptimizationRecommendation> recs = recommendationRepository.findAll();
        BigDecimal totalSavings = recs.stream()
                .map(OptimizationRecommendation::getPotentialMonthlySaving)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> report = new LinkedHashMap<>();
        report.put("reportType", "Optimization Report");
        report.put("totalRecommendations", recs.size());
        report.put("potentialMonthlySavings", totalSavings);
        report.put("potentialAnnualSavings", totalSavings.multiply(BigDecimal.valueOf(12)));
        report.put("recommendations", recs);
        return report;
    }

    @Override
    public Map<String, Object> getBudgetComplianceReport() {
        List<Budget> budgets = budgetRepository.findAll();
        long healthy = budgets.stream().filter(b -> b.getStatus() == BudgetStatus.HEALTHY).count();
        long warning = budgets.stream().filter(b -> b.getStatus() == BudgetStatus.WARNING).count();
        long exceeded = budgets.stream().filter(b -> b.getStatus() == BudgetStatus.EXCEEDED).count();

        Map<String, Object> report = new LinkedHashMap<>();
        report.put("reportType", "Budget Compliance Report");
        report.put("totalBudgets", budgets.size());
        report.put("healthy", healthy);
        report.put("warning", warning);
        report.put("exceeded", exceeded);
        report.put("complianceRate", budgets.isEmpty() ? 0 :
                ((double) healthy / budgets.size()) * 100);
        report.put("budgets", budgets);
        return report;
    }

    @Override
    public Map<String, Object> getGovernanceReport() {
        List<PolicyViolation> violations = violationRepository.findAll();
        long open = violations.stream().filter(v -> v.getStatus() == ViolationStatus.OPEN).count();

        Map<String, Object> report = new LinkedHashMap<>();
        report.put("reportType", "Governance Report");
        report.put("totalViolations", violations.size());
        report.put("openViolations", open);
        report.put("resolvedViolations", violations.size() - open);
        report.put("violations", violations);
        return report;
    }

    @Override
    public String exportCostsCsv(LocalDate startDate, LocalDate endDate) {
        List<CostRecord> records = filterByDateRange(startDate, endDate);
        StringBuilder csv = new StringBuilder("Date,Provider,Service,Resource,Region,Project,Department,Amount\n");
        for (CostRecord r : records) {
            csv.append(String.format("%s,%s,%s,%s,%s,%s,%s,%s\n",
                    r.getCostDate(), r.getProvider(), r.getServiceName(),
                    r.getResourceId(), r.getRegion(), r.getProject(),
                    r.getDepartment(), r.getAmount()));
        }
        return csv.toString();
    }

    @Override
    public String exportResourcesCsv() {
        List<CloudResource> resources = resourceRepository.findAll();
        StringBuilder csv = new StringBuilder("ResourceName,Provider,Type,Region,CPU,Memory,MonthlyCost,Status\n");
        for (CloudResource r : resources) {
            csv.append(String.format("%s,%s,%s,%s,%d,%d,%s,%s\n",
                    r.getResourceName(), r.getProvider(), r.getResourceType(),
                    r.getRegion(), r.getCpuUsage(), r.getMemoryUsage(),
                    r.getMonthlyCost(), r.getStatus()));
        }
        return csv.toString();
    }

    private List<CostRecord> filterByDateRange(LocalDate start, LocalDate end) {
        if (start == null && end == null) return costRecordRepository.findAll();
        if (start != null && end != null) {
            return costRecordRepository.findByCostDateBetween(start, end);
        }
        return costRecordRepository.findAll();
    }

    private BigDecimal sumCosts(List<CostRecord> records) {
        return records.stream()
                .map(CostRecord::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
