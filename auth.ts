import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";

import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";
import prisma from "@/lib/db/prisma";
import NextAuth from "next-auth";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  // redirection
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      console.log("🚀 ~ signIn ~ user:", user);
      // Allow Oauth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id!);
      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) {
        console.log("hi");
        return false;
      }

      // TODO: Add 2FA check

      return true;
    },
    //@ts-ignore
    async session({ token, session }) {
      if (session?.user && token?.sub) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      token.role = existingUser.role;
      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
