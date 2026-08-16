package com.cloudcostx.service.impl;

import com.cloudcostx.entity.*;
import com.cloudcostx.exception.ResourceNotFoundException;
import com.cloudcostx.repository.NetworkUsageRepository;
import com.cloudcostx.repository.NotificationRepository;
import com.cloudcostx.service.NetworkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class NetworkServiceImpl implements NetworkService {

    @Autowired
    private NetworkUsageRepository networkUsageRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public Map<String, Object> getNetworkDetails() {
        List<NetworkUsage> list = networkUsageRepository.findAll();

        BigDecimal total = list.stream()
                .map(NetworkUsage::getCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal internetEgress = list.stream()
                .filter(n -> n.getTransferType() == NetworkTransferType.INTERNET_EGRESS)
                .map(NetworkUsage::getCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal interRegion = list.stream()
                .filter(n -> n.getTransferType() == NetworkTransferType.INTER_REGION)
                .map(NetworkUsage::getCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal crossZone = list.stream()
                .filter(n -> n.getTransferType() == NetworkTransferType.CROSS_ZONE)
                .map(NetworkUsage::getCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalNetworkCost", total);
        summary.put("internetEgressCost", internetEgress);
        summary.put("interRegionCost", interRegion);
        summary.put("crossZoneCost", crossZone);

        // Group cost by region
        Map<String, BigDecimal> regionalMap = list.stream()
                .collect(Collectors.groupingBy(
                        NetworkUsage::getSourceRegion,
                        Collectors.reducing(BigDecimal.ZERO, NetworkUsage::getCost, BigDecimal::add)
                ));

        List<Map<String, Object>> byRegion = new ArrayList<>();
        for (Map.Entry<String, BigDecimal> entry : regionalMap.entrySet()) {
            Map<String, Object> rMap = new HashMap<>();
            rMap.put("region", entry.getKey());
            rMap.put("cost", entry.getValue());
            byRegion.add(rMap);
        }

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("summary", summary);
        responseData.put("networkCostByRegion", byRegion);
        responseData.put("trafficList", list);

        return responseData;
    }

    @Override
    @Transactional
    public void optimizeRoute(String id) {
        NetworkUsage net = networkUsageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Network usage route not found: " + id));

        if (net.getRiskLevel() == NetworkRisk.LOW) {
            return; // Already optimized
        }

        BigDecimal savings = net.getCost().multiply(BigDecimal.valueOf(0.40)).setScale(0, RoundingMode.HALF_UP);
        net.setRiskLevel(NetworkRisk.LOW);
        net.setCost(net.getCost().subtract(savings));
        net.setRecommendation("Configuration optimized (CDN / VPC Peering Active)");
        networkUsageRepository.save(net);

        Notification notification = Notification.builder()
                .id("n-net-opt-" + java.util.UUID.randomUUID().toString().substring(0, 4))
                .message("Successfully deployed network routing caching CDN configuration for: " + net.getSourceRegion() + ". Saved " + savings.setScale(0, RoundingMode.HALF_UP) + "/mo.")
                .type("success")
                .read(false)
                .build();
        notificationRepository.save(notification);
    }
}
