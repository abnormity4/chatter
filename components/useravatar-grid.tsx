import Image from "next/image";
import {Dispatch, SetStateAction} from "react";

const AVATARS = [
    "useravatar-01",
    "useravatar-02",
    "useravatar-03",
    "useravatar-04",
    "useravatar-05",
    "useravatar-06",
    "useravatar-07",
    "useravatar-08",
    "useravatar-09",
    "useravatar-10",
    "useravatar-11",
    "useravatar-12",
    "useravatar-13",
    "useravatar-14",
    "useravatar-15",
    "useravatar-16",
    "useravatar-17",
    "useravatar-18",
    "useravatar-19",
    "useravatar-20",
    "useravatar-21",
    "useravatar-22",
    "useravatar-23"
]

const UserAvatarGrid = ({setUserAvatar}: {setUserAvatar: Dispatch<SetStateAction<string>>}) => {
    return (
        <div className="grid grid-cols-4 gap-4 p-4 self-center">
            {AVATARS.map((avatar) => (
                    <div
                        key={avatar}
                        onClick={() => setUserAvatar(`/${avatar}.webp`)}
                        className="relative size-18 rounded-full overflow-hidden cursor-pointer">
                        <Image src={`/${avatar}.webp`} alt="Empty user avatar" fill={true} />
                    </div>

            ))}
        </div>
    )
}

export default UserAvatarGrid;