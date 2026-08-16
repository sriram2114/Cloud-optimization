package com.cloudcostx.service.impl;

import com.cloudcostx.dto.CloudComparisonDto;
import com.cloudcostx.entity.CloudResource;
import com.cloudcostx.entity.Provider;
import com.cloudcostx.repository.CloudResourceRepository;
import com.cloudcostx.service.MultiCloudComparisonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class MultiCloudComparisonServiceImpl implements MultiCloudComparisonService {

    @Autowired
    private CloudResourceRepository resourceRepository;

    @Override
    public List<CloudComparisonDto> getComparison() {
        List<CloudResource> allResources = resourceRepository.findAll();

        // Calculate AWS spends as a baseline
        BigDecimal awsSpends = allResources.stream()
                .filter(r -> r.getProvider() == Provider.AWS)
                .map(CloudResource::getMonthlyCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Fallback baseline if no AWS resource is seeded
        if (awsSpends.compareTo(BigDecimal.ZERO) == 0) {
            awsSpends = BigDecimal.valueOf(42500);
        }

        // Simulate equivalent workloads costs based on academic pricing scales
        // GCP is 22% cheaper, Azure is 10% cheaper
        BigDecimal gcpEquivalent = awsSpends.multiply(BigDecimal.valueOf(0.78)).setScale(0, RoundingMode.HALF_UP);
        BigDecimal azureEquivalent = awsSpends.multiply(BigDecimal.valueOf(0.90)).setScale(0, RoundingMode.HALF_UP);

        List<CloudComparisonDto> list = new ArrayList<>();
        list.add(CloudComparisonDto.builder()
                .provider("GCP")
                .estimatedMonthlyCost(gcpEquivalent)
                .estimatedAnnualCost(gcpEquivalent.multiply(BigDecimal.valueOf(12)))
                .potentialSavings(awsSpends.subtract(gcpEquivalent))
                .build());

        list.add(CloudComparisonDto.builder()
                .provider("Azure")
                .estimatedMonthlyCost(azureEquivalent)
                .estimatedAnnualCost(azureEquivalent.multiply(BigDecimal.valueOf(12)))
                .potentialSavings(awsSpends.subtract(azureEquivalent))
                .build());

        list.add(CloudComparisonDto.builder()
                .provider("AWS")
                .estimatedMonthlyCost(awsSpends)
                .estimatedAnnualCost(awsSpends.multiply(BigDecimal.valueOf(12)))
                .potentialSavings(BigDecimal.ZERO)
                .build());

        // Sort by estimated cost ascending
        list.sort(Comparator.comparing(CloudComparisonDto::getEstimatedMonthlyCost));

        // Assign ranks
        for (int i = 0; i < list.size(); i++) {
            list.get(i).setRank(i + 1);
        }

        return list;
    }
}
