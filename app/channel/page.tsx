import { redirect } from 'next/navigation';
import ChatWindow from '../../src/channel/components/chat-window/chat-window';
import getAuthenticatedUser from '@/src/shared/services/auth/get-authenticated-user.service';

const ChannelPage = async () => {
  let currentUser;

  try {
    const getUser = await getAuthenticatedUser();
    currentUser = getUser;
  } catch {
    redirect('/');
  }

  console.log(currentUser);

  return (
    <div>
      <ChatWindow currentUser={currentUser} />
    </div>
  );
};

export default ChannelPage;
