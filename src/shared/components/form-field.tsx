import { ComponentProps, createContext, useContext, useId } from 'react';
import { cva } from 'class-variance-authority';
import SpinnerAnimation from './icons/SpinnerAnimation';
import { motion } from 'motion/react';
import { AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { FormFieldContextType, FormFieldProps } from './form-field-types';
const FormFieldContext = createContext<FormFieldContextType | undefined>(
  undefined,
);

const useFormFieldContext = () => {
  const context = useContext(FormFieldContext);
  if (!context) {
    throw new Error('useFormFieldContext must be used within the FormField');
  }
  return context;
};

const FormField = ({ children, status, errorList }: FormFieldProps) => {
  const id = useId();
  return (
    <FormFieldContext value={{ id, status, errorList }}>
      <div>{children}</div>
    </FormFieldContext>
  );
};

FormField.Label = function FormFieldLabelContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id } = useFormFieldContext();
  return (
    <label htmlFor={id}>
      <p className='m-1 text-xs font-sans font-semibold leading-none'>
        {children}
      </p>
    </label>
  );
};

const formFieldInput = cva(
  'px-3 border h-9  rounded-lg backdrop-blur-md text-sm font-light transition-colors outline-none flex items-center overflow-hidden',
  {
    variants: {
      status: {
        neutral:
          'bg-neutral-400/20 border-white/20 focus:border-white/40 has-[:focus]:border-white/30',
        warning: 'border-amber-500',
        error: 'bg-neutral-600/20 border-neutral-800',
        success: 'bg-neutral-200/20 border-white/80',
        loading: 'bg-neutral-600/30 border-neutral-800',
      },
    },
    defaultVariants: {
      status: 'neutral',
    },
  },
);

FormField.Input = function FormFieldInput({
  children,
  ...props
}: { children?: React.ReactNode } & ComponentProps<'input'>) {
  const { id, status } = useFormFieldContext();

  return (
    <div className={formFieldInput({ status })}>
      <input
        className='w-full focus:outline-none group mask-[radial-gradient(circle_at_left,black_80%,transparent_100%)]'
        {...props}
        id={id}
      />
      {children}
    </div>
  );
};

const formFieldMessage = cva('text-xs m-1', {
  variants: {
    status: {
      error: 'text-white',
      success: 'text-emerald-400',
      warning: 'text-amber-400',
      neutral: '',
      loading: '',
    },
  },
});

FormField.Message = function FormFieldMessage({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useFormFieldContext();
  return (
    <div className='absolute'>
      <AnimatePresence>
        <motion.p
          key={status}
          initial={{ y: -5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -5, opacity: 0 }}
          className={formFieldMessage({ status })}>
          {children}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

FormField.Icons = function FormFieldIcons({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className='h-full flex items-center pl-2 gap-1'>{children}</div>;
};

FormField.Loader = function FormFieldLoader() {
  const { status } = useFormFieldContext();
  if (status !== 'loading') return null;

  return (
    <div className='h-full w-5 flex items-center'>
      <SpinnerAnimation />
    </div>
  );
};

FormField.ValidationList = function FormFieldValidationList() {
  const { errorList } = useFormFieldContext();

  if (!errorList) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      aria-label='validation-list'
      className='absolute pl-3 pt-2'>
      <ul className='space-y-1'>
        {errorList.map((err) => (
          <li
            key={err.id}
            className={`relative text-[12px] leading-3 transition-colors ${!err.passed ? 'text-white/50' : 'text-white'} select-none`}>
            {err.passed && <Check className='absolute -left-3 size-3' />}
            {err.message}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default FormField;
