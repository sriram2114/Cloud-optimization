package com.cloudcostx.service;

import com.cloudcostx.dto.CloudComparisonDto;
import java.util.List;

public interface MultiCloudComparisonService {
    List<CloudComparisonDto> getComparison();
}
