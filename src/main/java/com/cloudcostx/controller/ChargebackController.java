package com.cloudcostx.controller;

import com.cloudcostx.dto.ApiResponse;
import com.cloudcostx.service.ChargebackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/chargeback")
public class ChargebackController {

    @Autowired
    private ChargebackService chargebackService;

    @GetMapping("/departments")
    public ResponseEntity<ApiResponse<Map<String, BigDecimal>>> getDepartmentSpends() {
        Map<String, BigDecimal> spends = chargebackService.getDepartmentSpends();
        return ResponseEntity.ok(ApiResponse.success(spends, "Chargeback by department retrieved"));
    }

    @GetMapping("/projects")
    public ResponseEntity<ApiResponse<Map<String, BigDecimal>>> getProjectSpends() {
        Map<String, BigDecimal> spends = chargebackService.getProjectSpends();
        return ResponseEntity.ok(ApiResponse.success(spends, "Chargeback by project retrieved"));
    }

    @GetMapping("/cost-centers")
    public ResponseEntity<ApiResponse<Map<String, BigDecimal>>> getCostCenterSpends() {
        Map<String, BigDecimal> spends = chargebackService.getCostCenterSpends();
        return ResponseEntity.ok(ApiResponse.success(spends, "Chargeback by cost center retrieved"));
    }

    @GetMapping("/lifecycle")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getLifecycleSummary() {
        Map<String, Object> summary = chargebackService.getFinOpsLifecycleSummary();
        return ResponseEntity.ok(ApiResponse.success(summary, "FinOps lifecycle phase allocations retrieved"));
    }

    @GetMapping("/showback")
    public ResponseEntity<ApiResponse<Map<String, BigDecimal>>> getShowback() {
        Map<String, BigDecimal> spends = chargebackService.getDepartmentSpends();
        return ResponseEntity.ok(ApiResponse.success(spends, "Showback by department retrieved"));
    }
}
