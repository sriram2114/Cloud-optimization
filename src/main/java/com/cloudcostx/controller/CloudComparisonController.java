package com.cloudcostx.controller;

import com.cloudcostx.dto.ApiResponse;
import com.cloudcostx.dto.CloudComparisonDto;
import com.cloudcostx.service.MultiCloudComparisonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/cloud-comparison")
public class CloudComparisonController {

    @Autowired
    private MultiCloudComparisonService comparisonService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CloudComparisonDto>>> getComparison() {
        List<CloudComparisonDto> list = comparisonService.getComparison();
        return ResponseEntity.ok(ApiResponse.success(list, "Multi-cloud workload comparison compiled"));
    }
}
