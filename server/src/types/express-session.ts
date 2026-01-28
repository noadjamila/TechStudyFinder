import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: {
      id: number;
      username: string;
    };
    admin?: {
      id: number;
      username: string;
    };
  }
}
