package com.cloudcostx.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cloud_resources")
public class CloudResource {
    @Id
    private String id;

    @Column(name = "resource_name", nullable = false)
    private String resourceName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Provider provider;

    @Enumerated(EnumType.STRING)
    @Column(name = "resource_type", nullable = false)
    private ResourceType resourceType;

    @Column(nullable = false)
    private String region;

    @Column(name = "instance_type")
    private String instanceType;

    @Column(name = "cpu_usage")
    private Integer cpuUsage;

    @Column(name = "memory_usage")
    private Integer memoryUsage;

    @Column(name = "storage_size")
    private Long storageSize;

    @Column(name = "monthly_cost", nullable = false, precision = 15, scale = 2)
    private BigDecimal monthlyCost;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Environment environment;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cloud_account_id")
    private CloudAccount cloudAccount;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public CloudResource() {}

    public CloudResource(String id, String resourceName, Provider provider, ResourceType resourceType, String region, String instanceType, Integer cpuUsage, Integer memoryUsage, Long storageSize, BigDecimal monthlyCost, ResourceStatus status, Environment environment, Project project, CloudAccount cloudAccount, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.resourceName = resourceName;
        this.provider = provider;
        this.resourceType = resourceType;
        this.region = region;
        this.instanceType = instanceType;
        this.cpuUsage = cpuUsage;
        this.memoryUsage = memoryUsage;
        this.storageSize = storageSize;
        this.monthlyCost = monthlyCost;
        this.status = status;
        this.environment = environment;
        this.project = project;
        this.cloudAccount = cloudAccount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getResourceName() { return resourceName; }
    public void setResourceName(String resourceName) { this.resourceName = resourceName; }

    public Provider getProvider() { return provider; }
    public void setProvider(Provider provider) { this.provider = provider; }

    public ResourceType getResourceType() { return resourceType; }
    public void setResourceType(ResourceType resourceType) { this.resourceType = resourceType; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getInstanceType() { return instanceType; }
    public void setInstanceType(String instanceType) { this.instanceType = instanceType; }

    public Integer getCpuUsage() { return cpuUsage; }
    public void setCpuUsage(Integer cpuUsage) { this.cpuUsage = cpuUsage; }

    public Integer getMemoryUsage() { return memoryUsage; }
    public void setMemoryUsage(Integer memoryUsage) { this.memoryUsage = memoryUsage; }

    public Long getStorageSize() { return storageSize; }
    public void setStorageSize(Long storageSize) { this.storageSize = storageSize; }

    public BigDecimal getMonthlyCost() { return monthlyCost; }
    public void setMonthlyCost(BigDecimal monthlyCost) { this.monthlyCost = monthlyCost; }

    public ResourceStatus getStatus() { return status; }
    public void setStatus(ResourceStatus status) { this.status = status; }

    public Environment getEnvironment() { return environment; }
    public void setEnvironment(Environment environment) { this.environment = environment; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public CloudAccount getCloudAccount() { return cloudAccount; }
    public void setCloudAccount(CloudAccount cloudAccount) { this.cloudAccount = cloudAccount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Builder
    public static CloudResourceBuilder builder() {
        return new CloudResourceBuilder();
    }

    public static class CloudResourceBuilder {
        private String id;
        private String resourceName;
        private Provider provider;
        private ResourceType resourceType;
        private String region;
        private String instanceType;
        private Integer cpuUsage;
        private Integer memoryUsage;
        private Long storageSize;
        private BigDecimal monthlyCost;
        private ResourceStatus status;
        private Environment environment;
        private Project project;
        private CloudAccount cloudAccount;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public CloudResourceBuilder id(String id) { this.id = id; return this; }
        public CloudResourceBuilder resourceName(String resourceName) { this.resourceName = resourceName; return this; }
        public CloudResourceBuilder provider(Provider provider) { this.provider = provider; return this; }
        public CloudResourceBuilder resourceType(ResourceType resourceType) { this.resourceType = resourceType; return this; }
        public CloudResourceBuilder region(String region) { this.region = region; return this; }
        public CloudResourceBuilder instanceType(String instanceType) { this.instanceType = instanceType; return this; }
        public CloudResourceBuilder cpuUsage(Integer cpuUsage) { this.cpuUsage = cpuUsage; return this; }
        public CloudResourceBuilder memoryUsage(Integer memoryUsage) { this.memoryUsage = memoryUsage; return this; }
        public CloudResourceBuilder storageSize(Long storageSize) { this.storageSize = storageSize; return this; }
        public CloudResourceBuilder monthlyCost(BigDecimal monthlyCost) { this.monthlyCost = monthlyCost; return this; }
        public CloudResourceBuilder status(ResourceStatus status) { this.status = status; return this; }
        public CloudResourceBuilder environment(Environment environment) { this.environment = environment; return this; }
        public CloudResourceBuilder project(Project project) { this.project = project; return this; }
        public CloudResourceBuilder cloudAccount(CloudAccount cloudAccount) { this.cloudAccount = cloudAccount; return this; }
        public CloudResourceBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public CloudResourceBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public CloudResource build() {
            return new CloudResource(id, resourceName, provider, resourceType, region, instanceType, cpuUsage, memoryUsage, storageSize, monthlyCost, status, environment, project, cloudAccount, createdAt, updatedAt);
        }
    }
}
