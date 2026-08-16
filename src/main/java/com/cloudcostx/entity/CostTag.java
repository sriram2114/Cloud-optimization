package com.cloudcostx.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cost_tags")
public class CostTag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resource_id", nullable = false)
    private CloudResource resource;

    @Column(name = "tag_key", nullable = false)
    private String tagKey;

    @Column(name = "tag_value", nullable = false)
    private String tagValue;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public CostTag() {}

    public CostTag(Long id, CloudResource resource, String tagKey, String tagValue, LocalDateTime createdAt) {
        this.id = id;
        this.resource = resource;
        this.tagKey = tagKey;
        this.tagValue = tagValue;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public CloudResource getResource() { return resource; }
    public void setResource(CloudResource resource) { this.resource = resource; }

    public String getTagKey() { return tagKey; }
    public void setTagKey(String tagKey) { this.tagKey = tagKey; }

    public String getTagValue() { return tagValue; }
    public void setTagValue(String tagValue) { this.tagValue = tagValue; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Builder
    public static CostTagBuilder builder() {
        return new CostTagBuilder();
    }

    public static class CostTagBuilder {
        private Long id;
        private CloudResource resource;
        private String tagKey;
        private String tagValue;
        private LocalDateTime createdAt;

        public CostTagBuilder id(Long id) { this.id = id; return this; }
        public CostTagBuilder resource(CloudResource resource) { this.resource = resource; return this; }
        public CostTagBuilder tagKey(String tagKey) { this.tagKey = tagKey; return this; }
        public CostTagBuilder tagValue(String tagValue) { this.tagValue = tagValue; return this; }
        public CostTagBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public CostTag build() {
            return new CostTag(id, resource, tagKey, tagValue, createdAt);
        }
    }
}
