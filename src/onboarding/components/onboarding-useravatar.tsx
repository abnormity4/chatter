import Image from 'next/image';
import OnboardingUserAvatarReset from '../../../src/onboarding/components/onboarding-useravatar-reset';
import { motion } from 'framer-motion';
import { useOnboardingContext, USERAVATAR_DEFAULT_URL } from './onboarding';

const OnboardingUserAvatar = () => {
  const { onboardingData, setOnboardingData, avatarWasChanged } =
    useOnboardingContext();
  return (
    <div className='flex flex-col gap-3 items-center overflow-hidden'>
      <div className='relative group'>
        <div className='bg-neutral-800 border-3 border-neutral-800 rounded-full overflow-hidden'>
          <motion.div
            key={onboardingData.avatar}
            initial={{
              x: avatarWasChanged ? -10 : 0,
              opacity: avatarWasChanged ? 0 : 1,
            }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.1 }}
            className='relative size-54'>
            <Image
              src={onboardingData.avatar}
              sizes='(max-width: 768px) 60vw, 20vw'
              alt='User selected avatar'
              fill
              loading='eager'
            />
          </motion.div>
        </div>

        <div className='size-10 bg-seagreen-400 border-3 border-neutral-800 rounded-full absolute bottom-2 right-5 z-10' />

        {onboardingData.avatar !== USERAVATAR_DEFAULT_URL && (
          <OnboardingUserAvatarReset
            onClick={() => {
              setOnboardingData({
                ...onboardingData,
                avatar: USERAVATAR_DEFAULT_URL,
              });
            }}
            className='top-0 right-8 size-8'
            iconSize='size-6'
          />
        )}
      </div>

      <h2 className='mask-[radial-gradient(circle_at_center,black_75%,transparent_100%)] text-2xl text-center text-neutral-100/80 text-shadow-2xs min-h-8 w-full overflow-hidden select-none whitespace-nowrap font-quicksand'>
        {onboardingData.username}
      </h2>
    </div>
  );
};

export default OnboardingUserAvatar;
