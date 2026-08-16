package com.cloudcostx.service;

import java.math.BigDecimal;
import java.util.Map;

public interface ChargebackService {
    Map<String, BigDecimal> getDepartmentSpends();
    Map<String, BigDecimal> getProjectSpends();
    Map<String, BigDecimal> getCostCenterSpends();
    
    Map<String, Object> getFinOpsLifecycleSummary();
}
