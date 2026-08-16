package com.cloudcostx.controller;

import com.cloudcostx.dto.ApiResponse;
import com.cloudcostx.dto.DashboardResponse;
import com.cloudcostx.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboardData() {
        DashboardResponse data = dashboardService.getDashboardData();
        return ResponseEntity.ok(ApiResponse.success(data, "Dashboard data compiled successfully"));
    }
}
