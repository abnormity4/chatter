import { cookies } from 'next/headers';

export const setCookie = async (cookieName: string, cookieValue: string, cookieAge: number): Promise<void> => {
	const cookieStore = await cookies();

	cookieStore.set({
		name: cookieName,
		value: cookieValue,
		secure: process.env.NODE_ENV === 'production',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: cookieAge,
	});
};

export const getCookie = async (cookieName: string): Promise<string | undefined> => {
	const cookieStore = await cookies();
	const sessionToken = cookieStore.get(cookieName);

	return sessionToken?.value;
};
