import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "db";
import bcrypt from "bcryptjs";

// Static accounts — checked first so login works on Vercel without a live DB
const STATIC_ACCOUNTS = [
  { id: "static-owner",          email: "adib@scentora.com",       name: "Adib",        password: "Password123", role: "ADMIN"      },
  { id: "static-admin",          email: "admin",                   name: "Admin",        password: "2342",        role: "ADMIN"      },
  { id: "static-adminview",      email: "adminview@scentora.demo", name: "adminview",    password: "adminview",   role: "ADMIN_VIEW" },
  { id: "static-adminview-name", email: "adminview",               name: "adminview",    password: "adminview",   role: "ADMIN_VIEW" },
  { id: "static-customer",       email: "customer@gmail.com",      name: "Jean Laurent", password: "customer123", role: "CUSTOMER"   },
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const identifier = credentials.email as string;
        const password   = credentials.password as string;

        // 1. Check static accounts first (works with no DB)
        const staticUser = STATIC_ACCOUNTS.find(
          (u) => u.email === identifier || u.name === identifier
        );
        if (staticUser && staticUser.password === password) {
          return { id: staticUser.id, email: staticUser.email, name: staticUser.name, role: staticUser.role };
        }

        // 2. Fall back to live DB lookup (works on Render / self-hosted)
        try {
          const user = await prisma.user.findFirst({
            where: { OR: [{ email: identifier }, { name: identifier }] },
          });
          if (!user || !user.passwordHash) return null;

          const isValid = await bcrypt.compare(password, user.passwordHash);
          if (!isValid) return null;

          return { id: user.id, email: user.email, name: user.name, role: (user as any).role };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id   = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id   = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
});
