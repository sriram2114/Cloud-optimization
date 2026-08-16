package com.cloudcostx.controller;

import com.cloudcostx.dto.ApiResponse;
import com.cloudcostx.dto.ForecastDto;
import com.cloudcostx.service.CostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/costs")
public class CostController {

    @Autowired
    private CostService costService;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCosts(
            @RequestParam(required = false) String provider,
            @RequestParam(required = false) String service,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String project,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String environment,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String search
    ) {
        Map<String, Object> data = costService.getCosts(
                provider, service, region, project, department, environment, startDate, endDate, search
        );
        return ResponseEntity.ok(ApiResponse.success(data, "Cost analysis ledger retrieved successfully"));
    }

    @GetMapping("/forecast")
    public ResponseEntity<ApiResponse<List<ForecastDto>>> getForecast() {
        List<ForecastDto> forecast = costService.getForecast();
        return ResponseEntity.ok(ApiResponse.success(forecast, "Cost trend forecasts computed successfully"));
    }
}
