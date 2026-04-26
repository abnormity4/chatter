import UserAvatar from "../user-avatar";
import { useChatWindowContext } from "./chat-window";

const ChatWindowCurrentUser = () => {
    const { currentUser } = useChatWindowContext();
    return (
        <div className="bg-neutral-950/15 w-1/3 rounded-md flex items-center gap-2 p-2">
            <UserAvatar avatar={currentUser.avatar} />
            <div className="leading-none">
                <p className="font-semibold">{currentUser.displayName}</p>
                <p className="text-xs text-neutral-300">Online</p>
            </div>
        </div>
    )
}

export default ChatWindowCurrentUser;


