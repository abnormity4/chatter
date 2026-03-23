"use client"

import {useState} from "react";
import {UserNameValidationErrorsProp} from "@/lib/types";
import {USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH} from "@/lib/constants";
import ProgressBar from "@/components/progressbar";
import GridBackground from "@/components/grid-background";
import Image from "next/image";
import UsernameInput from "@/components/username-input";
import UserAvatarGrid from "@/components/useravatar-grid";
import {AnimatePresence, motion} from "framer-motion";
import RegistrationNextButton from "@/components/registration-next-button";

const SignUpPage = () => {
    const [username, setUsername] = useState("Your nickname");
    const [userAvatar, setUserAvatar] = useState("/useravatar-none.svg")
    const [validationErrors, setValidationErrors] = useState<UserNameValidationErrorsProp>([
        {id: "too_short", message: `Must be at least ${USERNAME_MIN_LENGTH} characters long`, passed: false},
        {id: "too_long", message: `Must be no more than ${USERNAME_MAX_LENGTH} characters long`, passed: false}
    ]);
    const hasNoErrors = validationErrors.every(err => err.passed);

    return (
        <>
                <div className="w-full mb-16 self-center md:w-1/2">
                    <h1 className="text-lg md:text-3xl md:font-light text-neutral-200 text-center mb-3 md:mb-6 leading-7 font-google-sans-flex select-none">Let’s get you started</h1>
                    <ProgressBar value={1} maxValue={2} />
                </div>

                <GridBackground className="flex items-center justify-center p-4 overflow-hidden ">

                    <div className="flex flex-col gap-3 items-center">
                        <div className="relative size-54 bg-red-100 border-3 border-neutral-800 rounded-full">
                            <Image src={userAvatar} alt="Empty user avatar" fill={true} className="rounded-full" />
                            <div className="size-8 bg-blue-400 border-2 border-neutral-800 rounded-full absolute bottom-3 right-5 z-10"></div>
                        </div>
                        <h2 className="[mask-image:radial-gradient(circle_at_center,black_75%,transparent_100%)] text-2xl text-center text-neutral-200 text-shadow-2xs min-h-8 w-full overflow-hidden select-none whitespace-nowrap">{username}</h2>

                        <div className="flex-1 w-full">
                            <UsernameInput
                                setUsername={setUsername}
                                validationErrors={validationErrors}
                                setValidationErrors={setValidationErrors}
                                hasNoErrors={hasNoErrors}
                            />
                        </div>

                    </div>
                </GridBackground>

                <UserAvatarGrid setUserAvatar={setUserAvatar} />

                <div className="w-full h-32 md:px-16">
                    <AnimatePresence>
                        {hasNoErrors && (
                            <motion.div
                                initial={{opacity: 0, y: -10}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: -10}}
                                className="flex items-center h-32"
                            >
                                <RegistrationNextButton />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
        </>
    )
}

export default SignUpPage;