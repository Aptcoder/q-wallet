import { TransactionType } from '../../entities/transaction.entity'

export interface CreateTransactionDto {
    type: TransactionType
    reference: string
    narration: string
    balance_before: number
    balance_after: number
    amount: number
    meta_data: string
    ext_reference: string
    last_ext_response: string
}
