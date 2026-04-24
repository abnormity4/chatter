"use client"

import ChatWindowInput from './chat-window-input';
import ChatWindowMessage from './chat-window-message';
import ChatWindowTypingUsers from './chat-window-typingusers';
import ChatWindowDivider from './chat-window-divider';
import { createContext, useContext, useEffect, useRef } from 'react';

const ChatWindowContext = createContext(undefined);

export const useChatWindowContext = () => {
  const context = useContext(ChatWindowContext);
  if (!context) {
    throw new Error('useChatWindowContext must be used within a ChatWindowProvider');
  }
  return context;
}


const ChatWindow = () => {
  const wsRef = useRef<WebSocket>(new WebSocket('ws://localhost:8081'));

  useEffect(() => {
    const ws = wsRef.current;

  })
  
  return (
    <ChatWindowContext value={{ ws: wsRef.current }}>
    <div className='overflow-hidden h-screen grid grid-rows-[90%_10%] relative bg-slate-600 backdrop-blur-3xl w-1/2'>
      <div className='p-4 relative'>
        <ChatWindowMessage />
        <ChatWindowDivider />
        <ChatWindowMessage />
        <div className='h-8 w-1/2 absolute bottom-1 left-6'>
          <ChatWindowTypingUsers />
        </div>
      </div>

      <div className='px-6 bg-neutral-800/20 flex items-center border-t border-neutral-700'>
        <ChatWindowInput />
      </div>
    </div>
    </ChatWindowContext>
  );
};

export default ChatWindow;
