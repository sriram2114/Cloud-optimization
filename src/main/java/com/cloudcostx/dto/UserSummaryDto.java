package com.cloudcostx.dto;

public class UserSummaryDto {
    private Long id;
    private String name;
    private String email;
    private String role;

    public UserSummaryDto() {}

    public UserSummaryDto(Long id, String name, String email, String role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    // Builder
    public static UserSummaryDtoBuilder builder() {
        return new UserSummaryDtoBuilder();
    }

    public static class UserSummaryDtoBuilder {
        private Long id;
        private String name;
        private String email;
        private String role;

        public UserSummaryDtoBuilder id(Long id) { this.id = id; return this; }
        public UserSummaryDtoBuilder name(String name) { this.name = name; return this; }
        public UserSummaryDtoBuilder email(String email) { this.email = email; return this; }
        public UserSummaryDtoBuilder role(String role) { this.role = role; return this; }

        public UserSummaryDto build() {
            return new UserSummaryDto(id, name, email, role);
        }
    }
}
