import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = nextUrl.pathname.startsWith('/login');
      
      // If on login page and logged in, redirect to dashboard
      if (isOnLogin && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      // If on login page and NOT logged in, allow access
      if (isOnLogin) {
        return true;
      }

      // If NOT on login page (protected routes) and NOT logged in, redirect to login
      if (!isLoggedIn) {
        return false; // This triggers redirect to signIn page defined above
      }

      // Otherwise (protected route & logged in), allow access
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
