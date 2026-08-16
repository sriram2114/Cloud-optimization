package com.cloudcostx;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import java.math.RoundingMode;
import static org.junit.jupiter.api.Assertions.*;

class FinOpsCalculationTests {

    @Test
    void testBudgetEvaluationMath() {
        BigDecimal limit = BigDecimal.valueOf(50000);
        BigDecimal threshold = BigDecimal.valueOf(80.00); // 80%

        // Spent 35,000 (70%) -> Healthy
        BigDecimal spendHealthy = BigDecimal.valueOf(35000);
        BigDecimal pctHealthy = spendHealthy.divide(limit, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
        assertTrue(pctHealthy.compareTo(threshold) < 0, "Spend should be under threshold (healthy)");

        // Spent 42,000 (84%) -> Warning
        BigDecimal spendWarning = BigDecimal.valueOf(42000);
        BigDecimal pctWarning = spendWarning.divide(limit, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
        assertTrue(pctWarning.compareTo(threshold) >= 0 && pctWarning.compareTo(BigDecimal.valueOf(100)) < 0, "Spend should trigger warning");

        // Spent 52,000 (104%) -> Exceeded
        BigDecimal spendExceeded = BigDecimal.valueOf(52000);
        BigDecimal pctExceeded = spendExceeded.divide(limit, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
        assertTrue(pctExceeded.compareTo(BigDecimal.valueOf(100)) >= 0, "Spend should exceed limit");
    }

    @Test
    void testRoiCalculation() {
        BigDecimal savings = BigDecimal.valueOf(24000); // Annual savings
        BigDecimal investment = BigDecimal.valueOf(10000); // Annual tool cost

        // ROI = (Savings - Investment) / Investment * 100
        // (24k - 10k) / 10k * 100 = 14k / 10k * 100 = 140.0%
        BigDecimal expectedRoi = BigDecimal.valueOf(140.00).setScale(2, RoundingMode.HALF_UP);
        BigDecimal calculatedRoi = savings.subtract(investment)
                .divide(investment, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .setScale(2, RoundingMode.HALF_UP);

        assertEquals(expectedRoi, calculatedRoi, "ROI calculation matches standard FinOps formulas");
    }
}
