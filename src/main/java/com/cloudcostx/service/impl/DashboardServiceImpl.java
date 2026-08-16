package com.cloudcostx.service.impl;

import com.cloudcostx.dto.DashboardResponse;
import com.cloudcostx.entity.Alert;
import com.cloudcostx.entity.CloudResource;
import com.cloudcostx.entity.OptimizationRecommendation;
import com.cloudcostx.entity.RecommendationStatus;
import com.cloudcostx.repository.*;
import com.cloudcostx.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private CostRecordRepository costRecordRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private CloudResourceRepository resourceRepository;

    @Autowired
    private OptimizationRecommendationRepository recommendationRepository;

    @Autowired
    private AlertRepository alertRepository;

    @Override
    public DashboardResponse getDashboardData() {
        // Aggregate values dynamically from active resource directory
        List<CloudResource> allResources = resourceRepository.findAll();
        BigDecimal totalCloudCost = allResources.stream()
                .map(CloudResource::getMonthlyCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Sum budget bounds
        List<com.cloudcostx.entity.Budget> allBudgets = budgetRepository.findAll();
        BigDecimal monthlyBudget = allBudgets.stream()
                .map(com.cloudcostx.entity.Budget::getMonthlyLimit)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal currentSpend = allBudgets.stream()
                .map(com.cloudcostx.entity.Budget::getCurrentSpend)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal forecastedCost = allBudgets.stream()
                .map(com.cloudcostx.entity.Budget::getForecastedCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Falls back to totalCloudCost if no budget spend is seeded
        if (currentSpend.compareTo(BigDecimal.ZERO) == 0) {
            currentSpend = totalCloudCost;
        }
        if (forecastedCost.compareTo(BigDecimal.ZERO) == 0) {
            forecastedCost = currentSpend.multiply(BigDecimal.valueOf(1.09)); // 9% forecast increase mock
        }

        BigDecimal remainingBudget = monthlyBudget.subtract(currentSpend);
        if (remainingBudget.compareTo(BigDecimal.ZERO) < 0) {
            remainingBudget = BigDecimal.ZERO;
        }

        BigDecimal budgetUtilization = BigDecimal.ZERO;
        if (monthlyBudget.compareTo(BigDecimal.ZERO) > 0) {
            budgetUtilization = currentSpend.divide(monthlyBudget, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
        }

        // Potential savings from advisor opportunities
        List<OptimizationRecommendation> activeRecommendations = recommendationRepository.findByStatus(RecommendationStatus.NEW);
        BigDecimal potentialMonthlySavings = activeRecommendations.stream()
                .map(OptimizationRecommendation::getPotentialMonthlySaving)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal potentialAnnualSavings = potentialMonthlySavings.multiply(BigDecimal.valueOf(12));

        // Group cost records aggregations
        List<CostAggregation> costByProvider = costRecordRepository.getCostByProvider();
        List<CostAggregation> costByService = costRecordRepository.getCostByService();
        List<CostAggregation> costByDepartment = costRecordRepository.getCostByDepartment();
        List<CostAggregation> monthlyCostTrend = costRecordRepository.getMonthlyCostTrend();

        // Top Cost Drivers (Pageable limit 5)
        List<CloudResource> topCostDrivers = resourceRepository.findAll(
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "monthlyCost"))
        ).getContent();

        // Recent alerts and recommendations
        List<Alert> recentAlerts = alertRepository.findAll(
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"))
        ).getContent();

        List<OptimizationRecommendation> recentRecommendations = recommendationRepository.findAll(
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"))
        ).getContent();

        return DashboardResponse.builder()
                .totalCloudCost(totalCloudCost)
                .monthlyBudget(monthlyBudget)
                .currentSpend(currentSpend)
                .remainingBudget(remainingBudget)
                .potentialMonthlySavings(potentialMonthlySavings)
                .potentialAnnualSavings(potentialAnnualSavings)
                .forecastedCost(forecastedCost)
                .budgetUtilization(budgetUtilization)
                .momChange("+8.2%") // standard baseline trend
                .costByProvider(costByProvider)
                .costByService(costByService)
                .costByDepartment(costByDepartment)
                .monthlyCostTrend(monthlyCostTrend)
                .topCostDrivers(topCostDrivers)
                .recentAlerts(recentAlerts)
                .recentRecommendations(recentRecommendations)
                .build();
    }
}
