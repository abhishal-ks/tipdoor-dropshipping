import { verifyToken } from "./jwt";

export function getUserFromHeader(req: Request) {
    const auth = req.headers.get("authorization");

    if (!auth) return null;

    const token = auth.split(" ")[1];

    try {
        return verifyToken(token);
    } catch {
        return null;
    }
}
