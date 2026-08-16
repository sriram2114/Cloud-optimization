package com.cloudcostx.controller;

import com.cloudcostx.dto.ApiResponse;
import com.cloudcostx.entity.Budget;
import com.cloudcostx.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Budget>>> getAllBudgets() {
        List<Budget> budgets = budgetService.getAllBudgets();
        return ResponseEntity.ok(ApiResponse.success(budgets, "Budgets list retrieved"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Budget>> getBudgetById(@PathVariable String id) {
        Budget budget = budgetService.getBudgetById(id);
        return ResponseEntity.ok(ApiResponse.success(budget, "Budget details retrieved"));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('FINANCE')")
    public ResponseEntity<ApiResponse<Budget>> createBudget(@RequestBody Budget budget) {
        Budget created = budgetService.createBudget(budget);
        return ResponseEntity.ok(ApiResponse.success(created, "Budget allocation created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('FINANCE')")
    public ResponseEntity<ApiResponse<Budget>> updateBudget(@PathVariable String id, @RequestBody Budget budget) {
        Budget updated = budgetService.updateBudget(id, budget);
        return ResponseEntity.ok(ApiResponse.success(updated, "Budget allocation updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('FINANCE')")
    public ResponseEntity<ApiResponse<String>> deleteBudget(@PathVariable String id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.ok(ApiResponse.success("Budget allocation removed", "Budget removed successfully"));
    }
}
