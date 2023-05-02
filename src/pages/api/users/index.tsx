import type { NextApiRequest, NextApiResponse } from 'next'
import { Prisma } from '@/lib/prisma'
import { setCookie } from 'nookies'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { name, username } = req.body

  const userNameExists = await Prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (userNameExists) {
    return res.status(400).send('Username already taken')
  }

  const user = await Prisma.user.create({
    data: {
      name,
      username,
    },
  })

  setCookie({ res }, '@ignitecall:userId', user.id, {
    maxAge: 60 * 60 * 24 * 7, // 7 days in milisseconds
    path: '/',
  })

  return res.status(201).json(user)
}
