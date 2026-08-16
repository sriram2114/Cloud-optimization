package com.cloudcostx.controller;

import com.cloudcostx.dto.ApiResponse;
import com.cloudcostx.entity.OptimizationRecommendation;
import com.cloudcostx.service.OptimizationEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/optimization")
public class OptimizationController {

    @Autowired
    private OptimizationEngine optimizationEngine;

    @GetMapping("/recommendations")
    public ResponseEntity<ApiResponse<List<OptimizationRecommendation>>> getRecommendations() {
        List<OptimizationRecommendation> recs = optimizationEngine.getActiveRecommendations();
        return ResponseEntity.ok(ApiResponse.success(recs, "Optimization recommendations list retrieved"));
    }

    @PostMapping("/recommendations/{id}/apply")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DEVOPS')")
    public ResponseEntity<ApiResponse<String>> applyRecommendation(@PathVariable String id) {
        optimizationEngine.applyRecommendation(id);
        return ResponseEntity.ok(ApiResponse.success("Recommendation applied", "Optimization applied successfully"));
    }

    @PostMapping("/recommendations/{id}/dismiss")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DEVOPS')")
    public ResponseEntity<ApiResponse<String>> dismissRecommendation(@PathVariable String id) {
        optimizationEngine.dismissRecommendation(id);
        return ResponseEntity.ok(ApiResponse.success("Recommendation dismissed", "Optimization recommendation dismissed"));
    }

    @PostMapping("/scan")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DEVOPS')")
    public ResponseEntity<ApiResponse<String>> triggerScan() {
        optimizationEngine.runOptimizationScan();
        return ResponseEntity.ok(ApiResponse.success("Scan completed", "FinOps optimization advisor scan completed"));
    }
}
