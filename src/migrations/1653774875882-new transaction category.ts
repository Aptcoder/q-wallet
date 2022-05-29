import {MigrationInterface, QueryRunner} from "typeorm";

export class newTransactionCategory1653774875882 implements MigrationInterface {
    name = 'newTransactionCategory1653774875882'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."transaction_category_enum" RENAME TO "transaction_category_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_category_enum" AS ENUM('wallet_transfer', 'card_funding', 'transfer_funding', 'withdrawal')`);
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "category" TYPE "public"."transaction_category_enum" USING "category"::"text"::"public"."transaction_category_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_category_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transaction_category_enum_old" AS ENUM('wallet_transfer', 'card_funding', 'transfer_funding')`);
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "category" TYPE "public"."transaction_category_enum_old" USING "category"::"text"::"public"."transaction_category_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_category_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."transaction_category_enum_old" RENAME TO "transaction_category_enum"`);
    }

}
