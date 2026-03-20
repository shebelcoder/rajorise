import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

// Admin email whitelist — even if role is ADMIN in DB, email must be here
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "admin@rajorise.com")
  .split(",")
  .map((e) => e.trim().toLowerCase());

export const authOptions: NextAuthOptions = {
  providers: [
    // ── Donor Login (public /login) ──
    CredentialsProvider({
      id: "donor-login",
      name: "Donor Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });

        if (!user || !user.passwordHash || !user.isActive) return null;
        if (user.role !== "DONOR") return null;

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        await logAuth("DONOR_LOGIN", user.id, user.role, user.email);

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),

    // ── Journalist Login (hidden /portal/journalist-login) ──
    CredentialsProvider({
      id: "journalist-login",
      name: "Journalist Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.toLowerCase().trim();
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.passwordHash || !user.isActive) return null;

        if (user.role !== "JOURNALIST") {
          await logAuth("UNAUTHORIZED_ACCESS_ATTEMPT", user.id, user.role, email, {
            attempted_portal: "journalist",
          });
          return null;
        }

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) {
          await logAuth("FAILED_LOGIN", user.id, user.role, email, { portal: "journalist" });
          return null;
        }

        await logAuth("JOURNALIST_LOGIN", user.id, user.role, user.email);

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),

    // ── Admin Login (hidden /portal/admin-login) ──
    CredentialsProvider({
      id: "admin-login",
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.toLowerCase().trim();

        // Whitelist check first — silent reject
        if (!ADMIN_EMAILS.includes(email)) {
          // Can't log to AuditLog without a valid actorId, just console warn
          console.warn(`[SECURITY] Admin login attempt from non-whitelisted email: ${email}`);
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.passwordHash || !user.isActive) return null;

        if (user.role !== "ADMIN") {
          await logAuth("UNAUTHORIZED_ACCESS_ATTEMPT", user.id, user.role, email, {
            attempted_portal: "admin",
            reason: "wrong_role",
          });
          return null;
        }

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) {
          await logAuth("FAILED_LOGIN", user.id, user.role, email, { portal: "admin" });
          return null;
        }

        await logAuth("ADMIN_LOGIN", user.id, user.role, user.email);

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],

  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || "DONOR";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string; role?: string }).id = token.id as string;
        (session.user as { id?: string; role?: string }).role = token.role as string;
      }
      return session;
    },
  },
};

// Helper to log auth events to AuditLog table
async function logAuth(
  action: string,
  actorId: string,
  actorRole: string,
  email: string,
  metadata?: Record<string, string>
) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        actorId,
        actorRole: actorRole as "DONOR" | "JOURNALIST" | "ADMIN" | "PROCUREMENT_OFFICER" | "FIELD_AGENT",
        metadata: { email, ...metadata },
      },
    });
  } catch {
    console.error(`Audit log failed: ${action} for ${email}`);
  }
}
