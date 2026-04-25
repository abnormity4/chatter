import { redirect } from 'next/navigation';
import ChatWindow from './components/chat-window/chat-window';
import getCurrentUser from '@/lib/auth/getCurrentUser';

const ChannelPage = async () => {
  let currentUser;

  try {
    const getUser = await getCurrentUser();
    currentUser = getUser;
  } catch {
    redirect('/')
  }

  console.log(currentUser)

  return (
    <div>
      <ChatWindow currentUser={currentUser} />
    </div>
  );
};

export default ChannelPage;
