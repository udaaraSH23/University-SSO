/// <reference path="./next-auth.d.ts" />

// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251220-US-e5f6g7
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-22T17:03:00Z

import NextAuth from "next-auth";
import { PrismaClient } from "@repo/database";

/**
 * Signature constant for fingerprinting.
 */
const __FP_SIG = "FP-20251220-US-e5f6g7|HASH-PLACEHOLDER";

/**
 * Shared Authentication Configuration.
 *
 * Configures NextAuth with the WSO2 IS provider using OIDC.
 * Handles JWT token callbacks to pass the access token to the session.
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    {
      id: "wso2",
      name: "WSO2 IS",
      type: "oidc",
      clientId: process.env.WSO2_CLIENT_ID,
      clientSecret: process.env.WSO2_CLIENT_SECRET,
      issuer: process.env.WSO2_ISSUER,
      authorization: { params: { scope: "openid email groups profile roles" } },
      wellKnown: process.env.WSO2_WELL_KNOWN,
      profile(profile) {
        // Extract role from groups or roles claim
        // We look for the specific roles: ROLE_STUDENT, ROLE_LIBRARIAN, ROLE_ADMIN.
        // WSO2 might send roles in 'roles' (as string or array) and groups in 'groups'.
        // We must check both.
        let userRole = null;

        const ensureArray = (item: any) => {
          if (Array.isArray(item)) return item;
          if (typeof item === "string" && item.trim() !== "") return [item];
          return [];
        };

        const groups = ensureArray(profile.groups);
        const roles = ensureArray(profile.roles);
        const allClaims = [...groups, ...roles];

        if (allClaims.includes("ROLE_ADMIN")) userRole = "admin";
        else if (allClaims.includes("ROLE_LIBRARIAN")) userRole = "librarian";
        else if (allClaims.includes("ROLE_STUDENT")) userRole = "student";

        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          role: userRole,
        };
      },
    },
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        return false;
      }

      try {
        const prisma = new PrismaClient();
        const existingUser = await prisma.user.findUnique({
          where: {
            email: user.email,
          },
        });

        await prisma.$disconnect();

        if (!existingUser) {
          console.log(
            `User ${user.email} denied access: Not found in database.`
          );
          return false; // or return '/auth/error?error=AccessDenied'
        }

        return true;
      } catch (error) {
        console.error("Error validating user during sign in:", error);
        return false;
      }
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.idToken = token.idToken as string;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    error: "/auth/error", // Redirect to custom error page
  },
});
