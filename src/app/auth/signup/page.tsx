"use client";

import { useState } from "react";
// import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github } from "lucide-react";
import LandingNavbar from "@/components/landing/landing-navbar";
import { signUpSchema, type SignUpInput } from "@/lib/validation/auth";

type SignupStep = "form" | "verification";

export default function SignUpPage() {
  // const router = useRouter(); //for navigation after successful signup

  // form state for collection of user data during signup
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // state for handling loading and error during signup process
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof SignUpInput, string>>
  >({});
  // Just added states for managing signup steps and storing email for verification step
  const [step, setStep] = useState<SignupStep>("form"); // state to manage signup steps
  const [registrationEmail, setRegistrationEmail] = useState(""); // state to store email for verification step
  const [resendLoading, setResendLoading] = useState(false); // state to manage loading state for resend verification email

  // function to handle form submission for signup
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault(); // prevent default form submission behavior
    setLoading(true); // set loading state to true when signup process starts
    setError(""); // reset error state before user input validation
    setValidationErrors({}); // reset validation errors before user input validation

    // validate user input using signUpSchema from validation/auth.ts
    const parseResult = signUpSchema.safeParse(formData);

    // if validation fails, set validation errors and return early
    if (!parseResult.success) {
      const f = parseResult.error.flatten().fieldErrors;
      setValidationErrors({
        name: f.name?.[0],
        email: f.email?.[0],
        password: f.password?.[0],
        confirmPassword: f.confirmPassword?.[0],
      });
      setError("Please fix the validation errors");
      setLoading(false);
      return;
    }

    // make API call to signup endpoint with user data
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: parseResult.data.name,
          email: parseResult.data.email,
          password: parseResult.data.password,
        }),
      });

      // this checks if the response from the server is not ok
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      // If signup is successful, store the email for verification step and move to the next step
      setRegistrationEmail(parseResult.data.email);
      setStep("verification");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // function to handle resending of verification email
  const handleResendVerification = async () => {
    setResendLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registrationEmail }),
      });

      // check if response is not ok and throw error
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to resend email");
      }
      setError(
        "Verification email resent successfully. Please check your inbox.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setResendLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name as keyof SignUpInput;
    setFormData({ ...formData, [key]: e.target.value });
    // Clear validation error for the field being edited
    setValidationErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  if (step === "verification") {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black">
        <LandingNavbar />
        <div className="flex-1 flex items-center justify-center px-12 py-16 pt-24">
          <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg dark:bg-amber-600/20">
            <div className="text-center">
              <h2 className="text-3xl font-bold">Check Your Email</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                We sent a verification link to:
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100 mt-1">
                {registrationEmail}
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Click the link in the email to verify your account. The link
                expires in 24 hours.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleResendVerification}
                disabled={resendLoading}
                className="w-full px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendLoading
                  ? "Sending..."
                  : "Didn't receive the email? Resend"}
              </button>

              <button
                onClick={() => setStep("form")}
                className="w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              >
                Back to signup
              </button>
            </div>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              After verifying, you can{" "}
              <Link
                href="/auth/signin"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black">
      <LandingNavbar />
      <div className="flex-1 flex items-center justify-center px-12 py-16 pt-24">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg dark:bg-amber-600/20">
          <div>
            <h2 className="text-3xl font-bold text-center">Create Account</h2>
            <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
              Start rating your favorite movies
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded text-sm">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-2"
              />
              {validationErrors.name && (
                <p className="mt-1 text-xs text-red-500">
                  {validationErrors.name}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-2"
              />
              {validationErrors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-2"
              />
              {validationErrors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {validationErrors.password}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="mt-2"
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => signIn("google", { callbackUrl: "/movies" })}
            >
              Google
            </Button>

            <Button
              variant="outline"
              onClick={() => signIn("github", { callbackUrl: "/movies" })}
            >
              <Github className="w-5 h-5 mr-2" />
              GitHub
            </Button>
          </div>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
