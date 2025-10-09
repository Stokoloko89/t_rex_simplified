import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Stack, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField } from '@mui/material';
import { Psychology, TrendingUp } from '@mui/icons-material';

interface CarInAnalyticsProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const CarInAnalytics: React.FC<CarInAnalyticsProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    usage: '',
    passengers: '',
    budget: '',
    features: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit({ carin_responses: formData });
  };

  const isFormValid = Object.values(formData).every(value => value.trim() !== '');
  const message = initialData?.message || "Let's help you find the perfect vehicle";

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Psychology sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          CarIn Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={4}>
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
                How will you primarily use this vehicle?
              </FormLabel>
              <RadioGroup
                value={formData.usage}
                onChange={(e) => handleInputChange('usage', e.target.value)}
              >
                <FormControlLabel value="daily_commute" control={<Radio />} label="Daily commuting to work" />
                <FormControlLabel value="family_trips" control={<Radio />} label="Family trips and errands" />
                <FormControlLabel value="weekend_adventures" control={<Radio />} label="Weekend adventures and recreation" />
                <FormControlLabel value="business_travel" control={<Radio />} label="Business travel" />
              </RadioGroup>
            </FormControl>

            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
                How many passengers do you typically carry?
              </FormLabel>
              <RadioGroup
                value={formData.passengers}
                onChange={(e) => handleInputChange('passengers', e.target.value)}
              >
                <FormControlLabel value="1-2" control={<Radio />} label="1-2 people (just me or with partner)" />
                <FormControlLabel value="3-4" control={<Radio />} label="3-4 people (small family)" />
                <FormControlLabel value="5-7" control={<Radio />} label="5-7 people (large family)" />
                <FormControlLabel value="8+" control={<Radio />} label="8+ people (extended family/groups)" />
              </RadioGroup>
            </FormControl>

            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
                What's your budget range?
              </FormLabel>
              <RadioGroup
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
              >
                <FormControlLabel value="under_20k" control={<Radio />} label="Under $20,000" />
                <FormControlLabel value="20k_35k" control={<Radio />} label="$20,000 - $35,000" />
                <FormControlLabel value="35k_50k" control={<Radio />} label="$35,000 - $50,000" />
                <FormControlLabel value="50k_75k" control={<Radio />} label="$50,000 - $75,000" />
                <FormControlLabel value="over_75k" control={<Radio />} label="Over $75,000" />
              </RadioGroup>
            </FormControl>

            <Box>
              <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600, display: 'block' }}>
                What features are most important to you?
              </FormLabel>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="e.g., fuel efficiency, safety features, technology, cargo space, performance..."
                value={formData.features}
                onChange={(e) => handleInputChange('features', e.target.value)}
                variant="outlined"
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
          startIcon={<TrendingUp />}
          sx={{ ml: 'auto' }}
        >
          Get Recommendations
        </Button>
      </Box>
    </Box>
  );
};

export default CarInAnalytics;
