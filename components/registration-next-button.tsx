'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ComponentProps } from 'react';

const RegistrationNextButton = ({ className }: ComponentProps<'div'>) => {
  const buttonStyle =
    'flex items-center text-neutral-500 hover:text-neutral-200 transition-colors cursor-pointer select-none';

  return (
    <div className={`flex justify-between w-full ${className}`}>
      <button className={buttonStyle}>
        <ChevronLeft className='size-5' />
        <p>Back</p>
      </button>
      <button className={buttonStyle}>
        <p>Next</p>
        <ChevronRight className='size-5' />
      </button>
    </div>
  );
};

export default RegistrationNextButton;
