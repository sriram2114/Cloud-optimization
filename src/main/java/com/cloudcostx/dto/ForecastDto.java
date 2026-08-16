package com.cloudcostx.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ForecastDto {
    private LocalDate date;
    private BigDecimal actualCost;
    private BigDecimal forecastedCost;
    private boolean isForecast;

    public ForecastDto() {}

    public ForecastDto(LocalDate date, BigDecimal actualCost, BigDecimal forecastedCost, boolean isForecast) {
        this.date = date;
        this.actualCost = actualCost;
        this.forecastedCost = forecastedCost;
        this.isForecast = isForecast;
    }

    // Getters and Setters
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public BigDecimal getActualCost() { return actualCost; }
    public void setActualCost(BigDecimal actualCost) { this.actualCost = actualCost; }

    public BigDecimal getForecastedCost() { return forecastedCost; }
    public void setForecastedCost(BigDecimal forecastedCost) { this.forecastedCost = forecastedCost; }

    public boolean isForecast() { return isForecast; }
    public void setForecast(boolean isForecast) { this.isForecast = isForecast; }

    // Builder
    public static ForecastDtoBuilder builder() {
        return new ForecastDtoBuilder();
    }

    public static class ForecastDtoBuilder {
        private LocalDate date;
        private BigDecimal actualCost;
        private BigDecimal forecastedCost;
        private boolean isForecast;

        public ForecastDtoBuilder date(LocalDate date) { this.date = date; return this; }
        public ForecastDtoBuilder actualCost(BigDecimal actualCost) { this.actualCost = actualCost; return this; }
        public ForecastDtoBuilder forecastedCost(BigDecimal forecastedCost) { this.forecastedCost = forecastedCost; return this; }
        public ForecastDtoBuilder isForecast(boolean isForecast) { this.isForecast = isForecast; return this; }

        public ForecastDto build() {
            return new ForecastDto(date, actualCost, forecastedCost, isForecast);
        }
    }
}
