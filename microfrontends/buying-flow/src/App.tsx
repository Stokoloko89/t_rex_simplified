import React, { useEffect, useState, createContext, useContext } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box } from '@mui/material';
import { theme, ErrorBoundary, LoadingSpinner } from '@t-rex/shared-ui';
import axios from 'axios';
import StepRenderer from './components/StepRenderer';

// Define types for workflow context and step configuration
interface WorkflowStep {
  stepId: string;
  componentName: string;
  data: any;
  validation?: any;
  nextSteps?: string[];
  previousStep?: string;
  stepNumber?: number;
  totalSteps?: number;
}

interface WorkflowContextType {
  currentStepConfig: WorkflowStep | null;
  navigate: (formData: any) => Promise<void>;
  goBack: () => Promise<void>;
  isLoading: boolean;
  isTransitioning: boolean;
  sessionId: string;
  error: string | null;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};

const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:8080/api';

// This provider will manage communication with the backend workflow engine
const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStepConfig, setCurrentStepConfig] = useState<WorkflowStep | null>(null);
  const [nextStepConfig, setNextStepConfig] = useState<WorkflowStep | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState<string>(() => 
    `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  );

  useEffect(() => {
    // Detect if this is being loaded as a modal (check URL params or parent context)
    const urlParams = new URLSearchParams(window.location.search);
    const isModal = urlParams.get('modal') === 'true' || window.parent !== window;
    const requestedStep = urlParams.get('step');
    
    // Check for global flag set by host app or other modal contexts
    const globalFlag = (window as any).LOAD_VEHICLE_VALUATION_REPORT;
    const isInHostApp = window.location.port === '3002' || window.location.href.includes('3002');
    const isSystemJSContext = window.System && window.location.port === '3001';
    const shouldLoadValuationReport = isModal || requestedStep === 'VehicleValuationReport' || isInHostApp || isSystemJSContext || globalFlag;

    // Initial load of the workflow
    const loadInitialStep = async () => {
      setIsLoading(true);
      setError(null);
      
      if (shouldLoadValuationReport) {
        console.log('Loading VehicleValuationReport - detected modal context:', { isModal, requestedStep, isInHostApp, isSystemJSContext, globalFlag });
        
        // Always load VehicleValuationReport directly when in modal context
        const config = {
          stepId: 'vehicle-valuation-report',
          componentName: 'VehicleValuationReport',
          data: { 
            message: 'Vehicle Valuation Report',
            title: 'Vehicle Valuation Report',
            modalTitle: 'Vehicle Valuation Report',
            hideEmoji: true,
            noIcon: true,
            vehicleData: {
              make: 'Toyota',
              model: 'Corolla',
              year: 2020,
              mileage: 45000,
              condition: 'Good'
            }
          },
          hideProgress: true,
          hideIcon: true,
          noEmoji: true,
          stepNumber: 1,
          totalSteps: 1
        };
        console.log('Setting VehicleValuationReport config:', config);
        setCurrentStepConfig(config);
      } else {
        try {
          const response = await axios.post(`${API_BASE_URL}/workflow/start`, { 
            sessionId,
            workflowType: 'buying'
          });
          setCurrentStepConfig(response.data);
        } catch (error: any) {
          console.error('Error starting workflow:', error);
          setError('Failed to start workflow. Using mock data for development.');
          // Mock data for development when backend is not available
          setCurrentStepConfig({
            stepId: 'intent-selection',
            componentName: 'IntentSelection',
            data: { message: 'What would you like to do today?' },
            stepNumber: 1,
            totalSteps: 5
          });
        }
      }
      
      setIsLoading(false);
    };
    loadInitialStep();
  }, [sessionId]);

  const smoothTransition = async (newStepConfig: WorkflowStep) => {
    // Start transition with fade out
    setIsTransitioning(true);
    
    // Wait for fade out animation (increased for smoother feel)
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Update the step content
    setCurrentStepConfig(newStepConfig);
    
    // Wait longer for content to render and settle
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Fade back in
    setIsTransitioning(false);
  };

  const navigate = async (formData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      // For development, use mock navigation directly to avoid backend dependency
      console.log('Navigating with data:', formData);
      await mockNavigate(formData);
    } catch (error: any) {
      console.error('Error navigating workflow:', error);
      setError('Navigation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/workflow/back`, {
        sessionId,
        currentStep: currentStepConfig?.stepId,
      });
      await smoothTransition(response.data);
    } catch (error: any) {
      console.error('Error going back in workflow:', error);
      setError('Go back failed. Using mock navigation.');
      // Mock back navigation for development
      mockGoBack();
    } finally {
      setIsLoading(false);
    }
  };

  // Mock functions for development
  const mockNavigate = async (formData: any) => {
    console.log('Mock navigate called with:', formData);
    const currentStep = currentStepConfig?.stepId;
    let nextStep: WorkflowStep | null = null;

    switch (currentStep) {
      case 'vehicle-valuation-report':
        // Handle navigation from VehicleValuationReport based on nextStep
        const { nextStep: componentName, action, intent, vehicleInterest, vehicleToSell, valuationData } = formData;
        console.log('Valuation report navigation:', { componentName, action, intent });
        
        if (componentName === 'VehiclePurchaseConfirmation' && intent === 'buying') {
          nextStep = {
            stepId: 'vehicle-purchase-confirmation',
            componentName: 'VehiclePurchaseConfirmation',
            data: { 
              ...formData,
              intent: 'buying',
              message: `Complete your purchase request for the ${vehicleInterest}`,
              vehicleInterest,
              valuationData
            },
            stepNumber: 2,
            totalSteps: 3
          };
          console.log('Created VehiclePurchaseConfirmation step:', nextStep);
        } else if (componentName === 'VehicleKnowledge' && intent === 'buying') {
          nextStep = {
            stepId: 'vehicle-knowledge',
            componentName: 'VehicleKnowledge',
            data: { 
              ...formData,
              intent: 'buying',
              message: `Great! You're interested in purchasing a ${vehicleInterest}.`,
              subMessage: 'Do you know exactly which vehicle you want to buy?',
              vehicleInterest,
              valuationData
            },
            stepNumber: 2,
            totalSteps: 6
          };
        } else if (componentName === 'HasBuyer' && intent === 'selling') {
          nextStep = {
            stepId: 'has-buyer',
            componentName: 'HasBuyer',
            data: { 
              ...formData,
              intent: 'selling',
              message: `Let's help you sell your ${vehicleToSell}.`,
              subMessage: 'Do you already have a buyer for your vehicle?',
              vehicleToSell,
              valuationData,
              estimatedValue: `R${valuationData?.marketValue?.toLocaleString() || '285,000'}`
            },
            stepNumber: 2,
            totalSteps: 4
          };
        } else if (componentName === 'DealerNetwork' && intent === 'dealer-network') {
          nextStep = {
            stepId: 'dealer-network',
            componentName: 'DealerNetwork',
            data: { 
              ...formData,
              intent: 'dealer-network',
              message: `Finding dealers with similar ${vehicleInterest} vehicles`,
              vehicleInterest,
              valuationData
            },
            stepNumber: 2,
            totalSteps: 3
          };
        }
        break;
      case 'intent-selection':
        if (formData.intent === 'buying') {
          nextStep = {
            stepId: 'vehicle-knowledge',
            componentName: 'VehicleKnowledge',
            data: { intent: formData.intent, message: 'Do you already know which vehicle you want to buy?' },
            stepNumber: 2,
            totalSteps: 6
          };
        } else if (formData.intent === 'selling') {
          nextStep = {
            stepId: 'has-buyer',
            componentName: 'HasBuyer',
            data: { intent: formData.intent, message: 'Do you already have a buyer for your vehicle?' },
            stepNumber: 2,
            totalSteps: 5
          };
        }
        break;
      case 'vehicle-knowledge':
        if (formData.vehicle_knowledge === 'knows_vehicle') {
          nextStep = {
            stepId: 'vehicle-search',
            componentName: 'VehicleSearch',
            data: { ...formData, message: 'Search for your desired vehicle' },
            stepNumber: 3,
            totalSteps: 6
          };
        } else {
          nextStep = {
            stepId: 'carin-analytics',
            componentName: 'CarInAnalytics',
            data: { ...formData, message: 'Let us help you find the perfect vehicle' },
            stepNumber: 3,
            totalSteps: 7
          };
        }
        break;
      case 'vehicle-search':
        nextStep = {
          stepId: 'search-results',
          componentName: 'SearchResults',
          data: { ...formData, message: 'Here are vehicles matching your criteria' },
          stepNumber: 4,
          totalSteps: 6
        };
        break;
      case 'search-results':
        nextStep = {
          stepId: 'buying-confirmation',
          componentName: 'BuyingConfirmation',
          data: { ...formData, message: 'Confirm your vehicle selection and provide contact details' },
          stepNumber: 5,
          totalSteps: 6
        };
        break;
      case 'has-buyer':
        // Handle HasBuyer transitions
        console.log('HasBuyer form data:', formData);
        if (formData.has_buyer === 'has_buyer') {
          nextStep = {
            stepId: 'buyer-type',
            componentName: 'BuyerType',
            data: { 
              ...formData, 
              message: 'What type of buyer do you have?',
              previousChoice: 'has_buyer'
            },
            stepNumber: 2,
            totalSteps: 4
          };
        } else if (formData.has_buyer === 'no_buyer') {
          nextStep = {
            stepId: 'dealer-network',
            componentName: 'DealerNetwork',  
            data: { 
              ...formData, 
              message: 'Find dealers interested in your vehicle',
              previousChoice: 'no_buyer',
              valuationData: currentStepConfig?.data?.valuationData,
              prePopulateFromValuation: true // Flag to indicate we should pre-populate
            },
            stepNumber: 2,
            totalSteps: 3
          };
        }
        break;
      case 'buyer-type':
        // Handle BuyerType transitions
        console.log('BuyerType form data:', formData);
        if (formData.buyer_type === 'private') {
          nextStep = {
            stepId: 'private-buyer',
            componentName: 'PrivateBuyer',
            data: { 
              ...formData, 
              message: 'Provide details about your private buyer',
              buyerType: 'private'
            },
            stepNumber: 3,
            totalSteps: 4
          };
        } else if (formData.buyer_type === 'dealer') {
          nextStep = {
            stepId: 'dealer-network',
            componentName: 'DealerNetwork',
            data: { 
              ...formData, 
              message: 'Connect with our dealer network',
              buyerType: 'dealer'
            },
            stepNumber: 3,
            totalSteps: 4
          };
        }
        break;
      case 'private-buyer':
        // Handle PrivateBuyer completion
        console.log('PrivateBuyer form data:', formData);
        const financingChoice = formData.private_buyer_details?.financing;
        
        if (financingChoice === 'yes') {
          // Buyer needs financing - collect buyer details
          nextStep = {
            stepId: 'buyer-financing-details',
            componentName: 'BuyerFinancingDetails',
            data: { 
              ...formData, 
              message: 'Buyer financing details required',
              saleType: 'private',
              privateBuyerDetails: formData.private_buyer_details
            },
            stepNumber: 4,
            totalSteps: 5
          };
        } else {
          // No financing needed - go directly to completion
          nextStep = {
            stepId: 'selling-complete',
            componentName: 'SellingComplete',
            data: { 
              ...formData, 
              message: 'Your private sale details have been recorded',
              saleType: 'private',
              privateBuyerDetails: formData.private_buyer_details
            },
            stepNumber: 4,
            totalSteps: 4
          };
        }
        break;
      case 'dealer-network':
        // Handle DealerNetwork completion - check the action/intent to determine next step
        console.log('DealerNetwork form data:', formData);
        
        // If this is a vehicle search action, go to SearchResults
        if (formData.action === 'vehicle-search' || formData.intent === 'search-vehicles') {
          nextStep = {
            stepId: 'search-results',
            componentName: 'SearchResults',
            data: { 
              ...formData, 
              message: 'Here are vehicles matching your criteria'
            },
            stepNumber: 4,
            totalSteps: 6
          };
        } else {
          // Default dealer network completion
          nextStep = {
            stepId: 'dealer-network-complete',
            componentName: 'DealerNetworkComplete',
            data: { 
              ...formData, 
              message: 'We will connect you with our dealer network',
              saleType: 'dealer'
            },
            stepNumber: 4,
            totalSteps: 4
          };
        }
        break;
      case 'vehicle-selling-form':
        // Handle VehicleSellingForm completion
        console.log('VehicleSellingForm form data:', formData);
        nextStep = {
          stepId: 'selling-complete',
          componentName: 'SellingComplete',
          data: { 
            ...formData, 
            message: 'Your vehicle has been submitted to our dealer network',
            saleType: 'dealer-assistance'
          },
          stepNumber: 3,
          totalSteps: 3
        };
        break;
      case 'buyer-financing-details':
        // Handle BuyerFinancingDetails completion
        console.log('BuyerFinancingDetails form data:', formData);
        nextStep = {
          stepId: 'selling-complete',
          componentName: 'SellingComplete',
          data: { 
            ...formData, 
            message: 'Your private sale and buyer financing details have been recorded',
            saleType: 'private-with-financing',
            privateBuyerDetails: formData.private_buyer_details,
            buyerFinancingDetails: formData.buyer_financing_details
          },
          stepNumber: 5,
          totalSteps: 5
        };
        break;
    }

    if (nextStep) {
      console.log('Transitioning to next step:', nextStep);
      await smoothTransition(nextStep);
    } else {
      console.warn('No next step defined for current transition:', { currentStep, formData });
    }
  };

  const mockGoBack = async () => {
    const currentStep = currentStepConfig?.stepId;
    let previousStep: WorkflowStep | null = null;

    switch (currentStep) {
      case 'vehicle-knowledge':
        previousStep = {
          stepId: 'intent-selection',
          componentName: 'IntentSelection',
          data: { message: 'What would you like to do today?' },
          stepNumber: 1,
          totalSteps: 6
        };
        break;
      case 'vehicle-search':
        previousStep = {
          stepId: 'vehicle-knowledge',
          componentName: 'VehicleKnowledge',
          data: { message: 'Do you already know which vehicle you want to buy?' },
          stepNumber: 2,
          totalSteps: 6
        };
        break;
      case 'search-results':
        previousStep = {
          stepId: 'vehicle-search',
          componentName: 'VehicleSearch',
          data: { message: 'Search for your desired vehicle' },
          stepNumber: 3,
          totalSteps: 6
        };
        break;
      case 'buying-confirmation':
        previousStep = {
          stepId: 'search-results',
          componentName: 'SearchResults',
          data: { message: 'Here are vehicles matching your criteria' },
          stepNumber: 4,
          totalSteps: 6
        };
        break;
    }

    if (previousStep) {
      await smoothTransition(previousStep);
    }
  };

  return (
    <WorkflowContext.Provider value={{ 
      currentStepConfig, 
      navigate, 
      goBack, 
      isLoading,
      isTransitioning, 
      sessionId,
      error 
    }}>
      {children}
    </WorkflowContext.Provider>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Container maxWidth="md">
          <Box sx={{ py: 4 }}>
            <WorkflowProvider>
              <StepRenderer />
            </WorkflowProvider>
          </Box>
        </Container>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
