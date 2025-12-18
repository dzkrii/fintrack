import LoginForm from '@/components/auth/login-form';
import { Wallet } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex w-full items-end rounded-lg bg-zinc-900 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <div className="flex flex-row items-center leading-none text-white">
              <Wallet className="h-12 w-12 rotate-[15deg]" />
              <p className="text-[44px]">Fintrack</p>
            </div>
          </div>
        </div>
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8 border">
            <h1 className="mb-3 text-2xl font-bold">
            Please log in to continue.
            </h1>
            <div className="w-full">
                <LoginForm />
            </div>
        </div>
      </div>
    </main>
  );
}
