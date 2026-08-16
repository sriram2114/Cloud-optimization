package com.cloudcostx.service.impl;

import com.cloudcostx.service.CloudCostProvider;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.*;

@Service("gcpCloudCostProvider")
public class GCPCloudCostProvider implements CloudCostProvider {

    @Override
    public String getProviderName() {
        return "GCP";
    }

    @Override
    public List<Map<String, Object>> fetchCostRecords(String accountId, String startDate, String endDate) {
        List<Map<String, Object>> records = new ArrayList<>();
        Map<String, Object> record = new HashMap<>();
        record.put("service", "Compute Engine");
        record.put("amount", BigDecimal.valueOf(18200));
        record.put("region", "asia-south1");
        records.add(record);
        return records;
    }

    @Override
    public List<Map<String, Object>> fetchResources(String accountId) {
        List<Map<String, Object>> resources = new ArrayList<>();
        Map<String, Object> compute = new HashMap<>();
        compute.put("resourceName", "GCP-Compute-03");
        compute.put("type", "COMPUTE");
        compute.put("monthlyCost", BigDecimal.valueOf(5400));
        resources.add(compute);
        return resources;
    }

    @Override
    public BigDecimal estimateMonthlyCost(String instanceType, String region) {
        return BigDecimal.valueOf(5400);
    }

    @Override
    public void syncAccount(String accountId) {
        // Mock sync — replace with Google Cloud Billing API
    }
}
