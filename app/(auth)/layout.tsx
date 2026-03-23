const AuthLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-quicksand dark:bg-black grid-bg">
            <main className="md:border-l border-r border-neutral-900 relative flex min-h-screen w-full max-w-3xl flex-col items-center justify-between p-16 bg-white dark:bg-black sm:items-start">
                {children}
            </main>
        </div>
    );
}

export default AuthLayout;