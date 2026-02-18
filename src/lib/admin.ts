import { getUserFromHeader } from "./auth";

export function requireAdmin(req: Request) {
    const user = getUserFromHeader(req);

    if (!user || user.role !== "admin") {
        return null;
    }

    return user;
}
