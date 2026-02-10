import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import  prisma  from "@/lib/prisma";

// GET all movies for logged-in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions); // get current user session

    // if no user is logged in, return unauthorized response
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // fetch movies from database that belong to the logged-in user, ordered by creation date in descending order
    const movies = await prisma.movie.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ items: movies }); // return the movies in a JSON response
  } catch (error) {
    console.error("GET movies error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST create new movie
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions); // get current user session

    // if no user is logged in, return unauthorized response
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // parse the request body to get movie details like name, description, image, rating, genres, and inTheaters status
    const body = await request.json();
    const { name, description, image, rating, genres, inTheaters } = body;

    const movie = await prisma.movie.create({
      data: {
        name,
        description,
        image,
        rating: rating || 0,
        genres: genres || [],
        inTheaters: inTheaters || false,
        userId: session.user.id,
      },
    });

    return NextResponse.json(movie, { status: 201 });
  } catch (error) {
    console.error("POST movie error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
