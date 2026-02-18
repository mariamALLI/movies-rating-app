import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions); // initialize NextAuth with authOptions
export { handler as GET, handler as POST }; // export the handler for both GET and POST requests
