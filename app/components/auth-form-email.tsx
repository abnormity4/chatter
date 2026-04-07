import { useState, useRef, ChangeEvent } from 'react';
import FormField from '@/components/form-field';
import { debounce } from '@/lib/utils';
import { emailSchema } from '@/lib/zodschemas';
import type { FormFieldUIStatus } from './auth-form-types';
import { useAuthFormContext } from './auth-form';
import { checkEmailAvailability } from '@/app/actions';

const AuthFormEmail = () => {
  const { setFormData, setFormValidation } = useAuthFormContext();

  const [emailForm, setEmailForm] = useState<FormFieldUIStatus>({
    status: 'neutral',
    message: null,
  });

  const debouncedValidation = useRef(
    debounce(async (value: string) => {
      const validateEmail = emailSchema.safeParse(value);

      if (!validateEmail.success) {
        setEmailForm({
          status: 'error',
          message: 'Please enter a valid email address.',
        });
        return;
      }

      setEmailForm({ status: 'loading', message: null });

      const isAlreadyRegistered = await checkEmailAvailability(
        validateEmail.data,
      );

      if (isAlreadyRegistered) {
        setEmailForm({
          status: 'warning',
          message: 'An account with this email already exists.',
        });
        return;
      }

      setEmailForm({ status: 'success', message: null });
      setFormValidation((prev) => ({ ...prev, email: true }));
    }, 500),
  );

  const fieldReset = () => {
    setEmailForm({ status: 'neutral', message: null });
    setFormValidation((prev) => ({ ...prev, email: false }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    fieldReset();

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
