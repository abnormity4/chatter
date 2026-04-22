import Image from 'next/image';

const UserAvatar = () => {
  return (
    <div className='flex flex-col gap-3 items-center overflow-hidden shrink-0'>
      <div className='relative group'>
        <div className='bg-neutral-800 size-10 relative rounded-full overflow-hidden'>
          <Image
            src={'/avatars/useravatar-01.webp'}
            sizes='(max-width: 768px) 60vw, 20vw'
            alt='User selected avatar'
            fill
            loading='eager'
          />
        </div>

        {/* <div className='size-4 bg-seagreen-400 border-3 border-neutral-800 rounded-full absolute bottom-2 right-5 z-10' />  //TODO: uncomment later*/}
      </div>
    </div>
  );
};

export default UserAvatar;
