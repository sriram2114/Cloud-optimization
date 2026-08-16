package com.cloudcostx.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
public class Alert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "alert_type", nullable = false)
    private AlertType alertType;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RecommendationSeverity severity;

    @Column(name = "is_read", nullable = false)
    private Boolean isRead;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Alert() {}

    public Alert(Long id, User user, AlertType alertType, String title, String message, RecommendationSeverity severity, Boolean isRead, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.alertType = alertType;
        this.title = title;
        this.message = message;
        this.severity = severity;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (isRead == null) isRead = false;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public AlertType getAlertType() { return alertType; }
    public void setAlertType(AlertType alertType) { this.alertType = alertType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public RecommendationSeverity getSeverity() { return severity; }
    public void setSeverity(RecommendationSeverity severity) { this.severity = severity; }

    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Builder
    public static AlertBuilder builder() {
        return new AlertBuilder();
    }

    public static class AlertBuilder {
        private Long id;
        private User user;
        private AlertType alertType;
        private String title;
        private String message;
        private RecommendationSeverity severity;
        private Boolean isRead;
        private LocalDateTime createdAt;

        public AlertBuilder id(Long id) { this.id = id; return this; }
        public AlertBuilder user(User user) { this.user = user; return this; }
        public AlertBuilder alertType(AlertType alertType) { this.alertType = alertType; return this; }
        public AlertBuilder title(String title) { this.title = title; return this; }
        public AlertBuilder message(String message) { this.message = message; return this; }
        public AlertBuilder severity(RecommendationSeverity severity) { this.severity = severity; return this; }
        public AlertBuilder isRead(Boolean isRead) { this.isRead = isRead; return this; }
        public AlertBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Alert build() {
            return new Alert(id, user, alertType, title, message, severity, isRead, createdAt);
        }
    }
}
