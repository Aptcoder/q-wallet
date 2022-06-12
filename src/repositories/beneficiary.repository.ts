import Beneficiary from '../entities/beneficiary.entity'
import { CreateBeneficiaryDto } from '../utils/dtos/beneficiary.dto'
import { IBeneficiaryRepository } from '../utils/interfaces/repos.interfaces'
import { EntityRepository, Repository } from 'typeorm'
import { IBeneficiary } from 'src/utils/interfaces/entities.interfaces'

@EntityRepository(Beneficiary)
export default class BeneficiaryRepository
    extends Repository<Beneficiary>
    implements IBeneficiaryRepository
{
    async createAndSave(createBeneficiaryDto: CreateBeneficiaryDto) {
        let beneficiary = this.create({
            ...createBeneficiaryDto,
            userId: Number(createBeneficiaryDto.userId),
        })

        beneficiary = await this.save(beneficiary)
        return beneficiary
    }

    async findByUserId(userId: string) {
        const beneficiaries = await this.find({
            where: {
                userId,
            },
        })

        return beneficiaries
    }

    async findOneWithUserId(
        userId: string,
        beneficiaryId: string
    ): Promise<IBeneficiary | undefined> {
        const beneficiary = await this.findOne({
            where: {
                userId,
                id: beneficiaryId,
            },
        })

        return beneficiary
    }

    async findOneWithUserIdAndAccount(userId: string, account_number: string) {
        const beneficiary = await this.findOne({
            where: {
                userId,
                bank_account: account_number,
            },
        })

        return beneficiary
    }
}
