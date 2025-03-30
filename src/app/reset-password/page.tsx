"use client";

import { Suspense } from "react";
import ResetPasswordForm from "./resetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="max-w-md w-full p-10 bg-white/90 rounded-2xl shadow-lg">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-16 w-16 bg-indigo-200 rounded-full mb-4"></div>
              <div className="h-6 bg-indigo-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
