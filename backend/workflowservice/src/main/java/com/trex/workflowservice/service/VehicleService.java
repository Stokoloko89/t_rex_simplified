package com.trex.workflowservice.service;

import com.trex.workflowservice.model.Vehicle;
import com.trex.workflowservice.repository.VehicleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class VehicleService {
    
    private static final Logger logger = LoggerFactory.getLogger(VehicleService.class);
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    public Page<Vehicle> searchVehicles(
            String make, 
            String model, 
            Integer minYear, 
            Integer maxYear,
            BigDecimal minPrice, 
            BigDecimal maxPrice,
            String province,
            String city,
            Integer maxMileage,
            String fuelType,
            String bodyType,
            String transmission,
            int page, 
            int size, 
            String sortBy, 
            String sortDir) {
        
        logger.info("Searching vehicles with filters - make: {}, model: {}, minYear: {}, maxYear: {}, " +
                   "minPrice: {}, maxPrice: {}, province: {}, city: {}, maxMileage: {}, fuelType: {}, bodyType: {}, " +
                   "transmission: {}, page: {}, size: {}, sortBy: {}, sortDir: {}", 
                   make, model, minYear, maxYear, minPrice, maxPrice, province, city, maxMileage, 
                   fuelType, bodyType, transmission, page, size, sortBy, sortDir);
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return vehicleRepository.findVehiclesWithFilters(
            make, model, minYear, maxYear, minPrice, maxPrice, 
            province, city, maxMileage, fuelType, bodyType, transmission, pageable
        );
    }
    
    public Page<Vehicle> searchVehiclesByText(String searchText, int page, int size, String sortBy, String sortDir) {
        logger.info("Searching vehicles by text: {}, page: {}, size: {}, sortBy: {}, sortDir: {}", 
                   searchText, page, size, sortBy, sortDir);
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return vehicleRepository.findBySearchText(searchText, pageable);
    }
    
    public Page<Vehicle> getAllAvailableVehicles(int page, int size, String sortBy, String sortDir) {
        logger.info("Getting all available vehicles - page: {}, size: {}, sortBy: {}, sortDir: {}", 
                   page, size, sortBy, sortDir);
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return vehicleRepository.findAvailableVehicles(pageable);
    }
    
    public Optional<Vehicle> getVehicleById(Long id) {
        logger.info("Getting vehicle by id: {}", id);
        return vehicleRepository.findById(id);
    }
    
    public List<String> getAllMakes() {
        logger.info("Getting all distinct makes");
        return vehicleRepository.findDistinctMakes();
    }
    
    public List<String> getModelsByMake(String make) {
        logger.info("Getting models for make: {}", make);
        return vehicleRepository.findDistinctModelsByMake(make);
    }
    
    public List<String> getAllModels() {
        logger.info("Getting all models");
        return vehicleRepository.findDistinctModels();
    }
    
    public String getMakeByModel(String model) {
        logger.info("Getting make for model: {}", model);
        List<String> makes = vehicleRepository.findMakesByModel(model);
        if (makes != null && !makes.isEmpty()) {
            return makes.get(0);
        }
        return null;
    }
    
    public List<String> getAllProvinces() {
        logger.info("Getting all distinct provinces");
        return vehicleRepository.findDistinctProvinces();
    }
    
    public List<String> getAllCities() {
        logger.info("Getting all distinct cities");
        return vehicleRepository.findDistinctCities();
    }
    
    public List<String> getCitiesByProvince(String province) {
        logger.info("Getting cities for province: {}", province);
        return vehicleRepository.findDistinctCitiesByProvince(province);
    }
    
    public List<String> getAllFuelTypes() {
        logger.info("Getting all distinct fuel types");
        return vehicleRepository.findDistinctFuelTypes();
    }
    
    public List<String> getAllBodyTypes() {
        logger.info("Getting all distinct body types");
        return vehicleRepository.findDistinctBodyTypes();
    }
    
    public List<String> getAllTransmissions() {
        logger.info("Getting all distinct transmissions");
        return vehicleRepository.findDistinctTransmissions();
    }
    
    public Map<String, Object> getSearchFilters() {
        logger.info("Getting search filters");
        
        Map<String, Object> filters = new HashMap<>();
        filters.put("makes", getAllMakes());
        filters.put("provinces", getAllProvinces());
        filters.put("cities", getAllCities());
        filters.put("fuelTypes", getAllFuelTypes());
        filters.put("bodyTypes", getAllBodyTypes());
        filters.put("transmissions", getAllTransmissions());
        
        // Get price range
        Object[] priceRange = vehicleRepository.findPriceRange();
        if (priceRange != null && priceRange.length == 2) {
            Map<String, BigDecimal> priceRangeMap = new HashMap<>();
            priceRangeMap.put("min", (BigDecimal) priceRange[0]);
            priceRangeMap.put("max", (BigDecimal) priceRange[1]);
            filters.put("priceRange", priceRangeMap);
        }
        
        // Get year range
        Object[] yearRange = vehicleRepository.findYearRange();
        if (yearRange != null && yearRange.length == 2) {
            Map<String, Integer> yearRangeMap = new HashMap<>();
            yearRangeMap.put("min", (Integer) yearRange[0]);
            yearRangeMap.put("max", (Integer) yearRange[1]);
            filters.put("yearRange", yearRangeMap);
        }
        
        return filters;
    }
    
    public long getTotalVehicleCount() {
        return vehicleRepository.count();
    }
    
    public Vehicle saveVehicle(Vehicle vehicle) {
        logger.info("Saving vehicle: {}", vehicle.getId());
        return vehicleRepository.save(vehicle);
    }
    
    public void deleteVehicle(Long id) {
        logger.info("Deleting vehicle with id: {}", id);
        vehicleRepository.deleteById(id);
    }
    
    // Filtered methods based on make and model selection
    public List<String> getBodyTypesByMakeAndModel(String make, String model) {
        logger.info("Getting body types filtered by make: {} and model: {}", make, model);
        return vehicleRepository.findDistinctBodyTypesByMakeAndModel(make, model);
    }
    
    public List<String> getFuelTypesByMakeAndModel(String make, String model) {
        logger.info("Getting fuel types filtered by make: {} and model: {}", make, model);
        return vehicleRepository.findDistinctFuelTypesByMakeAndModel(make, model);
    }
    
    public List<String> getProvincesByMakeAndModel(String make, String model) {
        logger.info("Getting provinces filtered by make: {} and model: {}", make, model);
        return vehicleRepository.findDistinctProvincesByMakeAndModel(make, model);
    }
    
    public List<String> getTransmissionsByMakeAndModel(String make, String model) {
        logger.info("Getting transmissions filtered by make: {} and model: {}", make, model);
        return vehicleRepository.findDistinctTransmissionsByMakeAndModel(make, model);
    }
    
    public List<String> getCitiesByFilters(String make, String model, String city) {
        logger.info("Getting cities filtered by make: {}, model: {}, city: {}", make, model, city);
        return vehicleRepository.findDistinctCitiesByFilters(make, model, city);
    }
    
    public List<String> getCitiesByAllFilters(String make, String model, String bodyType, String fuelType, String province, String city) {
        logger.info("Getting cities filtered by make: {}, model: {}, bodyType: {}, fuelType: {}, province: {}, city: {}", 
                   make, model, bodyType, fuelType, province, city);
        return vehicleRepository.findDistinctCitiesByAllFilters(make, model, bodyType, fuelType, province, city);
    }
    
    public List<String> getBodyTypesByFilters(String make, String model, String city) {
        logger.info("Getting body types filtered by make: {}, model: {}, city: {}", make, model, city);
        return vehicleRepository.findDistinctBodyTypesByFilters(make, model, city);
    }
    
    public List<String> getFuelTypesByFilters(String make, String model, String city) {
        logger.info("Getting fuel types filtered by make: {}, model: {}, city: {}", make, model, city);
        return vehicleRepository.findDistinctFuelTypesByFilters(make, model, city);
    }
    
    public List<String> getProvincesByFilters(String make, String model, String city) {
        logger.info("Getting provinces filtered by make: {}, model: {}, city: {}", make, model, city);
        return vehicleRepository.findDistinctProvincesByFilters(make, model, city);
    }
    
    // New methods with all filter parameters
    public List<String> getModelsByAllFilters(String make, String model, String bodyType, String fuelType, String province, String city) {
        logger.info("Getting models filtered by all parameters");
        return vehicleRepository.findDistinctModelsByAllFilters(make, model, bodyType, fuelType, province, city);
    }
    
    public List<String> getBodyTypesByAllFilters(String make, String model, String bodyType, String fuelType, String province, String city) {
        logger.info("Getting body types filtered by all parameters");
        return vehicleRepository.findDistinctBodyTypesByAllFilters(make, model, bodyType, fuelType, province, city);
    }
    
    public List<String> getFuelTypesByAllFilters(String make, String model, String bodyType, String fuelType, String province, String city) {
        logger.info("Getting fuel types filtered by all parameters");
        return vehicleRepository.findDistinctFuelTypesByAllFilters(make, model, bodyType, fuelType, province, city);
    }
    
    public List<String> getProvincesByAllFilters(String make, String model, String bodyType, String fuelType, String province, String city) {
        logger.info("Getting provinces filtered by all parameters");
        return vehicleRepository.findDistinctProvincesByAllFilters(make, model, bodyType, fuelType, province, city);
    }
    
    // Helper method to create a vehicle search summary
    public Map<String, Object> getSearchSummary(Page<Vehicle> vehiclePage) {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalElements", vehiclePage.getTotalElements());
        summary.put("totalPages", vehiclePage.getTotalPages());
        summary.put("currentPage", vehiclePage.getNumber());
        summary.put("pageSize", vehiclePage.getSize());
        summary.put("hasNext", vehiclePage.hasNext());
        summary.put("hasPrevious", vehiclePage.hasPrevious());
        summary.put("isFirst", vehiclePage.isFirst());
        summary.put("isLast", vehiclePage.isLast());
        return summary;
    }
    
    // Get filtered ranges based on current selections
    public Map<String, Object> getFilteredRanges(String make, String model, String bodyType, String fuelType, String province) {
        logger.info("Getting filtered ranges for make: {}, model: {}, bodyType: {}, fuelType: {}, province: {}", 
                   make, model, bodyType, fuelType, province);
        
        Map<String, Object> ranges = new HashMap<>();
        
        // Get filtered price range
        Object[] priceRange = vehicleRepository.findPriceRangeByFilters(make, model, bodyType, fuelType, province);
        if (priceRange != null && priceRange.length == 2 && priceRange[0] != null && priceRange[1] != null) {
            Map<String, BigDecimal> priceRangeMap = new HashMap<>();
            priceRangeMap.put("min", (BigDecimal) priceRange[0]);
            priceRangeMap.put("max", (BigDecimal) priceRange[1]);
            ranges.put("priceRange", priceRangeMap);
        }
        
        // Get filtered year range
        Object[] yearRange = vehicleRepository.findYearRangeByFilters(make, model, bodyType, fuelType, province);
        if (yearRange != null && yearRange.length == 2 && yearRange[0] != null && yearRange[1] != null) {
            Map<String, Integer> yearRangeMap = new HashMap<>();
            yearRangeMap.put("min", (Integer) yearRange[0]);
            yearRangeMap.put("max", (Integer) yearRange[1]);
            ranges.put("yearRange", yearRangeMap);
        }
        
        // Get filtered mileage range
        Object[] mileageRange = vehicleRepository.findMileageRangeByFilters(make, model, bodyType, fuelType, province);
        if (mileageRange != null && mileageRange.length == 2 && mileageRange[0] != null && mileageRange[1] != null) {
            Map<String, Integer> mileageRangeMap = new HashMap<>();
            mileageRangeMap.put("min", (Integer) mileageRange[0]);
            mileageRangeMap.put("max", (Integer) mileageRange[1]);
            ranges.put("mileageRange", mileageRangeMap);
        }
        
        return ranges;
    }
    
    public Map<String, Object> getFilterCounts(
            String make, String model, Integer yearMin, Integer yearMax,
            BigDecimal priceMin, BigDecimal priceMax, Integer mileageMin, Integer mileageMax,
            List<String> bodyTypes, List<String> fuelTypes, String transmission, String condition,
            String province, String city, List<String> colours) {
        
        logger.info("Getting filter counts with filters");
        
        Map<String, Object> response = new HashMap<>();
        Map<String, Map<String, Long>> counts = new HashMap<>();
        
        // Get total count with current filters
        long totalCount = vehicleRepository.countVehiclesWithFilters(
            make, model, yearMin, yearMax, priceMin, priceMax, mileageMin, mileageMax,
            bodyTypes, fuelTypes, transmission, condition, province, city, colours
        );
        
        // Get counts for each filter category and convert to Map
        counts.put("makes", convertToCountMap(vehicleRepository.countByMakeWithFiltersRaw(
            model, yearMin, yearMax, priceMin, priceMax, mileageMin, mileageMax,
            bodyTypes, fuelTypes, transmission, condition, province, city, colours
        )));
        
        counts.put("models", convertToCountMap(vehicleRepository.countByModelWithFiltersRaw(
            make, yearMin, yearMax, priceMin, priceMax, mileageMin, mileageMax,
            bodyTypes, fuelTypes, transmission, condition, province, city, colours
        )));
        
        counts.put("bodyTypes", convertToCountMap(vehicleRepository.countByBodyTypeWithFiltersRaw(
            make, model, yearMin, yearMax, priceMin, priceMax, mileageMin, mileageMax,
            fuelTypes, transmission, condition, province, city, colours
        )));
        
        counts.put("fuelTypes", convertToCountMap(vehicleRepository.countByFuelTypeWithFiltersRaw(
            make, model, yearMin, yearMax, priceMin, priceMax, mileageMin, mileageMax,
            bodyTypes, transmission, condition, province, city, colours
        )));
        
        counts.put("transmissions", convertToCountMap(vehicleRepository.countByTransmissionWithFiltersRaw(
            make, model, yearMin, yearMax, priceMin, priceMax, mileageMin, mileageMax,
            bodyTypes, fuelTypes, condition, province, city, colours
        )));
        
        counts.put("conditions", convertToCountMap(vehicleRepository.countByConditionWithFiltersRaw(
            make, model, yearMin, yearMax, priceMin, priceMax, mileageMin, mileageMax,
            bodyTypes, fuelTypes, transmission, province, city, colours
        )));
        
        counts.put("provinces", convertToCountMap(vehicleRepository.countByProvinceWithFiltersRaw(
            make, model, yearMin, yearMax, priceMin, priceMax, mileageMin, mileageMax,
            bodyTypes, fuelTypes, transmission, condition, city, colours
        )));
        
        counts.put("cities", convertToCountMap(vehicleRepository.countByCityWithFiltersRaw(
            make, model, yearMin, yearMax, priceMin, priceMax, mileageMin, mileageMax,
            bodyTypes, fuelTypes, transmission, condition, province, colours
        )));
        
        counts.put("colours", convertToCountMap(vehicleRepository.countByColourWithFiltersRaw(
            make, model, yearMin, yearMax, priceMin, priceMax, mileageMin, mileageMax,
            bodyTypes, fuelTypes, transmission, condition, province, city
        )));
        
        response.put("total", totalCount);
        response.put("counts", counts);
        
        return response;
    }
    
    // Helper method to convert List<Object[]> to Map<String, Long>
    private Map<String, Long> convertToCountMap(List<Object[]> rawResults) {
        Map<String, Long> countMap = new HashMap<>();
        for (Object[] row : rawResults) {
            if (row.length == 2 && row[0] != null && row[1] != null) {
                String key = row[0].toString();
                Long count = ((Number) row[1]).longValue();
                countMap.put(key, count);
            }
        }
        return countMap;
    }
}