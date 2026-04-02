import { ComponentProps, createContext, useContext, useId } from 'react';
import { cva } from 'class-variance-authority';
import SpinnerAnimation from '@/components/icons/SpinnerAnimation';
import { motion } from 'motion/react';
import { AnimatePresence } from 'framer-motion';
import { FormFieldStatusCode, UserNameValidationErrorsProp } from '@/lib/types';
import { Check } from 'lucide-react';

type FormFieldProps = {
  status: FormFieldStatusCode;
  children: React.ReactNode;
  errorList?: UserNameValidationErrorsProp;
};

type FormFieldContext = {
  id: string;
  status: FormFieldProps['status'];
  errorList?: FormFieldProps['errorList'];
};

const FormFieldContext = createContext<FormFieldContext | undefined>(undefined);

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
      <p className='m-1 text-sm'>{children}</p>
    </label>
  );
};

const formFieldInput = cva(
  'px-3 border h-9 rounded-lg text-sm font-light transition-colors outline-none flex items-center overflow-hidden',
  {
    variants: {
      status: {
        neutral:
          'bg-neutral-950 border-neutral-900 focus:border-neutral-800 has-[:focus]:border-neutral-800',
        error: 'bg-neutral-950 border-red-500',
        success: 'bg-neutral-950 border-blue-500 text-blue-300',
        loading: 'bg-neutral-950 border-neutral-400',
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
      error: 'text-red-500',
      success: 'text-blue-200',
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
    <div className='min-h-5'>
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
    <div className='h-full w-5 flex items-center text-neutral-500'>
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
      className='p-2 absolute'>
      <ul className='space-y-1'>
        {errorList.map((err) => (
          <li
            key={err.id}
            className={`pl-5 relative text-[12px] leading-3 transition-colors ${!err.passed ? 'text-neutral-400' : 'text-neutral-200'} select-none`}>
            {err.passed && <Check className='absolute left-1 size-3' />}
            {err.message}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default FormField;
