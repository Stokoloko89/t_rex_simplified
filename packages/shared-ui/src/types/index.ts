export interface WorkflowStep {
  stepId: string;
  componentName: string;
  data: any;
  validation?: any;
  nextSteps?: string[];
  previousStep?: string;
}

export interface WorkflowContextType {
  currentStepConfig: WorkflowStep | null;
  navigate: (formData: any) => Promise<void>;
  goBack: () => Promise<void>;
  isLoading: boolean;
  sessionId: string;
}

export interface StepComponentProps {
  initialData: any;
  onSubmit: (data: any) => void;
  onBack?: () => void;
  isLoading?: boolean;
}
