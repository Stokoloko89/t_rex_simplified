package com.trex.workflowservice.controller;

import com.trex.workflowservice.model.Vehicle;
import com.trex.workflowservice.service.VehicleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "*")
public class VehicleController {
    
    private static final Logger logger = LoggerFactory.getLogger(VehicleController.class);
    
    @Autowired
    private VehicleService vehicleService;
    
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchVehicles(
            @RequestParam(required = false) String make,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) Integer minYear,
            @RequestParam(required = false) Integer maxYear,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String province,
            @RequestParam(required = false) Integer maxMileage,
            @RequestParam(required = false) String fuelType,
            @RequestParam(required = false) String bodyType,
            @RequestParam(required = false) String transmission,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "price") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        logger.info("Vehicle search request received with filters");
        
        try {
            Page<Vehicle> vehiclePage = vehicleService.searchVehicles(
                make, model, minYear, maxYear, minPrice, maxPrice, 
                province, maxMileage, fuelType, bodyType, transmission,
                page, size, sortBy, sortDir
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("vehicles", vehiclePage.getContent());
            response.put("pagination", vehicleService.getSearchSummary(vehiclePage));
            
            logger.info("Found {} vehicles matching search criteria", vehiclePage.getTotalElements());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error searching vehicles", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error searching vehicles: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    @GetMapping("/search/text")
    public ResponseEntity<Map<String, Object>> searchVehiclesByText(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "price") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        logger.info("Text search request for: {}", q);
        
        try {
            Page<Vehicle> vehiclePage = vehicleService.searchVehiclesByText(q, page, size, sortBy, sortDir);
            
            Map<String, Object> response = new HashMap<>();
            response.put("vehicles", vehiclePage.getContent());
            response.put("pagination", vehicleService.getSearchSummary(vehiclePage));
            
            logger.info("Found {} vehicles matching text search: {}", vehiclePage.getTotalElements(), q);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error in text search", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error searching vehicles: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllVehicles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "price") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        logger.info("Get all vehicles request - page: {}, size: {}", page, size);
        
        try {
            Page<Vehicle> vehiclePage = vehicleService.getAllAvailableVehicles(page, size, sortBy, sortDir);
            
            Map<String, Object> response = new HashMap<>();
            response.put("vehicles", vehiclePage.getContent());
            response.put("pagination", vehicleService.getSearchSummary(vehiclePage));
            
            logger.info("Retrieved {} total vehicles", vehiclePage.getTotalElements());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error retrieving vehicles", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error retrieving vehicles: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long id) {
        logger.info("Get vehicle by id: {}", id);
        
        try {
            Optional<Vehicle> vehicle = vehicleService.getVehicleById(id);
            
            if (vehicle.isPresent()) {
                logger.info("Vehicle found with id: {}", id);
                return ResponseEntity.ok(vehicle.get());
            } else {
                logger.warn("Vehicle not found with id: {}", id);
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            logger.error("Error retrieving vehicle by id: {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/filters")
    public ResponseEntity<Map<String, Object>> getSearchFilters() {
        logger.info("Get search filters request");
        
        try {
            Map<String, Object> filters = vehicleService.getSearchFilters();
            logger.info("Retrieved search filters successfully");
            return ResponseEntity.ok(filters);
            
        } catch (Exception e) {
            logger.error("Error retrieving search filters", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error retrieving filters: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    @GetMapping("/makes")
    public ResponseEntity<List<String>> getAllMakes() {
        logger.info("Get all makes request");
        
        try {
            List<String> makes = vehicleService.getAllMakes();
            logger.info("Retrieved {} makes", makes.size());
            return ResponseEntity.ok(makes);
            
        } catch (Exception e) {
            logger.error("Error retrieving makes", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/makes/{make}/models")
    public ResponseEntity<List<String>> getModelsByMake(@PathVariable String make) {
        logger.info("Get models for make: {}", make);
        
        try {
            List<String> models = vehicleService.getModelsByMake(make);
            logger.info("Retrieved {} models for make: {}", models.size(), make);
            return ResponseEntity.ok(models);
            
        } catch (Exception e) {
            logger.error("Error retrieving models for make: {}", make, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/provinces")
    public ResponseEntity<List<String>> getAllProvinces() {
        logger.info("Get all provinces request");
        
        try {
            List<String> provinces = vehicleService.getAllProvinces();
            logger.info("Retrieved {} provinces", provinces.size());
            return ResponseEntity.ok(provinces);
            
        } catch (Exception e) {
            logger.error("Error retrieving provinces", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/fuel-types")
    public ResponseEntity<List<String>> getAllFuelTypes() {
        logger.info("Get all fuel types request");
        
        try {
            List<String> fuelTypes = vehicleService.getAllFuelTypes();
            logger.info("Retrieved {} fuel types", fuelTypes.size());
            return ResponseEntity.ok(fuelTypes);
            
        } catch (Exception e) {
            logger.error("Error retrieving fuel types", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/body-types")
    public ResponseEntity<List<String>> getAllBodyTypes() {
        logger.info("Get all body types request");
        
        try {
            List<String> bodyTypes = vehicleService.getAllBodyTypes();
            logger.info("Retrieved {} body types", bodyTypes.size());
            return ResponseEntity.ok(bodyTypes);
            
        } catch (Exception e) {
            logger.error("Error retrieving body types", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/transmissions")
    public ResponseEntity<List<String>> getAllTransmissions() {
        logger.info("Get all transmissions request");
        
        try {
            List<String> transmissions = vehicleService.getAllTransmissions();
            logger.info("Retrieved {} transmission types", transmissions.size());
            return ResponseEntity.ok(transmissions);
            
        } catch (Exception e) {
            logger.error("Error retrieving transmissions", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/count")
    public ResponseEntity<Map<String, Object>> getVehicleCount() {
        logger.info("Get vehicle count request");
        
        try {
            long count = vehicleService.getTotalVehicleCount();
            Map<String, Object> response = new HashMap<>();
            response.put("totalVehicles", count);
            
            logger.info("Total vehicle count: {}", count);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error retrieving vehicle count", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error retrieving vehicle count: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    // Filtered endpoints based on make and model selection
    @GetMapping("/filtered/body-types")
    public ResponseEntity<List<String>> getBodyTypesByMakeAndModel(
            @RequestParam(required = false) String make,
            @RequestParam(required = false) String model) {
        logger.info("FILTERED API: Get body types filtered by make: {} and model: {}", make, model);
        
        try {
            List<String> bodyTypes = vehicleService.getBodyTypesByMakeAndModel(make, model);
            logger.info("Retrieved {} body types for make: {} and model: {}", bodyTypes.size(), make, model);
            return ResponseEntity.ok(bodyTypes);
            
        } catch (Exception e) {
            logger.error("Error retrieving body types for make: {} and model: {}", make, model, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/filtered/fuel-types")
    public ResponseEntity<List<String>> getFuelTypesByMakeAndModel(
            @RequestParam(required = false) String make,
            @RequestParam(required = false) String model) {
        logger.info("Get fuel types filtered by make: {} and model: {}", make, model);
        
        try {
            List<String> fuelTypes = vehicleService.getFuelTypesByMakeAndModel(make, model);
            logger.info("Retrieved {} fuel types for make: {} and model: {}", fuelTypes.size(), make, model);
            return ResponseEntity.ok(fuelTypes);
            
        } catch (Exception e) {
            logger.error("Error retrieving fuel types for make: {} and model: {}", make, model, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/filtered/provinces")
    public ResponseEntity<List<String>> getProvincesByMakeAndModel(
            @RequestParam(required = false) String make,
            @RequestParam(required = false) String model) {
        logger.info("Get provinces filtered by make: {} and model: {}", make, model);
        
        try {
            List<String> provinces = vehicleService.getProvincesByMakeAndModel(make, model);
            logger.info("Retrieved {} provinces for make: {} and model: {}", provinces.size(), make, model);
            return ResponseEntity.ok(provinces);
            
        } catch (Exception e) {
            logger.error("Error retrieving provinces for make: {} and model: {}", make, model, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/filtered/transmissions")
    public ResponseEntity<List<String>> getTransmissionsByMakeAndModel(
            @RequestParam(required = false) String make,
            @RequestParam(required = false) String model) {
        logger.info("Get transmissions filtered by make: {} and model: {}", make, model);
        
        try {
            List<String> transmissions = vehicleService.getTransmissionsByMakeAndModel(make, model);
            logger.info("Retrieved {} transmissions for make: {} and model: {}", transmissions.size(), make, model);
            return ResponseEntity.ok(transmissions);
            
        } catch (Exception e) {
            logger.error("Error retrieving transmissions for make: {} and model: {}", make, model, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.OPTIONS})
    @GetMapping("/filtered/ranges")
    public ResponseEntity<Map<String, Object>> getFilteredRanges(
            @RequestParam(required = false) String make,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) String bodyType,
            @RequestParam(required = false) String fuelType,
            @RequestParam(required = false) String province) {
        logger.info("Get filtered ranges for make: {}, model: {}, bodyType: {}, fuelType: {}, province: {}", 
                   make, model, bodyType, fuelType, province);
        
        try {
            Map<String, Object> ranges = vehicleService.getFilteredRanges(make, model, bodyType, fuelType, province);
            logger.info("Retrieved filtered ranges successfully");
            return ResponseEntity.ok(ranges);
            
        } catch (Exception e) {
            logger.error("Error retrieving filtered ranges", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error retrieving filtered ranges: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @RequestMapping(value = "/filtered/ranges", method = RequestMethod.OPTIONS)
    public ResponseEntity<Void> optionsFilteredRanges() {
        return ResponseEntity.ok().build();
    }
}