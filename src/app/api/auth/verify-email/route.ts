import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request:NextRequest) {
    // This endpoint will be called when user clicks on the verification link in their email
    try {
        const token = request.nextUrl.searchParams.get('token'); // Get the token from the query parameters 

        if(!token){
            return NextResponse.json({
                error: 'Verification token is missing'
            }, {status: 400})
        }

        // Find the token in the database
        const verificationToken = await prisma.verificationToken.findUnique({
            where: {token}
        });

        // If token is not found or expired, return an error
        if(!verificationToken || verificationToken.expires < new Date()){
            await prisma.verificationToken.delete({
                where: {token}
            });
            return NextResponse.json({
                error: "Invalid or expired verification token"
            }, {status: 400}
        );
        }

        // Find user by email and update emailVerified to true
        const user = await prisma.user.findUnique({
            where: {
                email: verificationToken.identifier
            }
        });

        if(!user){
            return NextResponse.json({
                error: "User not found"
            }, {status: 404})
        }

        // Update user's emailVerified status
        await prisma.user.update({
            where: {email: verificationToken.identifier},
            data: {emailVerified: new Date()}
        });
        return NextResponse.json({
            message: "Email verified successfully"
        }, {status: 200}
        );
    }catch(error){
        console.error("Email verification error:", error);
        return NextResponse.json({
            error: 'Internal server error'
        }, {status: 500}
        );
    }
}