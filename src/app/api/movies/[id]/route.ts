import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// PATCH update movie
// export async function PATCH(
//   request: Request,
//   { params }: { params: { id: string } },
// ) {
//   try {
//     const session = await getServerSession(authOptions); // get current user session

//     // if no user is logged in, return unauthorized response

//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // parse the request body to get movie details like name, description, image, rating, genres, and inTheaters status
//     const body = await request.json();
//     const { name, description, image, rating, genres, inTheaters } = body;

//     // Verify ownership
//     const existingMovie = await prisma.movie.findUnique({
//       where: { id: params.id },
//     });

//     // if the movie doesn't exist or doesn't belong to the logged-in user, return not found response
//     if (!existingMovie || existingMovie.userId !== session.user.id) {
//       return NextResponse.json({ error: "Not found" }, { status: 404 });
//     }

//     // update the movie in the database with the new details provided in the request body
//     const movie = await prisma.movie.update({
//       where: { id: params.id },
//       data: {
//         name,
//         description,
//         image,
//         rating,
//         genres,
//         inTheaters,
//       },
//     });

//     return NextResponse.json(movie);
//   } catch (error) {
//     console.error("PATCH movie error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 },
//     );
//   }
// }


export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions); // get current user session

    // if no user is logged in, return unauthorized response
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email || "" },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // parse the request body to get updated movie details like name, description, image, rating, genres, and inTheaters status
    const body = await request.json();
    const { name, description, image, rating, genres, inTheaters } = body;

    // update the movie in the database with the new details, but only if the movie belongs to the logged-in user
    const existingMovie = await prisma.movie.findUnique({
      where: { id: params.id },
    });

    if (!existingMovie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    if (existingMovie.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updateMovie = await prisma.movie.update({
      where: { id: params.id },
      data: {
        name,
        description,
        image,
        rating,
        genres,
        inTheaters,
      },
    });

    return NextResponse.json(updateMovie);
  } catch (error) {
    console.error("Error updating movie:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


// DELETE movie
// export async function DELETE(
//   request: Request,
//   { params }: { params: { id: string } },
// ) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Verify ownership
//     const existingMovie = await prisma.movie.findUnique({
//       where: { id: params.id },
//     });

//     if (!existingMovie || existingMovie.userId !== session.user.id) {
//       return NextResponse.json({ error: "Not found" }, { status: 404 });
//     }

//     // delete the movie from the database if it belongs to the logged-in user
//     await prisma.movie.delete({
//       where: { id: params.id },
//     });

//     return NextResponse.json({ message: "Movie deleted" });
//   } catch (error) {
//     console.error("DELETE movie error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 },
//     );
//   }
// }

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions); // get current user session

    // if no user is logged in, return unauthorized user response
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // find the user in the database using the email from the session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email || "" },
    });

    // if user is not found, return not found response
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // find the movie in the database using the id from the request parameters
    const existingMovie = await prisma.movie.findUnique({
      where: { id: params.id },
    });

    // if movie is not found, return movie not found response
    if (!existingMovie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    // if the movie does not belong to the logged-in user, return unauthorized response
    if (existingMovie.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // delete the movie from the database
    await prisma.movie.delete({
      where: { id: params.id },
    });

    // return success message after deleting the movie
    return NextResponse.json({ message: "Movie deleted successfully" });
  } catch (error) {
    console.error("Error deleting movie:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}