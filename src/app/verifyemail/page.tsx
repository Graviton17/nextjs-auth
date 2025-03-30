"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Get the token from URL only once when component mounts
    const verifyEmail = async () => {
      try {
        // Extract token from URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (!token) {
          setVerificationStatus("error");
          const errorMsg =
            "Verification token is missing. Please check your email link.";
          setMessage(errorMsg);
          toast.error(errorMsg);
          return;
        }

        // Send verification request
        const response = await axios.post("/api/users/verifyemail", { token });

        if (response.data.success) {
          setVerificationStatus("success");
          const successMsg =
            response.data.message ||
            "Your email has been successfully verified!";
          setMessage(successMsg);
          toast.success(successMsg);
        } else {
          setVerificationStatus("error");
          const errorMsg =
            response.data.error || "Failed to verify email. Please try again.";
          setMessage(errorMsg);
          toast.error(errorMsg);
        }
      } catch (error: any) {
        setVerificationStatus("error");
        const errorMsg =
          error.response?.data?.error ||
          "An error occurred during verification. Please try again.";
        setMessage(errorMsg);
        toast.error(errorMsg);
      }
    };

    verifyEmail();
  }, []); // Empty dependency array = run once on mount

  // Add toast when navigating
  const handleLoginNavigation = () => {
    toast.success("Redirecting to login page");
    router.push("/login");
  };

  const handleResendNavigation = () => {
    toast.success("Redirecting to verification email resend page");
    router.push("/resend-verification");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/90 backdrop-blur-sm p-10 rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.2)] border border-indigo-50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4">
            {verificationStatus === "loading" && (
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            )}
            {verificationStatus === "success" && (
              <div className="bg-green-100 h-16 w-16 rounded-full flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
            {verificationStatus === "error" && (
              <div className="bg-red-100 h-16 w-16 rounded-full flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}
          </div>
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight">
            {verificationStatus === "loading" && "Verifying Email"}
            {verificationStatus === "success" && "Email Verified!"}
            {verificationStatus === "error" && "Verification Failed"}
          </h1>
          <p className="mt-2 text-sm text-gray-600">{message}</p>
        </div>

        <div className="mt-6">
          {verificationStatus === "success" && (
            <button
              onClick={handleLoginNavigation}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Continue to Login
            </button>
          )}

          {verificationStatus === "error" && (
            <div className="space-y-3">
              <Link
                href="/login"
                onClick={() => toast.success("Redirecting to login page")}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Login
              </Link>

              <button
                onClick={handleResendNavigation}
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Resend Verification Email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
