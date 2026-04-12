import { useState, useRef, ChangeEvent } from 'react';
import FormField from '@/components/form-field';
import { debounce } from '@/lib/utils';
import { emailSchema } from '@/app/schemas';
import type { FormFieldUIStatus } from './auth-form-types';
import { useAuthFormContext } from './auth-form';
import { isEmailValid } from '@/app/schemas';

const AuthFormEmail = () => {
  const { setFormData, setFormValidation, formMode } = useAuthFormContext();

  const [emailForm, setEmailForm] = useState<FormFieldUIStatus>({
    status: 'neutral',
    message: null,
  });

  const resetValidationState = () => {
    setEmailForm({ status: 'neutral', message: null });
    setFormValidation((prev) => ({ ...prev, email: false }));
  };

  const markAsValid = () => {
    setEmailForm({ status: 'success', message: null });
    setFormValidation((prev) => ({ ...prev, email: true }));
  };

  const debouncedValidation = useRef(
    debounce(async (value: string) => {
      const validatedEmail = isEmailValid(value);
      if (!validatedEmail) {
        setEmailForm({
          status: 'error',
          message: 'Please enter a valid email address.',
        });
        setFormValidation((prev) => ({ ...prev, email: false }));
      }

      if (formMode === 'signup') {
        const result = await fetch('/api/auth/check-availability', {
          method: 'POST',
          body: JSON.stringify({ email: value }),
        }).then((res) => res.json()); //TODO: fix race condition (abortcontroller)

        if (!result.success) {
          setEmailForm({
            status: 'error',
            message: 'Email is already in use.',
          });
          setFormValidation((prev) => ({ ...prev, email: false }));
          return;
        }
        return; //TODO: refactor component
      }

      markAsValid();
    }, 500),
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    resetValidationState();

    setFormData((prev) => ({ ...prev, email: value }));

    if (value === '') {
      debouncedValidation.current.cancel();
      return;
    }

    debouncedValidation.current(value);
  };

  return (
    <FormField status={emailForm.status}>
      <FormField.Label>Email</FormField.Label>
      <FormField.Input
        type='email'
        placeholder='mail@example.com'
        onChange={(e) => {
          handleChange(e);
        }}>
        <FormField.Loader />
      </FormField.Input>
      <FormField.Message>{emailForm.message}</FormField.Message>
    </FormField>
  );
};

export default AuthFormEmail;
