import { readdir } from 'fs/promises';
import path from 'path';
import SignupPage from '@/app/(auth)/signup/signup-page';

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

const SignupContainer = async () => {
  const avatarUrls = await getAvatars();

  return <SignupPage avatarUrls={avatarUrls} />;
};

export default SignupContainer;
