package com.cloudcostx.controller;

import com.cloudcostx.dto.ApiResponse;
import com.cloudcostx.entity.GovernancePolicy;
import com.cloudcostx.entity.PolicyViolation;
import com.cloudcostx.service.GovernanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/governance")
public class GovernanceController {

    @Autowired
    private GovernanceService governanceService;

    @GetMapping("/policies")
    public ResponseEntity<ApiResponse<List<GovernancePolicy>>> getAllPolicies() {
        List<GovernancePolicy> policies = governanceService.getAllPolicies();
        return ResponseEntity.ok(ApiResponse.success(policies, "Governance compliance policies retrieved"));
    }

    @PutMapping("/policies/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DEVOPS')")
    public ResponseEntity<ApiResponse<GovernancePolicy>> updatePolicy(@PathVariable String id, @RequestBody GovernancePolicy policy) {
        GovernancePolicy updated = governanceService.updatePolicy(id, policy);
        return ResponseEntity.ok(ApiResponse.success(updated, "Governance compliance policy status toggled"));
    }

    @GetMapping("/violations")
    public ResponseEntity<ApiResponse<List<PolicyViolation>>> getActiveViolations() {
        List<PolicyViolation> violations = governanceService.getActiveViolations();
        return ResponseEntity.ok(ApiResponse.success(violations, "Active compliance drifts list retrieved"));
    }

    @PostMapping("/scan")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DEVOPS')")
    public ResponseEntity<ApiResponse<String>> scanPolicies() {
        governanceService.scanGovernancePolicies();
        return ResponseEntity.ok(ApiResponse.success("Scan completed", "Compliance scan audits completed successfully"));
    }

    @PostMapping("/violations/{id}/resolve")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DEVOPS')")
    public ResponseEntity<ApiResponse<String>> resolveViolation(@PathVariable String id) {
        governanceService.resolveViolation(id);
        return ResponseEntity.ok(ApiResponse.success("Violation resolved", "Drift patched successfully"));
    }

    @PostMapping("/violations/{id}/ignore")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DEVOPS')")
    public ResponseEntity<ApiResponse<String>> ignoreViolation(@PathVariable String id) {
        governanceService.ignoreViolation(id);
        return ResponseEntity.ok(ApiResponse.success("Violation ignored", "Drift violation warning muted"));
    }
}
