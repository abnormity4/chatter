import Onboarding from '@/src/onboarding/components/onboarding';
import { readdir } from 'fs/promises';
import path from 'path';

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

const OnboardingPage = async ({currentUser}) => {

  const avatarUrls = await getAvatars();

  return <Onboarding avatarUrls={avatarUrls} currentUser={currentUser} />;
};

export default OnboardingPage;
