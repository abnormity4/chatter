import Image from 'next/image';
import { useState } from 'react';
import { useOnboardingContext, USERAVATAR_DEFAULT_URL } from '../onboarding';
import OverlayCloseButton from '@/src/onboarding/components/onboarding-useravatar-reset';

const OnboardingUserAvatarStep = () => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  const { avatarUrls, setOnboardingData, setAvatarWasChanged } =
    useOnboardingContext();

  return (
    <div className='w-full h-full [linear-gradient(to_bottom,transparent,black_40px,black_calc(100%-40px),transparent)] shrink flex justify-center items-start overflow-y-scroll scroll-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
      <div className='grid grid-cols-4 md:gap-4 gap-2 py-4'>
        {avatarUrls.map((avatarUrl) => (
          <div key={avatarUrl} className='relative group'>
            <div
              onClick={() => {
                setOnboardingData((prev) => ({
                  ...prev,
                  avatar: `/avatars/${avatarUrl}`,
                }));
                setAvatarWasChanged(true);
                setSelectedAvatar(avatarUrl);
              }}
              className={`relative cursor-pointer md:size-18 size-14 rounded-full overflow-hidden 
                             
              ${selectedAvatar === avatarUrl ? 'outline-3 outline-seagreen-500' : ''}`}>
              <Image
                src={`/avatars/${avatarUrl}`}
                alt='User avatar'
                fill={true}
                loading='eager'
                sizes='(max-width: 768px) 25vw, 10vw'
              />
            </div>

            {selectedAvatar === avatarUrl && (
              <OverlayCloseButton
                onClick={() => {
                  setSelectedAvatar(null);
                  setOnboardingData((prev) => ({
                    ...prev,
                    avatar: USERAVATAR_DEFAULT_URL,
                  }));
                }}
                className={'-top-1 right-0 size-5'}
                iconSize={'size-3.5'}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnboardingUserAvatarStep;
