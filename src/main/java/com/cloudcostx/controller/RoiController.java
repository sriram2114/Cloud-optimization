package com.cloudcostx.controller;

import com.cloudcostx.dto.ApiResponse;
import com.cloudcostx.dto.RoiResponse;
import com.cloudcostx.service.RoiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/roi")
public class RoiController {

    @Autowired
    private RoiService roiService;

    @GetMapping
    public ResponseEntity<ApiResponse<RoiResponse>> getRoi(@RequestParam(required = false) BigDecimal investmentCost) {
        RoiResponse roi = roiService.getRoiDetails(investmentCost);
        return ResponseEntity.ok(ApiResponse.success(roi, "ROI value realization calculations retrieved"));
    }
}
