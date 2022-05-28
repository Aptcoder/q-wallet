import Beneficiary from '../entities/beneficiary.entity'
import { CreateBeneficiaryDto } from '../utils/dtos/beneficiary.dto'
import { IBeneficiaryRepository } from '../utils/interfaces/repos.interfaces'
import { EntityRepository, Repository } from 'typeorm'

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
}
