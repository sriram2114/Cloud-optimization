package com.cloudcostx.dto;

import java.math.BigDecimal;

public class RoiResponse {
    private BigDecimal currentAnnualCost;
    private BigDecimal optimizationSavings;
    private BigDecimal optimizedAnnualCost;
    private BigDecimal estimatedROI;
    private BigDecimal annualValueRealized;
    private BigDecimal investmentCost;

    public RoiResponse() {}

    public RoiResponse(BigDecimal currentAnnualCost, BigDecimal optimizationSavings, BigDecimal optimizedAnnualCost, BigDecimal estimatedROI, BigDecimal annualValueRealized, BigDecimal investmentCost) {
        this.currentAnnualCost = currentAnnualCost;
        this.optimizationSavings = optimizationSavings;
        this.optimizedAnnualCost = optimizedAnnualCost;
        this.estimatedROI = estimatedROI;
        this.annualValueRealized = annualValueRealized;
        this.investmentCost = investmentCost;
    }

    // Getters and Setters
    public BigDecimal getCurrentAnnualCost() { return currentAnnualCost; }
    public void setCurrentAnnualCost(BigDecimal currentAnnualCost) { this.currentAnnualCost = currentAnnualCost; }

    public BigDecimal getOptimizationSavings() { return optimizationSavings; }
    public void setOptimizationSavings(BigDecimal optimizationSavings) { this.optimizationSavings = optimizationSavings; }

    public BigDecimal getOptimizedAnnualCost() { return optimizedAnnualCost; }
    public void setOptimizedAnnualCost(BigDecimal optimizedAnnualCost) { this.optimizedAnnualCost = optimizedAnnualCost; }

    public BigDecimal getEstimatedROI() { return estimatedROI; }
    public void setEstimatedROI(BigDecimal estimatedROI) { this.estimatedROI = estimatedROI; }

    public BigDecimal getAnnualValueRealized() { return annualValueRealized; }
    public void setAnnualValueRealized(BigDecimal annualValueRealized) { this.annualValueRealized = annualValueRealized; }

    public BigDecimal getInvestmentCost() { return investmentCost; }
    public void setInvestmentCost(BigDecimal investmentCost) { this.investmentCost = investmentCost; }

    // Builder
    public static RoiResponseBuilder builder() {
        return new RoiResponseBuilder();
    }

    public static class RoiResponseBuilder {
        private BigDecimal currentAnnualCost;
        private BigDecimal optimizationSavings;
        private BigDecimal optimizedAnnualCost;
        private BigDecimal estimatedROI;
        private BigDecimal annualValueRealized;
        private BigDecimal investmentCost;

        public RoiResponseBuilder currentAnnualCost(BigDecimal currentAnnualCost) { this.currentAnnualCost = currentAnnualCost; return this; }
        public RoiResponseBuilder optimizationSavings(BigDecimal optimizationSavings) { this.optimizationSavings = optimizationSavings; return this; }
        public RoiResponseBuilder optimizedAnnualCost(BigDecimal optimizedAnnualCost) { this.optimizedAnnualCost = optimizedAnnualCost; return this; }
        public RoiResponseBuilder estimatedROI(BigDecimal estimatedROI) { this.estimatedROI = estimatedROI; return this; }
        public RoiResponseBuilder annualValueRealized(BigDecimal annualValueRealized) { this.annualValueRealized = annualValueRealized; return this; }
        public RoiResponseBuilder investmentCost(BigDecimal investmentCost) { this.investmentCost = investmentCost; return this; }

        public RoiResponse build() {
            return new RoiResponse(currentAnnualCost, optimizationSavings, optimizedAnnualCost, estimatedROI, annualValueRealized, investmentCost);
        }
    }
}
