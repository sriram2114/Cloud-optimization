package com.cloudcostx.dto;

import java.math.BigDecimal;

public class CloudComparisonDto {
    private String provider;
    private BigDecimal estimatedMonthlyCost;
    private BigDecimal estimatedAnnualCost;
    private BigDecimal potentialSavings;
    private int rank;

    public CloudComparisonDto() {}

    public CloudComparisonDto(String provider, BigDecimal estimatedMonthlyCost, BigDecimal estimatedAnnualCost, BigDecimal potentialSavings, int rank) {
        this.provider = provider;
        this.estimatedMonthlyCost = estimatedMonthlyCost;
        this.estimatedAnnualCost = estimatedAnnualCost;
        this.potentialSavings = potentialSavings;
        this.rank = rank;
    }

    // Getters and Setters
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public BigDecimal getEstimatedMonthlyCost() { return estimatedMonthlyCost; }
    public void setEstimatedMonthlyCost(BigDecimal estimatedMonthlyCost) { this.estimatedMonthlyCost = estimatedMonthlyCost; }

    public BigDecimal getEstimatedAnnualCost() { return estimatedAnnualCost; }
    public void setEstimatedAnnualCost(BigDecimal estimatedAnnualCost) { this.estimatedAnnualCost = estimatedAnnualCost; }

    public BigDecimal getPotentialSavings() { return potentialSavings; }
    public void setPotentialSavings(BigDecimal potentialSavings) { this.potentialSavings = potentialSavings; }

    public int getRank() { return rank; }
    public void setRank(int rank) { this.rank = rank; }

    // Builder
    public static CloudComparisonDtoBuilder builder() {
        return new CloudComparisonDtoBuilder();
    }

    public static class CloudComparisonDtoBuilder {
        private String provider;
        private BigDecimal estimatedMonthlyCost;
        private BigDecimal estimatedAnnualCost;
        private BigDecimal potentialSavings;
        private int rank;

        public CloudComparisonDtoBuilder provider(String provider) { this.provider = provider; return this; }
        public CloudComparisonDtoBuilder estimatedMonthlyCost(BigDecimal estimatedMonthlyCost) { this.estimatedMonthlyCost = estimatedMonthlyCost; return this; }
        public CloudComparisonDtoBuilder estimatedAnnualCost(BigDecimal estimatedAnnualCost) { this.estimatedAnnualCost = estimatedAnnualCost; return this; }
        public CloudComparisonDtoBuilder potentialSavings(BigDecimal potentialSavings) { this.potentialSavings = potentialSavings; return this; }
        public CloudComparisonDtoBuilder rank(int rank) { this.rank = rank; return this; }

        public CloudComparisonDto build() {
            return new CloudComparisonDto(provider, estimatedMonthlyCost, estimatedAnnualCost, potentialSavings, rank);
        }
    }
}
