package com.cloudcostx.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "governance_policies")
public class GovernancePolicy {
    @Id
    private String id;

    @Column(name = "policy_name", nullable = false)
    private String policyName;

    @Column(nullable = false, length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "policy_type", nullable = false)
    private PolicyType policyType;

    @Column(nullable = false)
    private Boolean enabled;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public GovernancePolicy() {}

    public GovernancePolicy(String id, String policyName, String description, PolicyType policyType, Boolean enabled, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.policyName = policyName;
        this.description = description;
        this.policyType = policyType;
        this.enabled = enabled;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (enabled == null) enabled = true;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPolicyName() { return policyName; }
    public void setPolicyName(String policyName) { this.policyName = policyName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public PolicyType getPolicyType() { return policyType; }
    public void setPolicyType(PolicyType policyType) { this.policyType = policyType; }

    public Boolean getEnabled() { return enabled; }
    public void setEnabled(Boolean enabled) { this.enabled = enabled; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Builder
    public static GovernancePolicyBuilder builder() {
        return new GovernancePolicyBuilder();
    }

    public static class GovernancePolicyBuilder {
        private String id;
        private String policyName;
        private String description;
        private PolicyType policyType;
        private Boolean enabled;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public GovernancePolicyBuilder id(String id) { this.id = id; return this; }
        public GovernancePolicyBuilder policyName(String policyName) { this.policyName = policyName; return this; }
        public GovernancePolicyBuilder description(String description) { this.description = description; return this; }
        public GovernancePolicyBuilder policyType(PolicyType policyType) { this.policyType = policyType; return this; }
        public GovernancePolicyBuilder enabled(Boolean enabled) { this.enabled = enabled; return this; }
        public GovernancePolicyBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public GovernancePolicyBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public GovernancePolicy build() {
            return new GovernancePolicy(id, policyName, description, policyType, enabled, createdAt, updatedAt);
        }
    }
}
