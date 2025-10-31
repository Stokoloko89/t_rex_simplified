import React, { useEffect, useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
  Alert,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLocations } from '../hooks/useLocations';

/**
 * LocationFieldsSection Component
 * Renders Province and City dropdowns with dependent selection logic
 * City dropdown is disabled until province is selected
 */

interface LocationFieldsSectionProps {
  selectedProvince: number | null;
  selectedCity: string | null;
  onProvinceChange: (provinceId: number) => void;
  onCityChange: (cityName: string) => void;
  provinceError?: string | null;
  cityError?: string | null;
  disabled?: boolean;
}

export const LocationFieldsSection: React.FC<LocationFieldsSectionProps> = ({
  selectedProvince,
  selectedCity,
  onProvinceChange,
  onCityChange,
  provinceError,
  cityError,
  disabled = false,
}) => {
  const theme = useTheme();
  const {
    provinces,
    cities,
    isLoadingProvinces,
    isLoadingCities,
    errorProvinces,
    errorCities,
  } = useLocations();

  // Reset city when province changes
  useEffect(() => {
    if (selectedProvince) {
      onCityChange('');
    }
  }, [selectedProvince, onCityChange]);

  const isCityDisabled = !selectedProvince || isLoadingCities || disabled;

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
      {/* Province Dropdown */}
      <FormControl
        fullWidth
        disabled={disabled || isLoadingProvinces}
        error={Boolean(provinceError || errorProvinces)}
      >
        <InputLabel id="province-select-label" sx={{ fontSize: '0.875rem' }}>
          Province *
        </InputLabel>
        <Select
          labelId="province-select-label"
          id="province-select"
          value={selectedProvince || ''}
          onChange={(e) => onProvinceChange(Number(e.target.value))}
          label="Province *"
          sx={{
            backgroundColor: disabled ? '#f5f5f5' : '#ffffff',
            borderRadius: 1,
            fontSize: '1rem',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: provinceError || errorProvinces ? theme.palette.error.main : theme.palette.divider,
            },
          }}
        >
          <MenuItem value="">
            <em>Select a province</em>
          </MenuItem>
          {provinces.map((province) => (
            <MenuItem key={province.id} value={province.id}>
              {province.name}
            </MenuItem>
          ))}
        </Select>

        {/* Error Messages */}
        {(provinceError || errorProvinces) && (
          <Box
            sx={{
              marginTop: 1,
              padding: '8px 12px',
              backgroundColor: '#ffebee',
              borderRadius: 1,
              border: `1px solid ${theme.palette.error.light}`,
              display: 'flex',
              gap: 1,
              alignItems: 'flex-start',
            }}
          >
            <Typography sx={{ color: theme.palette.error.main, fontSize: '1rem' }}>
              ⚠️
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.error.main,
                fontSize: '0.8125rem',
                lineHeight: 1.4,
                fontWeight: 500,
              }}
            >
              {provinceError || errorProvinces}
            </Typography>
          </Box>
        )}
      </FormControl>

      {/* City Dropdown */}
      <FormControl
        fullWidth
        disabled={isCityDisabled}
        error={Boolean(cityError || errorCities)}
      >
        <InputLabel id="city-select-label" sx={{ fontSize: '0.875rem' }}>
          City {selectedProvince ? '*' : ''}
        </InputLabel>
        <Select
          labelId="city-select-label"
          id="city-select"
          value={selectedCity || ''}
          onChange={(e) => onCityChange(String(e.target.value))}
          label={`City ${selectedProvince ? '*' : ''}`}
          sx={{
            backgroundColor: isCityDisabled ? '#f5f5f5' : '#ffffff',
            borderRadius: 1,
            fontSize: '1rem',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: cityError || errorCities ? theme.palette.error.main : theme.palette.divider,
            },
          }}
        >
          <MenuItem value="">
            <em>
              {!selectedProvince
                ? 'Select a province first'
                : isLoadingCities
                ? 'Loading cities...'
                : 'Select a city'}
            </em>
          </MenuItem>
          {cities.map((city) => (
            <MenuItem key={city.id} value={city.name}>
              {city.name}
            </MenuItem>
          ))}
        </Select>

        {/* Loading State */}
        {selectedProvince && isLoadingCities && (
          <Box
            sx={{
              marginTop: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <CircularProgress size={16} />
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Loading cities...
            </Typography>
          </Box>
        )}

        {/* Error Messages */}
        {(cityError || errorCities) && (
          <Box
            sx={{
              marginTop: 1,
              padding: '8px 12px',
              backgroundColor: '#ffebee',
              borderRadius: 1,
              border: `1px solid ${theme.palette.error.light}`,
              display: 'flex',
              gap: 1,
              alignItems: 'flex-start',
            }}
          >
            <Typography sx={{ color: theme.palette.error.main, fontSize: '1rem' }}>
              ⚠️
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.error.main,
                fontSize: '0.8125rem',
                lineHeight: 1.4,
                fontWeight: 500,
              }}
            >
              {cityError || errorCities}
            </Typography>
          </Box>
        )}
      </FormControl>

      {/* Helper Text */}
      {!selectedProvince && (
        <Alert severity="info" sx={{ gridColumn: '1 / -1', marginTop: 1, fontSize: '0.875rem' }}>
          Select a province to populate available cities
        </Alert>
      )}
    </Box>
  );
};

export default LocationFieldsSection;
