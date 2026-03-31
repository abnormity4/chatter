import {useState} from "react";
import {Eye} from "lucide-react";
import Button from "@/components/button";
import {createUser, getUserByEmail} from "@/app/(auth)/signup/actions";
import {emailSchema, passwordSchema} from "@/lib/zodschemas";
import { z } from 'zod'

const SignupWindow = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [userAlreadyExists, setUserAlreadyExists] = useState(false);
    const [passwordHasErrors, setPasswordHasErrors] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    return (
        <div className="rounded-md p-4 bg-black divide-neutral-900 flex flex-col gap-8">
            <h1 className="font-google-sans-flex text-xl text-center">Create account</h1>

            <div>
                <label htmlFor="email">
                    <span>Email</span>
                    <input
                        id="email"
                        type="text"
                        placeholder="mail@example.com"
                        onChange={async (e) => {
                            const validationResult = emailSchema.safeParse(e.target.value);

                            if (!validationResult.success) {
                                setForm({...form, email: ""})
                            } else {
                                const user = await getUserByEmail(validationResult.data);
                                if (user) {
                                    setUserAlreadyExists(true);
                                } else {
                                    setUserAlreadyExists(false);
                                    }
                                setForm({...form, email: validationResult.data})
                            }
                        }}
                        className={`
                        ${userAlreadyExists ? "border-red-500" : "bg-neutral-950 border-neutral-900 focus:border-neutral-800"} 
                        px-3 border 
                        h-9 w-full rounded-lg text-sm font-light transition-colors outline-0`}
                    />
                    {userAlreadyExists && <p className="text-red-500 text-sm">A user with this email already exists.</p>}
                </label>

                <label htmlFor="password">
                    Password
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            onChange={(e) => {
                                const validationResult = passwordSchema.safeParse(e.target.value);

                                if (!validationResult.success) {
                                    const flattened = z.flattenError(validationResult.error);
                                    setPasswordHasErrors(true);
                                    setPasswordError(flattened.formErrors.toString())
                                } else {
                                    setPasswordHasErrors(false);
                                }

                                setForm({...form, password: e.target.value});
                            }}
                            className={`
                        ${passwordHasErrors ? "border-red-500" : "bg-neutral-950 border-neutral-900 focus:border-neutral-800"} 
                        px-3 border 
                        h-9 w-full rounded-lg text-sm font-light transition-colors outline-0`}

                        />
                        <Eye onClick={() => setShowPassword(prev => !prev)} className="absolute top-2 right-2
                        stroke-neutral-400 size-5" />
                        {passwordHasErrors && <p className="text-red-500 text-sm">{passwordError}</p>}
                    </div>
                </label>
            </div>

            <Button onClick={() => createUser(form)}>
                Create account
            </Button>

        </div>
    )
}

export default SignupWindow;