package com.cloudcostx.controller;

import com.cloudcostx.dto.ApiResponse;
import com.cloudcostx.service.NetworkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/network")
public class NetworkController {

    @Autowired
    private NetworkService networkService;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getNetworkDetails() {
        Map<String, Object> details = networkService.getNetworkDetails();
        return ResponseEntity.ok(ApiResponse.success(details, "Network traffic analysis compiled"));
    }

    @PostMapping("/{id}/optimize")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DEVOPS')")
    public ResponseEntity<ApiResponse<String>> optimizeRoute(@PathVariable String id) {
        networkService.optimizeRoute(id);
        return ResponseEntity.ok(ApiResponse.success("Routing optimized", "Egress peering route optimized successfully"));
    }
}
