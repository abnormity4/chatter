import ChatWindow from '../../src/channel/components/chat-window/chat-window';
import prisma from '@/lib/prisma';
import {redirect, RedirectType} from 'next/navigation'
import { USERAVATAR_DEFAULT_URL } from '@/src/onboarding/components/onboarding';
import { headers } from "next/headers";
import OnboardingPage from './(onboarding)/page';

const ChannelPage = async () => {

  const headerList = await headers();
  const userId = headerList.get('x-user-id')

    if (!userId) redirect('/', RedirectType.replace)

  const user = await prisma.user.findUnique({
      where: { id: userId},
      select: {
           displayName: true,
           avatar: true,
           isOnboarded: true
      }
   })
   //TODO: type properly 

    if (!user) {
        redirect('/', RedirectType.replace)
    }

    const currentUser = {
        ...user,
        avatar: user.avatar || USERAVATAR_DEFAULT_URL
    }


  if (!currentUser.isOnboarded) {
    return (
      <div className='backdrop-blur-3xl flex min-h-screen items-center justify-center font-sans landing-gradient'>
          <OnboardingPage currentUser={currentUser} />
      </div>

    )
  }

  return (
    <div>
      <ChatWindow currentUser={currentUser} />
    </div>
  );
};

export default ChannelPage;
