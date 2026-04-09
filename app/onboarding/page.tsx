import { readdir } from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';
import OnboardingClient from '@/app/onboarding/onboarding-client';
import { redirect } from 'next/navigation';
import redis from '@/lib/redis';

const validImageExtensions = ['.webp', '.jpg', '.svg', '.png'];

const getAvatars = async () => {
  const avatarsPath = path.join(process.cwd(), 'public/avatars');
  let files;
  try {
    files = await readdir(avatarsPath);
  } catch (e) {
    throw new Error(`Failed to read avatars folder: ${e}`);
  }
  for (const fileName of files) {
    const filePath = path.join(avatarsPath, fileName);
    const extName = path.extname(filePath);

    if (!validImageExtensions.includes(extName)) {
      throw new Error(
        `Found a file with an unsupported type in folder: ${avatarsPath}. 
                        Allowed types: ${validImageExtensions.join(' | ')}. 
                        Invalid file type: ${extName}`,
      );
    }
  }

  return files;
};

const OnboardingContainer = async () => {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session');
  console.log(sessionToken);

  if (!sessionToken) {
    redirect('/');
  }

  const userId = await redis.hGet(`session:${sessionToken.value}`, 'userId');

  if (!userId) {
    redirect('/');
  }

  const avatarUrls = await getAvatars();

  return <OnboardingClient avatarUrls={avatarUrls} />;
};

export default OnboardingContainer;
