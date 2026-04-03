import { cva, VariantProps } from 'class-variance-authority';
import { ComponentProps } from 'react';
import CircleSpinnerAnimation from './icons/CircleSpinnerAnimation';

const button = cva(
  'w-full transition-colors h-9 rounded-md flex items-center justify-center gap-2',
  {
    variants: {
      intent: {
        enabled: 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer',
        disabled:
          'bg-neutral-800 text-neutral-400 border border-neutral-600 cursor-not-allowed',
        loading:
          'bg-blue-500 border border-blue-400 text-white cursor-progress',
      },
    },
    defaultVariants: {
      intent: 'enabled',
    },
  },
);

const Button = ({
  onClick,
  disabled,
  children,
  intent,
}: ComponentProps<'button'> & VariantProps<typeof button>) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={button({ intent })}>
      {children}
      {intent === 'loading' && (
        <div className='size-5'>
          <CircleSpinnerAnimation />
        </div>
      )}
    </button>
  );
};

export default Button;
