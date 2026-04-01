import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request:Request) {
    try{
        const {email} = await request.json();

        // check for presence of email in the request body
        if(!email){
            return NextResponse.json({
                error: "Email is required"
            }, {status: 400})
        }

        // check if user with the provided email exists
        const user = await prisma.user.findUnique({
            where: {email}
        });

        // if user does not exist, return an error response
        if(!user){
            return NextResponse.json({
                error: "User not found"
            }, {status: 404})
        }

        // if already verified, return message
        if(user.emailVerified){
            return NextResponse.json({
                error: "Email is already verified"
            }, {status: 400})
        }

        // Delete any existing verification tokens for this email to prevent multiple valid tokens
        await prisma.verificationToken.deleteMany({
            where: {identifier: email}
        });

        //  Generate new verification token
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // Token valid for 24 hours

        // Store the new token in the database
        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token,
                expires,
            }
        });

        // Send verification email with the new token
        await sendVerificationEmail(email, token);

        return NextResponse.json({
            message: 'Verification email resent successfully'
        }, {status: 200})

    }catch(error){
        console.error('Resend verification email error:', error);
        return NextResponse.json({error: 'Internal server error'}, {status: 500})
    }
}