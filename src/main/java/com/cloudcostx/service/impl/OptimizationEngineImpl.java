package com.cloudcostx.service.impl;

import com.cloudcostx.entity.*;
import com.cloudcostx.exception.ResourceNotFoundException;
import com.cloudcostx.repository.*;
import com.cloudcostx.service.OptimizationEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OptimizationEngineImpl implements OptimizationEngine {

    @Autowired
    private OptimizationRecommendationRepository recommendationRepository;

    @Autowired
    private CloudResourceRepository resourceRepository;

    @Autowired
    private StorageUsageRepository storageUsageRepository;

    @Autowired
    private NetworkUsageRepository networkUsageRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public List<OptimizationRecommendation> getActiveRecommendations() {
        return recommendationRepository.findByStatus(RecommendationStatus.NEW);
    }

    @Override
    @Transactional
    public void runOptimizationScan() {
        // RULE 1 & 3: Scan COMPUTE resources for Right-Sizing or Unused terminations
        List<CloudResource> resources = resourceRepository.findAll();
        for (CloudResource res : resources) {
            if (res.getResourceType() == ResourceType.COMPUTE) {
                Integer cpu = res.getCpuUsage();
                if (cpu == null) continue;

                String recId = "opt-rs-" + res.getId();
                boolean exists = recommendationRepository.existsById(recId);
                if (exists) continue;

                if (cpu < 5) {
                    // Rule 3: Unused Resource
                    OptimizationRecommendation rec = OptimizationRecommendation.builder()
                            .id(recId)
                            .resource(res)
                            .category(RecommendationCategory.RIGHT_SIZING)
                            .title("Terminate Idle Instance: " + res.getResourceName())
                            .description(res.getResourceName() + " has average CPU usage of " + cpu + "% (below 5%). Recommend stopping or deleting the resource to eliminate waste.")
                            .currentConfiguration(res.getInstanceType() != null ? res.getInstanceType() : "Standard Node")
                            .recommendedConfiguration("Stop / Deallocate")
                            .currentMonthlyCost(res.getMonthlyCost())
                            .estimatedMonthlyCost(BigDecimal.ZERO)
                            .potentialMonthlySaving(res.getMonthlyCost())
                            .potentialAnnualSaving(res.getMonthlyCost().multiply(BigDecimal.valueOf(12)))
                            .severity(RecommendationSeverity.CRITICAL)
                            .status(RecommendationStatus.NEW)
                            .build();
                    recommendationRepository.save(rec);
                    createAlert("Unused Resource Terminate Alert", "Idle node discovered: " + res.getResourceName(), AlertType.OPTIMIZATION, RecommendationSeverity.CRITICAL);
                } else if (cpu < 20) {
                    // Rule 1: Right Sizing
                    BigDecimal currentCost = res.getMonthlyCost();
                    BigDecimal recommendedCost = currentCost.multiply(BigDecimal.valueOf(0.55)).setScale(0, RoundingMode.HALF_UP);
                    BigDecimal potentialSaving = currentCost.subtract(recommendedCost);

                    OptimizationRecommendation rec = OptimizationRecommendation.builder()
                            .id(recId)
                            .resource(res)
                            .category(RecommendationCategory.RIGHT_SIZING)
                            .title("Right-size Underutilized Instance: " + res.getResourceName())
                            .description(res.getResourceName() + " CPU utilization is " + cpu + "% (below 20%). Recommend shifting configuration to a lower tier.")
                            .currentConfiguration(res.getInstanceType() != null ? res.getInstanceType() : "t3.large")
                            .recommendedConfiguration("t3.medium")
                            .currentMonthlyCost(currentCost)
                            .estimatedMonthlyCost(recommendedCost)
                            .potentialMonthlySaving(potentialSaving)
                            .potentialAnnualSaving(potentialSaving.multiply(BigDecimal.valueOf(12)))
                            .severity(RecommendationSeverity.HIGH)
                            .status(RecommendationStatus.NEW)
                            .build();
                    recommendationRepository.save(rec);
                    createAlert("Right-sizing Saving Opportunity", "Underutilized compute resized: " + res.getResourceName(), AlertType.OPTIMIZATION, RecommendationSeverity.HIGH);
                }
            }
        }

        // RULE 2: Scan Storage lifecycle
        List<StorageUsage> storageUsages = storageUsageRepository.findAll();
        for (StorageUsage st : storageUsages) {
            String recId = "opt-st-" + st.getId();
            boolean exists = recommendationRepository.existsById(recId);
            if (exists) continue;

            if (st.getAgeDays() > 90) {
                RecommendationSeverity severity = st.getAgeDays() > 180 ? RecommendationSeverity.HIGH : RecommendationSeverity.MEDIUM;
                OptimizationRecommendation rec = OptimizationRecommendation.builder()
                        .id(recId)
                        .resource(st.getResource())
                        .category(RecommendationCategory.STORAGE)
                        .title("Transition Stale Volume to Cold Archive: " + st.getResource().getResourceName())
                        .description("Data within " + st.getResource().getResourceName() + " has not been modified in " + st.getAgeDays() + " days. Transition from " + st.getCurrentTier() + " to " + st.getRecommendedTier() + " class.")
                        .currentConfiguration(st.getCurrentTier().name())
                        .recommendedConfiguration(st.getRecommendedTier().name())
                        .currentMonthlyCost(st.getMonthlyCost())
                        .estimatedMonthlyCost(st.getMonthlyCost().subtract(st.getPotentialSaving()))
                        .potentialMonthlySaving(st.getPotentialSaving())
                        .potentialAnnualSaving(st.getPotentialSaving().multiply(BigDecimal.valueOf(12)))
                        .severity(severity)
                        .status(RecommendationStatus.NEW)
                        .build();
                recommendationRepository.save(rec);
            }
        }

        // RULE 4: Scan Network egress spends
        List<NetworkUsage> networkUsages = networkUsageRepository.findAll();
        for (NetworkUsage net : networkUsages) {
            String recId = "opt-net-" + net.getId();
            boolean exists = recommendationRepository.existsById(recId);
            if (exists) continue;

            if (net.getCost().compareTo(BigDecimal.valueOf(5000)) > 0) {
                BigDecimal currentCost = net.getCost();
                BigDecimal recommendedCost = currentCost.multiply(BigDecimal.valueOf(0.60)).setScale(0, RoundingMode.HALF_UP);
                BigDecimal potentialSaving = currentCost.subtract(recommendedCost);

                OptimizationRecommendation rec = OptimizationRecommendation.builder()
                        .id(recId)
                        .resource(null) // network routing is global/region level
                        .category(RecommendationCategory.NETWORK)
                        .title("Optimize Egress Route Mumbai-Singapore")
                        .description("NAT Transit fees from ap-south-1 to ap-southeast-1 are higher than budget goals. Peering direct VPCs or caching assets via CDN will reduce transit overheads.")
                        .currentConfiguration(net.getTransferType().name() + " (Direct Out)")
                        .recommendedConfiguration("VPC Peering / CDN Cache")
                        .currentMonthlyCost(currentCost)
                        .estimatedMonthlyCost(recommendedCost)
                        .potentialMonthlySaving(potentialSaving)
                        .potentialAnnualSaving(potentialSaving.multiply(BigDecimal.valueOf(12)))
                        .severity(RecommendationSeverity.CRITICAL)
                        .status(RecommendationStatus.NEW)
                        .build();
                // We mock link a resource if available, else network recommendation is saved
                if (!resources.isEmpty()) {
                    rec.setResource(resources.get(0));
                }
                recommendationRepository.save(rec);
            }
        }
    }

    @Override
    @Transactional
    public void applyRecommendation(String id) {
        OptimizationRecommendation rec = recommendationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Saving recommendation not found with ID: " + id));

        rec.setStatus(RecommendationStatus.APPLIED);
        recommendationRepository.save(rec);

        // Update the underlying resource pricing bounds
        CloudResource resource = rec.getResource();
        if (resource != null) {
            resource.setMonthlyCost(rec.getEstimatedMonthlyCost());
            if (rec.getRecommendedConfiguration().equalsIgnoreCase("Stop / Deallocate")) {
                resource.setStatus(ResourceStatus.STOPPED);
            } else {
                resource.setStatus(ResourceStatus.ACTIVE);
                resource.setCpuUsage(45); // reset usage values to normal limits
                if (rec.getRecommendedConfiguration().contains("t3.")) {
                    resource.setInstanceType(rec.getRecommendedConfiguration());
                }
            }
            resourceRepository.save(resource);

            // Also check storage lifecycle mappings to update StorageUsage if applicable
            if (rec.getCategory() == RecommendationCategory.STORAGE) {
                List<StorageUsage> storageList = storageUsageRepository.findAll();
                for (StorageUsage st : storageList) {
                    if (st.getResource().getId().equals(resource.getId())) {
                        st.setCurrentTier(st.getRecommendedTier());
                        st.setMonthlyCost(rec.getEstimatedMonthlyCost());
                        st.setPotentialSaving(BigDecimal.ZERO);
                        storageUsageRepository.save(st);
                    }
                }
            }
        }

        // Log notification success
        Notification notification = Notification.builder()
                .id("n-opt-app-" + java.util.UUID.randomUUID().toString().substring(0, 4))
                .message("Optimization applied successfully: " + rec.getTitle() + ". Saved " + rec.getPotentialMonthlySaving().setScale(0, RoundingMode.HALF_UP) + "/mo.")
                .type("success")
                .read(false)
                .build();
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void dismissRecommendation(String id) {
        OptimizationRecommendation rec = recommendationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Saving recommendation not found: " + id));

        rec.setStatus(RecommendationStatus.DISMISSED);
        recommendationRepository.save(rec);

        Notification notification = Notification.builder()
                .id("n-opt-dis-" + java.util.UUID.randomUUID().toString().substring(0, 4))
                .message("Savings recommendation dismissed for " + (rec.getResource() != null ? rec.getResource().getResourceName() : "network"))
                .type("info")
                .read(false)
                .build();
        notificationRepository.save(notification);
    }

    private void createAlert(String title, String message, AlertType type, RecommendationSeverity severity) {
        Alert alert = Alert.builder()
                .alertType(type)
                .title(title)
                .message(message)
                .severity(severity)
                .isRead(false)
                .build();
        alertRepository.save(alert);
    }
}
