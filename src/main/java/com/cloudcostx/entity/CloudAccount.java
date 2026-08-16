package com.cloudcostx.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cloud_accounts")
public class CloudAccount {
    @Id
    private String id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Provider provider;

    @Column(name = "account_name", nullable = false)
    private String accountName;

    @Column(name = "account_identifier", nullable = false)
    private String accountIdentifier;

    @Column(nullable = false)
    private String region;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CloudAccountStatus status;

    @Column(name = "last_synced_at")
    private LocalDateTime lastSyncedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public CloudAccount() {}

    public CloudAccount(String id, Provider provider, String accountName, String accountIdentifier, String region, CloudAccountStatus status, LocalDateTime lastSyncedAt, LocalDateTime createdAt) {
        this.id = id;
        this.provider = provider;
        this.accountName = accountName;
        this.accountIdentifier = accountIdentifier;
        this.region = region;
        this.status = status;
        this.lastSyncedAt = lastSyncedAt;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (lastSyncedAt == null) lastSyncedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Provider getProvider() { return provider; }
    public void setProvider(Provider provider) { this.provider = provider; }

    public String getAccountName() { return accountName; }
    public void setAccountName(String accountName) { this.accountName = accountName; }

    public String getAccountIdentifier() { return accountIdentifier; }
    public void setAccountIdentifier(String accountIdentifier) { this.accountIdentifier = accountIdentifier; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public CloudAccountStatus getStatus() { return status; }
    public void setStatus(CloudAccountStatus status) { this.status = status; }

    public LocalDateTime getLastSyncedAt() { return lastSyncedAt; }
    public void setLastSyncedAt(LocalDateTime lastSyncedAt) { this.lastSyncedAt = lastSyncedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Builder
    public static CloudAccountBuilder builder() {
        return new CloudAccountBuilder();
    }

    public static class CloudAccountBuilder {
        private String id;
        private Provider provider;
        private String accountName;
        private String accountIdentifier;
        private String region;
        private CloudAccountStatus status;
        private LocalDateTime lastSyncedAt;
        private LocalDateTime createdAt;

        public CloudAccountBuilder id(String id) { this.id = id; return this; }
        public CloudAccountBuilder provider(Provider provider) { this.provider = provider; return this; }
        public CloudAccountBuilder accountName(String accountName) { this.accountName = accountName; return this; }
        public CloudAccountBuilder accountIdentifier(String accountIdentifier) { this.accountIdentifier = accountIdentifier; return this; }
        public CloudAccountBuilder region(String region) { this.region = region; return this; }
        public CloudAccountBuilder status(CloudAccountStatus status) { this.status = status; return this; }
        public CloudAccountBuilder lastSyncedAt(LocalDateTime lastSyncedAt) { this.lastSyncedAt = lastSyncedAt; return this; }
        public CloudAccountBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public CloudAccount build() {
            return new CloudAccount(id, provider, accountName, accountIdentifier, region, status, lastSyncedAt, createdAt);
        }
    }
}
