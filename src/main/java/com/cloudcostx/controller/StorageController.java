package com.cloudcostx.controller;

import com.cloudcostx.dto.ApiResponse;
import com.cloudcostx.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/storage")
public class StorageController {

    @Autowired
    private StorageService storageService;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStorageDetails() {
        Map<String, Object> details = storageService.getStorageDetails();
        return ResponseEntity.ok(ApiResponse.success(details, "Storage usage analysis compiled"));
    }

    @PostMapping("/{id}/lifecycle")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DEVOPS')")
    public ResponseEntity<ApiResponse<String>> applyLifecycle(@PathVariable String id) {
        storageService.applyStorageLifecycle(id);
        return ResponseEntity.ok(ApiResponse.success("Lifecycle policy applied", "Storage tier lifecycle applied successfully"));
    }
}
