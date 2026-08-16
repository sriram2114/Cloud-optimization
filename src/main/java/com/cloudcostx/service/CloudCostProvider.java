package com.cloudcostx.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Interface for cloud cost provider integrations.
 * Mock implementations are used during development.
 * Replace with actual AWS/Azure/GCP SDK implementations in production.
 */
public interface CloudCostProvider {
    String getProviderName();
    List<Map<String, Object>> fetchCostRecords(String accountId, String startDate, String endDate);
    List<Map<String, Object>> fetchResources(String accountId);
    BigDecimal estimateMonthlyCost(String instanceType, String region);
    void syncAccount(String accountId);
}
