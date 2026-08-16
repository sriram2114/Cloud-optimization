package com.cloudcostx.dto;

import java.util.List;

public class ApiListResponse<T> {
    private boolean success;
    private List<T> data;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private String message;

    public ApiListResponse() {}

    public ApiListResponse(boolean success, List<T> data, int page, int size, long totalElements, int totalPages, String message) {
        this.success = success;
        this.data = data;
        this.page = page;
        this.size = size;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.message = message;
    }

    public static <T> ApiListResponse<T> success(List<T> data, int page, int size, long totalElements, int totalPages, String message) {
        return new ApiListResponse<>(true, data, page, size, totalElements, totalPages, message);
    }

    public static <T> ApiListResponse<T> success(List<T> data, int page, int size, long totalElements, int totalPages) {
        return success(data, page, size, totalElements, totalPages, "List retrieved successfully");
    }

    // Getters and Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public List<T> getData() { return data; }
    public void setData(List<T> data) { this.data = data; }

    public int getPage() { return page; }
    public void setPage(int page) { this.page = page; }

    public int getSize() { return size; }
    public void setSize(int size) { this.size = size; }

    public long getTotalElements() { return totalElements; }
    public void setTotalElements(long totalElements) { this.totalElements = totalElements; }

    public int getPages() { return totalPages; }
    public void setPages(int totalPages) { this.totalPages = totalPages; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    // Builder
    public static <T> ApiListResponseBuilder<T> builder() {
        return new ApiListResponseBuilder<>();
    }

    public static class ApiListResponseBuilder<T> {
        private boolean success;
        private List<T> data;
        private int page;
        private int size;
        private long totalElements;
        private int totalPages;
        private String message;

        public ApiListResponseBuilder<T> success(boolean success) { this.success = success; return this; }
        public ApiListResponseBuilder<T> data(List<T> data) { this.data = data; return this; }
        public ApiListResponseBuilder<T> page(int page) { this.page = page; return this; }
        public ApiListResponseBuilder<T> size(int size) { this.size = size; return this; }
        public ApiListResponseBuilder<T> totalElements(long totalElements) { this.totalElements = totalElements; return this; }
        public ApiListResponseBuilder<T> totalPages(int totalPages) { this.totalPages = totalPages; return this; }
        public ApiListResponseBuilder<T> message(String message) { this.message = message; return this; }

        public ApiListResponse<T> build() {
            return new ApiListResponse<>(success, data, page, size, totalElements, totalPages, message);
        }
    }
}
