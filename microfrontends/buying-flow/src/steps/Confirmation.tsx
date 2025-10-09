import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Button as MuiButton,
} from '@mui/material';
import { Button } from '@t-rex/shared-ui';
import { CheckCircle, Email, Phone, Home } from '@mui/icons-material';

interface ConfirmationProps {
  initialData: any;
  onSubmit: (data: any) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const Confirmation: React.FC<ConfirmationProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading,
}) => {
  const { selectedVehicle, personalInfo } = initialData;

  const handleSubmit = () => {
    onSubmit({
      ...initialData,
      status: 'completed',
      submittedAt: new Date().toISOString(),
    });
  };

  return (
    <Card>
      <CardContent>
        <Box textAlign="center" mb={4}>
          <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Application Complete!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Thank you for your application. Here's a summary of your submission.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Selected Vehicle
              </Typography>
              {selectedVehicle && (
                <>
                  <Typography variant="h5" gutterBottom>
                    {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    ${selectedVehicle.price?.toLocaleString()}
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                    <Chip 
                      label={`${selectedVehicle.mileage?.toLocaleString()} miles`} 
                      size="small" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={selectedVehicle.color} 
                      size="small" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={selectedVehicle.fuelType} 
                      size="small" 
                      variant="outlined" 
                    />
                  </Box>
                  <img
                    src={selectedVehicle.images?.[0]}
                    alt={`${selectedVehicle.make} ${selectedVehicle.model}`}
                    style={{ width: '100%', borderRadius: 8 }}
                  />
                </>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Contact Information
              </Typography>
              {personalInfo && (
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary={`${personalInfo.firstName} ${personalInfo.lastName}`}
                      secondary="Full Name"
                    />
                  </ListItem>
                  <ListItem>
                    <Email sx={{ mr: 2, color: 'text.secondary' }} />
                    <ListItemText 
                      primary={personalInfo.email}
                      secondary="Email Address"
                    />
                  </ListItem>
                  <ListItem>
                    <Phone sx={{ mr: 2, color: 'text.secondary' }} />
                    <ListItemText 
                      primary={personalInfo.phone}
                      secondary="Phone Number"
                    />
                  </ListItem>
                  <ListItem>
                    <Home sx={{ mr: 2, color: 'text.secondary' }} />
                    <ListItemText 
                      primary={`${personalInfo.address}, ${personalInfo.city}, ${personalInfo.state} ${personalInfo.zipCode}`}
                      secondary="Address"
                    />
                  </ListItem>
                </List>
              )}
            </Paper>

            <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Financial Information
              </Typography>
              {personalInfo && (
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary={personalInfo.creditScore}
                      secondary="Credit Score Range"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary={personalInfo.employmentStatus}
                      secondary="Employment Status"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary={personalInfo.annualIncome}
                      secondary="Annual Income"
                    />
                  </ListItem>
                </List>
              )}
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box textAlign="center" mb={3}>
          <Typography variant="h6" gutterBottom>
            What's Next?
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Our team will review your application and contact you within 24 hours with financing options and next steps.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Application ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mt={4}>
          {onBack && (
            <MuiButton variant="outlined" onClick={onBack}>
              Back
            </MuiButton>
          )}
          <Box flex={1} />
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            loading={isLoading}
          >
            Start New Application
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Confirmation;
