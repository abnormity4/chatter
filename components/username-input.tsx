"use client"

import {ChangeEvent, Dispatch, SetStateAction, useState} from "react";
import {z} from "zod";
import { MULTI_SPACES_REGEX } from "@/lib/constants";
import UsernameInputValidation from "@/components/username-input-validation";
import {UserNameValidationErrorsProp} from "@/lib/types";
import {AnimatePresence, motion} from "framer-motion";
import {usernameSchema} from "@/lib/schemas";

const UsernameInput = (
    {
        setUsername,
        validationErrors,
        setValidationErrors,
        hasNoErrors
    }:
    {
        setUsername: Dispatch<SetStateAction<string>>,
        validationErrors: UserNameValidationErrorsProp,
        setValidationErrors: Dispatch<SetStateAction<UserNameValidationErrorsProp>>,
        hasNoErrors: boolean
    }) => {

    const [hadInput, setHadInput] = useState(false);

    return (
        <div>
            <input
                type="text"
                name="registration-username-field"
                placeholder="Create nickname..."
                className={`bg-neutral-900  ${hasNoErrors ? "border-blue-500 focus:border-blue-400" : "border-neutral-800 focus:border-neutral-600"} px-3 mb-4 border h-9 w-full rounded-lg text-sm font-light transition-colors outline-0`}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (!hadInput) setHadInput(true);

                    const normalizedInput = e.target.value.replace(MULTI_SPACES_REGEX, " ");
                    setUsername(normalizedInput);

                    const validationResult = usernameSchema.safeParse(normalizedInput);

                    if (!validationResult.success) {
                        const zodErrorArray = z.flattenError(validationResult.error).formErrors
                        setValidationErrors(prev =>
                            prev.map(error => ({ ...error, passed: !zodErrorArray.includes(error.id)}))
                        );
                    } else {
                        setValidationErrors(prev =>
                            prev.map(error => ({...error, passed: true}))
                        );
                    }
                    }
                }
            />

            <div className="min-h-16">
                <AnimatePresence>
                    {hadInput && (
                        <motion.div
                            initial={{opacity: 0, y: -10}}
                            animate={{opacity: 1, y: 0}}
                        >
                            <UsernameInputValidation
                                validationErrors={validationErrors}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default UsernameInput;
