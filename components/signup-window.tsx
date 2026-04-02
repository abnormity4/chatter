import {ChangeEvent, useRef, useState} from "react";
import {Eye} from "lucide-react";
import Button from "@/components/button";
import {createUser, checkEmailAvailability} from "@/app/(auth)/signup/actions";
import {emailSchema, passwordSchema} from "@/lib/zodschemas";
import { z } from 'zod'
import FormField from "@/components/form-field";
import { FormFieldStatusCode } from "@/lib/types";
import { debounce } from "@/lib/utils";

type FormField = {
    status: FormFieldStatusCode;
    message: string | null;
}

const SignupWindow = () => {
    
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [emailForm, _setEmailForm] = useState<FormField>({
        status: "neutral",
        message: null
    });
    const setEmailForm = (
        status: FormField["status"],
        message: FormField["message"]
    ) => {
        _setEmailForm({ status, message });
    }

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordForm, _setPasswordForm] = useState<FormField>({
        status: "neutral",
        message: null
    });
    const setPasswordForm = (
        status: FormField["status"],
        message: FormField["message"]
    ) => {
        _setPasswordForm({ status, message });
    }

    const debouncedValidation = useRef(debounce(async (value: string) => {
            const emailValidation = emailSchema.safeParse(value);
            if (!emailValidation.success) {
                setEmailForm("error", "Please enter a valid email address.");
            } else {
                setEmailForm("loading", null);
                const user = await checkEmailAvailability(value);
                if (!!user) {
                    setEmailForm("error", "An account with this email already exists.");
                } else {
                    setEmailForm("success", null);
                    setForm(prev => ({...prev, email: value}));
                }
            }
    }, 500))

    const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
        setEmailForm("neutral", null);
        debouncedValidation.current(e.target.value);
    }

    const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
        const passwordValidation = passwordSchema.safeParse(e.target.value);
        if (!passwordValidation.success) {
            const flattened = z.flattenError(passwordValidation.error);
            setPasswordForm("error", flattened.formErrors.toString())
        } else {
            setPasswordForm("success", null);
            setForm(prev => ({...prev, password: e.target.value}));
        }
    }

    return (
        <div className="rounded-md p-4 bg-black divide-neutral-900 flex flex-col gap-8">
            <h1 className="font-google-sans-flex text-xl text-center">Create account</h1>

            <div>
                <FormField status={emailForm.status}>
                    <FormField.Label>Email</FormField.Label>
                    <FormField.Input
                        type="email"
                        placeholder="mail@example.com"
                        onChange={(e) => {
                            handleEmail(e);
                        }}
                    >
                        <FormField.Loader />
                    </FormField.Input>
                    <FormField.Message>{emailForm.message}</FormField.Message>
                </FormField>

                <FormField status={passwordForm.status}>
                    <FormField.Label>Password</FormField.Label>
                    <FormField.Input
                        type={passwordVisible ? "text" : "password"}
                        onChange={(e) => {
                            handlePassword(e);
                        }}
                    >
                        <FormField.Icons>
                            <Eye 
                                onClick={() => setPasswordVisible(prev => !prev)}
                                className="size-5 stroke-neutral-500 hover:stroke-neutral-300 cursor-pointer transition-colors"
                            />
                        </FormField.Icons>
                    </FormField.Input>
                </FormField>
            </div>

            <Button onClick={() => createUser(form)}>
                Create account
            </Button>
        </div>
    )
}

export default SignupWindow;