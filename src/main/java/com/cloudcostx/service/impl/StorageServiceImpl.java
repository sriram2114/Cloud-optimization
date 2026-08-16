package com.cloudcostx.service.impl;

import com.cloudcostx.entity.*;
import com.cloudcostx.exception.ResourceNotFoundException;
import com.cloudcostx.repository.CloudResourceRepository;
import com.cloudcostx.repository.NotificationRepository;
import com.cloudcostx.repository.StorageUsageRepository;
import com.cloudcostx.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StorageServiceImpl implements StorageService {

    @Autowired
    private StorageUsageRepository storageUsageRepository;

    @Autowired
    private CloudResourceRepository resourceRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public Map<String, Object> getStorageDetails() {
        List<StorageUsage> items = storageUsageRepository.findAll();

        BigDecimal totalCost = items.stream()
                .map(StorageUsage::getMonthlyCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal hotCost = items.stream()
                .filter(st -> st.getCurrentTier() == StorageTier.HOT)
                .map(StorageUsage::getMonthlyCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal coolCost = items.stream()
                .filter(st -> st.getCurrentTier() == StorageTier.COOL)
                .map(StorageUsage::getMonthlyCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal archiveCost = items.stream()
                .filter(st -> st.getCurrentTier() == StorageTier.ARCHIVE)
                .map(StorageUsage::getMonthlyCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal potentialSavings = items.stream()
                .map(StorageUsage::getPotentialSaving)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalStorageCost", totalCost);
        summary.put("hotStorageCost", hotCost);
        summary.put("coolStorageCost", coolCost);
        summary.put("archiveStorageCost", archiveCost);
        summary.put("potentialSavings", potentialSavings);

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("summary", summary);
        responseData.put("storageResources", items);

        return responseData;
    }

    @Override
    @Transactional
    public void applyStorageLifecycle(String id) {
        StorageUsage st = storageUsageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Storage volume record not found with ID: " + id));

        if (st.getPotentialSaving().compareTo(BigDecimal.ZERO) == 0) {
            return; // Already optimized
        }

        BigDecimal savings = st.getPotentialSaving();
        
        // Transition tier
        st.setCurrentTier(st.getRecommendedTier());
        st.setMonthlyCost(st.getMonthlyCost().subtract(savings));
        st.setPotentialSaving(BigDecimal.ZERO);
        storageUsageRepository.save(st);

        // Update main resource cost in resource list
        CloudResource resource = st.getResource();
        if (resource != null) {
            resource.setMonthlyCost(st.getMonthlyCost());
            resourceRepository.save(resource);
        }

        Notification notification = Notification.builder()
                .id("n-st-opt-" + java.util.UUID.randomUUID().toString().substring(0, 4))
                .message("Successfully transitioned storage lifecycle tier for: " + st.getResource().getResourceName() + ". Saved " + savings.setScale(0, RoundingMode.HALF_UP) + "/mo.")
                .type("success")
                .read(false)
                .build();
        notificationRepository.save(notification);
    }
}
