import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCustomBillingPlanIdToWorkspace1765000000000
  implements MigrationInterface
{
  name = 'AddCustomBillingPlanIdToWorkspace1765000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."workspace" ADD "customBillingPlanId" uuid`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."workspace" DROP COLUMN "customBillingPlanId"`,
    );
  }
}

