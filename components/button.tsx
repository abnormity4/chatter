import { cva, VariantProps } from 'class-variance-authority';
import { ComponentProps } from 'react';
import CircleSpinnerAnimation from './icons/CircleSpinnerAnimation';

const button = cva(
  'w-full transition-colors h-10 rounded-md flex items-center justify-center gap-2',
  {
    variants: {
      intent: {
        enabled: 'bg-indigo-500 hover:bg-indigo-400 text-white cursor-pointer',
        disabled:
          'bg-stone-900 text-stone-400 border border-stone-600 cursor-not-allowed',
        loading:
          'bg-indigo-500 border border-indigo-400 text-white cursor-progress',
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
