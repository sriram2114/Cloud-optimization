package com.cloudcostx.service;

import com.cloudcostx.entity.Budget;
import java.util.List;

public interface BudgetService {
    List<Budget> getAllBudgets();
    Budget getBudgetById(String id);
    Budget createBudget(Budget budget);
    Budget updateBudget(String id, Budget budget);
    void deleteBudget(String id);
    void evaluateBudgets(); // Triggered manually or by scheduler to refresh statuses
}
