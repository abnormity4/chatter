'use client';
import UserAvatar from '../user-avatar';
import { motion } from 'motion/react';

const ChatWindowMessage = () => {
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
        <h3 className='font-semibold inline'>Username</h3>
        <span className='pl-1 text-neutral-500 text-xs'>13:44</span>
        <div className='leading-6 mb-2'>
          <span>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates,
            porro. Officia maxime quaerat, pariatur, commodi beatae architecto
            voluptates placeat dolorem vel ut molestias maiores impedit
            voluptatibus praesentium eligendi totam voluptatum! Optio, corrupti.
            Omnis vero amet placeat accusamus rerum soluta eligendi doloribus
            commodi beatae modi ut dolorem, sapiente, earum voluptatem debitis
            culpa illum, quam ea qui! Veritatis aperiam nemo esse sint?
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatWindowMessage;
