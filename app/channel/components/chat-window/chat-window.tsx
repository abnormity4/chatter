"use client"

import ChatWindowCurrentUser from './chat-window-current-user';
import ChatWindowInput from './chat-window-input';
import { createContext, useContext, useRef } from 'react';
import { useState } from 'react';
import ChatWindowMessage from './chat-window-message';

type ChatWindowContextType = {
  ws: WebSocket;
  currentUser: {
    id: string;
    displayName: string;
    avatarUrl: string;
  }
}

const ChatWindowContext = createContext<ChatWindowContextType | undefined>(undefined);

export const useChatWindowContext = () => {
  const context = useContext(ChatWindowContext);
  if (!context) {
    throw new Error('useChatWindowContext must be used within a ChatWindowProvider');
  }
  return context;
}


const ChatWindow = ({ currentUser }: { currentUser: {
    id: string;
    displayName: string;
    avatarUrl: string;
}}) => {
  const wsRef = useRef<WebSocket>(new WebSocket('ws://localhost:8081'));
  const [messages, setMessages] = useState<{
    senderId: string;
    messageContent: string;
    createdAt: string
  }[]>([]);

  wsRef.current.onmessage = (eventData) => {
    const data = JSON.parse(eventData.data)
    console.log(data)
    setMessages(prev => [...prev, {
      senderId: data.data.message.senderId,
      messageContent: data.data.message.messageContent,
      createdAt: data.data.message.createdAt
    }])
  }
  
  return (
    <ChatWindowContext value={{ ws: wsRef.current, currentUser }}>
    <div className='overflow-hidden h-screen grid grid-rows-[90%_10%] relative bg-slate-600 backdrop-blur-3xl w-1/2'>
      <div className='p-4 relative'>
          {messages.map((msg) => (
            <ChatWindowMessage
              key={msg.messageContent}
              username={msg.senderId}
              messageContent={msg.messageContent}
              msgDate={msg.createdAt}
            />
          ))}
        <div className='h-8 w-1/2 absolute bottom-1 left-6'>

        </div>
        <ChatWindowCurrentUser />
      </div>
      
      <div className='px-6 bg-neutral-800/20 flex items-center border-t border-neutral-700'>
        <ChatWindowInput />

      </div>
    </div>
    </ChatWindowContext>
  );
};

export default ChatWindow;
