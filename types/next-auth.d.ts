import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      username: string;
      created_at: Date;
      uuid: string;
      email: string;
    }
  }

  interface User {
    username: string;
    created_at: Date;
    uuid: string;
    email: string;
  }
}