import { useState, useRef, ChangeEvent } from 'react';
import FormField from '@/components/form-field';
import { FormFieldStatusCode } from '@/lib/types';
import { debounce } from '@/lib/utils';
import { checkEmailAvailability } from '@/app/actions';
import { emailSchema } from '@/lib/zodschemas';

type FormField = {
  status: FormFieldStatusCode;
  message: string | null;
};

const AuthFormEmail = ({
  setForm,
  setFormValidation,
}: {
  setForm: React.Dispatch<
    React.SetStateAction<{ email: string; password: string }>
  >;
  setFormValidation: React.Dispatch<
    React.SetStateAction<{ email: boolean; password: boolean }>
  >;
}) => {
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

  return (
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
  );
};

export default AuthFormEmail;
