package com.cloudcostx.service;

import com.cloudcostx.dto.ForecastDto;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface CostService {
    Map<String, Object> getCosts(
            String provider,
            String service,
            String region,
            String project,
            String department,
            String environment,
            LocalDate startDate,
            LocalDate endDate,
            String search
    );

    List<ForecastDto> getForecast();
}
