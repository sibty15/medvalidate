import { Suspense } from "react";
import LoginPage from "./LoginPage";
// ...existing code...

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<Fallback />}>
      <LoginPage />
    </Suspense>
  );
}

const Fallback = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="animate-pulse flex flex-col items-center space-y-4">
        <div className="w-64 h-10 bg-gray-300 rounded-md"></div>
        <div className="w-80 h-6 bg-gray-300 rounded-md"></div>
        <div className="w-80 h-6 bg-gray-300 rounded-md"></div>
        <div className="w-80 h-6 bg-gray-300 rounded-md"></div>
        <div className="w-32 h-10 bg-gray-300 rounded-md mt-6"></div>
      </div>
    </div>

  );
}

