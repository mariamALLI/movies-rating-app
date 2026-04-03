// This file is the API route for user signup. It handles POST requests to create a new user in the database. It validates the input using the signUpApiSchema, checks if the email is already registered, hashes the password using bcrypt, and creates a new user record in the database using Prisma. It returns appropriate responses based on the success or failure of the operation.
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import  prisma  from "@/lib/prisma";
import { signUpApiSchema } from "@/lib/validation/auth";
// Just Added
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";



export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Validate input using signUpApiSchema from validation/auth.ts
    const parsedData = signUpApiSchema.safeParse(body);

    if(!parsedData.success){
      return NextResponse.json(
        {error: parsedData.error.flatten().fieldErrors},
        {status: 400}
      )
    }

  const {name, email, password} = parsedData.data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with unverified email and generate verification token
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Generate email verification token (Just added this line of code)
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // Token valid for 24 hours

    // Store token in the database (Just added this line of code)
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      }
    })

    // Send verification email (Just added this line of code)
    try {
      await sendVerificationEmail(email, token);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Delete the user if email sending fails to avoid having unverified users in the database
      await prisma.user.delete({where: {id: user.id}});
      return NextResponse.json(
        {error: "Failed to send verification email. Please try again."},
        {status: 500}
      )
    }

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
