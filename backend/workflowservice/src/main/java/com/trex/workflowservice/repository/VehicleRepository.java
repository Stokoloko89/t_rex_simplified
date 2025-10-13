package com.trex.workflowservice.repository;

import com.trex.workflowservice.model.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    
    // Find by make
    List<Vehicle> findByMakeNameIgnoreCase(String makeName);
    
    // Find by make and model
    List<Vehicle> findByMakeNameIgnoreCaseAndModelNameIgnoreCase(String makeName, String modelName);
    
    // Find by year range
    List<Vehicle> findByYearBetween(Integer startYear, Integer endYear);
    
    // Find by price range
    List<Vehicle> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    
    // Find by province
    List<Vehicle> findByProvinceNameIgnoreCase(String provinceName);
    
    // Find by mileage range
    List<Vehicle> findByMileageLessThanEqual(Integer maxMileage);
    
    // Find by fuel type
    List<Vehicle> findByFuelTypeIgnoreCase(String fuelType);
    
    // Find by body type
    List<Vehicle> findByBodyTypeIgnoreCase(String bodyType);
    
    // Find by transmission
    List<Vehicle> findByTransmissionIgnoreCase(String transmission);
    
    // Complex search query with all filters
    @Query("SELECT v FROM Vehicle v WHERE " +
           "(:make IS NULL OR LOWER(v.makeName) = LOWER(:make)) AND " +
           "(:model IS NULL OR LOWER(v.modelName) = LOWER(:model)) AND " +
           "(:minYear IS NULL OR v.year >= :minYear) AND " +
           "(:maxYear IS NULL OR v.year <= :maxYear) AND " +
           "(:minPrice IS NULL OR v.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR v.price <= :maxPrice) AND " +
           "(:province IS NULL OR LOWER(v.provinceName) = LOWER(:province)) AND " +
           "(:maxMileage IS NULL OR v.mileage <= :maxMileage) AND " +
           "(:fuelType IS NULL OR LOWER(v.fuelType) = LOWER(:fuelType)) AND " +
           "(:bodyType IS NULL OR LOWER(v.bodyType) = LOWER(:bodyType)) AND " +
           "(:transmission IS NULL OR LOWER(v.transmission) = LOWER(:transmission)) AND " +
           "v.soldDate IS NULL")
    Page<Vehicle> findVehiclesWithFilters(
        @Param("make") String make,
        @Param("model") String model,
        @Param("minYear") Integer minYear,
        @Param("maxYear") Integer maxYear,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("province") String province,
        @Param("maxMileage") Integer maxMileage,
        @Param("fuelType") String fuelType,
        @Param("bodyType") String bodyType,
        @Param("transmission") String transmission,
        Pageable pageable
    );
    
    // Get distinct makes
    @Query("SELECT DISTINCT v.makeName FROM Vehicle v WHERE v.soldDate IS NULL ORDER BY v.makeName")
    List<String> findDistinctMakes();
    
    // Get distinct models for a make
    @Query("SELECT DISTINCT v.modelName FROM Vehicle v WHERE LOWER(v.makeName) = LOWER(:make) AND v.soldDate IS NULL ORDER BY v.modelName")
    List<String> findDistinctModelsByMake(@Param("make") String make);
    
    // Get distinct provinces
    @Query("SELECT DISTINCT v.provinceName FROM Vehicle v WHERE v.soldDate IS NULL ORDER BY v.provinceName")
    List<String> findDistinctProvinces();
    
    // Get distinct fuel types
    @Query("SELECT DISTINCT v.fuelType FROM Vehicle v WHERE v.fuelType IS NOT NULL AND v.soldDate IS NULL ORDER BY v.fuelType")
    List<String> findDistinctFuelTypes();
    
    // Get distinct body types
    @Query("SELECT DISTINCT v.bodyType FROM Vehicle v WHERE v.bodyType IS NOT NULL AND v.soldDate IS NULL ORDER BY v.bodyType")
    List<String> findDistinctBodyTypes();
    
    // Get distinct transmissions
    @Query("SELECT DISTINCT v.transmission FROM Vehicle v WHERE v.transmission IS NOT NULL AND v.soldDate IS NULL ORDER BY v.transmission")
    List<String> findDistinctTransmissions();
    
    // Find available vehicles (not sold)
    @Query("SELECT v FROM Vehicle v WHERE v.soldDate IS NULL")
    Page<Vehicle> findAvailableVehicles(Pageable pageable);
    
    // Search by text across make, model, and variant
    @Query("SELECT v FROM Vehicle v WHERE " +
           "(LOWER(v.makeName) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
           "LOWER(v.modelName) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
           "LOWER(v.variantName) LIKE LOWER(CONCAT('%', :searchText, '%'))) AND " +
           "v.soldDate IS NULL")
    Page<Vehicle> findBySearchText(@Param("searchText") String searchText, Pageable pageable);
    
    // Get price range for available vehicles
    @Query("SELECT MIN(v.price), MAX(v.price) FROM Vehicle v WHERE v.soldDate IS NULL AND v.price IS NOT NULL")
    Object[] findPriceRange();
    
    // Get year range for available vehicles
    @Query("SELECT MIN(v.year), MAX(v.year) FROM Vehicle v WHERE v.soldDate IS NULL")
    Object[] findYearRange();
}