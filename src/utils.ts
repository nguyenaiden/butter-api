import { Knex } from "knex";

export function getBalanceTransaction(trx: Knex, userId: string) {
    return trx('users').select('balance').where('userId', userId)
}

export function getEventInsertTransaction(
    trx: Knex,
    messageId: string,
    userId: string,
    type: string,
    status: string,
    currency: string,
    transactionAmount: number) {
    return trx('events').insert({
        messageId,
        userId,
        type,
        status,
        currency,
        transaction_amount: transactionAmount
      })
}