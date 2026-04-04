import { X } from 'lucide-react';
import { ComponentProps } from 'react';

const OverlayCloseButton = ({
  onClick,
  className,
  iconSize,
}: { iconSize: string } & ComponentProps<'div'>) => {
  return (
    <div
      onClick={onClick}
      className={`opacity-0 group-hover:opacity-100 transition-opacity p-px
                                rounded-full absolute bg-red-500 flex items-center justify-center
                                cursor-pointer ${className}`}>
      <X className={`${iconSize} stroke-red-200`} />
    </div>
  );
};
export default OverlayCloseButton;
