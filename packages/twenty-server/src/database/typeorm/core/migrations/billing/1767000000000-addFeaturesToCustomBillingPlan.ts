import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFeaturesToCustomBillingPlan1767000000000
  implements MigrationInterface
{
  name = 'AddFeaturesToCustomBillingPlan1767000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "core"."customBillingPlan"
      ADD COLUMN "features" jsonb DEFAULT '[]'::jsonb
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "core"."customBillingPlan"
      DROP COLUMN "features"
    `);
  }
}

