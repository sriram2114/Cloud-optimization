package com.cloudcostx.service;

import java.util.Map;

public interface NetworkService {
    Map<String, Object> getNetworkDetails();
    void optimizeRoute(String id);
}
