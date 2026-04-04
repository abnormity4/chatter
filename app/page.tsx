import AuthSignupForm from './components/auth-signup-form';

const Landing = () => {
  return (
    <main className='grid grid-cols-[60%_25%_15%] min-w-1/2 min-h-screen font-instrument-sans landing-gradient backdrop-blur-3xl'>
      <div className='w-full flex flex-col items-start justify-center p-64 z-100'>
        <h1 className='text-6xl font-bold text-blue-50'>Chatter</h1>
        <p className='text-md font-extralight text-blue-50'>
          Simple chat app made with Next.js and TypeScript
        </p>
      </div>

      <div className='flex bg-gray-800/50'>
        <div className='flex-1 flex justify-center items-center w-full'>
          <AuthSignupForm />
        </div>
      </div>
    </main>
  );
};

export default Landing;
