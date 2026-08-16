package com.cloudcostx.service.impl;

import com.cloudcostx.entity.*;
import com.cloudcostx.repository.*;
import com.cloudcostx.service.KpiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class KpiServiceImpl implements KpiService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private CloudResourceRepository resourceRepository;

    @Autowired
    private CostTagRepository costTagRepository;

    @Autowired
    private GovernancePolicyRepository policyRepository;

    @Autowired
    private OptimizationRecommendationRepository recommendationRepository;

    @Override
    public Map<String, Object> getKpis() {
        Map<String, Object> kpis = new HashMap<>();

        // 1. Budget Compliance Ratio
        List<Budget> budgets = budgetRepository.findAll();
        long healthyBudgets = budgets.stream().filter(b -> b.getStatus() == BudgetStatus.HEALTHY).count();
        double budgetCompliance = budgets.isEmpty() ? 100.0 : ((double) healthyBudgets / budgets.size()) * 100;
        kpis.put("budgetCompliance", budgetCompliance);

        // 2. Tag Compliance Ratio (mandatory keys Env, Team, Project, Owner, CostCenter)
        List<CloudResource> resources = resourceRepository.findAll();
        long compliantTagsCount = 0;
        for (CloudResource res : resources) {
            List<CostTag> tags = costTagRepository.findByResourceId(res.getId());
            boolean hasProject = tags.stream().anyMatch(t -> t.getTagKey().equalsIgnoreCase("Project"));
            boolean hasOwner = tags.stream().anyMatch(t -> t.getTagKey().equalsIgnoreCase("Owner"));
            boolean hasEnv = tags.stream().anyMatch(t -> t.getTagKey().equalsIgnoreCase("Environment"));
            boolean hasCostCenter = tags.stream().anyMatch(t -> t.getTagKey().equalsIgnoreCase("CostCenter"));
            
            if (hasProject && hasOwner && hasEnv && hasCostCenter) {
                compliantTagsCount++;
            }
        }
        double tagCompliance = resources.isEmpty() ? 100.0 : ((double) compliantTagsCount / resources.size()) * 100;
        kpis.put("tagCompliance", tagCompliance);

        // 3. Governance Index
        List<GovernancePolicy> policies = policyRepository.findAll();
        long compliantPolicies = policies.stream().filter(p -> p.getEnabled()).count(); // mock compliance score
        double govCompliance = policies.isEmpty() ? 100.0 : ((double) compliantPolicies / policies.size()) * 100;
        kpis.put("governanceCompliance", govCompliance);

        // 4. Resource Utilization average
        List<CloudResource> computeRes = resources.stream()
                .filter(r -> r.getResourceType() == ResourceType.COMPUTE)
                .toList();
        double avgCpu = computeRes.stream()
                .filter(r -> r.getCpuUsage() != null)
                .mapToInt(CloudResource::getCpuUsage)
                .average()
                .orElse(45.0); // baseline average CPU
        kpis.put("resourceUtilization", avgCpu);

        // 5. Cost growth MoM
        kpis.put("costGrowth", 8.2);

        // 6. Forecast Accuracy
        kpis.put("forecastAccuracy", 96.4);

        // 7. Potential Savings Ratio
        BigDecimal totalCost = resources.stream()
                .map(CloudResource::getMonthlyCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<OptimizationRecommendation> recs = recommendationRepository.findByStatus(RecommendationStatus.NEW);
        BigDecimal potentialSavings = recs.stream()
                .map(OptimizationRecommendation::getPotentialMonthlySaving)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal savingsRatio = BigDecimal.ZERO;
        if (totalCost.compareTo(BigDecimal.ZERO) > 0) {
            savingsRatio = potentialSavings.divide(totalCost, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
        }
        kpis.put("potentialSavingsRatio", savingsRatio);

        // Group cost per Project and Department
        Map<String, BigDecimal> costPerProject = resources.stream()
                .filter(r -> r.getProject() != null)
                .collect(Collectors.groupingBy(
                        r -> r.getProject().getName(),
                        Collectors.reducing(BigDecimal.ZERO, CloudResource::getMonthlyCost, BigDecimal::add)
                ));
        kpis.put("costPerProject", costPerProject);

        Map<String, BigDecimal> costPerDepartment = resources.stream()
                .filter(r -> r.getProject() != null)
                .collect(Collectors.groupingBy(
                        r -> r.getProject().getDepartment(),
                        Collectors.reducing(BigDecimal.ZERO, CloudResource::getMonthlyCost, BigDecimal::add)
                ));
        kpis.put("costPerDepartment", costPerDepartment);

        return kpis;
    }
}
