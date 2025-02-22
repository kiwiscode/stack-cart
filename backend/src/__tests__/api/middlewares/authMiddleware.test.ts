import request from "supertest";
import { createApp } from "../../../app";
import jwt, { SignOptions } from "jsonwebtoken";
import ms from "ms";

const app = createApp();

const generateToken = (
  userId: string,
  expiresIn: number | ms.StringValue | undefined = "7d"
): string => {
  const options: SignOptions = {
    expiresIn: expiresIn,
  };

  return jwt.sign({ userId }, process.env.JWT_SECRET as string, options);
};

describe("Auth Middleware", () => {
  const protectedRoutes = [
    "/api/auth/logout",
    // ...other protected routes
  ];

  protectedRoutes.forEach((route) => {
    it(`should return 401 if no token is provided on ${route}`, async () => {
      const res = await request(app).post(route).send({});
      expect(res.status).toBe(401);
      expect(res.body.errorMessage).toBe("Unauthorized");
    });

    it("should return 401 if the token is expired", async () => {
      const expiredToken = generateToken("testUserId", "1ms");
      const res = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${expiredToken}`)
        .send({});
      expect(res.status).toBe(401);
      expect(res.body.errorMessage).toBe("Token has expired");
    });

    it("should return 403 if the token is invalid", async () => {
      const invalidToken = "invalidToken";
      const res = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${invalidToken}`)
        .send({});
      expect(res.status).toBe(403);
      expect(res.body.errorMessage).toBe("Invalid token");
    });

    // it("should set userId on req.body if token is valid", async () => {});
  });
});
