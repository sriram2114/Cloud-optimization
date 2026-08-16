package com.cloudcostx.dto;

import com.cloudcostx.entity.Alert;
import com.cloudcostx.entity.CloudResource;
import com.cloudcostx.entity.OptimizationRecommendation;
import com.cloudcostx.repository.CostAggregation;
import java.math.BigDecimal;
import java.util.List;

public class DashboardResponse {
    private BigDecimal totalCloudCost;
    private BigDecimal monthlyBudget;
    private BigDecimal currentSpend;
    private BigDecimal remainingBudget;
    private BigDecimal potentialMonthlySavings;
    private BigDecimal potentialAnnualSavings;
    private BigDecimal forecastedCost;
    private BigDecimal budgetUtilization;
    private String momChange;

    private List<CostAggregation> costByProvider;
    private List<CostAggregation> costByService;
    private List<CostAggregation> costByDepartment;
    private List<CostAggregation> monthlyCostTrend;
    private List<CloudResource> topCostDrivers;
    private List<Alert> recentAlerts;
    private List<OptimizationRecommendation> recentRecommendations;

    public DashboardResponse() {}

    public DashboardResponse(BigDecimal totalCloudCost, BigDecimal monthlyBudget, BigDecimal currentSpend, BigDecimal remainingBudget, BigDecimal potentialMonthlySavings, BigDecimal potentialAnnualSavings, BigDecimal forecastedCost, BigDecimal budgetUtilization, String momChange, List<CostAggregation> costByProvider, List<CostAggregation> costByService, List<CostAggregation> costByDepartment, List<CostAggregation> monthlyCostTrend, List<CloudResource> topCostDrivers, List<Alert> recentAlerts, List<OptimizationRecommendation> recentRecommendations) {
        this.totalCloudCost = totalCloudCost;
        this.monthlyBudget = monthlyBudget;
        this.currentSpend = currentSpend;
        this.remainingBudget = remainingBudget;
        this.potentialMonthlySavings = potentialMonthlySavings;
        this.potentialAnnualSavings = potentialAnnualSavings;
        this.forecastedCost = forecastedCost;
        this.budgetUtilization = budgetUtilization;
        this.momChange = momChange;
        this.costByProvider = costByProvider;
        this.costByService = costByService;
        this.costByDepartment = costByDepartment;
        this.monthlyCostTrend = monthlyCostTrend;
        this.topCostDrivers = topCostDrivers;
        this.recentAlerts = recentAlerts;
        this.recentRecommendations = recentRecommendations;
    }

    // Getters and Setters
    public BigDecimal getTotalCloudCost() { return totalCloudCost; }
    public void setTotalCloudCost(BigDecimal totalCloudCost) { this.totalCloudCost = totalCloudCost; }

    public BigDecimal getMonthlyBudget() { return monthlyBudget; }
    public void setMonthlyBudget(BigDecimal monthlyBudget) { this.monthlyBudget = monthlyBudget; }

    public BigDecimal getCurrentSpend() { return currentSpend; }
    public void setCurrentSpend(BigDecimal currentSpend) { this.currentSpend = currentSpend; }

    public BigDecimal getRemainingBudget() { return remainingBudget; }
    public void setRemainingBudget(BigDecimal remainingBudget) { this.remainingBudget = remainingBudget; }

    public BigDecimal getPotentialMonthlySavings() { return potentialMonthlySavings; }
    public void setPotentialMonthlySavings(BigDecimal potentialMonthlySavings) { this.potentialMonthlySavings = potentialMonthlySavings; }

    public BigDecimal getPotentialAnnualSavings() { return potentialAnnualSavings; }
    public void setPotentialAnnualSavings(BigDecimal potentialAnnualSavings) { this.potentialAnnualSavings = potentialAnnualSavings; }

    public BigDecimal getForecastedCost() { return forecastedCost; }
    public void setForecastedCost(BigDecimal forecastedCost) { this.forecastedCost = forecastedCost; }

    public BigDecimal getBudgetUtilization() { return budgetUtilization; }
    public void setBudgetUtilization(BigDecimal budgetUtilization) { this.budgetUtilization = budgetUtilization; }

    public String getMomChange() { return momChange; }
    public void setMomChange(String momChange) { this.momChange = momChange; }

    public List<CostAggregation> getCostByProvider() { return costByProvider; }
    public void setCostByProvider(List<CostAggregation> costByProvider) { this.costByProvider = costByProvider; }

    public List<CostAggregation> getCostByService() { return costByService; }
    public void setCostByService(List<CostAggregation> costByService) { this.costByService = costByService; }

    public List<CostAggregation> getCostByDepartment() { return costByDepartment; }
    public void setCostByDepartment(List<CostAggregation> costByDepartment) { this.costByDepartment = costByDepartment; }

    public List<CostAggregation> getMonthlyCostTrend() { return monthlyCostTrend; }
    public void setMonthlyCostTrend(List<CostAggregation> monthlyCostTrend) { this.monthlyCostTrend = monthlyCostTrend; }

    public List<CloudResource> getTopCostDrivers() { return topCostDrivers; }
    public void setTopCostDrivers(List<CloudResource> topCostDrivers) { this.topCostDrivers = topCostDrivers; }

    public List<Alert> getRecentAlerts() { return recentAlerts; }
    public void setRecentAlerts(List<Alert> recentAlerts) { this.recentAlerts = recentAlerts; }

    public List<OptimizationRecommendation> getRecentRecommendations() { return recentRecommendations; }
    public void setRecentRecommendations(List<OptimizationRecommendation> recentRecommendations) { this.recentRecommendations = recentRecommendations; }

    // Builder
    public static DashboardResponseBuilder builder() {
        return new DashboardResponseBuilder();
    }

    public static class DashboardResponseBuilder {
        private BigDecimal totalCloudCost;
        private BigDecimal monthlyBudget;
        private BigDecimal currentSpend;
        private BigDecimal remainingBudget;
        private BigDecimal potentialMonthlySavings;
        private BigDecimal potentialAnnualSavings;
        private BigDecimal forecastedCost;
        private BigDecimal budgetUtilization;
        private String momChange;
        private List<CostAggregation> costByProvider;
        private List<CostAggregation> costByService;
        private List<CostAggregation> costByDepartment;
        private List<CostAggregation> monthlyCostTrend;
        private List<CloudResource> topCostDrivers;
        private List<Alert> recentAlerts;
        private List<OptimizationRecommendation> recentRecommendations;

        public DashboardResponseBuilder totalCloudCost(BigDecimal totalCloudCost) { this.totalCloudCost = totalCloudCost; return this; }
        public DashboardResponseBuilder monthlyBudget(BigDecimal monthlyBudget) { this.monthlyBudget = monthlyBudget; return this; }
        public DashboardResponseBuilder currentSpend(BigDecimal currentSpend) { this.currentSpend = currentSpend; return this; }
        public DashboardResponseBuilder remainingBudget(BigDecimal remainingBudget) { this.remainingBudget = remainingBudget; return this; }
        public DashboardResponseBuilder potentialMonthlySavings(BigDecimal potentialMonthlySavings) { this.potentialMonthlySavings = potentialMonthlySavings; return this; }
        public DashboardResponseBuilder potentialAnnualSavings(BigDecimal potentialAnnualSavings) { this.potentialAnnualSavings = potentialAnnualSavings; return this; }
        public DashboardResponseBuilder forecastedCost(BigDecimal forecastedCost) { this.forecastedCost = forecastedCost; return this; }
        public DashboardResponseBuilder budgetUtilization(BigDecimal budgetUtilization) { this.budgetUtilization = budgetUtilization; return this; }
        public DashboardResponseBuilder momChange(String momChange) { this.momChange = momChange; return this; }
        public DashboardResponseBuilder costByProvider(List<CostAggregation> costByProvider) { this.costByProvider = costByProvider; return this; }
        public DashboardResponseBuilder costByService(List<CostAggregation> costByService) { this.costByService = costByService; return this; }
        public DashboardResponseBuilder costByDepartment(List<CostAggregation> costByDepartment) { this.costByDepartment = costByDepartment; return this; }
        public DashboardResponseBuilder monthlyCostTrend(List<CostAggregation> monthlyCostTrend) { this.monthlyCostTrend = monthlyCostTrend; return this; }
        public DashboardResponseBuilder topCostDrivers(List<CloudResource> topCostDrivers) { this.topCostDrivers = topCostDrivers; return this; }
        public DashboardResponseBuilder recentAlerts(List<Alert> recentAlerts) { this.recentAlerts = recentAlerts; return this; }
        public DashboardResponseBuilder recentRecommendations(List<OptimizationRecommendation> recentRecommendations) { this.recentRecommendations = recentRecommendations; return this; }

        public DashboardResponse build() {
            return new DashboardResponse(totalCloudCost, monthlyBudget, currentSpend, remainingBudget, potentialMonthlySavings, potentialAnnualSavings, forecastedCost, budgetUtilization, momChange, costByProvider, costByService, costByDepartment, monthlyCostTrend, topCostDrivers, recentAlerts, recentRecommendations);
        }
    }
}
