package com.cloudcostx.service.impl;

import com.cloudcostx.service.CloudCostProvider;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.*;

@Service("awsCloudCostProvider")
public class AWSCloudCostProvider implements CloudCostProvider {

    @Override
    public String getProviderName() {
        return "AWS";
    }

    @Override
    public List<Map<String, Object>> fetchCostRecords(String accountId, String startDate, String endDate) {
        // Mock implementation — replace with AWS Cost Explorer SDK
        List<Map<String, Object>> records = new ArrayList<>();
        Map<String, Object> record = new HashMap<>();
        record.put("service", "EC2");
        record.put("amount", BigDecimal.valueOf(42500));
        record.put("region", "ap-south-1");
        records.add(record);
        return records;
    }

    @Override
    public List<Map<String, Object>> fetchResources(String accountId) {
        List<Map<String, Object>> resources = new ArrayList<>();
        Map<String, Object> ec2 = new HashMap<>();
        ec2.put("resourceName", "EC2-Production-01");
        ec2.put("type", "COMPUTE");
        ec2.put("monthlyCost", BigDecimal.valueOf(9200));
        resources.add(ec2);
        return resources;
    }

    @Override
    public BigDecimal estimateMonthlyCost(String instanceType, String region) {
        Map<String, BigDecimal> pricing = Map.of(
                "t3.large", BigDecimal.valueOf(9200),
                "t3.medium", BigDecimal.valueOf(5100),
                "t3.small", BigDecimal.valueOf(2800)
        );
        return pricing.getOrDefault(instanceType, BigDecimal.valueOf(5000));
    }

    @Override
    public void syncAccount(String accountId) {
        // Mock sync — replace with AWS CUR/billing API integration
    }
}
