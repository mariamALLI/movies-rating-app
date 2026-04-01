import { VerifyEmailProps } from "@/lib/global-types";

export const VerificationEmail = ({
  verificationUrl,
  email,
}: VerifyEmailProps) => {
  return (
  <div className="max-w-[600px] m-[0 auto] font-sans p-6 rounded-lg shadow-md">
    <div className="bg-[#f5f5f5] p-[20px] rounded-sm dark:bg-gray-800">
      <h1 className="text-2xl font-bold mb-4 text-[#333] dark:text-gray-100">
        Verify Your Email Address
      </h1>
      <p className="text-[#666] text-sm mb-6 dark:text-gray-300">Hi {email},</p>
      <p className="text-[#666] text-sm mb-8 dark:text-gray-300">
        Thank you for signing up! Please verify your email address to complete
        your registration.
      </p>

      <div className="bg-[#e0e0e0] p-[10px] rounded-md text-center mb-8 dark:bg-gray-700">
        <a
          href={verificationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#007bff] hover:text-[#0056b3] decoration-none px-4 py-2 rounded-md inline-block font-medium bg-[#007bff] text-white hover:bg-[#0056b3] dark:bg-[#0056b3] dark:hover:bg-[#003d80]"
        >
          Verify Email
        </a>
      </div>

      <p className="text-[#999] text-sm mb-4 dark:text-gray-400">
        Or copy and paste this link:
      </p>
      <p className="text-[#007bff] text-xs break-all dark:text-gray-300">
        {verificationUrl}
      </p>

      <p className="text-[#999] text-xs mt-[30px] dark:text-gray-400">
        This link will expire in 24 hours. If you did not create an account, no
        further action is required.
      </p>
    </div>
  </div>
  )
};
