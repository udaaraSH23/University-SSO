// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251222-US-S9T0U1
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-22T17:03:00Z

import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    idToken?: string;
    user: {
      role?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    idToken?: string;
    role?: string | null;
  }
}
