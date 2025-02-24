import request from "supertest";
import { createApp } from "../../../app";
import prisma from "../../../utils/PrismaConfig";
import bcrypt from "bcrypt";

const app = createApp();

describe("Auth Controller", () => {
  let testUser: {
    username: string;
    email: string;
    password: string;
    isActive: boolean;
  };

  beforeAll(async () => {
    // user information for testing
    testUser = {
      username: "testuser",
      email: "testuser@gmail.com",
      password: "TestPass123.",
      isActive: false,
    };
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [
            "testuser@gmail.com",
            "validUser@gmail.com",
            "user1@gmail.com",
            "newuser@gmail.com",
            "existentuser@gmail.com",
            "nonexistentuser@gmail.com",
          ],
        },
      },
    });
    await prisma.$disconnect();
  });

  describe("POST /api/auth/register", () => {
    it("should return 403 if any required field is missing", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "",
        email: "",
        password: "",
      });

      expect(res.status).toBe(403);
      expect(res.body.errorMessage).toBe(
        "All fields are mandatory. Please provide a username, email, and password."
      );
    });

    it("should return 400 if the username is shorter than 4 characters", async () => {
      const username = "t";
      const res = await request(app).post("/api/auth/register").send({
        username,
        email: "validUser@gmail.com",
        password: "TestPass123.",
      });

      expect(res.status).toBe(400);
      expect(username.length).toBeLessThan(4);
      expect(res.body.errorMessage).toBe(
        "Username is required and must be at least 4 characters long."
      );
    });

    it("should return 400 if the email is invalid", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "validUser",
        email: "invalid-email",
        password: "TestPass123.",
      });

      expect(res.status).toBe(400);
      expect(res.body.errorMessage).toBe("Please enter a valid email.");
    });

    it("should return 400 if the password is invalid", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "validUser",
        email: "validUser@gmail.com",
        password: "short",
      });

      expect(res.status).toBe(400);
      expect(res.body.errorMessage).toBe(
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter."
      );
    });

    it("should return 400 if the username is already taken", async () => {
      // create a user
      await request(app).post("/api/auth/register").send({
        username: "takenUsername",
        email: "user1@gmail.com",
        password: "ValidPass123.",
      });

      const res = await request(app).post("/api/auth/register").send({
        username: "takenUsername", // already exist username
        email: "user1@gmail.com",
        password: "AnotherPass123.",
      });

      expect(res.status).toBe(400);
      expect(res.body.errorMessage).toBe(
        "Username is already taken. Please choose a different one."
      );
    });

    it("should return 400 if the email is already taken", async () => {
      // create a user
      await request(app).post("/api/auth/register").send({
        username: "takenUsername1",
        email: "user1@gmail.com",
        password: "ValidPass123.",
      });

      const res = await request(app).post("/api/auth/register").send({
        username: "takenUsername2", // already exist email
        email: "user1@gmail.com",
        password: "AnotherPass123.",
      });

      expect(res.status).toBe(400);
      expect(res.body.errorMessage).toBe(
        "An account with this email already exists. Please use a different email."
      );
    });

    it("should return 201, create a new user, and return the user data", async () => {
      const newUser = {
        username: "newUser",
        email: "newuser@gmail.com",
        password: "ValidPass123.",
      };

      const res = await request(app).post("/api/auth/register").send({
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
      });

      const userInDb = await prisma.user.findUnique({
        where: { email: newUser.email },
      });

      if (!userInDb) {
        throw new Error("User not found in the database");
      }

      const isPasswordMatch: boolean = await bcrypt.compare(
        newUser.password,
        userInDb.password
      );

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("User created successfully.");
      expect(isPasswordMatch).toBe(true);
      expect(userInDb).toHaveProperty("username", newUser.username);
      expect(userInDb).toHaveProperty("email", newUser.email);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should return 400 if the email is invalid", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "invalidEmail",
        password: "ValidPass123.",
      });

      expect(res.status).toBe(400);
      expect(res.body.errorMessage).toBe("Please enter a valid email.");
    });
    it("should return 404 if the user is not found", async () => {
      const nonexistentUser = {
        email: "nonexistentuser@gmail.com",
        password: "SomePassword123.",
      };

      const userInDb = await prisma.user.findUnique({
        where: { email: nonexistentUser.email },
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send(nonexistentUser);

      if (!userInDb) {
        expect(res.status).toBe(404);
        expect(res.body.errorMessage).toBe("User not found!");
      }
    });
    it("should return 401 if the password is incorrect", async () => {
      const userCredentials = {
        email: "newuser@gmail.com",
        password: "ValidPass123.",
      };

      await request(app).post("/api/auth/register").send({
        email: userCredentials.email,
        password: userCredentials.password,
      });

      const incorrectCredentials = {
        email: "newuser@gmail.com",
        password: "WrongPassword!",
      };

      const res = await request(app)
        .post("/api/auth/login")
        .send(incorrectCredentials);

      const userInDb = await prisma.user.findUnique({
        where: { email: userCredentials.email },
      });

      if (!userInDb) {
        throw new Error("User not found in the database");
      }

      const isPasswordMatch: boolean = await bcrypt.compare(
        incorrectCredentials.password,
        userInDb.password
      );

      expect(res.status).toBe(401);
      expect(res.body.errorMessage).toBe("Invalid credentials!");
      expect(isPasswordMatch).toBe(false);
      expect(userInDb).toHaveProperty("email", userCredentials.email);
    });
    it("should return 200 and a token if the login is successfull & should update the user's isActive status to true on successful login", async () => {
      const existentUser = {
        email: "existentuser@gmail.com",
        password: "SomePassword123.",
      };

      const userInDb = await prisma.user.findUnique({
        where: { email: existentUser.email },
      });

      const res = await request(app).post("/api/auth/login").send(existentUser);

      if (userInDb) {
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();
        expect(userInDb.isActive).toBe(true);
      }
    });
  });

  describe("POST /api/auth/logout", () => {});
});
