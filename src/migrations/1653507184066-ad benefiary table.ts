import {MigrationInterface, QueryRunner} from "typeorm";

export class adBenefiaryTable1653507184066 implements MigrationInterface {
    name = 'adBenefiaryTable1653507184066'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "beneficiary" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" integer NOT NULL, "bank_account" character varying NOT NULL, "account_name" character varying, "bank_code" character varying NOT NULL, CONSTRAINT "UQ_98271d9db9d7f02e17f1f3e2131" UNIQUE ("bank_account"), CONSTRAINT "PK_c7514d7fed62b8e619cb1840f41" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5da38f1e0ac0af55d4f65e28b7" ON "beneficiary" ("userId") `);
        await queryRunner.query(`ALTER TABLE "beneficiary" ADD CONSTRAINT "FK_5da38f1e0ac0af55d4f65e28b71" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "beneficiary" DROP CONSTRAINT "FK_5da38f1e0ac0af55d4f65e28b71"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5da38f1e0ac0af55d4f65e28b7"`);
        await queryRunner.query(`DROP TABLE "beneficiary"`);
    }

}
