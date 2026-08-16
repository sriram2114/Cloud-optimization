package com.cloudcostx.service.impl;

import com.cloudcostx.entity.*;
import com.cloudcostx.repository.*;
import com.cloudcostx.service.ChargebackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ChargebackServiceImpl implements ChargebackService {

    @Autowired
    private CloudResourceRepository resourceRepository;

    @Autowired
    private OptimizationRecommendationRepository recommendationRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private AlertRepository alertRepository;

    @Override
    public Map<String, BigDecimal> getDepartmentSpends() {
        List<CloudResource> resources = resourceRepository.findAll();
        return resources.stream()
                .filter(r -> r.getProject() != null)
                .collect(Collectors.groupingBy(
                        r -> r.getProject().getDepartment(),
                        Collectors.reducing(BigDecimal.ZERO, CloudResource::getMonthlyCost, BigDecimal::add)
                ));
    }

    @Override
    public Map<String, BigDecimal> getProjectSpends() {
        List<CloudResource> resources = resourceRepository.findAll();
        return resources.stream()
                .filter(r -> r.getProject() != null)
                .collect(Collectors.groupingBy(
                        r -> r.getProject().getName(),
                        Collectors.reducing(BigDecimal.ZERO, CloudResource::getMonthlyCost, BigDecimal::add)
                ));
    }

    @Override
    public Map<String, BigDecimal> getCostCenterSpends() {
        List<CloudResource> resources = resourceRepository.findAll();
        return resources.stream()
                .filter(r -> r.getProject() != null)
                .collect(Collectors.groupingBy(
                        r -> r.getProject().getCostCenter(),
                        Collectors.reducing(BigDecimal.ZERO, CloudResource::getMonthlyCost, BigDecimal::add)
                ));
    }

    @Override
    public Map<String, Object> getFinOpsLifecycleSummary() {
        Map<String, Object> summary = new HashMap<>();

        // INFORM Phase: Where and who is spending
        Map<String, Object> inform = new HashMap<>();
        inform.put("byDepartment", getDepartmentSpends());
        inform.put("byProject", getProjectSpends());
        inform.put("byCostCenter", getCostCenterSpends());
        
        List<CloudResource> resources = resourceRepository.findAll();
        Map<Provider, BigDecimal> byProvider = resources.stream()
                .collect(Collectors.groupingBy(
                        CloudResource::getProvider,
                        Collectors.reducing(BigDecimal.ZERO, CloudResource::getMonthlyCost, BigDecimal::add)
                ));
        inform.put("byProvider", byProvider);
        summary.put("informPhase", inform);

        // OPTIMIZE Phase: Potential vs applied recommendations
        Map<String, Object> optimize = new HashMap<>();
        List<OptimizationRecommendation> allRecs = recommendationRepository.findAll();
        long newRecs = allRecs.stream().filter(r -> r.getStatus() == RecommendationStatus.NEW).count();
        long appliedRecs = allRecs.stream().filter(r -> r.getStatus() == RecommendationStatus.APPLIED).count();
        
        BigDecimal potentialMonthlySavings = allRecs.stream()
                .filter(r -> r.getStatus() == RecommendationStatus.NEW)
                .map(OptimizationRecommendation::getPotentialMonthlySaving)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        optimize.put("pendingOpportunitiesCount", newRecs);
        optimize.put("appliedOpportunitiesCount", appliedRecs);
        optimize.put("potentialMonthlySavings", potentialMonthlySavings);
        optimize.put("potentialAnnualSavings", potentialMonthlySavings.multiply(BigDecimal.valueOf(12)));
        summary.put("optimizePhase", optimize);

        // OPERATE Phase: Policies, warning alerts and budget healths
        Map<String, Object> operate = new HashMap<>();
        List<Budget> budgets = budgetRepository.findAll();
        long healthy = budgets.stream().filter(b -> b.getStatus() == BudgetStatus.HEALTHY).count();
        long breached = budgets.stream().filter(b -> b.getStatus() != BudgetStatus.HEALTHY).count();

        operate.put("healthyBudgets", healthy);
        operate.put("breachedBudgets", breached);
        
        long activeAlertsCount = alertRepository.findByIsReadFalseOrderByCreatedAtDesc().size();
        operate.put("activeAlertsCount", activeAlertsCount);
        summary.put("operatePhase", operate);

        return summary;
    }
}
