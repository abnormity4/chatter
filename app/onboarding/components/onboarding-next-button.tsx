'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ComponentProps } from 'react';
import { useOnboardingContext } from '../page';
import { useRouter } from 'next/navigation';

const OnboardingNextButton = ({ className }: ComponentProps<'div'>) => {
  const router = useRouter();
  const { steps, setCurrentStepIndex, currentStepIndex } =
    useOnboardingContext();

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const goToPreviousStep = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const goToNextStep = () => {
    if (!isLastStep) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      router.replace('/'); // TODO: replace with actual app (/chat)
    }
  };

  const buttonStyle =
    'flex items-center text-white/80 hover:text-white text-lg transition-colors cursor-pointer select-none';

  return (
    <div className={`flex justify-between px-12 ${className}`}>
      {!isFirstStep && (
        <button className={buttonStyle} onClick={goToPreviousStep}>
          <ChevronLeft className='size-5' />
          <p>Back</p>
        </button>
      )}

      <button
        className={`${buttonStyle} justify-self-end`}
        onClick={goToNextStep}>
        <p>{isLastStep ? 'Finish onboarding' : 'Next'}</p>
        <ChevronRight className='size-5' />
      </button>
    </div>
  );
};

export default OnboardingNextButton;
