'use client';
import { useState } from 'react';
import Button from '@/components/button';
import { createUser } from '@/app/actions';
import FormField from '@/components/form-field';
import { CreateUserResponse, FormFieldStatusCode } from '@/lib/types';

import { useRouter } from 'next/navigation';
import AuthFormEmail from './auth-form-email';
import AuthFormPassword from './auth-form-password';

type FormField = {
  status: FormFieldStatusCode;
  message: string | null;
};

const AuthSignupForm = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [formStatus, setFormStatus] = useState<FormField>({
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

    const result: CreateUserResponse = await createUser(form);

    if (!result.success) {
      setFormStatus({ status: 'error', message: result.message });
      setIsBeingSubmitted(false);
      return;
    }

    router.push('/onboarding');
  };

  return (
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
        <AuthFormEmail
          setForm={setForm}
          setFormValidation={setFormValidation}
        />

        <AuthFormPassword
          setForm={setForm}
          setFormValidation={setFormValidation}
        />
      </div>

      <Button
        intent={
          isBeingSubmitted ? 'loading' : canSubmit ? 'enabled' : 'disabled'
        }
        onClick={() => handleSubmit(form)}
        disabled={!canSubmit}>
        {isBeingSubmitted ? null : 'Create account'}
      </Button>
    </div>
  );
};

export default AuthSignupForm;
