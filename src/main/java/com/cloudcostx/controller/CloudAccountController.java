package com.cloudcostx.controller;

import com.cloudcostx.dto.ApiResponse;
import com.cloudcostx.entity.CloudAccount;
import com.cloudcostx.service.CloudAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cloud-accounts")
public class CloudAccountController {

    @Autowired
    private CloudAccountService cloudAccountService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CloudAccount>>> getAllAccounts() {
        List<CloudAccount> accounts = cloudAccountService.getAllAccounts();
        return ResponseEntity.ok(ApiResponse.success(accounts, "Cloud integrations list retrieved"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CloudAccount>> getAccountById(@PathVariable String id) {
        CloudAccount account = cloudAccountService.getAccountById(id);
        return ResponseEntity.ok(ApiResponse.success(account, "Cloud connection retrieved"));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('DEVOPS')")
    public ResponseEntity<ApiResponse<CloudAccount>> connectAccount(@RequestBody CloudAccount account) {
        CloudAccount newAccount = cloudAccountService.createAccount(account);
        return ResponseEntity.ok(ApiResponse.success(newAccount, "Cloud platform integration connected successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DEVOPS')")
    public ResponseEntity<ApiResponse<CloudAccount>> updateAccount(@PathVariable String id, @RequestBody CloudAccount account) {
        CloudAccount updated = cloudAccountService.updateAccount(id, account);
        return ResponseEntity.ok(ApiResponse.success(updated, "Cloud platform integration updated"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DEVOPS')")
    public ResponseEntity<ApiResponse<String>> deleteAccount(@PathVariable String id) {
        cloudAccountService.deleteAccount(id);
        return ResponseEntity.ok(ApiResponse.success("Cloud account integration removed", "Connection removed successfully"));
    }

    @PostMapping("/{id}/sync")
    public ResponseEntity<ApiResponse<String>> syncAccount(@PathVariable String id) {
        cloudAccountService.syncAccount(id);
        return ResponseEntity.ok(ApiResponse.success("Sync triggered", "CUR billing sync initialized successfully"));
    }
}
