'use client';
import { Plus } from 'lucide-react';
import { useChatWindowContext } from './chat-window';
import useKeyboard from '@/src/shared/hooks/useKeyboard';
import { useState } from 'react';

const ChatWindowInput = () => {
  const { ws, currentUser } = useChatWindowContext();

  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (message.trim() === '') return;

    ws.send(
      JSON.stringify({
        event: 'message',
        userId: currentUser.id,
        content: message,
      }),
    );
    setMessage('');
  };

  useKeyboard(['Enter'], sendMessage);

  return (
    <div className='flex w-full gap-2'>
      <div className='bg-neutral-950/15 min-h-14 h-auto rounded-2xl overflow-hidden flex w-max-full w-full items-center px-3'>
        <div className='flex items-center'>
          <Plus className='size-7 shrink-0  stroke-neutral-400 hover:stroke-seagreen-200 transition-colors cursor-pointer' />
        </div>
        <div className='max-w-full flex items-center justify-center flex-1 min-w-0'>
          <input
            spellCheck={false}
            value={message}
            className='flex-1 h-7 pl-4 pt-0.5 resize-none focus:outline-none'
            placeholder='Message in #general'
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatWindowInput;
