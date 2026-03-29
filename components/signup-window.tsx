import {useState} from "react";
import {Eye} from "lucide-react";
import Button from "@/components/button";
import {createUser} from "@/app/(auth)/signup/actions";

const SignupWindow = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    return (
        <div className="rounded-md p-4 bg-black divide-neutral-900">
            <h1 className="font-google-sans-flex text-xl text-center">Create account</h1>

            <label htmlFor="username">
                Login <span className="text-red-500">*</span>
                <input
                    id="username"
                    type="text"
                    onChange={(e) => {
                        setForm({...form, username: e.target.value});
                    }}
                    className={`bg-neutral-950 border-neutral-900 focus:border-neutral-800 px-3 mb-4 border 
                    h-9 w-full rounded-lg text-sm font-light transition-colors outline-0`}
                />
            </label>

            <label htmlFor="password">
                Password <span className="text-red-500">*</span>
                <div className="relative">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        onChange={(e) => {
                            setForm({...form, password: e.target.value});
                        }}
                        className={`bg-neutral-950 border-neutral-900 focus:border-neutral-800 px-3 mb-4 
                        border h-9 w-full rounded-lg text-sm font-light transition-colors outline-0`}

                    />
                    <Eye onClick={() => setShowPassword(prev => !prev)} className="absolute top-2 right-2
                    stroke-neutral-400 size-5" />
                </div>
            </label>

            <Button onClick={() => createUser(form)}>
                Create account
            </Button>

        </div>
    )
}

export default SignupWindow;