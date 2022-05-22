import {MigrationInterface, QueryRunner} from "typeorm";

export class addTransferToTransactionCategroty1653207498732 implements MigrationInterface {
    name = 'addTransferToTransactionCategroty1653207498732'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."transaction_category_enum" RENAME TO "transaction_category_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_category_enum" AS ENUM('wallet_transfer', 'card_funding', 'transfer_funding')`);
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "category" TYPE "public"."transaction_category_enum" USING "category"::"text"::"public"."transaction_category_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_category_enum_old"`);
        await queryRunner.query(`CREATE INDEX "IDX_60328bf27019ff5498c4b97742" ON "account" ("userId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_60328bf27019ff5498c4b97742"`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_category_enum_old" AS ENUM('wallet_transfer', 'card_funding')`);
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "category" TYPE "public"."transaction_category_enum_old" USING "category"::"text"::"public"."transaction_category_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_category_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."transaction_category_enum_old" RENAME TO "transaction_category_enum"`);
    }

}
