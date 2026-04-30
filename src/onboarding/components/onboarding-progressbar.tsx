import { motion } from 'motion/react';

const OnboardingProgressBar = ({
  value,
  maxValue,
  color,
  bgColor,
}: {
  value: number;
  maxValue: number;
  color: string;
  bgColor: string;
}) => {
  return (
    <div className='w-full'>
      <div className={`h-1.5 w-full ${bgColor} overflow-hidden`}>
        <motion.div
          className={`h-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${(value / maxValue) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};

export default OnboardingProgressBar;
