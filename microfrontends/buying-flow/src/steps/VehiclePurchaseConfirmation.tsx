import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  TextField,
  Grid,
  Divider,
  Alert,
  CardMedia,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Chip,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import {
  CheckCircle,
  Person,
  Email,
  Phone,
  DirectionsCar,
  LocalGasStation,
  Speed,
  AccountBalance,
  Security,
  TrendingUp,
  Assignment,
  LocationOn,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface PersonData {
  name?: string;
  email?: string;
  phone?: string;
  preferredContact?: "email" | "phone" | "whatsapp";
  location?: string;
  city?: string;
}

interface VehicleData {
  MKT?: string;
  Id?: number;
  usedVehicleStockID?: number;
  year?: number;
  makeName?: string;
  modelName?: string;
  variantName?: string;
  vin?: string;
  registration?: string;
  mmCode?: string | null;
  engineNo?: string;
  milage?: number;
  colour?: string;
  provinceName?: string;
  trim?: string | null;
  condition?: string | null;
  stockCode?: string;
  department?: string;
  loadDate?: string;
  lastTouchDate?: string;
  lastChangedDate?: string;
  soldDate?: string;
  isProgram?: number;
  currencySymbol?: string;
  price?: number;
  firstPrice?: number;
  franchise?: string;
  extras?: string | null;
  comments?: string;
  // Legacy fields for backward compatibility
  make?: string;
  model?: string;
  marketValue?: number;
  currency?: string;
  mileage?: string;
  bodyType?: string;
  color?: string;
  transmission?: string;
  fuelType?: string;
  engineSize?: string;
}

interface SearchFilters {
  make?: string;
  model?: string;
  bodyType?: string;
  fuelType?: string;
  province?: string;
  city?: string;
}

interface VehiclePurchaseConfirmationProps {
  initialData?: {
    personData?: PersonData;
    vehicleData?: VehicleData;
    valuationData?: VehicleData;
    searchFilters?: SearchFilters;
  };
  onSubmit: (data: any) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const schema = yup.object({
  name: yup
    .string()
    .required("Full name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .matches(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email format"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(
      /^[\+]?[0-9\s\-\(\)]{10,15}$/,
      "Please enter a valid phone number (10-15 digits)"
    )
    .test(
      "phone-format",
      "Phone number must contain at least 10 digits",
      (value) => {
        if (!value) return false;
        const digitsOnly = value.replace(/\D/g, "");
        return digitsOnly.length >= 10 && digitsOnly.length <= 15;
      }
    ),
  preferredContact: yup
    .string()
    .required("Preferred contact method is required")
    .oneOf(
      ["email", "phone", "whatsapp"],
      "Please select a valid contact method"
    ),
  location: yup
    .string()
    .required("Location is required")
    .oneOf(
      [
        "Eastern Cape",
        "Free State",
        "Gauteng",
        "KwaZulu-Natal",
        "Limpopo",
        "Mpumalanga",
        "Northern Cape",
        "North West",
        "Western Cape",
      ],
      "Please select a valid South African province"
    ),
  city: yup
    .string()
    .required("City is required")
    .min(2, "City name must be at least 2 characters"),
  comments: yup
    .string()
    .max(1000, "Comments must be less than 1000 characters"),
  assistanceTypes: yup
    .array()
    .of(
      yup.string().oneOf(["financing", "compliance"], "Invalid assistance type")
    )
    .min(1, "Please select at least one assistance type")
    .required("Assistance selection is required"),
});

const VehiclePurchaseConfirmation: React.FC<
  VehiclePurchaseConfirmationProps
> = ({ initialData, onSubmit, onBack, isLoading = false }) => {
  // Extract person data and search filters from initialData
  const personData = initialData?.personData || {};
  const searchFilters = initialData?.searchFilters || {};

  // Mock user data for prepopulation (in real app, this would come from user session/profile)
  const mockUserData = {
    name: "Sarah Johnson",
    email: "sarah.johnson@gmail.com",
    phone: "+27 83 456 7890",
    location: "Western Cape",
    city: "Cape Town",
    preferredContact: "whatsapp" as const,
  };

  // State for cities dropdown
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: personData.name || mockUserData.name,
      email: personData.email || mockUserData.email,
      phone: personData.phone || mockUserData.phone,
      location: personData.location || mockUserData.location,
      city: personData.city || mockUserData.city,
      preferredContact:
        personData.preferredContact || mockUserData.preferredContact,
      comments: "",
      assistanceTypes: ["financing"], // Default to financing assistance
    },
  });

  const selectedProvince = watch("location");

  // Load cities dynamically based on province AND search filters
  useEffect(() => {
    const loadCities = async () => {
      setLoadingCities(true);
      try {
        // Build query parameters based on available filters
        const params = new URLSearchParams();

        // Add search filters from vehicle search
        if (searchFilters.make) params.append("make", searchFilters.make);
        if (searchFilters.model) params.append("model", searchFilters.model);
        if (searchFilters.bodyType)
          params.append("bodyType", searchFilters.bodyType);
        if (searchFilters.fuelType)
          params.append("fuelType", searchFilters.fuelType);

        // Add selected province from form
        if (selectedProvince) params.append("province", selectedProvince);

        // Use filtered cities endpoint if we have any filters
        const hasFilters =
          searchFilters.make ||
          searchFilters.model ||
          searchFilters.bodyType ||
          searchFilters.fuelType ||
          selectedProvince;

        if (hasFilters) {
          const response = await fetch(
            `http://localhost:8080/api/vehicles/filtered/cities?${params}`
          );
          const citiesData = await response.json();
          setCities(citiesData || []);
        } else {
          // No filters, load all cities
          const response = await fetch(
            "http://localhost:8080/api/vehicles/cities"
          );
          const citiesData = await response.json();
          setCities(citiesData || []);
        }
      } catch (error) {
        console.error("Error loading cities:", error);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };

    loadCities();
  }, [
    selectedProvince,
    searchFilters.make,
    searchFilters.model,
    searchFilters.bodyType,
    searchFilters.fuelType,
  ]);

  // Get vehicle data from initialData with proper structure
  const vehicleData: VehicleData = initialData?.vehicleData ||
    initialData?.valuationData || {
      // New data structure fields
      MKT: "MCV",
      Id: 2324711,
      usedVehicleStockID: 8570067,
      year: 2023,
      makeName: "Toyota",
      modelName: "Quantum Bus",
      variantName: "2.8 SLWB bus 14-seater GL",
      vin: "JTFEB9CP106040993",
      registration: "LC03YCGP",
      mmCode: null,
      engineNo: "1GD9078319",
      milage: 118640,
      colour: "White 058",
      provinceName: "Gauteng",
      trim: null,
      condition: null,
      stockCode: "0173USP040993",
      department: "Used",
      loadDate: "2025-07-11 08:42:00.850000000",
      lastTouchDate: "2025-07-15 18:08:14.300000000",
      lastChangedDate: "2025-07-12 08:43:58.733000000",
      soldDate: "1900-01-01 00:00:00",
      isProgram: -1,
      currencySymbol: "R",
      price: 679900.0,
      firstPrice: 679900.0,
      franchise: "Toyota,Toyota Commercial",
      extras: null,
      comments: "TOYOTA QUANTUM 2.8 GL SLWB 14 SEAT",
      // Legacy fields for backward compatibility
      make: "Toyota",
      model: "Quantum Bus",
      marketValue: 679900,
      currency: "R",
      mileage: "118,640 km",
      bodyType: "Bus",
      color: "White",
      transmission: "Manual",
      fuelType: "Diesel",
      engineSize: "2.8L",
    };

  // Helper function to get display values with fallbacks
  const getVehicleDisplayData = () => {
    return {
      make: vehicleData.makeName || vehicleData.make || "Unknown Make",
      model: vehicleData.modelName || vehicleData.model || "Unknown Model",
      year: vehicleData.year || new Date().getFullYear(),
      variant: vehicleData.variantName || "",
      price: vehicleData.price || vehicleData.marketValue || 0,
      currency: vehicleData.currencySymbol || vehicleData.currency || "R",
      mileage: vehicleData.milage
        ? `${vehicleData.milage.toLocaleString()} km`
        : vehicleData.mileage || "Unknown",
      color: vehicleData.colour || vehicleData.color || "Unknown",
      condition: vehicleData.condition || "Good",
      department: vehicleData.department || "Used",
      stockCode: vehicleData.stockCode || "",
      vin: vehicleData.vin || "",
      registration: vehicleData.registration || "",
      province: vehicleData.provinceName || "",
      franchise: vehicleData.franchise || "",
      engineNo: vehicleData.engineNo || "",
      bodyType: vehicleData.bodyType || "Unknown",
      transmission: vehicleData.transmission || "Unknown",
      fuelType: vehicleData.fuelType || "Unknown",
      engineSize: vehicleData.engineSize || "",
      trim: vehicleData.trim || "",
      extras: vehicleData.extras || "",
      comments: vehicleData.comments || "",
      firstPrice: vehicleData.firstPrice || vehicleData.price || 0,
      loadDate: vehicleData.loadDate
        ? new Date(vehicleData.loadDate).toLocaleDateString()
        : "",
      lastTouchDate: vehicleData.lastTouchDate
        ? new Date(vehicleData.lastTouchDate).toLocaleDateString()
        : "",
    };
  };

  const displayData = getVehicleDisplayData();

  const selectedAssistanceTypes = watch("assistanceTypes") || [];

  const onFormSubmit = (formData: any) => {
    // Validate the form data before submission
    try {
      schema.validateSync(formData, { abortEarly: false });

      // Navigate directly to BuyingComplete without showing interim screen
      onSubmit({
        contactInfo: {
          ...formData,
          submittedAt: new Date().toISOString(),
          validatedData: true,
        },
        vehicleData: vehicleData,
        assistanceRequested: formData.assistanceTypes,
        confirmed: true,
        action: "purchase-confirmed",
        nextStep: "BuyingComplete",
      });
    } catch (validationError) {
      console.error("Form validation failed:", validationError);
      // The form validation should prevent this, but handle edge cases
    }
  };

  // Main Form
  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8f9fa 0%, #e8ecf1 100%)", py: 4, px: 2 }}>
      <Box sx={{ maxWidth: 1400, mx: "auto" }}>
        {/* Header Section */}
        <Box sx={{ mb: 5, textAlign: "center" }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 800,
              color: "#1e3a8a",
              mb: 1.5,
              letterSpacing: "-0.03em",
              fontSize: { xs: "1.8rem", md: "2.2rem" },
            }}
          >
            Complete Contact Request
          </Typography>
          <Box
            sx={{
              width: "60px",
              height: "4px",
              background: "linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%)",
              mx: "auto",
              mb: 2,
              borderRadius: "2px",
            }}
          />
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: "1rem", fontWeight: 500, maxWidth: "600px", mx: "auto" }}
          >
            Review your vehicle selection and provide your contact information
          </Typography>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1.4fr" }, gap: 3 }}>
          {/* Vehicle Summary Card - Left Side */}
          <Box>
            <Card
              sx={{
                height: "100%",
                border: "none",
                boxShadow: "0 2px 20px rgba(30, 58, 138, 0.08)",
                borderRadius: "12px",
                overflow: "hidden",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  boxShadow: "0 8px 28px rgba(30, 58, 138, 0.12)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              {/* Vehicle Image */}
              <Box
                component="img"
                src="https://news-site-za.s3.af-south-1.amazonaws.com/images/2021/02/2012-Chevrolet-Sonic-Sedan.jpg"
                alt={`${vehicleData.make} ${vehicleData.model}`}
                sx={{
                  width: "100%",
                  height: "240px",
                  objectFit: "cover",
                  backgroundColor: "#f0f0f0",
                }}
              />
              
              {/* Vehicle Details */}
              <CardContent sx={{ p: 3.5 }}>
                {/* Selected Vehicle Badge */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2.5 }}>
                  <Box
                    sx={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1.5,
                    }}
                  >
                    <DirectionsCar sx={{ color: "white", fontSize: "20px" }} />
                  </Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, color: "#1e3a8a", textTransform: "uppercase", letterSpacing: "0.5px" }}
                  >
                    Your Selection
                  </Typography>
                </Box>

                {/* Vehicle Title & Price */}
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    mb: 0.5,
                    color: "#1a1a1a",
                    lineHeight: 1.2,
                    fontSize: "1.4rem",
                  }}
                >
                  {displayData.year} {displayData.make}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "#666",
                    mb: 2,
                    fontSize: "0.95rem",
                  }}
                >
                  {displayData.model}
                </Typography>

                {displayData.variant && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2.5, fontSize: "0.85rem", lineHeight: 1.4 }}
                  >
                    {displayData.variant}
                  </Typography>
                )}

                {/* Price Badge */}
                <Box
                  sx={{
                    background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
                    borderRadius: "8px",
                    p: 1.5,
                    mb: 3,
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem", mb: 0.25 }}
                  >
                    Asking Price
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: "1.5rem",
                      color: "white",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {displayData.currency}
                    {displayData.price?.toLocaleString()}
                  </Typography>
                </Box>

                {/* Vehicle Details Grid */}
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 3 }}>
                  {/* Department */}
                  <Box sx={{ background: "#f8f9fa", p: 1.5, borderRadius: "8px" }}>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", color: "text.secondary", mb: 0.5, fontWeight: 600 }}
                    >
                      DEPT
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, color: "#1a1a1a" }}
                    >
                      {displayData.department}
                    </Typography>
                  </Box>

                  {/* Mileage */}
                  <Box sx={{ background: "#f8f9fa", p: 1.5, borderRadius: "8px" }}>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", color: "text.secondary", mb: 0.5, fontWeight: 600 }}
                    >
                      MILEAGE
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, color: "#1a1a1a" }}
                    >
                      {displayData.mileage}
                    </Typography>
                  </Box>

                  {/* Color */}
                  <Box sx={{ background: "#f8f9fa", p: 1.5, borderRadius: "8px" }}>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", color: "text.secondary", mb: 0.5, fontWeight: 600 }}
                    >
                      COLOR
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, color: "#1a1a1a" }}
                    >
                      {displayData.color}
                    </Typography>
                  </Box>

                  {/* Body Type */}
                  <Box sx={{ background: "#f8f9fa", p: 1.5, borderRadius: "8px" }}>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", color: "text.secondary", mb: 0.5, fontWeight: 600 }}
                    >
                      BODY TYPE
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, color: "#1a1a1a" }}
                    >
                      {displayData.bodyType}
                    </Typography>
                  </Box>

                  {/* Transmission */}
                  <Box sx={{ background: "#f8f9fa", p: 1.5, borderRadius: "8px" }}>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", color: "text.secondary", mb: 0.5, fontWeight: 600 }}
                    >
                      TRANSMISSION
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, color: "#1a1a1a" }}
                    >
                      {displayData.transmission}
                    </Typography>
                  </Box>

                  {/* Fuel Type */}
                  <Box sx={{ background: "#f8f9fa", p: 1.5, borderRadius: "8px" }}>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", color: "text.secondary", mb: 0.5, fontWeight: 600 }}
                    >
                      FUEL TYPE
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, color: "#1a1a1a" }}
                    >
                      {displayData.fuelType}
                    </Typography>
                  </Box>
                </Box>

                {/* Additional Details - Collapsible Section */}
                {(displayData.engineSize ||
                  displayData.stockCode ||
                  displayData.registration ||
                  displayData.vin ||
                  displayData.engineNo ||
                  displayData.province) && (
                  <Box sx={{ pt: 2, borderTop: "1px solid #e8e8e8" }}>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        fontWeight: 700,
                        color: "#1e3a8a",
                        mb: 1.5,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Additional Info
                    </Typography>
                    <Stack spacing={1}>
                      {displayData.engineSize && (
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="body2" color="text.secondary">
                            Engine:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: "#1a1a1a" }}
                          >
                            {displayData.engineSize}
                          </Typography>
                        </Box>
                      )}
                      {displayData.stockCode && (
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="body2" color="text.secondary">
                            Stock:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: "#1a1a1a" }}
                          >
                            {displayData.stockCode}
                          </Typography>
                        </Box>
                      )}
                      {displayData.registration && (
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="body2" color="text.secondary">
                            Reg:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: "#1a1a1a" }}
                          >
                            {displayData.registration}
                          </Typography>
                        </Box>
                      )}
                      {displayData.province && (
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="body2" color="text.secondary">
                            Location:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: "#1a1a1a" }}
                          >
                            {displayData.province}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>

          {/* Contact Form - Right Side */}
          <Box>
            <form onSubmit={handleSubmit(onFormSubmit)}>
              <Stack spacing={3}>
                {/* Contact Information Card */}
                <Card
                  sx={{
                    border: "none",
                    boxShadow: "0 2px 20px rgba(30, 58, 138, 0.08)",
                    borderRadius: "12px",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <CardContent sx={{ p: 3.5 }}>
                    {/* Card Header */}
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Box
                        sx={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 1.5,
                        }}
                      >
                        <Person sx={{ color: "white", fontSize: "20px" }} />
                      </Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700,
                          color: "#1a1a1a",
                          fontSize: "1.05rem",
                        }}
                      >
                        Your Contact Information
                      </Typography>
                    </Box>

                    {/* Name & Phone Row */}
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mb: 2.5 }}>
                      <Box>
                        <Controller
                          name="name"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Full Name"
                              placeholder="John Doe"
                              fullWidth
                              size="small"
                              error={!!errors.name}
                              helperText={
                                errors.name?.message ||
                                "As per your ID document"
                              }
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "8px",
                                  backgroundColor: "#f8f9fa",
                                  transition: "all 0.2s",
                                  "&:hover": {
                                    backgroundColor: "#f0f0f0",
                                  },
                                  "&.Mui-focused": {
                                    backgroundColor: "white",
                                  },
                                },
                              }}
                            />
                          )}
                        />
                      </Box><Box>
                        <Controller
                          name="phone"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Phone Number"
                              placeholder="+27 83 456 7890"
                              fullWidth
                              size="small"
                              error={!!errors.phone}
                              helperText={
                                errors.phone?.message || "Include country code"
                              }
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "8px",
                                  backgroundColor: "#f8f9fa",
                                  transition: "all 0.2s",
                                  "&:hover": {
                                    backgroundColor: "#f0f0f0",
                                  },
                                  "&.Mui-focused": {
                                    backgroundColor: "white",
                                  },
                                },
                              }}
                            />
                          )}
                        />
                      </Box></Box>

                    {/* Email */}
                    <Box sx={{ mb: 2.5 }}>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Email Address"
                            type="email"
                            placeholder="your.email@example.com"
                            fullWidth
                            size="small"
                            error={!!errors.email}
                            helperText={
                              errors.email?.message ||
                              "We'll send documents here"
                            }
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                backgroundColor: "#f8f9fa",
                                transition: "all 0.2s",
                                "&:hover": {
                                  backgroundColor: "#f0f0f0",
                                },
                                "&.Mui-focused": {
                                  backgroundColor: "white",
                                },
                              },
                            }}
                          />
                        )}
                      />
                    </Box>

                    {/* Province & City Row */}
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mb: 2.5 }}>
                      <Box>
                        <Controller
                          name="location"
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth size="small" error={!!errors.location}>
                              <InputLabel id="location-label" sx={{ fontSize: "0.9rem" }}>
                                Province
                              </InputLabel>
                              <Select
                                {...field}
                                labelId="location-label"
                                label="Province"
                                sx={{
                                  borderRadius: "8px",
                                  backgroundColor: "#f8f9fa",
                                  transition: "all 0.2s",
                                  "&:hover": {
                                    backgroundColor: "#f0f0f0",
                                  },
                                  "&.Mui-focused": {
                                    backgroundColor: "white",
                                  },
                                }}
                              >
                                <MenuItem value="Eastern Cape">
                                  Eastern Cape
                                </MenuItem>
                                <MenuItem value="Free State">Free State</MenuItem>
                                <MenuItem value="Gauteng">Gauteng</MenuItem>
                                <MenuItem value="KwaZulu-Natal">
                                  KwaZulu-Natal
                                </MenuItem>
                                <MenuItem value="Limpopo">Limpopo</MenuItem>
                                <MenuItem value="Mpumalanga">Mpumalanga</MenuItem>
                                <MenuItem value="Northern Cape">
                                  Northern Cape
                                </MenuItem>
                                <MenuItem value="North West">
                                  North West
                                </MenuItem>
                                <MenuItem value="Western Cape">
                                  Western Cape
                                </MenuItem>
                              </Select>
                              {errors.location && (
                                <Typography
                                  variant="caption"
                                  color="error"
                                  sx={{ mt: 0.5, ml: 1.5 }}
                                >
                                  {errors.location.message}
                                </Typography>
                              )}
                            </FormControl>
                          )}
                        />
                      </Box><Box>
                        <Controller
                          name="city"
                          control={control}
                          render={({ field }) => (
                            <FormControl
                              fullWidth
                              size="small"
                              error={!!errors.city}
                            >
                              <InputLabel id="city-label" sx={{ fontSize: "0.9rem" }}>
                                City
                              </InputLabel>
                              <Select
                                {...field}
                                labelId="city-label"
                                label="City"
                                disabled={!selectedProvince || loadingCities}
                                sx={{
                                  borderRadius: "8px",
                                  backgroundColor: "#f8f9fa",
                                  transition: "all 0.2s",
                                  "&:hover": {
                                    backgroundColor: "#f0f0f0",
                                  },
                                  "&.Mui-focused": {
                                    backgroundColor: "white",
                                  },
                                }}
                              >
                                <MenuItem value="">
                                  <em>
                                    {loadingCities
                                      ? "Loading cities..."
                                      : "Select a city"}
                                  </em>
                                </MenuItem>
                                {(cities || []).map((city) => (
                                  <MenuItem key={city} value={city}>
                                    {city}
                                  </MenuItem>
                                ))}
                              </Select>
                              {errors.city && (
                                <Typography
                                  variant="caption"
                                  color="error"
                                  sx={{ mt: 0.5, ml: 1.5 }}
                                >
                                  {errors.city.message}
                                </Typography>
                              )}
                            </FormControl>
                          )}
                        />
                      </Box></Box>

                    {/* Preferred Contact */}
                    <Box>
                      <Controller
                        name="preferredContact"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            label="Preferred Contact Method"
                            fullWidth
                            size="small"
                            error={!!errors.preferredContact}
                            helperText={
                              errors.preferredContact?.message || "How should we reach you?"
                            }
                            SelectProps={{ native: true }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                backgroundColor: "#f8f9fa",
                                transition: "all 0.2s",
                                "&:hover": {
                                  backgroundColor: "#f0f0f0",
                                },
                                "&.Mui-focused": {
                                  backgroundColor: "white",
                                },
                              },
                            }}
                          >
                            <option value="email">📧 Email</option>
                            <option value="phone">📞 Phone Call</option>
                            <option value="whatsapp">💬 WhatsApp</option>
                          </TextField>
                        )}
                      />
                    </Box>
                  </CardContent>
                </Card>

                {/* Additional Comments Card */}
                <Card
                  sx={{
                    border: "none",
                    boxShadow: "0 2px 20px rgba(30, 58, 138, 0.08)",
                    borderRadius: "12px",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <CardContent sx={{ p: 3.5 }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                      <Box
                        sx={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 1.5,
                          flexShrink: 0,
                          mt: 0.25,
                        }}
                      >
                        <Typography sx={{ color: "white", fontWeight: 700 }}>
                          ?
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 700,
                            color: "#1a1a1a",
                            fontSize: "1.05rem",
                          }}
                        >
                          Additional Comments
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mt: 0.5 }}
                        >
                          Optional - Any specific requirements or questions
                        </Typography>
                      </Box>
                    </Box>

                    <Controller
                      name="comments"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          multiline
                          rows={3}
                          fullWidth
                          placeholder="Share any specific requirements, timeline concerns, or questions about this vehicle..."
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "8px",
                              backgroundColor: "#f8f9fa",
                              transition: "all 0.2s",
                              "&:hover": {
                                backgroundColor: "#f0f0f0",
                              },
                              "&.Mui-focused": {
                                backgroundColor: "white",
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Disclaimer Card */}
                <Card
                  sx={{
                    border: "none",
                    background: "linear-gradient(135deg, #f0f4ff 0%, #e8ecf1 100%)",
                    boxShadow: "0 1px 12px rgba(30, 58, 138, 0.06)",
                    borderRadius: "12px",
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: "flex", gap: 1.5 }}>
                      <Box
                        sx={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          background: "#1e3a8a",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          mt: 0.25,
                        }}
                      >
                        <Typography sx={{ color: "white", fontSize: "0.9rem", fontWeight: 700 }}>
                          i
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "#1a1a1a", lineHeight: 1.6, fontSize: "0.9rem" }}
                      >
                        By submitting this request, you agree to be contacted
                        regarding your vehicle purchase. Your information will
                        be handled per our privacy policy.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    pt: 2,
                  }}
                >
                  {onBack && (
                    <Button
                      variant="outlined"
                      onClick={onBack}
                      disabled={isLoading}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        px: 3.5,
                        py: 1.25,
                        borderRadius: "8px",
                        borderColor: "#d0d0d0",
                        color: "#666",
                        fontSize: "0.95rem",
                        transition: "all 0.2s",
                        "&:hover": {
                          borderColor: "#1e3a8a",
                          backgroundColor: "transparent",
                          color: "#1e3a8a",
                        },
                        "&:disabled": {
                          borderColor: "#e0e0e0",
                          color: "#999",
                        },
                      }}
                    >
                      Back
                    </Button>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading || !isValid}
                    sx={{
                      ml: "auto",
                      textTransform: "none",
                      fontWeight: 700,
                      px: 5,
                      py: 1.5,
                      fontSize: "1rem",
                      borderRadius: "8px",
                      background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
                      color: "#ffffff",
                      boxShadow: "0 4px 14px rgba(30, 58, 138, 0.25)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)",
                        boxShadow: "0 6px 20px rgba(30, 58, 138, 0.35)",
                        transform: "translateY(-1px)",
                      },
                      "&:active": {
                        transform: "translateY(0px)",
                      },
                      "&:disabled": {
                        background: "#f0f0f0",
                        color: "#999",
                        boxShadow: "none",
                        transform: "none",
                      },
                    }}
                  >
                    {isLoading ? "Submitting..." : "Submit"}
                  </Button>
                </Box>
              </Stack>
            </form>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default VehiclePurchaseConfirmation;