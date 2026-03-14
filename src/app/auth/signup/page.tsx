"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github } from "lucide-react";
import { signUpSchema, type SignUpInput } from "@/lib/validation/auth";

export default function SignUpPage() {
  const router = useRouter(); //for navigation after successful signup

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
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof SignUpInput, string>>>({});

  // function to handle form submission for signup
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault(); // prevent default form submission behavior
    setLoading(true); // set loading state to true when signup process starts
    setError(""); // reset error state before user input validation
    setValidationErrors({}); // reset validation errors before user input validation

    // validate user input using signUpSchema from validation/auth.ts
    const parseResult = signUpSchema.safeParse(formData);

    // if validation fails, set validation errors and return early
    if (!parseResult.success){
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

      // Auto sign in after signup
      await signIn("credentials", {
        email: parseResult.data.email,
        password: parseResult.data.password,
        redirect: false,
      });

      router.push("/movies");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name as keyof SignUpInput;
    setFormData({ ...formData, [key]: e.target.value });
      // Clear validation error for the field being edited
      setValidationErrors((prev) => ({...prev, [key]: undefined }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-12 py-16">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg dark:bg-[#240046]">
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
            {validationErrors.name && <p className="mt-1 text-xs text-red-500">{validationErrors.name}</p>}
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
            {validationErrors.email && <p className="mt-1 text-xs text-red-500">{validationErrors.email}</p>}
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
            {validationErrors.password && <p className="mt-1 text-xs text-red-500">{validationErrors.password}</p>}
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
            {validationErrors.confirmPassword && <p className="mt-1 text-xs text-red-500">{validationErrors.confirmPassword}</p>}
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
  );
}
