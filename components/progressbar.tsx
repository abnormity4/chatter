import { motion } from 'motion/react';

const ProgressBar = ({
  value,
  maxValue,
}: {
  value: number;
  maxValue: number;
}) => {
  return (
    <div className='w-full'>
      <div className='h-1.5 w-full bg-neutral-900 border border-neutral-800 rounded-md overflow-hidden'>
        <motion.div
          className='h-full rounded-md bg-blue-400'
          initial={{ width: 0 }}
          animate={{ width: `${(value / maxValue) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
