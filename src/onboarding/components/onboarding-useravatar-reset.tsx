import { X } from 'lucide-react';
import { ComponentProps } from 'react';

const OverlayUserAvatarReset = ({
  onClick,
  className,
  iconSize,
}: { iconSize: string } & ComponentProps<'div'>) => {
  return (
    <div
      onClick={onClick}
      className={`opacity-0 group-hover:opacity-100 transition-opacity p-px
                                rounded-full absolute bg-seared-600 flex items-center justify-center
                                cursor-pointer ${className}`}>
      <X className={`${iconSize} stroke-seared-200`} />
    </div>
  );
};
export default OverlayUserAvatarReset;
