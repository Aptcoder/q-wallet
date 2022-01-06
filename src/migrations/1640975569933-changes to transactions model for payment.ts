import {MigrationInterface, QueryRunner} from "typeorm";

export class changesToTransactionsModelForPayment1640975569933 implements MigrationInterface {
    name = 'changesToTransactionsModelForPayment1640975569933'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "ext_reference" character varying`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "last_ext_response" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "last_ext_response"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "ext_reference"`);
    }

}
