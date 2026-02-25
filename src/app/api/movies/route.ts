import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

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

// PATCH update existing movie by id
// export async function PATCH(request: Request, {params}: {params : {id: string}}) {
//   try {
//     const session = await getServerSession(authOptions); // get current user session

//     // if no user is logged in, return unauthorized response
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const user = await prisma.user.findUnique({
//       where: {email: session.user.email || ""},
//     });

//     if (!user) {
//       return NextResponse.json({error: "User not found"}, {status: 404});
//     }

//     // parse the request body to get updated movie details like name, description, image, rating, genres, and inTheaters status
//     const body = await request.json();
//     const { name, description, image, rating, genres, inTheaters } = body;

//     // update the movie in the database with the new details, but only if the movie belongs to the logged-in user
//     const existingMovie = await prisma.movie.findUnique({
//       where: {id: params.id},
//     });

//     if (!existingMovie) {
//       return NextResponse.json({error: "Movie not found"}, {status: 404});
//     }

//     if (existingMovie.userId !== user.id) {
//       return NextResponse.json({error: "Unauthorized"}, {status: 403});
//     }

//     const updateMovie = await prisma.movie.update({
//       where: {id: params.id},
//       data: {
//         name, description, image, rating, genres, inTheaters
//       }
//     });

//     return NextResponse.json(updateMovie);
//   } catch (error){
//     console.error("Error updating movie:", error);
//     return NextResponse.json({error: "Internal server error"}, {status: 500});
//   }
// }

// DELETE delete existing movie by id
// export async function DELETE(request: Request, {params}: {params: {id: string}}) {
//   try{
//     const session = await getServerSession(authOptions); // get current user session

//     // if no user is logged in, return unauthorized user response
//     if(!session?.user?.id) {
//       return NextResponse.json({error: "Unauthorized"}, {status: 401})
//     }

//     // find the user in the database using the email from the session
//     const user = await prisma.user.findUnique({
//       where: {email: session.user.email || ""},
//     });

//     // if user is not found, return not found response
//     if(!user) {
//       return NextResponse.json({error: "User not found"}, {status: 404});
//     };

//     // find the movie in the database using the id from the request parameters
//     const existingMovie = await prisma.movie.findUnique({
//       where: {id: params.id}
//     })

//     // if movie is not found, return movie not found response
//     if(!existingMovie){
//       return NextResponse.json({error: "Movie not found"}, {status: 404});
//     }

//     // if the movie does not belong to the logged-in user, return unauthorized response
//     if(existingMovie.userId !== user.id) {
//       return NextResponse.json({error: "Unauthorized"}, {status: 403});
//     }

//     // delete the movie from the database
//     await prisma.movie.delete({
//       where: {id: params.id}
//     });

//     // return success message after deleting the movie
//     return NextResponse.json({message: "Movie deleted successfully"});
//   }
//   catch (error) {
//     console.error("Error deleting movie:", error);
//     return NextResponse.json({error: "Internal server error"}, {status: 500});
//   }
// }
