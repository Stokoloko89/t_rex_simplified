import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Stack, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { Business, DirectionsCar, Assessment } from '@mui/icons-material';

interface DealerNetworkProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const DealerNetwork: React.FC<DealerNetworkProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    mileage: '',
    condition: '',
    additionalInfo: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit({ 
      vehicle_info: formData,
      dealer_network: true
    });
  };

  const isFormValid = formData.make && formData.model && formData.year && formData.mileage && formData.condition;
  const message = initialData?.message || "We'll help you find buyers through our dealer network";

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Business sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Dealer Network
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={4}>
            <Box>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <DirectionsCar sx={{ mr: 1 }} />
                Vehicle Information
              </Typography>
              
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Make"
                    placeholder="e.g., Toyota"
                    value={formData.make}
                    onChange={(e) => handleInputChange('make', e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label="Model"
                    placeholder="e.g., Camry"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label="Year"
                    placeholder="e.g., 2020"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    sx={{ flex: 1 }}
                  />
                </Box>

                <TextField
                  fullWidth
                  label="Current Mileage"
                  placeholder="e.g., 45,000"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange('mileage', e.target.value)}
                />
              </Stack>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <Assessment sx={{ mr: 1 }} />
                Vehicle Condition
              </Typography>
              
              <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
                <FormLabel component="legend" sx={{ mb: 2 }}>
                  Overall condition of your vehicle:
                </FormLabel>
                <RadioGroup
                  value={formData.condition}
                  onChange={(e) => handleInputChange('condition', e.target.value)}
                >
                  <FormControlLabel 
                    value="excellent" 
                    control={<Radio />} 
                    label="Excellent - Like new, no visible wear" 
                  />
                  <FormControlLabel 
                    value="good" 
                    control={<Radio />} 
                    label="Good - Minor wear, well maintained" 
                  />
                  <FormControlLabel 
                    value="fair" 
                    control={<Radio />} 
                    label="Fair - Some wear and tear, needs minor repairs" 
                  />
                  <FormControlLabel 
                    value="poor" 
                    control={<Radio />} 
                    label="Poor - Significant wear, needs major repairs" 
                  />
                </RadioGroup>
              </FormControl>

              <TextField
                fullWidth
                label="Additional Information"
                multiline
                rows={4}
                placeholder="Describe any accidents, modifications, service history, or other relevant details..."
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        {onBack && (
          <Button 
            variant="outlined" 
            onClick={onBack}
            disabled={isLoading}
          >
            Back
          </Button>
        )}
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={isLoading || !isFormValid}
          sx={{ ml: 'auto' }}
        >
          Connect with Dealers
        </Button>
      </Box>
    </Box>
  );
};

export default DealerNetwork;
