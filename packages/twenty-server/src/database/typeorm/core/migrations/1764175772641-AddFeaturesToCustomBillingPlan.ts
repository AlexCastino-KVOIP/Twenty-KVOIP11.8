import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFeaturesToCustomBillingPlan1764175772641 implements MigrationInterface {
    name = 'AddFeaturesToCustomBillingPlan1764175772641'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."workspace" DROP CONSTRAINT "FK_workspace_customBillingPlan"`);
        await queryRunner.query(`ALTER TABLE "core"."customBillingPlanPriceTier" DROP CONSTRAINT "FK_custom_billing_plan_price_tier_plan"`);
        await queryRunner.query(`ALTER TABLE "core"."billingCustomer" DROP CONSTRAINT "FK_53c2ef50e9611082f83d760897d"`);
        await queryRunner.query(`ALTER TABLE "core"."billingSubscriptionItem" DROP CONSTRAINT "FK_d6eb2f6674a26736c8b2fa4ab11"`);
        await queryRunner.query(`ALTER TABLE "core"."billingSubscription" DROP CONSTRAINT "FK_0e793f67ed79fac873fb0eb30fb"`);
        await queryRunner.query(`ALTER TABLE "core"."billingSubscription" DROP CONSTRAINT "FK_6e7dda21d7fd1c0be7b3b07b3c4"`);
        await queryRunner.query(`ALTER TABLE "core"."billingSubscriptionItem" DROP CONSTRAINT "IDX_BILLING_SUBSCRIPTION_ITEM_BILLING_SUBSCRIPTION_ID_STRIPE_PR"`);
        await queryRunner.query(`ALTER TYPE "core"."billingPrice_interval_enum" RENAME TO "billingPrice_interval_enum_old"`);
        await queryRunner.query(`CREATE TYPE "core"."billingPrice_interval_enum" AS ENUM('month', 'year')`);
        await queryRunner.query(`ALTER TABLE "core"."billingPrice" ALTER COLUMN "interval" TYPE "core"."billingPrice_interval_enum" USING "interval"::"text"::"core"."billingPrice_interval_enum"`);
        await queryRunner.query(`DROP TYPE "core"."billingPrice_interval_enum_old"`);
        await queryRunner.query(`ALTER TABLE "core"."billingPrice" ALTER COLUMN "interval" SET NOT NULL`);
        await queryRunner.query(`ALTER TYPE "core"."billingSubscription_interval_enum" RENAME TO "billingSubscription_interval_enum_old"`);
        await queryRunner.query(`CREATE TYPE "core"."billingSubscription_interval_enum" AS ENUM('month', 'year')`);
        await queryRunner.query(`ALTER TABLE "core"."billingSubscription" ALTER COLUMN "interval" TYPE "core"."billingSubscription_interval_enum" USING "interval"::"text"::"core"."billingSubscription_interval_enum"`);
        await queryRunner.query(`DROP TYPE "core"."billingSubscription_interval_enum_old"`);
        await queryRunner.query(`ALTER TABLE "core"."billingSubscriptionItem" ADD CONSTRAINT "IDX_BILLING_SUBSCRIPTION_ITEM_BILLING_SUBSCRIPTION_ID_STRIPE_PRODUCT_ID_UNIQUE" UNIQUE ("billingSubscriptionId", "stripeProductId")`);
        await queryRunner.query(`ALTER TABLE "core"."customBillingPlanPriceTier" ADD CONSTRAINT "FK_5e78ddde055c7607886a4f88136" FOREIGN KEY ("customBillingPlanId") REFERENCES "core"."customBillingPlan"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."billingPrice" ADD CONSTRAINT "FK_4d57ee4dbfc8b4075eb24026fca" FOREIGN KEY ("stripeProductId") REFERENCES "core"."billingProduct"("stripeProductId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."billingPrice" ADD CONSTRAINT "FK_c8b4375b7bf8724ba54065372e1" FOREIGN KEY ("stripeMeterId") REFERENCES "core"."billingMeter"("stripeMeterId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."billingSubscriptionItem" ADD CONSTRAINT "FK_a602e7c9da619b8290232f6eeab" FOREIGN KEY ("billingSubscriptionId") REFERENCES "core"."billingSubscription"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."billingSubscriptionItem" ADD CONSTRAINT "FK_e576e45ea2b21aef8271826622e" FOREIGN KEY ("stripeProductId") REFERENCES "core"."billingProduct"("stripeProductId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."billingSubscriptionItem" DROP CONSTRAINT "FK_e576e45ea2b21aef8271826622e"`);
        await queryRunner.query(`ALTER TABLE "core"."billingSubscriptionItem" DROP CONSTRAINT "FK_a602e7c9da619b8290232f6eeab"`);
        await queryRunner.query(`ALTER TABLE "core"."billingPrice" DROP CONSTRAINT "FK_c8b4375b7bf8724ba54065372e1"`);
        await queryRunner.query(`ALTER TABLE "core"."billingPrice" DROP CONSTRAINT "FK_4d57ee4dbfc8b4075eb24026fca"`);
        await queryRunner.query(`ALTER TABLE "core"."customBillingPlanPriceTier" DROP CONSTRAINT "FK_5e78ddde055c7607886a4f88136"`);
        await queryRunner.query(`ALTER TABLE "core"."billingSubscriptionItem" DROP CONSTRAINT "IDX_BILLING_SUBSCRIPTION_ITEM_BILLING_SUBSCRIPTION_ID_STRIPE_PRODUCT_ID_UNIQUE"`);
        await queryRunner.query(`CREATE TYPE "core"."billingSubscription_interval_enum_old" AS ENUM('day', 'month', 'week', 'year')`);
        await queryRunner.query(`ALTER TABLE "core"."billingSubscription" ALTER COLUMN "interval" TYPE "core"."billingSubscription_interval_enum_old" USING "interval"::"text"::"core"."billingSubscription_interval_enum_old"`);
        await queryRunner.query(`DROP TYPE "core"."billingSubscription_interval_enum"`);
        await queryRunner.query(`ALTER TYPE "core"."billingSubscription_interval_enum_old" RENAME TO "billingSubscription_interval_enum"`);
        await queryRunner.query(`ALTER TABLE "core"."billingPrice" ALTER COLUMN "interval" DROP NOT NULL`);
        await queryRunner.query(`CREATE TYPE "core"."billingPrice_interval_enum_old" AS ENUM('day', 'month', 'week', 'year')`);
        await queryRunner.query(`ALTER TABLE "core"."billingPrice" ALTER COLUMN "interval" TYPE "core"."billingPrice_interval_enum_old" USING "interval"::"text"::"core"."billingPrice_interval_enum_old"`);
        await queryRunner.query(`DROP TYPE "core"."billingPrice_interval_enum"`);
        await queryRunner.query(`ALTER TYPE "core"."billingPrice_interval_enum_old" RENAME TO "billingPrice_interval_enum"`);
        await queryRunner.query(`ALTER TABLE "core"."billingSubscriptionItem" ADD CONSTRAINT "IDX_BILLING_SUBSCRIPTION_ITEM_BILLING_SUBSCRIPTION_ID_STRIPE_PR" UNIQUE ("billingSubscriptionId", "stripeProductId")`);
        await queryRunner.query(`ALTER TABLE "core"."billingSubscription" ADD CONSTRAINT "FK_6e7dda21d7fd1c0be7b3b07b3c4" FOREIGN KEY ("stripeCustomerId") REFERENCES "core"."billingCustomer"("stripeCustomerId") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "core"."billingSubscription" ADD CONSTRAINT "FK_0e793f67ed79fac873fb0eb30fb" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."billingSubscriptionItem" ADD CONSTRAINT "FK_d6eb2f6674a26736c8b2fa4ab11" FOREIGN KEY ("billingSubscriptionId") REFERENCES "core"."billingSubscription"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."billingCustomer" ADD CONSTRAINT "FK_53c2ef50e9611082f83d760897d" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."customBillingPlanPriceTier" ADD CONSTRAINT "FK_custom_billing_plan_price_tier_plan" FOREIGN KEY ("customBillingPlanId") REFERENCES "core"."customBillingPlan"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."workspace" ADD CONSTRAINT "FK_workspace_customBillingPlan" FOREIGN KEY ("customBillingPlanId") REFERENCES "core"."customBillingPlan"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
