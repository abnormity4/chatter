import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import { USERAVATAR_DEFAULT_URL } from '@/lib/constants';
import OverlayCloseButton from '@/app/onboarding/components/overlay-close-button';

const UserAvatarGrid = ({
  setUserAvatar,
  avatarUrls,
  setAvatarWasChanged,
}: {
  setUserAvatar: Dispatch<SetStateAction<string>>;
  avatarUrls: string[];
  setAvatarWasChanged: Dispatch<SetStateAction<boolean>>;
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  return (
    <div
      className='w-full h-full
            [linear-gradient(to_bottom,transparent,black_40px,black_calc(100%-40px),transparent)]
        shrink flex justify-center items-start overflow-y-scroll scroll-auto [scrollbar-width:none]
        [&::-webkit-scrollbar]:hidden'>
      <div className='grid grid-cols-4 md:gap-4 gap-2 py-4'>
        {avatarUrls.map((avatar) => (
          <div key={avatar} className='relative group'>
            <div
              onClick={() => {
                setUserAvatar(`/avatars/${avatar}`);
                setAvatarWasChanged(true);
                setSelectedAvatar(avatar);
              }}
              className={`relative cursor-pointer md:size-18 size-14 rounded-full overflow-hidden 
                             
                            ${selectedAvatar === avatar ? 'drop-shadow-md drop-shadow-blue-400 ' : ''}`}>
              <Image
                src={`/avatars/${avatar}`}
                alt='User avatar'
                fill={true}
                loading='eager'
                sizes='(max-width: 768px) 25vw, 10vw'
              />
            </div>

            {selectedAvatar === avatar && (
              <OverlayCloseButton
                onClick={() => {
                  setSelectedAvatar(null);
                  setUserAvatar(USERAVATAR_DEFAULT_URL);
                }}
                className={'top-0 right-0 size-5'}
                iconSize={'size-3.5'}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserAvatarGrid;
