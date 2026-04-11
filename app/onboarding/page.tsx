'use client';

import { createContext, useState, useContext } from 'react';
import OnboardingProgressBar from '@/app/onboarding/components/onboarding-progressbar';
import { SquareArrowRightExit } from 'lucide-react';
import OnboardingUserAvatar from './components/onboarding-useravatar';
import { OnboardingContextType } from './onboarding-types';
import OnboardingUsernameStep from './components/steps/onboarding-username-step';
import OnboardingUserAvatarStep from './components/steps/onboarding-useravatar-step';
import OnboardingNextButton from './components/onboarding-next-button';
import { motion } from 'motion/react';

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
);

export const useOnboardingContext = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error(
      'useOnboardingContext must be used within an OnboardingProvider',
    );
  }
  return context;
};

export const USERAVATAR_DEFAULT_URL = '/useravatar-none.svg';
export const usernameDefault = 'Your nickname'; //will be pulled from db

const OnboardingPage = ({ avatarUrls }: { avatarUrls: string[] }) => {
  const steps = [
    {
      id: 'username',
      component: OnboardingUsernameStep,
    },
    {
      id: 'avatar',
      component: OnboardingUserAvatarStep,
    },
  ] as const;

  type StepId = (typeof steps)[number]['id'];

  const [stepsCompletion, setStepsCompletion] = useState<
    Record<StepId, boolean>
  >({
    username: false,
    avatar: true,
  });

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const CurrentStepComponent = steps[currentStepIndex].component;
  const currentStepId = steps[currentStepIndex].id;

  const [onboardingData, setOnboardingData] = useState({
    username: usernameDefault, //TODO: replace with actual username from db
    avatar: USERAVATAR_DEFAULT_URL,
  });

  const [avatarWasChanged, setAvatarWasChanged] = useState(false);

  const isCurrentStepCompleted = stepsCompletion[currentStepId];

  return (
    <OnboardingContext
      value={{
        avatarUrls,
        onboardingData,
        setOnboardingData,
        avatarWasChanged,
        setAvatarWasChanged,
        steps,
        setStepsCompletion,
        currentStepIndex,
        setCurrentStepIndex,
      }}>
      <main className='w-1/3 border-r border-l relative h-screen dark:bg-black/20 sm:items-start bg-white/5 backdrop-blur-xl border border-white/20 overflow-hidden'>
        <div className='mb-12'>
          <OnboardingProgressBar
            value={currentStepIndex === 0 ? 0.2 : currentStepIndex}
            maxValue={steps.length}
            color='bg-seagreen-400/80'
            bgColor='bg-neutral-900/50'
          />
        </div>

        <div className='absolute -left-24 top-4 cursor-pointer text-[16px] text-white/80 hover:text-white/80 transition-colors'>
          <span>Log out</span>
          <SquareArrowRightExit className='inline-block ml-1 size-4' />
        </div>

        <div className='grid grid-rows-[35%_45%_20%] h-full'>
          <div className='justify-center'>
            <OnboardingUserAvatar />
          </div>
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className='px-24'>
            <CurrentStepComponent />
          </motion.div>
          <div className='h-fit'>
            {isCurrentStepCompleted && <OnboardingNextButton />}
          </div>
        </div>
      </main>
    </OnboardingContext>
  );
};

export default OnboardingPage;

//TODO: expand when chat creating are added