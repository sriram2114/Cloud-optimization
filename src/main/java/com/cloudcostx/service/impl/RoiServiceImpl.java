package com.cloudcostx.service.impl;

import com.cloudcostx.dto.RoiResponse;
import com.cloudcostx.entity.CloudResource;
import com.cloudcostx.entity.OptimizationRecommendation;
import com.cloudcostx.entity.RecommendationStatus;
import com.cloudcostx.repository.CloudResourceRepository;
import com.cloudcostx.repository.OptimizationRecommendationRepository;
import com.cloudcostx.service.RoiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class RoiServiceImpl implements RoiService {

    @Autowired
    private CloudResourceRepository resourceRepository;

    @Autowired
    private OptimizationRecommendationRepository recommendationRepository;

    @Override
    public RoiResponse getRoiDetails(BigDecimal investmentCost) {
        if (investmentCost == null || investmentCost.compareTo(BigDecimal.ZERO) <= 0) {
            investmentCost = BigDecimal.valueOf(15000); // Default local FinOps tool investment config
        }

        // Sum current monthly spends
        List<CloudResource> resources = resourceRepository.findAll();
        BigDecimal monthlySpend = resources.stream()
                .map(CloudResource::getMonthlyCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal currentAnnualCost = monthlySpend.multiply(BigDecimal.valueOf(12));

        // Sum active saving opportunities
        List<OptimizationRecommendation> recs = recommendationRepository.findByStatus(RecommendationStatus.NEW);
        BigDecimal monthlySavings = recs.stream()
                .map(OptimizationRecommendation::getPotentialMonthlySaving)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal optimizationSavings = monthlySavings.multiply(BigDecimal.valueOf(12));

        BigDecimal optimizedAnnualCost = currentAnnualCost.subtract(optimizationSavings);
        if (optimizedAnnualCost.compareTo(BigDecimal.ZERO) < 0) {
            optimizedAnnualCost = BigDecimal.ZERO;
        }

        // ROI = (Savings - Investment) / Investment * 100
        BigDecimal roiPct = BigDecimal.ZERO;
        if (investmentCost.compareTo(BigDecimal.ZERO) > 0) {
            roiPct = optimizationSavings.subtract(investmentCost)
                    .divide(investmentCost, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        }

        return RoiResponse.builder()
                .currentAnnualCost(currentAnnualCost)
                .optimizationSavings(optimizationSavings)
                .optimizedAnnualCost(optimizedAnnualCost)
                .annualValueRealized(optimizationSavings)
                .estimatedROI(roiPct)
                .investmentCost(investmentCost)
                .build();
    }
}
