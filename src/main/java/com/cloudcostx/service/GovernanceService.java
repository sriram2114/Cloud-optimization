package com.cloudcostx.service;

import com.cloudcostx.entity.GovernancePolicy;
import com.cloudcostx.entity.PolicyViolation;
import java.util.List;

public interface GovernanceService {
    List<GovernancePolicy> getAllPolicies();
    GovernancePolicy getPolicyById(String id);
    GovernancePolicy updatePolicy(String id, GovernancePolicy policy);
    
    List<PolicyViolation> getActiveViolations();
    void scanGovernancePolicies(); // Scan all resources and budgets against active policies
    void resolveViolation(String id);
    void ignoreViolation(String id);
}
