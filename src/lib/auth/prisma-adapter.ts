import { Adapter } from 'next-auth/adapters'
import { Prisma } from '../prisma'
import { parseCookies, destroyCookie } from 'nookies'
import { NextApiRequest, NextApiResponse, NextPageContext } from 'next'

export default function PrismaAdapter(
  req: NextApiRequest | NextPageContext['req'],
  res: NextApiResponse | NextPageContext['res'],
): Adapter {
  return {
    async createUser(user) {
      const { '@ignitecall:userId': userIdOnCookies } = parseCookies({ req })

      if (!userIdOnCookies) {
        throw new Error('User id not found on Cookies')
      }

      const prismaUser = await Prisma.user.update({
        where: {
          id: userIdOnCookies,
        },
        data: {
          name: user.name as string,
          email: user.email,
          avatar_url: user.image,
        },
      })

      destroyCookie({ res }, '@ignitecall:userId', {
        path: '/',
      })

      return {
        id: prismaUser.id,
        name: prismaUser.name,
        username: prismaUser.username,
        email: prismaUser.email!,
        emailVerified: null,
        avatar_url: prismaUser.avatar_url!,
      }
    },
    async getUser(id) {
      const user = await Prisma.user.findUnique({
        where: {
          id,
        },
      })

      if (!user) {
        return null
      }

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        emailVerified: null,
        avatar_url: user.avatar_url!,
      }
    },

    async getUserByEmail(email) {
      const user = await Prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!user) {
        return null
      }

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        emailVerified: null,
        avatar_url: user.avatar_url!,
      }
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const account = await Prisma.account.findUnique({
        where: {
          provider_provider_account_id: {
            provider,
            provider_account_id: providerAccountId,
          },
        },
        include: {
          user: true,
        },
      })

      if (!account) {
        return null
      }

      const { user } = account

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        emailVerified: null,
        avatar_url: user.avatar_url!,
      }
    },

    async updateUser(user) {
      const userUpdated = await Prisma.user.update({
        where: {
          id: user.id!,
        },
        data: {
          name: user.name as string,
          email: user.email,
          avatar_url: user.image,
        },
      })

      return {
        id: userUpdated.id,
        name: userUpdated.name,
        username: userUpdated.username,
        email: userUpdated.email!,
        emailVerified: null,
        avatar_url: userUpdated.avatar_url!,
      }
    },

    async linkAccount(account) {
      await Prisma.account.create({
        data: {
          user_id: account.userId,
          type: account.type,
          provider: account.provider,
          provider_account_id: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state,
        },
      })
    },
    async createSession({ sessionToken, userId, expires }) {
      await Prisma.session.create({
        data: {
          user_id: userId,
          expires,
          session_token: sessionToken,
        },
      })

      return {
        userId,
        sessionToken,
        expires,
      }
    },

    async getSessionAndUser(sessionToken) {
      const sessionDb = await Prisma.session.findUnique({
        where: {
          session_token: sessionToken,
        },
        include: {
          user: true,
        },
      })

      if (!sessionDb) {
        return null
      }

      const { user, ...session } = sessionDb

      return {
        session: {
          id: session.id,
          expires: session.expires,
          userId: session.user_id,
          sessionToken: session.session_token,
        },
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email!,
          emailVerified: null,
          avatar_url: user.avatar_url!,
        },
      }
    },

    async updateSession({ sessionToken, expires, userId }) {
      const sessionUpdated = await Prisma.session.update({
        where: {
          session_token: sessionToken,
        },
        data: {
          expires,
          user_id: userId,
        },
      })

      return {
        sessionToken,
        userId: sessionUpdated.user_id,
        expires: sessionUpdated.expires,
      }
    },

    async deleteSession(sessionToken) {
      await Prisma.session.delete({
        where: {
          session_token: sessionToken,
        },
      })
    },
  }
}
