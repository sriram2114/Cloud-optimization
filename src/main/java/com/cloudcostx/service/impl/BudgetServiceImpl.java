package com.cloudcostx.service.impl;

import com.cloudcostx.entity.*;
import com.cloudcostx.exception.ResourceNotFoundException;
import com.cloudcostx.repository.AlertRepository;
import com.cloudcostx.repository.BudgetRepository;
import com.cloudcostx.repository.NotificationRepository;
import com.cloudcostx.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class BudgetServiceImpl implements BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public List<Budget> getAllBudgets() {
        return budgetRepository.findAll();
    }

    @Override
    public Budget getBudgetById(String id) {
        return budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget allocation not found with ID: " + id));
    }

    @Override
    @Transactional
    public Budget createBudget(Budget budget) {
        if (budget.getId() == null) {
            budget.setId("b-" + java.util.UUID.randomUUID().toString().substring(0, 4));
        }
        evaluateSingleBudget(budget);
        return budgetRepository.save(budget);
    }

    @Override
    @Transactional
    public Budget updateBudget(String id, Budget budgetDetails) {
        Budget budget = getBudgetById(id);
        
        budget.setBudgetName(budgetDetails.getBudgetName());
        budget.setProject(budgetDetails.getProject());
        budget.setDepartment(budgetDetails.getDepartment());
        budget.setMonthlyLimit(budgetDetails.getMonthlyLimit());
        budget.setAlertThreshold(budgetDetails.getAlertThreshold());
        if (budgetDetails.getCurrentSpend() != null) {
            budget.setCurrentSpend(budgetDetails.getCurrentSpend());
        }
        if (budgetDetails.getForecastedCost() != null) {
            budget.setForecastedCost(budgetDetails.getForecastedCost());
        }
        
        evaluateSingleBudget(budget);
        return budgetRepository.save(budget);
    }

    @Override
    @Transactional
    public void deleteBudget(String id) {
        Budget budget = getBudgetById(id);
        budgetRepository.delete(budget);
    }

    @Override
    @Transactional
    public void evaluateBudgets() {
        List<Budget> budgets = budgetRepository.findAll();
        for (Budget b : budgets) {
            evaluateSingleBudget(b);
            budgetRepository.save(b);
        }
    }

    private void evaluateSingleBudget(Budget budget) {
        if (budget.getMonthlyLimit() == null || budget.getMonthlyLimit().compareTo(BigDecimal.ZERO) == 0) {
            budget.setStatus(BudgetStatus.HEALTHY);
            return;
        }

        BigDecimal limit = budget.getMonthlyLimit();
        BigDecimal spend = budget.getCurrentSpend() != null ? budget.getCurrentSpend() : BigDecimal.ZERO;
        
        BigDecimal utilizationPct = spend.divide(limit, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
        BigDecimal threshold = budget.getAlertThreshold();
        
        BudgetStatus oldStatus = budget.getStatus();
        BudgetStatus newStatus = BudgetStatus.HEALTHY;

        if (utilizationPct.compareTo(BigDecimal.valueOf(100)) >= 0) {
            newStatus = BudgetStatus.EXCEEDED;
        } else if (utilizationPct.compareTo(threshold) >= 0) {
            newStatus = BudgetStatus.WARNING;
        }

        budget.setStatus(newStatus);

        // Generate Alerts if state degraded
        if (oldStatus != newStatus) {
            if (newStatus == BudgetStatus.EXCEEDED && oldStatus != BudgetStatus.EXCEEDED) {
                triggerAlert(budget, "Budget limit exceeded for: " + budget.getBudgetName(),
                        String.format("Critical: spent %s of allocated limit %s (%s%% consumed)", 
                                spend.setScale(0, RoundingMode.HALF_UP), limit.setScale(0, RoundingMode.HALF_UP), utilizationPct.setScale(1, RoundingMode.HALF_UP)),
                        RecommendationSeverity.CRITICAL);
            } else if (newStatus == BudgetStatus.WARNING && oldStatus == BudgetStatus.HEALTHY) {
                triggerAlert(budget, "Budget threshold reached for: " + budget.getBudgetName(),
                        String.format("Warning: spent %s of allocated limit %s (%s%% consumed)", 
                                spend.setScale(0, RoundingMode.HALF_UP), limit.setScale(0, RoundingMode.HALF_UP), utilizationPct.setScale(1, RoundingMode.HALF_UP)),
                        RecommendationSeverity.HIGH);
            }
        }
    }

    private void triggerAlert(Budget budget, String title, String message, RecommendationSeverity severity) {
        // Create internal alert log
        Alert alert = Alert.builder()
                .alertType(AlertType.BUDGET)
                .title(title)
                .message(message)
                .severity(severity)
                .isRead(false)
                .build();
        alertRepository.save(alert);

        // Create notification banner alert
        Notification notification = Notification.builder()
                .id("n-budget-" + java.util.UUID.randomUUID().toString().substring(0, 4))
                .message(title + ". " + message)
                .type(severity == RecommendationSeverity.CRITICAL ? "error" : "warning")
                .read(false)
                .build();
        notificationRepository.save(notification);
    }
}
