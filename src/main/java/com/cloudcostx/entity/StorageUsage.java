package com.cloudcostx.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "storage_usage")
public class StorageUsage {
    @Id
    private String id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "resource_id", nullable = false)
    private CloudResource resource;

    @Column(name = "storage_type", nullable = false)
    private String storageType;

    @Column(name = "storage_size", nullable = false)
    private String storageSize;

    @Column(name = "age_days", nullable = false)
    private Integer ageDays;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_tier", nullable = false)
    private StorageTier currentTier;

    @Enumerated(EnumType.STRING)
    @Column(name = "recommended_tier", nullable = false)
    private StorageTier recommendedTier;

    @Column(name = "monthly_cost", nullable = false, precision = 15, scale = 2)
    private BigDecimal monthlyCost;

    @Column(name = "potential_saving", nullable = false, precision = 15, scale = 2)
    private BigDecimal potentialSaving;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public StorageUsage() {}

    public StorageUsage(String id, CloudResource resource, String storageType, String storageSize, Integer ageDays, StorageTier currentTier, StorageTier recommendedTier, BigDecimal monthlyCost, BigDecimal potentialSaving, LocalDateTime createdAt) {
        this.id = id;
        this.resource = resource;
        this.storageType = storageType;
        this.storageSize = storageSize;
        this.ageDays = ageDays;
        this.currentTier = currentTier;
        this.recommendedTier = recommendedTier;
        this.monthlyCost = monthlyCost;
        this.potentialSaving = potentialSaving;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public CloudResource getResource() { return resource; }
    public void setResource(CloudResource resource) { this.resource = resource; }

    public String getStorageType() { return storageType; }
    public void setStorageType(String storageType) { this.storageType = storageType; }

    public String getStorageSize() { return storageSize; }
    public void setStorageSize(String storageSize) { this.storageSize = storageSize; }

    public Integer getAgeDays() { return ageDays; }
    public void setAgeDays(Integer ageDays) { this.ageDays = ageDays; }

    public StorageTier getCurrentTier() { return currentTier; }
    public void setCurrentTier(StorageTier currentTier) { this.currentTier = currentTier; }

    public StorageTier getRecommendedTier() { return recommendedTier; }
    public void setRecommendedTier(StorageTier recommendedTier) { this.recommendedTier = recommendedTier; }

    public BigDecimal getMonthlyCost() { return monthlyCost; }
    public void setMonthlyCost(BigDecimal monthlyCost) { this.monthlyCost = monthlyCost; }

    public BigDecimal getPotentialSaving() { return potentialSaving; }
    public void setPotentialSaving(BigDecimal potentialSaving) { this.potentialSaving = potentialSaving; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Builder
    public static StorageUsageBuilder builder() {
        return new StorageUsageBuilder();
    }

    public static class StorageUsageBuilder {
        private String id;
        private CloudResource resource;
        private String storageType;
        private String storageSize;
        private Integer ageDays;
        private StorageTier currentTier;
        private StorageTier recommendedTier;
        private BigDecimal monthlyCost;
        private BigDecimal potentialSaving;
        private LocalDateTime createdAt;

        public StorageUsageBuilder id(String id) { this.id = id; return this; }
        public StorageUsageBuilder resource(CloudResource resource) { this.resource = resource; return this; }
        public StorageUsageBuilder storageType(String storageType) { this.storageType = storageType; return this; }
        public StorageUsageBuilder storageSize(String storageSize) { this.storageSize = storageSize; return this; }
        public StorageUsageBuilder ageDays(Integer ageDays) { this.ageDays = ageDays; return this; }
        public StorageUsageBuilder currentTier(StorageTier currentTier) { this.currentTier = currentTier; return this; }
        public StorageUsageBuilder recommendedTier(StorageTier recommendedTier) { this.recommendedTier = recommendedTier; return this; }
        public StorageUsageBuilder monthlyCost(BigDecimal monthlyCost) { this.monthlyCost = monthlyCost; return this; }
        public StorageUsageBuilder potentialSaving(BigDecimal potentialSaving) { this.potentialSaving = potentialSaving; return this; }
        public StorageUsageBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public StorageUsage build() {
            return new StorageUsage(id, resource, storageType, storageSize, ageDays, currentTier, recommendedTier, monthlyCost, potentialSaving, createdAt);
        }
    }
}
