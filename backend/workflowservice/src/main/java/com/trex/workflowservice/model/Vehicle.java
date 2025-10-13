package com.trex.workflowservice.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles")
public class Vehicle {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "mkt")
    private String mkt = "MCV";
    
    @Column(name = "used_vehicle_stock_id", unique = true, nullable = false)
    private Long usedVehicleStockId;
    
    @Column(nullable = false)
    private Integer year;
    
    @Column(name = "make_name", nullable = false, length = 100)
    private String makeName;
    
    @Column(name = "model_name", nullable = false, length = 100)
    private String modelName;
    
    @Column(name = "variant_name", length = 200)
    private String variantName;
    
    @Column(unique = true, length = 17)
    private String vin;
    
    @Column(length = 20)
    private String registration;
    
    @Column(name = "mm_code", length = 50)
    private String mmCode;
    
    @Column(name = "engine_no", length = 50)
    private String engineNo;
    
    private Integer mileage;
    
    @Column(length = 50)
    private String colour;
    
    @Column(name = "province_name", length = 50)
    private String provinceName;
    
    @Column(length = 100)
    private String trim;
    
    @Column(length = 20)
    private String condition = "Good";
    
    @Column(name = "stock_code", length = 50)
    private String stockCode;
    
    @Column(length = 20)
    private String department = "Used";
    
    @Column(name = "load_date")
    private LocalDate loadDate;
    
    @Column(name = "last_touch_date")
    private LocalDate lastTouchDate;
    
    @Column(name = "last_changed_date")
    private LocalDate lastChangedDate;
    
    @Column(name = "sold_date")
    private LocalDate soldDate;
    
    @Column(name = "is_program")
    private Integer isProgram = 0;
    
    @Column(name = "currency_symbol", length = 5)
    private String currencySymbol = "R";
    
    @Column(precision = 12, scale = 2)
    private BigDecimal price;
    
    @Column(name = "first_price", precision = 12, scale = 2)
    private BigDecimal firstPrice;
    
    @Column(length = 100)
    private String franchise;
    
    @Column(columnDefinition = "TEXT")
    private String extras;
    
    @Column(columnDefinition = "TEXT")
    private String comments;
    
    // Legacy fields for backward compatibility
    @Column(name = "body_type", length = 50)
    private String bodyType;
    
    @Column(length = 20)
    private String transmission;
    
    @Column(name = "fuel_type", length = 20)
    private String fuelType;
    
    @Column(name = "engine_size", length = 20)
    private String engineSize;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Vehicle() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.loadDate = LocalDate.now();
        this.lastTouchDate = LocalDate.now();
        this.lastChangedDate = LocalDate.now();
    }
    
    public Vehicle(String makeName, String modelName, Integer year) {
        this();
        this.makeName = makeName;
        this.modelName = modelName;
        this.year = year;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getMkt() { return mkt; }
    public void setMkt(String mkt) { this.mkt = mkt; }
    
    public Long getUsedVehicleStockId() { return usedVehicleStockId; }
    public void setUsedVehicleStockId(Long usedVehicleStockId) { this.usedVehicleStockId = usedVehicleStockId; }
    
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    
    public String getMakeName() { return makeName; }
    public void setMakeName(String makeName) { this.makeName = makeName; }
    
    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }
    
    public String getVariantName() { return variantName; }
    public void setVariantName(String variantName) { this.variantName = variantName; }
    
    public String getVin() { return vin; }
    public void setVin(String vin) { this.vin = vin; }
    
    public String getRegistration() { return registration; }
    public void setRegistration(String registration) { this.registration = registration; }
    
    public String getMmCode() { return mmCode; }
    public void setMmCode(String mmCode) { this.mmCode = mmCode; }
    
    public String getEngineNo() { return engineNo; }
    public void setEngineNo(String engineNo) { this.engineNo = engineNo; }
    
    public Integer getMileage() { return mileage; }
    public void setMileage(Integer mileage) { this.mileage = mileage; }
    
    public String getColour() { return colour; }
    public void setColour(String colour) { this.colour = colour; }
    
    public String getProvinceName() { return provinceName; }
    public void setProvinceName(String provinceName) { this.provinceName = provinceName; }
    
    public String getTrim() { return trim; }
    public void setTrim(String trim) { this.trim = trim; }
    
    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }
    
    public String getStockCode() { return stockCode; }
    public void setStockCode(String stockCode) { this.stockCode = stockCode; }
    
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    
    public LocalDate getLoadDate() { return loadDate; }
    public void setLoadDate(LocalDate loadDate) { this.loadDate = loadDate; }
    
    public LocalDate getLastTouchDate() { return lastTouchDate; }
    public void setLastTouchDate(LocalDate lastTouchDate) { this.lastTouchDate = lastTouchDate; }
    
    public LocalDate getLastChangedDate() { return lastChangedDate; }
    public void setLastChangedDate(LocalDate lastChangedDate) { this.lastChangedDate = lastChangedDate; }
    
    public LocalDate getSoldDate() { return soldDate; }
    public void setSoldDate(LocalDate soldDate) { this.soldDate = soldDate; }
    
    public Integer getIsProgram() { return isProgram; }
    public void setIsProgram(Integer isProgram) { this.isProgram = isProgram; }
    
    public String getCurrencySymbol() { return currencySymbol; }
    public void setCurrencySymbol(String currencySymbol) { this.currencySymbol = currencySymbol; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public BigDecimal getFirstPrice() { return firstPrice; }
    public void setFirstPrice(BigDecimal firstPrice) { this.firstPrice = firstPrice; }
    
    public String getFranchise() { return franchise; }
    public void setFranchise(String franchise) { this.franchise = franchise; }
    
    public String getExtras() { return extras; }
    public void setExtras(String extras) { this.extras = extras; }
    
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
    
    public String getBodyType() { return bodyType; }
    public void setBodyType(String bodyType) { this.bodyType = bodyType; }
    
    public String getTransmission() { return transmission; }
    public void setTransmission(String transmission) { this.transmission = transmission; }
    
    public String getFuelType() { return fuelType; }
    public void setFuelType(String fuelType) { this.fuelType = fuelType; }
    
    public String getEngineSize() { return engineSize; }
    public void setEngineSize(String engineSize) { this.engineSize = engineSize; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}