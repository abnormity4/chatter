import { useState } from 'react';
import type { FormFieldValidationProp } from '@/components/form-field-types';
import FormField from '@/components/form-field';
import { useOnboardingContext, usernameDefault } from '../../page';
import { z } from 'zod';

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 20;
const MULTI_SPACES_REGEX = /\s{2,}/g;

const usernameSchema = z
  .string()
  .min(USERNAME_MIN_LENGTH, 'invalid_length')
  .max(USERNAME_MAX_LENGTH, 'invalid_length');

const OnboardingUsernameStep = () => {
  const { setOnboardingData, setStepsCompletion } = useOnboardingContext();
  const [hadInput, setHadInput] = useState(false);
  const [validationErrors, setValidationErrors] =
    useState<FormFieldValidationProp>([
      {
        id: 'invalid_length',
        message: `Must be between ${USERNAME_MIN_LENGTH}-${USERNAME_MAX_LENGTH} characters long.`,
        passed: false,
      },
    ]);

  const handleChange = (value: string) => {
    if (!hadInput) setHadInput(true);

    if (value === '') {
      setOnboardingData((prev) => ({ ...prev, username: usernameDefault }));
      setStepsCompletion((prev) => ({ ...prev, username: false }));
      return;
    }

    const normalizedInput = value.replace(MULTI_SPACES_REGEX, ' ').trimStart();

    setOnboardingData((prev) => ({ ...prev, username: normalizedInput }));

    const validationResult = usernameSchema.safeParse(normalizedInput);

    if (!validationResult.success) {
      const zodErrorArray = z.flattenError(validationResult.error).formErrors;

      setValidationErrors((prev) =>
        prev.map((error) => ({
          ...error,
          passed: !zodErrorArray.includes(error.id),
        })),
      );
      setStepsCompletion((prev) => ({ ...prev, username: false }));
    } else {
      setStepsCompletion((prev) => ({ ...prev, username: true }));
      setValidationErrors((prev) =>
        prev.map((error) => ({ ...error, passed: true })),
      );
    }
  };

  return (
    <div className='w-64'>
      <FormField errorList={validationErrors}>
        <FormField.Input
          placeholder='Your username...'
          onChange={(e) => handleChange(e.target.value)}
        />
        {hadInput && <FormField.ValidationList />}
      </FormField>
    </div>
  );
};

export default OnboardingUsernameStep;
