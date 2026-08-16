package com.cloudcostx.service;

import java.util.Map;

public interface StorageService {
    Map<String, Object> getStorageDetails();
    void applyStorageLifecycle(String id);
}
