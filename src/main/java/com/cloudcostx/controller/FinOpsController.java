package com.cloudcostx.controller;

import com.cloudcostx.dto.ApiResponse;
import com.cloudcostx.service.ChargebackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/finops")
public class FinOpsController {

    @Autowired
    private ChargebackService chargebackService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getFinOpsSummary() {
        Map<String, Object> summary = chargebackService.getFinOpsLifecycleSummary();
        return ResponseEntity.ok(ApiResponse.success(summary, "FinOps lifecycle summary retrieved"));
    }
}
