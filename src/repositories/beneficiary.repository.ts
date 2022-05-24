import Beneficiary from 'src/entities/beneficiary.entity'
import { EntityRepository, Repository } from 'typeorm'

@EntityRepository(Beneficiary)
export default class BeneficiaryRepository extends Repository<Beneficiary> {}
