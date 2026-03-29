import {useState} from "react";
import {Eye} from "lucide-react";
import Button from "@/components/button";

const SignupWindow = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="rounded-md p-4 bg-black divide-neutral-900">
            <h1 className="font-google-sans-flex text-xl text-center">Create account</h1>

            <label htmlFor="registration-username-field">
                Login <span className="text-red-500">*</span>
                <input
                    id="registration-username-field"
                    type="text"
                    name="registration-username-field"
                    className={`bg-neutral-950 border-neutral-900 focus:border-neutral-800 px-3 mb-4 border 
                    h-9 w-full rounded-lg text-sm font-light transition-colors outline-0`}
                />
            </label>

            <label htmlFor="registration-username-field">
                Password <span className="text-red-500">*</span>
                <div className="relative">
                    <input
                        id="registration-username-password"
                        type={showPassword ? "text" : "password"}
                        name="registration-username-password"
                        className={`bg-neutral-950 border-neutral-900 focus:border-neutral-800 px-3 mb-4 
                        border h-9 w-full rounded-lg text-sm font-light transition-colors outline-0`}

                    />
                    <Eye onClick={() => setShowPassword(prev => !prev)} className="absolute top-2 right-2
                    stroke-neutral-400 size-5" />
                </div>
            </label>

            <Button>
                Create account
            </Button>

        </div>
    )
}

export default SignupWindow;