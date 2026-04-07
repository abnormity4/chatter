'use client';
import { useState, createContext, useContext } from 'react';
import Button from '@/components/button';
import { createUser } from '@/app/actions';
import type { FormFieldUIStatus, AuthServerResponse } from './auth-form-types';
import { useRouter } from 'next/navigation';
import AuthFormEmail from './auth-form-email';
import AuthFormPassword from './auth-form-password';

const AuthFormContext = createContext<
  | {
      formData: { email: string; password: string };
      setFormData: React.Dispatch<
        React.SetStateAction<{ email: string; password: string }>
      >;
      setFormValidation: React.Dispatch<
        React.SetStateAction<{ email: boolean; password: boolean }>
      >;
    }
  | undefined
>(undefined);

export const useAuthFormContext = () => {
  const context = useContext(AuthFormContext);
  if (!context) {
    throw new Error(
      'useAuthFormContext must be used within an AuthFormContextProvider',
    );
  }
  return context;
};

const AuthForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formStatus, setFormStatus] = useState<FormFieldUIStatus>({
    status: 'neutral',
    message: null,
  });

  const [isBeingSubmitted, setIsBeingSubmitted] = useState(false);

  const [formValidation, setFormValidation] = useState({
    email: false,
    password: false,
  });

  const canSubmit = Object.values(formValidation).every((v) => v);
  const router = useRouter();

  const handleSubmit = async (form: { email: string; password: string }) => {
    if (!canSubmit) return;

    setIsBeingSubmitted(true);
    setFormStatus({ status: 'neutral', message: null });

    const result: AuthServerResponse = await createUser(form);

    if (!result.success) {
      setFormStatus({ status: 'error', message: result.message });
      setIsBeingSubmitted(false);
      return;
    }

    router.push('/onboarding');
  };

  return (
    <AuthFormContext value={{ formData, setFormData, setFormValidation }}>
      <div className={`divide-stone-900 flex flex-col gap-4 transition-colors`}>
        <div>
          <h1 className='font-google-sans-flex text-xl font-semibold text-center'>
            Sign up
          </h1>
          <p className='text-center text-sm text-rose-400'>
            {formStatus.message}
          </p>
        </div>

        <div className='mb-8 space-y-6'>
          <AuthFormEmail />
          <AuthFormPassword />
        </div>

        <Button
          intent={
            isBeingSubmitted ? 'loading' : canSubmit ? 'enabled' : 'disabled'
          }
          onClick={() => handleSubmit(formData)}
          disabled={!canSubmit}>
          {isBeingSubmitted ? null : 'Create account'}
        </Button>
      </div>
    </AuthFormContext>
  );
};

export default AuthForm;
