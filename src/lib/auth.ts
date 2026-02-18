import { NextAuthOptions} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import  prisma  from "@/lib/prisma";
import bcrypt from "bcryptjs";
// import type {Adapter} from "next-auth/adapters";


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma), // use PrismaAdapter to connect NextAuth with Prisma and the database for storing user data and session data
  providers: [
    // use GoogleProvider and GitHubProvider for OAuth authentication with Google and GitHub, and use CredentialsProvider for email/password authentication
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        } // check if user exists in database with the email provided in credentials

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // if user does not exist or user does not have a password (i.e. user signed up with Google or GitHub) throw error
        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        // compare the password provided in credentials with the hashed password stored in database using bcrypt
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        // if password is incorrect throw error
        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        // if everything is correct return the user object with the id, email, name and image properties
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    // signUp: "/auth/signup",
  },
  session: {
    strategy: "jwt",
  },
  // callbacks are used to modify the token and session objects before they are returned to the client
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
