package com.cloudcostx.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "policy_violations")
public class PolicyViolation {
    @Id
    private String id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "policy_id", nullable = false)
    private GovernancePolicy policy;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "resource_id", nullable = false)
    private CloudResource resource;

    @Column(name = "violation_message", nullable = false, length = 1000)
    private String violationMessage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RecommendationSeverity severity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ViolationStatus status;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    public PolicyViolation() {}

    public PolicyViolation(String id, GovernancePolicy policy, CloudResource resource, String violationMessage, RecommendationSeverity severity, ViolationStatus status, LocalDateTime createdAt, LocalDateTime resolvedAt) {
        this.id = id;
        this.policy = policy;
        this.resource = resource;
        this.violationMessage = violationMessage;
        this.severity = severity;
        this.status = status;
        this.createdAt = createdAt;
        this.resolvedAt = resolvedAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = ViolationStatus.OPEN;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public GovernancePolicy getPolicy() { return policy; }
    public void setPolicy(GovernancePolicy policy) { this.policy = policy; }

    public CloudResource getResource() { return resource; }
    public void setResource(CloudResource resource) { this.resource = resource; }

    public String getViolationMessage() { return violationMessage; }
    public void setViolationMessage(String violationMessage) { this.violationMessage = violationMessage; }

    public RecommendationSeverity getSeverity() { return severity; }
    public void setSeverity(RecommendationSeverity severity) { this.severity = severity; }

    public ViolationStatus getStatus() { return status; }
    public void setStatus(ViolationStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }

    // Builder
    public static PolicyViolationBuilder builder() {
        return new PolicyViolationBuilder();
    }

    public static class PolicyViolationBuilder {
        private String id;
        private GovernancePolicy policy;
        private CloudResource resource;
        private String violationMessage;
        private RecommendationSeverity severity;
        private ViolationStatus status;
        private LocalDateTime createdAt;
        private LocalDateTime resolvedAt;

        public PolicyViolationBuilder id(String id) { this.id = id; return this; }
        public PolicyViolationBuilder policy(GovernancePolicy policy) { this.policy = policy; return this; }
        public PolicyViolationBuilder resource(CloudResource resource) { this.resource = resource; return this; }
        public PolicyViolationBuilder violationMessage(String violationMessage) { this.violationMessage = violationMessage; return this; }
        public PolicyViolationBuilder severity(RecommendationSeverity severity) { this.severity = severity; return this; }
        public PolicyViolationBuilder status(ViolationStatus status) { this.status = status; return this; }
        public PolicyViolationBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public PolicyViolationBuilder resolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; return this; }

        public PolicyViolation build() {
            return new PolicyViolation(id, policy, resource, violationMessage, severity, status, createdAt, resolvedAt);
        }
    }
}
