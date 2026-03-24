import Image from "next/image";
import {Dispatch, SetStateAction} from "react";

const UserAvatarGrid = ({setUserAvatar, avatarUrls}: {setUserAvatar: Dispatch<SetStateAction<string>>, avatarUrls: string[]}) => {
    return (
        <div className="grid grid-cols-4 gap-4 p-4 self-center">
            {avatarUrls.map((a) => (
                    <div
                        key={a}
                        onClick={() => setUserAvatar(`/avatars/${a}`)}
                        className="relative md:size-18 size-14 rounded-full overflow-hidden cursor-pointer">
                        <Image
                            src={`/avatars/${a}`}
                            alt="User avatar" fill={true}
                            loading="eager"
                            sizes="(max-width: 768px) 25vw, 10vw"
                        />
                    </div>

            ))}
        </div>
    )
}

export default UserAvatarGrid;