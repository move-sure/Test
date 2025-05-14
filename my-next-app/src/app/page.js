'use client';

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center">
      <div className="glass-container p-8 rounded-xl text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-6">Welcome to Transport Bilty System</h1>
        <p className="text-blue-700 mb-8">Manage your transport documentation efficiently and securely.</p>
        <button
          onClick={handleRedirect}
          className="px-8 py-4 bg-blue-800 text-white rounded-lg font-semibold hover:bg-blue-700 transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg"
        >
          Go to Bilty Dashboard
        </button>
      </div>
    </div>
  );
}