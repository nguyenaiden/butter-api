// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import type { components } from '../../types'
import db from '../../db/client'

type Ping = components['schemas']['Ping']
type Error = components['schemas']['Error']

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Ping | Error>
) {

  try {
    process.uptime()
    // Sample query to check connection with server. 
    // DB will throw an error if query isn't run
    await db.raw('SELECT version()')
    res.status(200).json({ serverTime: `${new Date(Date.now())}` })
  } catch (error) {
    res.status(500).json({ message: `Server is experiencing unexpected error`, code: "500" })
  }
}
