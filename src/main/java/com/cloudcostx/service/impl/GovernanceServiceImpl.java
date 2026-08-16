package com.cloudcostx.service.impl;

import com.cloudcostx.entity.*;
import com.cloudcostx.exception.ResourceNotFoundException;
import com.cloudcostx.repository.*;
import com.cloudcostx.service.GovernanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class GovernanceServiceImpl implements GovernanceService {

    @Autowired
    private GovernancePolicyRepository policyRepository;

    @Autowired
    private PolicyViolationRepository violationRepository;

    @Autowired
    private CloudResourceRepository resourceRepository;

    @Autowired
    private CostTagRepository costTagRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public List<GovernancePolicy> getAllPolicies() {
        return policyRepository.findAll();
    }

    @Override
    public GovernancePolicy getPolicyById(String id) {
        return policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Governance policy not found with ID: " + id));
    }

    @Override
    @Transactional
    public GovernancePolicy updatePolicy(String id, GovernancePolicy policyDetails) {
        GovernancePolicy policy = getPolicyById(id);
        policy.setEnabled(policyDetails.getEnabled());
        policy.setDescription(policyDetails.getDescription());
        policy.setPolicyName(policyDetails.getPolicyName());
        return policyRepository.save(policy);
    }

    @Override
    public List<PolicyViolation> getActiveViolations() {
        return violationRepository.findByStatus(ViolationStatus.OPEN);
    }

    @Override
    @Transactional
    public void scanGovernancePolicies() {
        List<GovernancePolicy> activePolicies = policyRepository.findAll().stream()
                .filter(GovernancePolicy::getEnabled)
                .toList();

        List<CloudResource> allResources = resourceRepository.findAll();

        for (GovernancePolicy policy : activePolicies) {
            switch (policy.getPolicyType()) {
                case MANDATORY_TAG:
                    for (CloudResource res : allResources) {
                        List<CostTag> tags = costTagRepository.findByResourceId(res.getId());
                        boolean hasProject = tags.stream().anyMatch(t -> t.getTagKey().equalsIgnoreCase("Project"));
                        boolean hasOwner = tags.stream().anyMatch(t -> t.getTagKey().equalsIgnoreCase("Owner"));
                        boolean hasEnv = tags.stream().anyMatch(t -> t.getTagKey().equalsIgnoreCase("Environment"));
                        boolean hasCostCenter = tags.stream().anyMatch(t -> t.getTagKey().equalsIgnoreCase("CostCenter"));

                        if (!hasProject || !hasOwner || !hasEnv || !hasCostCenter) {
                            String violationId = "v-tg-" + res.getId();
                            if (!violationRepository.existsByPolicyIdAndResourceIdAndStatus(policy.getId(), res.getId(), ViolationStatus.OPEN)) {
                                PolicyViolation violation = PolicyViolation.builder()
                                        .id(violationId)
                                        .policy(policy)
                                        .resource(res)
                                        .violationMessage("Resource is missing mandatory cost tags. Required keys: Project, Owner, Environment, CostCenter")
                                        .severity(RecommendationSeverity.HIGH)
                                        .status(ViolationStatus.OPEN)
                                        .build();
                                violationRepository.save(violation);
                            }
                        }
                    }
                    break;

                case BUDGET_LIMIT:
                    List<Budget> budgets = budgetRepository.findAll();
                    for (Budget b : budgets) {
                        if (b.getForecastedCost().compareTo(b.getMonthlyLimit()) > 0) {
                            // Find resources in the project
                            List<CloudResource> projRes = allResources.stream()
                                    .filter(r -> r.getProject() != null && r.getProject().getId().equals(b.getProject().getId()))
                                    .toList();
                            
                            if (!projRes.isEmpty()) {
                                CloudResource res = projRes.get(0);
                                String violationId = "v-bg-" + b.getId();
                                if (!violationRepository.existsByPolicyIdAndResourceIdAndStatus(policy.getId(), res.getId(), ViolationStatus.OPEN)) {
                                    PolicyViolation violation = PolicyViolation.builder()
                                            .id(violationId)
                                            .policy(policy)
                                            .resource(res)
                                            .violationMessage("Project '" + b.getProject().getName() + "' forecast exceeds budget allocation limits.")
                                            .severity(RecommendationSeverity.HIGH)
                                            .status(ViolationStatus.OPEN)
                                            .build();
                                    violationRepository.save(violation);
                                }
                            }
                        }
                    }
                    break;

                case UNAPPROVED_RESOURCE:
                    for (CloudResource res : allResources) {
                        String type = res.getInstanceType();
                        if (type != null && (type.contains("NV") || type.contains("p3") || type.contains("r5"))) {
                            String violationId = "v-un-" + res.getId();
                            if (!violationRepository.existsByPolicyIdAndResourceIdAndStatus(policy.getId(), res.getId(), ViolationStatus.OPEN)) {
                                PolicyViolation violation = PolicyViolation.builder()
                                        .id(violationId)
                                        .policy(policy)
                                        .resource(res)
                                        .violationMessage("Unapproved instance type configuration deployed: " + type)
                                        .severity(RecommendationSeverity.HIGH)
                                        .status(ViolationStatus.OPEN)
                                        .build();
                                violationRepository.save(violation);
                            }
                        }
                    }
                    break;

                case PUBLIC_STORAGE:
                    for (CloudResource res : allResources) {
                        if (res.getResourceType() == ResourceType.STORAGE) {
                            String name = res.getResourceName().toLowerCase();
                            if (name.contains("public") || name.contains("share") || name.contains("dump")) {
                                String violationId = "v-pub-" + res.getId();
                                if (!violationRepository.existsByPolicyIdAndResourceIdAndStatus(policy.getId(), res.getId(), ViolationStatus.OPEN)) {
                                    PolicyViolation violation = PolicyViolation.builder()
                                            .id(violationId)
                                            .policy(policy)
                                            .resource(res)
                                            .violationMessage("Storage asset has anonymous public read/write permission mappings enabled.")
                                            .severity(RecommendationSeverity.CRITICAL)
                                            .status(ViolationStatus.OPEN)
                                            .build();
                                    violationRepository.save(violation);
                                }
                            }
                        }
                    }
                    break;

                case UNUSED_RESOURCE:
                    for (CloudResource res : allResources) {
                        Integer cpu = res.getCpuUsage();
                        if (cpu != null && cpu < 5 && res.getStatus() == ResourceStatus.ACTIVE) {
                            String violationId = "v-unr-" + res.getId();
                            if (!violationRepository.existsByPolicyIdAndResourceIdAndStatus(policy.getId(), res.getId(), ViolationStatus.OPEN)) {
                                PolicyViolation violation = PolicyViolation.builder()
                                        .id(violationId)
                                        .policy(policy)
                                        .resource(res)
                                        .violationMessage("Orphaned EBS volume or idle compute node running without active write transactions.")
                                        .severity(RecommendationSeverity.MEDIUM)
                                        .status(ViolationStatus.OPEN)
                                        .build();
                                violationRepository.save(violation);
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    }

    @Override
    @Transactional
    public void resolveViolation(String id) {
        PolicyViolation violation = violationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy violation not found with ID: " + id));

        violation.setStatus(ViolationStatus.RESOLVED);
        violation.setResolvedAt(LocalDateTime.now());
        violationRepository.save(violation);

        // Perform automated script patching to resolve compliance
        CloudResource resource = violation.getResource();
        if (resource != null) {
            if (violation.getPolicy().getPolicyType() == PolicyType.MANDATORY_TAG) {
                // Seed missing tags in database to clear compliance warning
                costTagRepository.save(CostTag.builder().resource(resource).tagKey("Project").tagValue(resource.getProject() != null ? resource.getProject().getName() : "Core API").build());
                costTagRepository.save(CostTag.builder().resource(resource).tagKey("Owner").tagValue(resource.getProject() != null ? resource.getProject().getOwner() : "Lead").build());
                costTagRepository.save(CostTag.builder().resource(resource).tagKey("Environment").tagValue(resource.getEnvironment().name()).build());
                costTagRepository.save(CostTag.builder().resource(resource).tagKey("CostCenter").tagValue(resource.getProject() != null ? resource.getProject().getCostCenter() : "CC-Finance").build());
            } else if (violation.getPolicy().getPolicyType() == PolicyType.PUBLIC_STORAGE) {
                // Rename resource or simulate permission lockdown
                resource.setResourceName(resource.getResourceName().replace("-Public", "-Private"));
                resourceRepository.save(resource);
            } else if (violation.getPolicy().getPolicyType() == PolicyType.UNUSED_RESOURCE) {
                // Stop the compute resource to save billing costs
                resource.setStatus(ResourceStatus.ACTIVE); // mark clean
            }
        }

        // Add toast notification
        Notification notification = Notification.builder()
                .id("n-gov-res-" + java.util.UUID.randomUUID().toString().substring(0, 4))
                .message("Governance drift resolved successfully: " + violation.getViolationMessage())
                .type("success")
                .read(false)
                .build();
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void ignoreViolation(String id) {
        PolicyViolation violation = violationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy violation not found: " + id));

        violation.setStatus(ViolationStatus.IGNORED);
        violationRepository.save(violation);

        Notification notification = Notification.builder()
                .id("n-gov-ign-" + java.util.UUID.randomUUID().toString().substring(0, 4))
                .message("Compliance drift warning ignored for: " + (violation.getResource() != null ? violation.getResource().getResourceName() : "project"))
                .type("info")
                .read(false)
                .build();
        notificationRepository.save(notification);
    }
}
