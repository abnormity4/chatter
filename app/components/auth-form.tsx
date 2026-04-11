'use client';
import { useState, createContext, useContext } from 'react';
import { createUser, logIn } from '@/app/actions';
import type { FormFieldUIStatus, AuthServerResponse } from './auth-form-types';
import { useRouter } from 'next/navigation';
import AuthFormEmail from './auth-form-email';
import AuthFormPassword from './auth-form-password';
import AuthFormButton from '@/app/components/auth-form-button';
import { motion } from 'motion/react';

const AuthFormContext = createContext<
  | {
      formData: { email: string; password: string };
      formMode: 'login' | 'signup';
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

  const [formMode, setFormMode] = useState<'login' | 'signup'>('signup');

  const canSubmit = Object.values(formValidation).every((v) => v);
  const router = useRouter();

  const handleSignup = async (form: { email: string; password: string }) => {
    if (!canSubmit) return;

    formEnableSubmit();

    const result: AuthServerResponse = await createUser(form);

    if (!result.success) {
      setFormStatus({ status: 'error', message: result.message });
      setIsBeingSubmitted(false);
      return;
    }

    router.push('/onboarding');
  };

  const handleLogin = async (form: { email: string; password: string }) => {
    if (!canSubmit) return;

    formEnableSubmit();

    const result: AuthServerResponse = await logIn(form);

    if (!result.success) {
      setFormStatus({ status: 'error', message: result.message });
      setIsBeingSubmitted(false);
      return;
    }

    router.push('/onboarding');
  };

  const formReset = () => {
    setFormData({ email: '', password: '' });
    setFormValidation({ email: false, password: false });
    setFormStatus({ status: 'neutral', message: null });
    setIsBeingSubmitted(false);
  };

  const formEnableSubmit = () => {
    setIsBeingSubmitted(true);
    setFormStatus({ status: 'neutral', message: null });
  };

  return (
    <AuthFormContext
      value={{ formData, formMode, setFormData, setFormValidation }}>
      <div
        className={`flex w-[45%] flex-col rounded-xl bg-white/10 backdrop-blur-md p-8 border border-white/20 shadow-2xl`}>
        <motion.div
          key={formMode}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}>
          <div>
            <h1 className='font-google-sans-flex text-xl text-neutral-600 mb-1 font-semibold text-center'>
              {formMode === 'signup' ? 'Sign up' : 'Login'}
            </h1>
            <p className='text-center text-xs text-red-500'>
              {formStatus.message}
            </p>
          </div>

          <div className='mb-12 space-y-6'>
            <AuthFormEmail />
            <AuthFormPassword />
          </div>

          <AuthFormButton
            intent={
              isBeingSubmitted ? 'loading' : canSubmit ? 'enabled' : 'disabled'
            }
            onClick={() =>
              formMode === 'signup'
                ? handleSignup(formData)
                : handleLogin(formData)
            }
            disabled={!canSubmit}>
            {isBeingSubmitted
              ? null
              : formMode === 'signup'
                ? 'Create account'
                : 'Log in'}
          </AuthFormButton>

          <p className='text-sm text-center text-neutral-600 mt-4'>
            {formMode === 'signup'
              ? 'Already have an account?'
              : "Don't have an account?"}
            <span
              onClick={() => {
                if (isBeingSubmitted) return;
                setFormMode((prev) => (prev === 'signup' ? 'login' : 'signup'));
                formReset();
              }}
              className='text-neutral-700 font-bold hover:border-b hover:border-neutral-700 cursor-pointer'>
              {' '}
              {formMode === 'signup' ? 'Log in' : 'Sign up'}
            </span>
          </p>
        </motion.div>
      </div>
    </AuthFormContext>
  );
};

export default AuthForm;
