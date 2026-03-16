// This file is the API route for user signup. It handles POST requests to create a new user in the database. It validates the input using the signUpApiSchema, checks if the email is already registered, hashes the password using bcrypt, and creates a new user record in the database using Prisma. It returns appropriate responses based on the success or failure of the operation.
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import  prisma  from "@/lib/prisma";
import { signUpApiSchema } from "@/lib/validation/auth";

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

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

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
