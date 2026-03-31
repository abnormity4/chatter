import {ComponentProps} from "react";

const Button = ({onClick, disabled, children}: ComponentProps<"button">) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="w-full bg-blue-500 hover:bg-blue-600 transition-colors text-white h-9 rounded-md">
            {children}
        </button>
    )
}

export default Button;