import {UserNameValidationErrorsProp} from "@/lib/types";
import {Check} from "lucide-react";

const UsernameInputValidation = ({validationErrors}: {validationErrors: UserNameValidationErrorsProp}) => {
    return (
        <div className="p-2">
            <ul className="space-y-1">
                {validationErrors.map(err => (
                    <li
                        key={err.id}
                        className={`pl-5 relative text-[12px] leading-3 transition-colors ${!err.passed ? "text-neutral-600" : "text-neutral-200"} select-none`}
                    >
                        {err.passed && <Check className="absolute left-1 size-3" />}
                        {err.message}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default UsernameInputValidation;