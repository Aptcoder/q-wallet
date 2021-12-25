import { MigrationInterface, QueryRunner } from 'typeorm';

// eslint-disable-next-line import/prefer-default-export
export class newmigration1640276660345 implements MigrationInterface {
  name = 'newmigration1640276660345';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "transaction" DROP CONSTRAINT "FK_605baeb040ff0fae995404cea37"');
    await queryRunner.query('ALTER TABLE "transaction" DROP CONSTRAINT "REL_605baeb040ff0fae995404cea3"');
    await queryRunner.query('ALTER TABLE "transaction" DROP COLUMN "userId"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "transaction" ADD "userId" integer NOT NULL');
    await queryRunner.query('ALTER TABLE "transaction" ADD CONSTRAINT "REL_605baeb040ff0fae995404cea3" UNIQUE ("userId")');
    await queryRunner.query('ALTER TABLE "transaction" ADD CONSTRAINT "FK_605baeb040ff0fae995404cea37" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
  }
}
