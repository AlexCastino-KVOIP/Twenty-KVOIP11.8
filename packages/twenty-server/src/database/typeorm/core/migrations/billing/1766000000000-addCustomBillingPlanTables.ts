import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCustomBillingPlanTables1766000000000
  implements MigrationInterface
{
  name = 'AddCustomBillingPlanTables1766000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "core"."customBillingPlan_interval_enum" AS ENUM('month', 'year')`,
    );

    await queryRunner.query(
      `CREATE TABLE "core"."customBillingPlan" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "name" character varying NOT NULL,
        "description" text,
        "active" boolean NOT NULL DEFAULT true,
        "currency" character varying NOT NULL DEFAULT 'BRL',
        "interval" "core"."customBillingPlan_interval_enum" NOT NULL DEFAULT 'month',
        "trialPeriodDays" integer,
        "paymentGateway" text,
        CONSTRAINT "PK_custom_billing_plan" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE "core"."customBillingPlanPriceTier" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "customBillingPlanId" uuid NOT NULL,
        "upTo" integer,
        "unitAmount" numeric(10,2) NOT NULL,
        CONSTRAINT "PK_custom_billing_plan_price_tier" PRIMARY KEY ("id"),
        CONSTRAINT "FK_custom_billing_plan_price_tier_plan"
          FOREIGN KEY ("customBillingPlanId")
          REFERENCES "core"."customBillingPlan"("id")
          ON DELETE CASCADE
      )`,
    );

    await queryRunner.query(
      `ALTER TABLE "core"."workspace"
        ADD CONSTRAINT "FK_workspace_customBillingPlan"
        FOREIGN KEY ("customBillingPlanId")
        REFERENCES "core"."customBillingPlan"("id")
        ON DELETE SET NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."workspace" DROP CONSTRAINT "FK_workspace_customBillingPlan"`,
    );

    await queryRunner.query(`DROP TABLE "core"."customBillingPlanPriceTier"`);
    await queryRunner.query(`DROP TABLE "core"."customBillingPlan"`);
    await queryRunner.query(
      `DROP TYPE "core"."customBillingPlan_interval_enum"`,
    );
  }
}

