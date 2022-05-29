export interface VerifyAccountDto {
    bank_account: string
    bank_code: string
}

export interface CreateBeneficiaryDto extends VerifyAccountDto {
    account_name?: string
    userId: string
}

export interface PayoutDto extends VerifyAccountDto {
    amount: number
}
