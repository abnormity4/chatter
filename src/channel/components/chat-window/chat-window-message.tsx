'use client';
import UserAvatar from '../user-avatar';
import { motion } from 'motion/react';

const ChatWindowMessage = ({ username, msgDate, messageContent }) => {
  const date = new Date(msgDate);
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='flex gap-4'>
      <div className='pt-2'>
        <UserAvatar />
      </div>
      <div>
        <h3 className='font-semibold inline'>{username}</h3>
        <span className='pl-1 text-neutral-500 text-xs'>
          {date.getHours() + ':' + date.getMinutes()}
        </span>
        <div className='leading-6 mb-2'>
          <span>{messageContent}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatWindowMessage;
