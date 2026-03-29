import {ComponentProps} from "react";

const Button = ({onClick, children}: ComponentProps<"button">) => {
    return (
        <button
            onClick={onClick}
            className="w-full bg-blue-500 hover:bg-blue-600 transition-colors text-white h-9 rounded-md">
            {children}
        </button>
    )
}

export default Button;