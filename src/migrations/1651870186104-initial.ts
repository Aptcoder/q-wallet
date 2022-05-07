import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1651870186104 implements MigrationInterface {
    name = 'initial1651870186104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "phoneNumber" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "account" ("id" SERIAL NOT NULL, "balance" numeric(20,4) NOT NULL DEFAULT '0', "userId" integer NOT NULL, CONSTRAINT "REL_60328bf27019ff5498c4b97742" UNIQUE ("userId"), CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_type_enum" AS ENUM('debit', 'credit')`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_category_enum" AS ENUM('wallet_transfer', 'card_funding')`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "type" "public"."transaction_type_enum" NOT NULL, "ext_reference" character varying, "last_ext_response" character varying, "category" "public"."transaction_category_enum" NOT NULL, "meta_data" character varying NOT NULL, "reference" uuid NOT NULL DEFAULT uuid_generate_v4(), "narration" character varying NOT NULL, "balance_before" numeric(20,4) NOT NULL, "balance_after" numeric(20,4) NOT NULL, "amount" numeric(20,4) NOT NULL, "accountId" integer NOT NULL, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_60328bf27019ff5498c4b977421" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_3d6e89b14baa44a71870450d14d" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_3d6e89b14baa44a71870450d14d"`);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_60328bf27019ff5498c4b977421"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_category_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_type_enum"`);
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
