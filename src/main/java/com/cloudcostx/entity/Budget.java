package com.cloudcostx.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "budgets")
public class Budget {
    @Id
    private String id;

    @Column(name = "budget_name", nullable = false)
    private String budgetName;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "project_id")
    private Project project;

    @Column(nullable = false)
    private String department;

    @Column(name = "monthly_limit", nullable = false, precision = 15, scale = 2)
    private BigDecimal monthlyLimit;

    @Column(name = "current_spend", nullable = false, precision = 15, scale = 2)
    private BigDecimal currentSpend;

    @Column(name = "alert_threshold", nullable = false, precision = 5, scale = 2)
    private BigDecimal alertThreshold;

    @Column(name = "forecasted_cost", nullable = false, precision = 15, scale = 2)
    private BigDecimal forecastedCost;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BudgetStatus status;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Budget() {}

    public Budget(String id, String budgetName, Project project, String department, BigDecimal monthlyLimit, BigDecimal currentSpend, BigDecimal alertThreshold, BigDecimal forecastedCost, LocalDate startDate, LocalDate endDate, BudgetStatus status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.budgetName = budgetName;
        this.project = project;
        this.department = department;
        this.monthlyLimit = monthlyLimit;
        this.currentSpend = currentSpend;
        this.alertThreshold = alertThreshold;
        this.forecastedCost = forecastedCost;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (currentSpend == null) currentSpend = BigDecimal.ZERO;
        if (forecastedCost == null) forecastedCost = BigDecimal.ZERO;
        if (status == null) status = BudgetStatus.HEALTHY;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getBudgetName() { return budgetName; }
    public void setBudgetName(String budgetName) { this.budgetName = budgetName; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public BigDecimal getMonthlyLimit() { return monthlyLimit; }
    public void setMonthlyLimit(BigDecimal monthlyLimit) { this.monthlyLimit = monthlyLimit; }

    public BigDecimal getCurrentSpend() { return currentSpend; }
    public void setCurrentSpend(BigDecimal currentSpend) { this.currentSpend = currentSpend; }

    public BigDecimal getAlertThreshold() { return alertThreshold; }
    public void setAlertThreshold(BigDecimal alertThreshold) { this.alertThreshold = alertThreshold; }

    public BigDecimal getForecastedCost() { return forecastedCost; }
    public void setForecastedCost(BigDecimal forecastedCost) { this.forecastedCost = forecastedCost; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public BudgetStatus getStatus() { return status; }
    public void setStatus(BudgetStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Builder
    public static BudgetBuilder builder() {
        return new BudgetBuilder();
    }

    public static class BudgetBuilder {
        private String id;
        private String budgetName;
        private Project project;
        private String department;
        private BigDecimal monthlyLimit;
        private BigDecimal currentSpend;
        private BigDecimal alertThreshold;
        private BigDecimal forecastedCost;
        private LocalDate startDate;
        private LocalDate endDate;
        private BudgetStatus status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public BudgetBuilder id(String id) { this.id = id; return this; }
        public BudgetBuilder budgetName(String budgetName) { this.budgetName = budgetName; return this; }
        public BudgetBuilder project(Project project) { this.project = project; return this; }
        public BudgetBuilder department(String department) { this.department = department; return this; }
        public BudgetBuilder monthlyLimit(BigDecimal monthlyLimit) { this.monthlyLimit = monthlyLimit; return this; }
        public BudgetBuilder currentSpend(BigDecimal currentSpend) { this.currentSpend = currentSpend; return this; }
        public BudgetBuilder alertThreshold(BigDecimal alertThreshold) { this.alertThreshold = alertThreshold; return this; }
        public BudgetBuilder forecastedCost(BigDecimal forecastedCost) { this.forecastedCost = forecastedCost; return this; }
        public BudgetBuilder startDate(LocalDate startDate) { this.startDate = startDate; return this; }
        public BudgetBuilder endDate(LocalDate endDate) { this.endDate = endDate; return this; }
        public BudgetBuilder status(BudgetStatus status) { this.status = status; return this; }
        public BudgetBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public BudgetBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Budget build() {
            return new Budget(id, budgetName, project, department, monthlyLimit, currentSpend, alertThreshold, forecastedCost, startDate, endDate, status, createdAt, updatedAt);
        }
    }
}
