'use client';
import IsTypingAnimation from '@/components/icons/IsTypingAnimation';

const ChatWindowTypingUsers = () => {
  return (
    <div className='flex size-full justify-center items-center text-sm '>
      <div className='size-8 grow-0'>
        <IsTypingAnimation />
      </div>
      <span className='ml-2 grow'>Username is typing...</span>
    </div>
  );
};

export default ChatWindowTypingUsers;
