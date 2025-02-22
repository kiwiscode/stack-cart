import { Request, Response } from "express";
import prisma from "../../utils/PrismaConfig";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
}

interface LogInReqBody {
  email: string;
  password: string;
}

interface LogOutReqBody {
  userId: number;
}

const emailRegex =
  /^[a-zA-Z0-9._%+-]+@(gmail|outlook|hotmail|yahoo|proton|zoho|mail|aol|yandex)\.(com|org|net|gov|edu|mil|co|info|de|co.uk|ca|me|tr|com.tr)$/;

const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

export async function register(req: Request, res: Response) {
  try {
    const { username, email, password }: RegisterRequestBody = req.body;

    if (username === "" || email === "" || password === "") {
      res.status(403).json({
        errorMessage:
          "All fields are mandatory. Please provide a username, email, and password.",
      });
      return;
    }

    if (username.length < 4) {
      res.status(400).json({
        errorMessage:
          "Username is required and must be at least 4 characters long.",
      });
      return;
    }

    if (!email.match(emailRegex)) {
      res.status(400).json({
        success: false,
        errorMessage: "Please enter a valid email.",
      });
      return;
    }

    if (!passwordRegex.test(password)) {
      res.status(400).json({
        errorMessage:
          "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
      });
      return;
    }

    const existingUsername = await prisma.user.findFirst({
      where: { username },
    });

    const existingEmail = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUsername) {
      res.status(400).json({
        success: false,
        errorMessage:
          "Username is already taken. Please choose a different one.",
      });
      return;
    }

    if (existingEmail) {
      res.status(400).json({
        success: false,
        errorMessage:
          "An account with this email already exists. Please use a different email.",
      });
      return;
    }

    const hashedPassword: string = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      createdUser: user,
      message: "User created successfully.",
    });
    return;
  } catch (error) {
    res.status(500).json({
      errorMessage: "User creation failed. (Internal server error)",
      error,
    });
    return;
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password }: LogInReqBody = req.body;

    if (!email.match(emailRegex)) {
      res.status(400).json({
        success: false,
        errorMessage: "Please enter a valid email.",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(404).json({
        errorMessage: "User not found!",
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        errorMessage: "Invalid credentials!",
      });
      return;
    }

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        isActive: true,
      },
    });

    const token: string = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      token,
    });
    return;
  } catch (error) {
    res.status(500).json({
      errorMessage: "User login failed. (Internal server error)",
      error,
    });
    return;
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const { userId }: LogOutReqBody = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      res.status(404).json({
        errorMessage: "User not found!",
      });
      return;
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isActive: false,
      },
    });

    res.status(200).json({
      success: true,
      message: "User logged out successfully.",
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: "User logout failed. (Internal server error)",
      error,
    });
  }
}
