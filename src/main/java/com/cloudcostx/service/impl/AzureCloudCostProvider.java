package com.cloudcostx.service.impl;

import com.cloudcostx.service.CloudCostProvider;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.*;

@Service("azureCloudCostProvider")
public class AzureCloudCostProvider implements CloudCostProvider {

    @Override
    public String getProviderName() {
        return "Azure";
    }

    @Override
    public List<Map<String, Object>> fetchCostRecords(String accountId, String startDate, String endDate) {
        List<Map<String, Object>> records = new ArrayList<>();
        Map<String, Object> record = new HashMap<>();
        record.put("service", "Virtual Machines");
        record.put("amount", BigDecimal.valueOf(27800));
        record.put("region", "centralindia");
        records.add(record);
        return records;
    }

    @Override
    public List<Map<String, Object>> fetchResources(String accountId) {
        List<Map<String, Object>> resources = new ArrayList<>();
        Map<String, Object> vm = new HashMap<>();
        vm.put("resourceName", "Azure-VM-02");
        vm.put("type", "COMPUTE");
        vm.put("monthlyCost", BigDecimal.valueOf(6800));
        resources.add(vm);
        return resources;
    }

    @Override
    public BigDecimal estimateMonthlyCost(String instanceType, String region) {
        return BigDecimal.valueOf(6800);
    }

    @Override
    public void syncAccount(String accountId) {
        // Mock sync — replace with Azure Cost Management API
    }
}
