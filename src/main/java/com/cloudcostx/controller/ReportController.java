package com.cloudcostx.controller;

import com.cloudcostx.dto.ApiResponse;
import com.cloudcostx.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/monthly-cost")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMonthlyCostReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Map<String, Object> report = reportService.getMonthlyCostReport(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(report, "Monthly cost report generated"));
    }

    @GetMapping("/provider-cost")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProviderCostReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Map<String, Object> report = reportService.getProviderCostReport(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(report, "Provider cost report generated"));
    }

    @GetMapping("/department-cost")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDepartmentCostReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Map<String, Object> report = reportService.getDepartmentCostReport(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(report, "Department cost report generated"));
    }

    @GetMapping("/optimization")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOptimizationReport() {
        Map<String, Object> report = reportService.getOptimizationReport();
        return ResponseEntity.ok(ApiResponse.success(report, "Optimization report generated"));
    }

    @GetMapping("/budget-compliance")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getBudgetComplianceReport() {
        Map<String, Object> report = reportService.getBudgetComplianceReport();
        return ResponseEntity.ok(ApiResponse.success(report, "Budget compliance report generated"));
    }

    @GetMapping("/governance")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getGovernanceReport() {
        Map<String, Object> report = reportService.getGovernanceReport();
        return ResponseEntity.ok(ApiResponse.success(report, "Governance report generated"));
    }

    @GetMapping(value = "/costs/export", produces = "text/csv")
    public ResponseEntity<String> exportCostsCsv(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        String csv = reportService.exportCostsCsv(startDate, endDate);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=costs-export.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }

    @GetMapping(value = "/resources/export", produces = "text/csv")
    public ResponseEntity<String> exportResourcesCsv() {
        String csv = reportService.exportResourcesCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=resources-export.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }
}
