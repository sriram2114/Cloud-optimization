package com.cloudcostx.service;

import com.cloudcostx.dto.AuthResponse;
import com.cloudcostx.dto.LoginRequest;
import com.cloudcostx.dto.RegisterRequest;
import com.cloudcostx.dto.UserSummaryDto;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    UserSummaryDto register(RegisterRequest request);
    UserSummaryDto getMe(String email);
}
