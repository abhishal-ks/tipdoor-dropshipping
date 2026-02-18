import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface UserJwtPayload extends JwtPayload {
    id: string;
    role: string;
}

export function signToken(payload: UserJwtPayload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): UserJwtPayload {
    return jwt.verify(token, JWT_SECRET) as UserJwtPayload;
}
