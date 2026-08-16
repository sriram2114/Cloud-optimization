package com.cloudcostx.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "optimization_recommendations")
public class OptimizationRecommendation {
    @Id
    private String id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "resource_id", nullable = false)
    private CloudResource resource;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RecommendationCategory category;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(name = "current_configuration")
    private String currentConfiguration;

    @Column(name = "recommended_configuration")
    private String recommendedConfiguration;

    @Column(name = "current_monthly_cost", nullable = false, precision = 15, scale = 2)
    private BigDecimal currentMonthlyCost;

    @Column(name = "estimated_monthly_cost", nullable = false, precision = 15, scale = 2)
    private BigDecimal estimatedMonthlyCost;

    @Column(name = "potential_monthly_saving", nullable = false, precision = 15, scale = 2)
    private BigDecimal potentialMonthlySaving;

    @Column(name = "potential_annual_saving", nullable = false, precision = 15, scale = 2)
    private BigDecimal potentialAnnualSaving;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RecommendationSeverity severity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RecommendationStatus status;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public OptimizationRecommendation() {}

    public OptimizationRecommendation(String id, CloudResource resource, RecommendationCategory category, String title, String description, String currentConfiguration, String recommendedConfiguration, BigDecimal currentMonthlyCost, BigDecimal estimatedMonthlyCost, BigDecimal potentialMonthlySaving, BigDecimal potentialAnnualSaving, RecommendationSeverity severity, RecommendationStatus status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.resource = resource;
        this.category = category;
        this.title = title;
        this.description = description;
        this.currentConfiguration = currentConfiguration;
        this.recommendedConfiguration = recommendedConfiguration;
        this.currentMonthlyCost = currentMonthlyCost;
        this.estimatedMonthlyCost = estimatedMonthlyCost;
        this.potentialMonthlySaving = potentialMonthlySaving;
        this.potentialAnnualSaving = potentialAnnualSaving;
        this.severity = severity;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (potentialMonthlySaving == null && currentMonthlyCost != null && estimatedMonthlyCost != null) {
            potentialMonthlySaving = currentMonthlyCost.subtract(estimatedMonthlyCost);
        }
        if (potentialAnnualSaving == null && potentialMonthlySaving != null) {
            potentialAnnualSaving = potentialMonthlySaving.multiply(BigDecimal.valueOf(12));
        }
        if (status == null) status = RecommendationStatus.NEW;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        if (currentMonthlyCost != null && estimatedMonthlyCost != null) {
            potentialMonthlySaving = currentMonthlyCost.subtract(estimatedMonthlyCost);
            potentialAnnualSaving = potentialMonthlySaving.multiply(BigDecimal.valueOf(12));
        }
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public CloudResource getResource() { return resource; }
    public void setResource(CloudResource resource) { this.resource = resource; }

    public RecommendationCategory getCategory() { return category; }
    public void setCategory(RecommendationCategory category) { this.category = category; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCurrentConfiguration() { return currentConfiguration; }
    public void setCurrentConfiguration(String currentConfiguration) { this.currentConfiguration = currentConfiguration; }

    public String getRecommendedConfiguration() { return recommendedConfiguration; }
    public void setRecommendedConfiguration(String recommendedConfiguration) { this.recommendedConfiguration = recommendedConfiguration; }

    public BigDecimal getCurrentMonthlyCost() { return currentMonthlyCost; }
    public void setCurrentMonthlyCost(BigDecimal currentMonthlyCost) { this.currentMonthlyCost = currentMonthlyCost; }

    public BigDecimal getEstimatedMonthlyCost() { return estimatedMonthlyCost; }
    public void setEstimatedMonthlyCost(BigDecimal estimatedMonthlyCost) { this.estimatedMonthlyCost = estimatedMonthlyCost; }

    public BigDecimal getPotentialMonthlySaving() { return potentialMonthlySaving; }
    public void setPotentialMonthlySaving(BigDecimal potentialMonthlySaving) { this.potentialMonthlySaving = potentialMonthlySaving; }

    public BigDecimal getPotentialAnnualSaving() { return potentialAnnualSaving; }
    public void setPotentialAnnualSaving(BigDecimal potentialAnnualSaving) { this.potentialAnnualSaving = potentialAnnualSaving; }

    public RecommendationSeverity getSeverity() { return severity; }
    public void setSeverity(RecommendationSeverity severity) { this.severity = severity; }

    public RecommendationStatus getStatus() { return status; }
    public void setStatus(RecommendationStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Builder
    public static OptimizationRecommendationBuilder builder() {
        return new OptimizationRecommendationBuilder();
    }

    public static class OptimizationRecommendationBuilder {
        private String id;
        private CloudResource resource;
        private RecommendationCategory category;
        private String title;
        private String description;
        private String currentConfiguration;
        private String recommendedConfiguration;
        private BigDecimal currentMonthlyCost;
        private BigDecimal estimatedMonthlyCost;
        private BigDecimal potentialMonthlySaving;
        private BigDecimal potentialAnnualSaving;
        private RecommendationSeverity severity;
        private RecommendationStatus status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public OptimizationRecommendationBuilder id(String id) { this.id = id; return this; }
        public OptimizationRecommendationBuilder resource(CloudResource resource) { this.resource = resource; return this; }
        public OptimizationRecommendationBuilder category(RecommendationCategory category) { this.category = category; return this; }
        public OptimizationRecommendationBuilder title(String title) { this.title = title; return this; }
        public OptimizationRecommendationBuilder description(String description) { this.description = description; return this; }
        public OptimizationRecommendationBuilder currentConfiguration(String currentConfiguration) { this.currentConfiguration = currentConfiguration; return this; }
        public OptimizationRecommendationBuilder recommendedConfiguration(String recommendedConfiguration) { this.recommendedConfiguration = recommendedConfiguration; return this; }
        public OptimizationRecommendationBuilder currentMonthlyCost(BigDecimal currentMonthlyCost) { this.currentMonthlyCost = currentMonthlyCost; return this; }
        public OptimizationRecommendationBuilder estimatedMonthlyCost(BigDecimal estimatedMonthlyCost) { this.estimatedMonthlyCost = estimatedMonthlyCost; return this; }
        public OptimizationRecommendationBuilder potentialMonthlySaving(BigDecimal potentialMonthlySaving) { this.potentialMonthlySaving = potentialMonthlySaving; return this; }
        public OptimizationRecommendationBuilder potentialAnnualSaving(BigDecimal potentialAnnualSaving) { this.potentialAnnualSaving = potentialAnnualSaving; return this; }
        public OptimizationRecommendationBuilder severity(RecommendationSeverity severity) { this.severity = severity; return this; }
        public OptimizationRecommendationBuilder status(RecommendationStatus status) { this.status = status; return this; }
        public OptimizationRecommendationBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public OptimizationRecommendationBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public OptimizationRecommendation build() {
            return new OptimizationRecommendation(id, resource, category, title, description, currentConfiguration, recommendedConfiguration, currentMonthlyCost, estimatedMonthlyCost, potentialMonthlySaving, potentialAnnualSaving, severity, status, createdAt, updatedAt);
        }
    }
}
