package com.cloudcostx.controller;

import com.cloudcostx.dto.ApiResponse;
import com.cloudcostx.service.KpiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/kpis")
public class KpiController {

    @Autowired
    private KpiService kpiService;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getKpis() {
        Map<String, Object> kpis = kpiService.getKpis();
        return ResponseEntity.ok(ApiResponse.success(kpis, "FinOps KPIs retrieved successfully"));
    }
}
