import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Alert, Box, Fade, CircularProgress, Typography } from '@mui/material';
import { LoadingSpinner } from '@t-rex/shared-ui';
import { useWorkflow } from '../App';

// Step component imports
import IntentSelection from '../steps/IntentSelection';
import VehicleSearch from '../steps/VehicleSearch';
import VehicleDetails from '../steps/VehicleDetails';
import PersonalInfo from '../steps/PersonalInfo';
import Confirmation from '../steps/Confirmation';
import VehicleValuationReport from '../steps/VehicleValuationReport';

// New Core Application Flow components
import VehicleKnowledge from '../steps/VehicleKnowledge';
import CarInAnalytics from '../steps/CarInAnalytics';
import SearchResults from '../steps/SearchResults';
import CarInResults from '../steps/CarInResults';
import BuyingConfirmation from '../steps/BuyingConfirmation';
import BuyingComplete from '../steps/BuyingComplete';

// Selling flow components
import HasBuyer from '../steps/HasBuyer';
import BuyerType from '../steps/BuyerType';
import PrivateBuyer from '../steps/PrivateBuyer';
import DealerNetwork from '../steps/DealerNetwork';
import ReplacementCheck from '../steps/ReplacementCheck';
import SellingComplete from '../steps/SellingComplete';
import NoAssistanceNeeded from '../steps/NoAssistanceNeeded';
import FinancingAssistanceComplete from '../steps/FinancingAssistanceComplete';
import DealerNetworkComplete from '../steps/DealerNetworkComplete';

// New Purchase Confirmation component
import VehiclePurchaseConfirmation from '../steps/VehiclePurchaseConfirmation';

// Vehicle Selling Form component
import VehicleSellingForm from '../steps/VehicleSellingForm';

// Buyer Financing Details component
import BuyerFinancingDetails from '../steps/BuyerFinancingDetails';

// New simplified flow components
import FormCompletionConfirmation from '../steps/FormCompletionConfirmation';
import VehicleHelpQuestion from '../steps/VehicleHelpQuestion';

// Component mapping for dynamic loading
const stepComponents: Record<string, React.ComponentType<any>> = {
  // Original components
  IntentSelection,
  VehicleSearch,
  VehicleDetails,
  PersonalInfo,
  Confirmation,
  VehicleValuationReport,
  
  // Enhanced buying flow
  VehicleKnowledge,
  CarInAnalytics,
  SearchResults,
  CarInResults,
  BuyingConfirmation,
  BuyingComplete,
  
  // Selling flow
  HasBuyer,
  BuyerType,
  PrivateBuyer,
  DealerNetwork,
  ReplacementCheck,
  SellingComplete,
  NoAssistanceNeeded,
  FinancingAssistanceComplete,
  DealerNetworkComplete,
  
  // New Purchase Confirmation component
  VehiclePurchaseConfirmation,
  
  // Vehicle Selling Form component
  VehicleSellingForm,
  
  // Buyer Financing Details component
  BuyerFinancingDetails,

  // New simplified flow components
  FormCompletionConfirmation,
  VehicleHelpQuestion,
};

const StepRenderer: React.FC = () => {
  const { currentStepConfig, navigate, goBack, isLoading, isTransitioning, error } = useWorkflow();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number | 'auto'>('auto');
  const [isHeightTransitioning, setIsHeightTransitioning] = useState(false);

  // Capture current height before transition starts
  useEffect(() => {
    if (isTransitioning && contentRef.current) {
      const currentHeight = contentRef.current.scrollHeight;
      setContainerHeight(currentHeight);
      setIsHeightTransitioning(true);
    }
  }, [isTransitioning]);

  // Smooth height adjustment after new content loads
  useEffect(() => {
    if (!isTransitioning && isHeightTransitioning && contentRef.current) {
      const newHeight = contentRef.current.scrollHeight;
      
      // Animate to new height
      setContainerHeight(newHeight);
      
      // Reset to auto after animation completes
      const timer = setTimeout(() => {
        setContainerHeight('auto');
        setIsHeightTransitioning(false);
      }, 900); // Even longer for smoother transitions
      
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, isHeightTransitioning, currentStepConfig?.stepId]);

  if (isLoading || !currentStepConfig) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '60vh',
        width: '100%',
        textAlign: 'center',
        py: 8,
        animation: 'initialLoad 1.5s ease-out',
        '@keyframes initialLoad': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0px)' },
        }
      }}>
        <CircularProgress 
          size={64} 
          thickness={3}
          sx={{ 
            mb: 3, 
            color: '#007AFF',
            animation: 'initialSpin 2s ease-in-out infinite',
            '@keyframes initialSpin': {
              '0%': { transform: 'rotate(0deg) scale(1)' },
              '50%': { transform: 'rotate(180deg) scale(1.1)' },
              '100%': { transform: 'rotate(360deg) scale(1)' },
            }
          }} 
        />
        <Typography 
          variant="h6" 
          color="text.primary"
          sx={{
            fontWeight: 500,
            mb: 1,
            animation: 'titleFade 1.8s ease-in-out',
            '@keyframes titleFade': {
              '0%': { opacity: 0 },
              '70%': { opacity: 0 },
              '100%': { opacity: 0.9 },
            }
          }}
        >
          Loading Workflow
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            animation: 'subtitleFade 2.1s ease-in-out',
            '@keyframes subtitleFade': {
              '0%': { opacity: 0 },
              '80%': { opacity: 0 },
              '100%': { opacity: 0.6 },
            }
          }}
        >
          Please wait while we prepare your experience...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box mb={2}>
        <Alert severity="warning">{error}</Alert>
      </Box>
    );
  }

  const StepComponent = stepComponents[currentStepConfig.componentName];

  if (!StepComponent) {
    return (
      <Alert severity="error">
        Unknown step component: {currentStepConfig.componentName}
      </Alert>
    );
  }

  // Show transition loading overlay
  if (isTransitioning) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '60vh',
        width: '100%',
        textAlign: 'center',
        py: 8,
        animation: 'fadeInOut 1.3s ease-in-out',
        '@keyframes fadeInOut': {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '50%': { opacity: 1, transform: 'translateY(0px)' },
          '100%': { opacity: 1, transform: 'translateY(0px)' },
        }
      }}>
        <CircularProgress 
          size={56} 
          thickness={3.5}
          sx={{ 
            mb: 3, 
            color: '#007AFF',
            animation: 'pulse 2s ease-in-out infinite',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)', opacity: 1 },
              '50%': { transform: 'scale(1.05)', opacity: 0.8 },
              '100%': { transform: 'scale(1)', opacity: 1 },
            }
          }} 
        />
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{
            fontWeight: 500,
            animation: 'textFade 1.5s ease-in-out',
            '@keyframes textFade': {
              '0%': { opacity: 0 },
              '60%': { opacity: 0 },
              '100%': { opacity: 0.7 },
            }
          }}
        >
          Preparing your next step...
        </Typography>
      </Box>
    );
  }

  // Stepper functionality removed for cleaner modal experience

  return (
    <Box>
      {/* Progress stepper removed for cleaner modal experience */}
      
      <Box 
        ref={containerRef}
        sx={{
          height: containerHeight,
          transition: 'height 0.8s cubic-bezier(0.23, 1, 0.320, 1)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Box 
          ref={contentRef}
          sx={{
            position: containerHeight !== 'auto' ? 'absolute' : 'relative',
            width: '100%',
            top: 0,
            left: 0
          }}
        >
          <Fade in={!isTransitioning} timeout={800}>
            <Box>
              <Suspense fallback={<LoadingSpinner message="Loading component..." />}>
                <StepComponent
                  initialData={currentStepConfig.data}
                  onSubmit={navigate}
                  onBack={goBack}
                  isLoading={isLoading}
                />
              </Suspense>
            </Box>
          </Fade>
        </Box>
      </Box>
    </Box>
  );
};

export default StepRenderer;
