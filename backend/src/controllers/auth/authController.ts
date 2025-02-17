import { Request, Response } from "express-serve-static-core";
import prisma from "../../utils/PrismaConfig";

export async function testRoute(request: Request, response: Response) {
  try {
    response.send("Hello world");
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ message: "An error occurred during test route" });
  }
}
