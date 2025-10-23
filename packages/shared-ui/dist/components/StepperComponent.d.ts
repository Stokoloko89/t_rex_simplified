import React from 'react';
interface StepperComponentProps {
    steps: string[];
    activeStep: number;
    orientation?: 'horizontal' | 'vertical';
}
declare const StepperComponent: React.FC<StepperComponentProps>;
export default StepperComponent;
