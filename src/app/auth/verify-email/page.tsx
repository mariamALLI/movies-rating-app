"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`);

        if (!res.ok) {
          const data = await res.json();
          setStatus("error");
          setMessage(data.error || "Verification failed");
          return;
        }

        setStatus("success");
        setMessage("Email verified successfully!");
        setTimeout(() => router.push("/auth/signin"), 3000);
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    verifyEmail();
  }, [token, router]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-12 py-16">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg dark:bg-[#240046]">
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Verification Failed</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Verification token is missing
            </p>
          </div>
          <div className="space-y-3">
            <Button
              onClick={() => router.push("/auth/signup")}
              className="w-full"
            >
              Back to Sign Up
            </Button>
            <Link
              href="/auth/signin"
              className="block text-center text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              Go to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-12 py-16">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg dark:bg-[#240046]">
        {status === "loading" && (
          <>
            <div className="text-center">
              <h2 className="text-2xl font-bold">Verifying Email...</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Please wait while we verify your email address.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold">Success!</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{message}</p>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Redirecting to sign in page...
              </p>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold">Verification Failed</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{message}</p>
            </div>
            <div className="space-y-3">
              <Button
                onClick={() => router.push("/auth/signup")}
                className="w-full"
              >
                Back to Sign Up
              </Button>
              <Link
                href="/auth/signin"
                className="block text-center text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                Go to Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
