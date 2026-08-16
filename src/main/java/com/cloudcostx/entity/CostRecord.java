package com.cloudcostx.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "cost_records", indexes = {
    @Index(name = "idx_cost_provider", columnList = "provider"),
    @Index(name = "idx_cost_service", columnList = "service_name"),
    @Index(name = "idx_cost_date", columnList = "cost_date"),
    @Index(name = "idx_cost_project", columnList = "project"),
    @Index(name = "idx_cost_department", columnList = "department")
})
public class CostRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "resource_id", nullable = false)
    private String resourceId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Provider provider;

    @Column(name = "service_name", nullable = false)
    private String serviceName;

    @Column(nullable = false)
    private String region;

    @Column(nullable = false)
    private String project;

    @Column(nullable = false)
    private String department;

    @Column(nullable = false)
    private String environment;

    @Column(name = "cost_date", nullable = false)
    private LocalDate costDate;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private String currency;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public CostRecord() {}

    public CostRecord(Long id, String resourceId, Provider provider, String serviceName, String region, String project, String department, String environment, LocalDate costDate, BigDecimal amount, String currency, LocalDateTime createdAt) {
        this.id = id;
        this.resourceId = resourceId;
        this.provider = provider;
        this.serviceName = serviceName;
        this.region = region;
        this.project = project;
        this.department = department;
        this.environment = environment;
        this.costDate = costDate;
        this.amount = amount;
        this.currency = currency;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (currency == null) currency = "INR";
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getResourceId() { return resourceId; }
    public void setResourceId(String resourceId) { this.resourceId = resourceId; }

    public Provider getProvider() { return provider; }
    public void setProvider(Provider provider) { this.provider = provider; }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getProject() { return project; }
    public void setProject(String project) { this.project = project; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getEnvironment() { return environment; }
    public void setEnvironment(String environment) { this.environment = environment; }

    public LocalDate getCostDate() { return costDate; }
    public void setCostDate(LocalDate costDate) { this.costDate = costDate; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Builder
    public static CostRecordBuilder builder() {
        return new CostRecordBuilder();
    }

    public static class CostRecordBuilder {
        private Long id;
        private String resourceId;
        private Provider provider;
        private String serviceName;
        private String region;
        private String project;
        private String department;
        private String environment;
        private LocalDate costDate;
        private BigDecimal amount;
        private String currency;
        private LocalDateTime createdAt;

        public CostRecordBuilder id(Long id) { this.id = id; return this; }
        public CostRecordBuilder resourceId(String resourceId) { this.resourceId = resourceId; return this; }
        public CostRecordBuilder provider(Provider provider) { this.provider = provider; return this; }
        public CostRecordBuilder serviceName(String serviceName) { this.serviceName = serviceName; return this; }
        public CostRecordBuilder region(String region) { this.region = region; return this; }
        public CostRecordBuilder project(String project) { this.project = project; return this; }
        public CostRecordBuilder department(String department) { this.department = department; return this; }
        public CostRecordBuilder environment(String environment) { this.environment = environment; return this; }
        public CostRecordBuilder costDate(LocalDate costDate) { this.costDate = costDate; return this; }
        public CostRecordBuilder amount(BigDecimal amount) { this.amount = amount; return this; }
        public CostRecordBuilder currency(String currency) { this.currency = currency; return this; }
        public CostRecordBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public CostRecord build() {
            return new CostRecord(id, resourceId, provider, serviceName, region, project, department, environment, costDate, amount, currency, createdAt);
        }
    }
}
