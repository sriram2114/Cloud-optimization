package com.cloudcostx.service;

import com.cloudcostx.dto.RoiResponse;
import java.math.BigDecimal;

public interface RoiService {
    RoiResponse getRoiDetails(BigDecimal investmentCost);
}
