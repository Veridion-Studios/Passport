"use client";

import { useRouter } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';

export default function LogoutPage() {
  const router = useRouter();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    await signOut();
    router.push('/sign-in');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-blue-500 to-purple-600">
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Ready to leave?</h1>
        <p className="mb-6 text-gray-600">Click below to securely log out of your account.</p>
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold shadow hover:bg-purple-700 transition-all duration-200"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
