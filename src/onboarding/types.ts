export type OnboardingData = {
  username: string;
  avatar: string;
};

export type OnboardingStepsCompletion = {
  username: boolean;
  avatar: boolean;
};

export type OnboardingStep = {
  id: string;
  component: React.ComponentType;
};

export type OnboardingContextType = {
  avatarUrls: string[];
  onboardingData: OnboardingData;
  setOnboardingData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  avatarWasChanged: boolean;
  setAvatarWasChanged: React.Dispatch<React.SetStateAction<boolean>>;
  steps: readonly OnboardingStep[];
  setStepsCompletion: React.Dispatch<
    React.SetStateAction<OnboardingStepsCompletion>
  >;
  currentStepIndex: number;
  setCurrentStepIndex: React.Dispatch<React.SetStateAction<number>>;
};
