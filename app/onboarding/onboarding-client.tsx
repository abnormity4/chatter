'use client';

import { useState } from 'react';
import { FormFieldValidationProp } from '@/components/form-field-types';
import {
  USERAVATAR_DEFAULT_URL,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from '@/lib/constants';
import ProgressBar from '@/app/onboarding/components/progressbar';
import Image from 'next/image';
import UsernameInput from '@/app/onboarding/components/username-input';
import UserAvatarGrid from '@/app/onboarding/components/useravatar-grid';
import { AnimatePresence, motion } from 'framer-motion';
import RegistrationNextButton from '@/app/onboarding/components/registration-next-button';
import OverlayCloseButton from '@/app/onboarding/components/overlay-close-button';

const OnboardingClient = ({ avatarUrls }: { avatarUrls: string[] }) => {
  const [username, setUsername] = useState('Your nickname');
  const [userAvatar, setUserAvatar] = useState(USERAVATAR_DEFAULT_URL);
  const [avatarWasChanged, setAvatarWasChanged] = useState(false);

  const [validationErrors, setValidationErrors] =
    useState<FormFieldValidationProp>([
      {
        id: 'invalid_length',
        message: `Must be between ${USERNAME_MIN_LENGTH}-${USERNAME_MAX_LENGTH} characters long.`,
        passed: false,
      },
    ]);

  const hasNoErrors = validationErrors.every((err) => err.passed);

  return (
    <>
      <div className='w-full self-center md:w-1/2'>
        <h1 className='text-lg md:text-3xl md:font-light text-neutral-200 text-center mb-3 md:mb-6 leading-7 font-google-sans-flex select-none'>
          Let’s get you started
        </h1>
        <ProgressBar value={1} maxValue={2} />
      </div>

      <div className='flex flex-col gap-3 items-center'>
        <div className='relative group'>
          <div className='bg-neutral-800 border-3 border-neutral-700 rounded-full overflow-hidden'>
            <motion.div
              key={userAvatar}
              initial={{
                x: avatarWasChanged ? -10 : 0,
                opacity: avatarWasChanged ? 0 : 1,
              }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.1 }}
              className='relative size-54'>
              <Image
                src={userAvatar}
                sizes='(max-width: 768px) 60vw, 20vw'
                alt='User selected avatar'
                fill
                loading='eager'
              />
            </motion.div>
          </div>

          <div className='size-8 bg-blue-400 border-2 border-neutral-800 rounded-full absolute bottom-3 right-5 z-10' />

          {userAvatar !== USERAVATAR_DEFAULT_URL && (
            <OverlayCloseButton
              onClick={() => {
                setUserAvatar(USERAVATAR_DEFAULT_URL);
              }}
              className='top-0 right-8 size-8'
              iconSize='size-6'
            />
          )}
        </div>

        <h2 className='mask-[radial-gradient(circle_at_center,black_75%,transparent_100%)] text-2xl text-center text-neutral-200 text-shadow-2xs min-h-8 w-full overflow-hidden select-none whitespace-nowrap'>
          {username}
        </h2>

        <div className='flex-1 w-full'>
          <UsernameInput
            setUsername={setUsername}
            validationErrors={validationErrors}
            setValidationErrors={setValidationErrors}
            hasNoErrors={hasNoErrors}
          />
        </div>
      </div>

      <UserAvatarGrid
        avatarUrls={avatarUrls}
        setUserAvatar={setUserAvatar}
        setAvatarWasChanged={setAvatarWasChanged}
      />

      <div className='w-full md:min-h-24 min-h-32 md:px-16'>
        <AnimatePresence>
          {hasNoErrors && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className='flex items-center h-32'>
              <RegistrationNextButton />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default OnboardingClient;
