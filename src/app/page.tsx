import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LandingPage from "@/components/landing/landing-page";

export default async function Home() {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);

  // If user is authenticated, redirect to movies page
  if (session?.user) {
    redirect("/movies");
  }

  // Otherwise, show landing page
  return <LandingPage />;
}
