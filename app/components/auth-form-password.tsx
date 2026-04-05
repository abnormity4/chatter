import { useState, ChangeEvent } from 'react';
import { FormFieldStatusCode, UserNameValidationErrorsProp } from '@/lib/types';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@/lib/constants';
import { passwordSchema } from '@/lib/zodschemas';
import FormField from '@/components/form-field';
import { Eye } from 'lucide-react';
import { z } from 'zod';

type FormField = {
  status: FormFieldStatusCode;
  message: string | null;
};

const AuthFormPassword = ({
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
      {passwordHasInput && <FormField.ValidationList />}
    </FormField>
  );
};

export default AuthFormPassword;
