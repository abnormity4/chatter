import { cva, VariantProps } from 'class-variance-authority';
import { ComponentProps } from 'react';
import CircleSpinnerAnimation from '@/src/shared/components/icons/CircleSpinnerAnimation';

const button = cva(
  'w-full transition-colors transition-all h-10 rounded-md flex items-center justify-center gap-2',
  {
    variants: {
      intent: {
        enabled: 'bg-white text-black/70 cursor-pointer',
        disabled:
          'bg-white/20 border border-neutral-900/20 hover:bg-white/40 text-black/30 cursor-not-allowed',
        loading:
          'bg-white/20 border border-neutral-500/90 text-neutral-400 cursor-progress',
      },
    },
    defaultVariants: {
      intent: 'enabled',
    },
  },
);

const AuthFormButton = ({
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

export default AuthFormButton;
