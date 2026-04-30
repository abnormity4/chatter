const OnboardingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='backdrop-blur-3xl flex min-h-screen items-center justify-center font-sans landing-gradient'>
      {children}
    </div>
  );
};

export default OnboardingLayout;
