import request from "supertest";
import { createApp } from "../../../app";
import jwt, { SignOptions } from "jsonwebtoken";
import ms from "ms";

const app = createApp();

const generateToken = (
  userId: number,
  expiresIn: number | ms.StringValue | undefined = "7d"
): string => {
  const options: SignOptions = {
    expiresIn: expiresIn,
  };

  return jwt.sign({ userId }, process.env.JWT_SECRET as string, options);
};

describe("Auth Middleware", () => {
  it(`should return 401 if no token is provided on /api/auth/logout`, async () => {
    const res = await request(app).post("/api/auth/protected-route").send({});
    expect(res.status).toBe(401);
    expect(res.body.errorMessage).toBe("Unauthorized");
  });

  it("should return 401 if the token is expired", async () => {
    const expiredToken = generateToken(1, "1ms");
    const res = await request(app)
      .post("/api/auth/protected-route")
      .set("Authorization", `Bearer ${expiredToken}`)
      .send({});
    expect(res.status).toBe(401);
    expect(res.body.errorMessage).toBe("Token has expired");
  });

  it("should return 403 if the token is invalid", async () => {
    const invalidToken = "invalidToken";
    const res = await request(app)
      .post("/api/auth/protected-route")
      .set("Authorization", `Bearer ${invalidToken}`)
      .send({});
    expect(res.status).toBe(403);
    expect(res.body.errorMessage).toBe("Invalid token");
  });

  it("should verify the token and include the correct userId in the request body", async () => {
    const validToken = generateToken(1, "7d");
    const res = await request(app)
      .post("/api/auth/protected-route")
      .set("Authorization", `Bearer ${validToken}`)
      .getHeader("Authorization");

    const token: string | undefined = res?.split(" ")[1];

    expect(token).toBeDefined();

    jwt.verify(
      token as string,
      process.env.JWT_SECRET as string,
      (
        err: null | jwt.VerifyErrors,
        decoded: string | jwt.JwtPayload | undefined
      ) => {
        expect(err).toBeNull();

        if (typeof decoded !== "string" && decoded && decoded.userId) {
          expect(decoded.userId).toBe(1);
        }
      }
    );
  });
});
