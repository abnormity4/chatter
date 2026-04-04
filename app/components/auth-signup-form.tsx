'use client';
import { ChangeEvent, useRef, useState } from 'react';
import { Eye } from 'lucide-react';
import Button from '@/components/button';
import { createUser, checkEmailAvailability } from '@/app/actions';
import { emailSchema, passwordSchema } from '@/lib/zodschemas';
import { z } from 'zod';
import FormField from '@/components/form-field';
import {
  CreateUserResponse,
  FormFieldStatusCode,
  UserNameValidationErrorsProp,
} from '@/lib/types';
import { debounce } from '@/lib/utils';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@/lib/constants';
import { redirect } from 'next/navigation';

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

  const [isFormBeingSubmitted, setIsFormBeingSubmitted] = useState(false);

  const [emailForm, _setEmailForm] = useState<FormField>({
    status: 'neutral',
    message: null,
  });
  const setEmailForm = (
    status: FormField['status'],
    message: FormField['message'],
  ) => {
    _setEmailForm({ status, message });
  };
  const [formValidation, setFormValidation] = useState({
    email: false,
    password: false,
  });

  const canSubmit = Object.values(formValidation).every((v) => v);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordHasInput, setPasswordHasInput] = useState(false);
  const [passwordForm, _setPasswordForm] = useState<FormField>({
    status: 'neutral',
    message: null,
  });
  const setPasswordForm = (
    status: FormField['status'],
    message: FormField['message'],
  ) => {
    _setPasswordForm({ status, message });
  };
  const [passwordErrorList, setPasswordErrorList] =
    useState<UserNameValidationErrorsProp>([
      {
        id: 'invalid_length',
        message: `Must be at least ${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH} characters long.`,
        passed: false,
      },
      {
        id: 'not_enough_unique_characters',
        message: 'Must contain at least 2 unique characters.',
        passed: false,
      },
    ]);

  const debouncedValidation = useRef(
    debounce(async (value: string) => {
      const emailValidation = emailSchema.safeParse(value);
      if (!emailValidation.success) {
        setEmailForm('error', 'Please enter a valid email address.');
      } else {
        setEmailForm('loading', null);
        const user = await checkEmailAvailability(value);
        if (!!user) {
          setEmailForm('error', 'An account with this email already exists.');
        } else {
          setEmailForm('success', null);
          setForm((prev) => ({ ...prev, email: value }));
          setFormValidation((prev) => ({ ...prev, email: true }));
        }
      }
    }, 500),
  );

  const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmailForm('neutral', null);
    if (e.target.value === '') {
      debouncedValidation.current.cancel();
      return;
    }
    setFormValidation((prev) => ({ ...prev, email: false }));
    debouncedValidation.current(e.target.value);
  };

  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordHasInput(true);

    if (e.target.value === '') {
      setPasswordForm('neutral', null);
      setPasswordHasInput(false);
      setFormValidation((prev) => ({ ...prev, password: false }));
      return;
    }

    const passwordValidation = passwordSchema.safeParse(e.target.value);
    if (!passwordValidation.success) {
      const zodErrorArray = z.flattenError(passwordValidation.error);
      setPasswordForm('error', null);
      setFormValidation((prev) => ({ ...prev, password: false }));
      setPasswordErrorList((prev) =>
        prev.map((err) => ({
          ...err,
          passed: !zodErrorArray.formErrors.includes(err.id),
        })),
      );
    } else {
      setPasswordForm('success', null);
      setPasswordErrorList((prev) =>
        prev.map((err) => ({ ...err, passed: true })),
      );
      setForm((prev) => ({ ...prev, password: e.target.value }));
      setFormValidation((prev) => ({ ...prev, password: true }));
    }
  };

  const handleSubmit = async (form: { email: string; password: string }) => {
    if (!canSubmit) return;

    setIsFormBeingSubmitted(true);
    setFormStatus({ status: 'neutral', message: null });

    const result: CreateUserResponse = await createUser(form);

    if (!result.success) {
      setFormStatus({ status: 'error', message: result.message });
      setIsFormBeingSubmitted(false);
      return;
    }

    redirect('/');
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
        <FormField status={emailForm.status}>
          <FormField.Label>Email</FormField.Label>
          <FormField.Input
            type='email'
            placeholder='mail@example.com'
            onChange={(e) => {
              handleEmail(e);
            }}>
            <FormField.Loader />
          </FormField.Input>
          <FormField.Message>{emailForm.message}</FormField.Message>
        </FormField>

        <FormField status={passwordForm.status} errorList={passwordErrorList}>
          <FormField.Label>Password</FormField.Label>
          <FormField.Input
            type={passwordVisible ? 'text' : 'password'}
            onChange={(e) => {
              handlePassword(e);
            }}>
            <FormField.Icons>
              <Eye
                onClick={() => setPasswordVisible((prev) => !prev)}
                className='size-5 stroke-stone-500 hover:stroke-stone-300 cursor-pointer transition-colors'
              />
            </FormField.Icons>
          </FormField.Input>
          {passwordHasInput && <FormField.ValidationList />}
        </FormField>
      </div>

      <Button
        intent={
          isFormBeingSubmitted ? 'loading' : canSubmit ? 'enabled' : 'disabled'
        }
        onClick={() => handleSubmit(form)}
        disabled={!canSubmit}>
        {isFormBeingSubmitted ? null : 'Create account'}
      </Button>
    </div>
  );
};

export default AuthSignupForm;
