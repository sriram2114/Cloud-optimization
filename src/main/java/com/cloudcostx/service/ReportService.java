package com.cloudcostx.service;

import java.time.LocalDate;
import java.util.Map;

public interface ReportService {
    Map<String, Object> getMonthlyCostReport(LocalDate startDate, LocalDate endDate);
    Map<String, Object> getProviderCostReport(LocalDate startDate, LocalDate endDate);
    Map<String, Object> getDepartmentCostReport(LocalDate startDate, LocalDate endDate);
    Map<String, Object> getOptimizationReport();
    Map<String, Object> getBudgetComplianceReport();
    Map<String, Object> getGovernanceReport();
    String exportCostsCsv(LocalDate startDate, LocalDate endDate);
    String exportResourcesCsv();
}
