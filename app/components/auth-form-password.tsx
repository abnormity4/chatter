import { useState, ChangeEvent } from 'react';
import { FormFieldValidationProp } from '@/components/form-field-types';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@/lib/constants';
import { passwordSchema } from '@/lib/zodschemas';
import FormField from '@/components/form-field';
import { Eye } from 'lucide-react';
import { z } from 'zod';
import { useAuthFormContext } from './auth-form';
import type { FormFieldUIStatus } from './auth-form-types';

const AuthFormPassword = () => {
  const { formData, setFormData, setFormValidation } = useAuthFormContext();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordForm, setPasswordForm] = useState<FormFieldUIStatus>({
    status: 'neutral',
    message: null,
  });
  const [passwordErrorList, setPasswordErrorList] =
    useState<FormFieldValidationProp>([
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

  const fieldReset = () => {
    setPasswordForm({ status: 'neutral', message: null });
    setFormValidation((prev) => ({ ...prev, password: false }));
    setFormData((prev) => ({ ...prev, password: '' }));
  };

  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === '') {
      fieldReset();
      return;
    }

    setFormData((prev) => ({ ...prev, password: value }));

    const passwordValidation = passwordSchema.safeParse(value);
    if (!passwordValidation.success) {
      const zodErrorArray = z.flattenError(passwordValidation.error);
      setPasswordForm({ status: 'error', message: null });
      setFormValidation((prev) => ({ ...prev, password: false }));
      setPasswordErrorList((prev) =>
        prev.map((err) => ({
          ...err,
          passed: !zodErrorArray.formErrors.includes(err.id),
        })),
      );
    } else {
      setPasswordForm({ status: 'success', message: null });
      setPasswordErrorList((prev) =>
        prev.map((err) => ({ ...err, passed: true })),
      );
      setFormValidation((prev) => ({ ...prev, password: true }));
    }
  };

  return (
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
      {formData.password !== '' && <FormField.ValidationList />}
    </FormField>
  );
};

export default AuthFormPassword;
