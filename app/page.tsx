import AuthSignupForm from './components/auth-form';

const Landing = () => {
  return (
    <main className='grid grid-cols-[60%_40%] min-w-1/2 min-h-screen landing-gradient backdrop-blur-3xl'>
      <div className='w-full flex flex-col items-start justify-center p-64 z-100'>
        <h1 className='text-[112px] tracking-tighter leading-none font-bold text-blue-50'>
          Chatter
        </h1>
        <p className='text-lg pl-3 text-blue-50'>
          Simple chat app made with Next.js and TypeScript
        </p>
      </div>

      <div className='flex justify-center items-center'>
        <AuthSignupForm />
      </div>
    </main>
  );
};

export default Landing;
