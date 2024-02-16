'use server';

import NextAuth, { User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { findOne } from './app/lib/mongodb/repositories/user.mongo';
import { compareSync } from 'bcrypt';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials): Promise<User | null>  {
        const parsedCredentials = z
          .object({ username: z.string(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { username, password } = parsedCredentials.data;
          const user = await findOne({ username });
          if(!user) {
            return null;
          }

          const isValidPassword = compareSync(password, user.password);
          if(!isValidPassword) {
            return null
          }
          return {
            username: user.username,
            uuid: user.uuid,
            email: user.email,
            created_at: user.created_at
          };
        }
        return null;
      },
    }),
  ],
});