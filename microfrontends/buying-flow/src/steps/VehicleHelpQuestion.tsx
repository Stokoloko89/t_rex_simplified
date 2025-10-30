// React is available globally from the host app
declare const React: typeof import('react');
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Container
} from '@mui/material';
import { Search, HelpOutline, CheckCircle } from '@mui/icons-material';
import VehicleSearch from './VehicleSearch';

interface VehicleHelpQuestionProps {
  initialData: {
    message: string;
    subMessage: string;
    showButton: boolean;
    buttonText: string;
  };
  onSubmit: (data: { action: string }) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const VehicleHelpQuestion: React.FC<VehicleHelpQuestionProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading
}) => {
  const handleStartSearch = () => {
    onSubmit({ action: 'start_vehicle_search' });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card
        elevation={2}
        sx={{
          background: '#ffffff',
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          {/* Confirmation Message */}
          <Box sx={{ mb: 3, p: 3, backgroundColor: '#e8f5e8', borderRadius: 2, border: '1px solid #4caf50' }}>
            <Typography
              variant="body1"
              sx={{
                color: '#2e7d32',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}
            >
              <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />
              Your vehicle valuation report has been sent to your email and will arrive shortly.
            </Typography>
          </Box>

          {/* Main Question */}
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 600,
              color: '#1a1a1a',
              mb: 2,
              letterSpacing: '-0.02em'
            }}
          >
            While you await the report, can we help you find a vehicle?
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#424242',
              mb: 3,
              fontWeight: 400,
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            We'll help you find vehicles that match your preferences and budget. Our advanced search tools will guide you to the perfect match.
          </Typography>

          <VehicleSearch 
            initialData={initialData} 
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
          

          {/* Action Button */}
          {/* {initialData.showButton && (
            <Box sx={{ mt: 3 }}>  
              <Button
                variant="contained"
                size="medium"
                onClick={handleStartSearch}
                disabled={isLoading}
                startIcon={<Search />}
                sx={{
                  px: 4,
                  py: 1,
                  fontSize: '1rem',
                  fontWeight: 500,
                  borderRadius: 2,
                  textTransform: 'none',
                  backgroundColor: '#1e3a8a',
                  color: '#ffffff',
                  boxShadow: '0 2px 8px rgba(30, 58, 138, 0.2)',
                  '&:hover': {
                    backgroundColor: '#1e40af',
                    boxShadow: '0 3px 10px rgba(30, 58, 138, 0.3)',
                  }
                }}
              >
                {initialData.buttonText}
              </Button>
            </Box>
          )} */}
        </CardContent>
      </Card>
    </Container>
  );
};

export default VehicleHelpQuestion;
