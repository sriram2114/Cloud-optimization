package com.cloudcostx.dto;

public class AuthResponse {
    private String token;
    private UserSummaryDto user;

    public AuthResponse() {}

    public AuthResponse(String token, UserSummaryDto user) {
        this.token = token;
        this.user = user;
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public UserSummaryDto getUser() { return user; }
    public void setUser(UserSummaryDto user) { this.user = user; }

    // Builder
    public static AuthResponseBuilder builder() {
        return new AuthResponseBuilder();
    }

    public static class AuthResponseBuilder {
        private String token;
        private UserSummaryDto user;

        public AuthResponseBuilder token(String token) { this.token = token; return this; }
        public AuthResponseBuilder user(UserSummaryDto user) { this.user = user; return this; }

        public AuthResponse build() {
            return new AuthResponse(token, user);
        }
    }
}
