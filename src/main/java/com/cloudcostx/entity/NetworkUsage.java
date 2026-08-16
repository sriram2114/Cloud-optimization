package com.cloudcostx.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "network_usage")
public class NetworkUsage {
    @Id
    private String id;

    @Column(name = "source_region", nullable = false)
    private String sourceRegion;

    @Column(name = "destination_region", nullable = false)
    private String destinationRegion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Provider provider;

    @Enumerated(EnumType.STRING)
    @Column(name = "transfer_type", nullable = false)
    private NetworkTransferType transferType;

    @Column(name = "data_transfer_gb", nullable = false, precision = 15, scale = 2)
    private BigDecimal dataTransferGb;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal cost;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_level", nullable = false)
    private NetworkRisk riskLevel;

    private String recommendation;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public NetworkUsage() {}

    public NetworkUsage(String id, String sourceRegion, String destinationRegion, Provider provider, NetworkTransferType transferType, BigDecimal dataTransferGb, BigDecimal cost, NetworkRisk riskLevel, String recommendation, LocalDateTime createdAt) {
        this.id = id;
        this.sourceRegion = sourceRegion;
        this.destinationRegion = destinationRegion;
        this.provider = provider;
        this.transferType = transferType;
        this.dataTransferGb = dataTransferGb;
        this.cost = cost;
        this.riskLevel = riskLevel;
        this.recommendation = recommendation;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSourceRegion() { return sourceRegion; }
    public void setSourceRegion(String sourceRegion) { this.sourceRegion = sourceRegion; }

    public String getDestinationRegion() { return destinationRegion; }
    public void setDestinationRegion(String destinationRegion) { this.destinationRegion = destinationRegion; }

    public Provider getProvider() { return provider; }
    public void setProvider(Provider provider) { this.provider = provider; }

    public NetworkTransferType getTransferType() { return transferType; }
    public void setTransferType(NetworkTransferType transferType) { this.transferType = transferType; }

    public BigDecimal getDataTransferGb() { return dataTransferGb; }
    public void setDataTransferGb(BigDecimal dataTransferGb) { this.dataTransferGb = dataTransferGb; }

    public BigDecimal getCost() { return cost; }
    public void setCost(BigDecimal cost) { this.cost = cost; }

    public NetworkRisk getRiskLevel() { return riskLevel; }
    public void setRiskLevel(NetworkRisk riskLevel) { this.riskLevel = riskLevel; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Builder
    public static NetworkUsageBuilder builder() {
        return new NetworkUsageBuilder();
    }

    public static class NetworkUsageBuilder {
        private String id;
        private String sourceRegion;
        private String destinationRegion;
        private Provider provider;
        private NetworkTransferType transferType;
        private BigDecimal dataTransferGb;
        private BigDecimal cost;
        private NetworkRisk riskLevel;
        private String recommendation;
        private LocalDateTime createdAt;

        public NetworkUsageBuilder id(String id) { this.id = id; return this; }
        public NetworkUsageBuilder sourceRegion(String sourceRegion) { this.sourceRegion = sourceRegion; return this; }
        public NetworkUsageBuilder destinationRegion(String destinationRegion) { this.destinationRegion = destinationRegion; return this; }
        public NetworkUsageBuilder provider(Provider provider) { this.provider = provider; return this; }
        public NetworkUsageBuilder transferType(NetworkTransferType transferType) { this.transferType = transferType; return this; }
        public NetworkUsageBuilder dataTransferGb(BigDecimal dataTransferGb) { this.dataTransferGb = dataTransferGb; return this; }
        public NetworkUsageBuilder cost(BigDecimal cost) { this.cost = cost; return this; }
        public NetworkUsageBuilder riskLevel(NetworkRisk riskLevel) { this.riskLevel = riskLevel; return this; }
        public NetworkUsageBuilder recommendation(String recommendation) { this.recommendation = recommendation; return this; }
        public NetworkUsageBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public NetworkUsage build() {
            return new NetworkUsage(id, sourceRegion, destinationRegion, provider, transferType, dataTransferGb, cost, riskLevel, recommendation, createdAt);
        }
    }
}
