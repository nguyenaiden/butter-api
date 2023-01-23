// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import type { components } from '../../../types'
import db from '../../../db/client'                                                                                             
import { v1 as uuid } from 'uuid'
import { getBalanceTransaction, getEventInsertTransaction } from '@/utils'

type LoadResponse = components['schemas']['LoadResponse']
type Error = components['schemas']['Error']

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoadResponse | Error>
) {
  if (req.method === 'PUT') {
    const { userId, transactionAmount: { amount, currency } } = req.body
    const trx = await db.transaction()
    if (!amount || !currency || !userId) {
      res.status(400).json({ message: `Unable to complete request. Please verify all required fields`, code: "400" })
    } else {
      try {
        const messageId = uuid()
        await getEventInsertTransaction(trx, messageId, userId, "CREDIT", "approved", currency, amount)
        const { balance }  = (await getBalanceTransaction(trx, userId))[0] 
        await trx.commit()
        res.status(201).json({ userId, messageId, balance: {
          amount: balance,
          currency,
          debitOrCredit: "CREDIT"
        }})
      } catch (error) {
        await trx.rollback()
        res.status(500).json({ message: `Server is experiencing unexpected error. ${error}`, code: "500" })
      }
      
    }
  } else {
    res.status(403).json({ message: `Unable to complete request. Method ${req.method} is not accepted`, code: "403" })
  }
  
}
