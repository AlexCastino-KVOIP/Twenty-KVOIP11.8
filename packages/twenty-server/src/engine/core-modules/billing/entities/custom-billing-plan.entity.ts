/* @license Enterprise */

import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    Relation,
    UpdateDateColumn,
} from 'typeorm';

import { CustomBillingPlanPriceTierEntity } from 'src/engine/core-modules/billing/entities/custom-billing-plan-price-tier.entity';
import { SubscriptionInterval } from 'src/engine/core-modules/billing/enums/billing-subscription-interval.enum';

registerEnumType(SubscriptionInterval, {
  name: 'SubscriptionInterval',
});

@ObjectType()
@Entity({ name: 'customBillingPlan', schema: 'core' })
export class CustomBillingPlanEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true, type: 'timestamptz' })
  deletedAt?: Date | null;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Field(() => String)
  @Column({ nullable: false })
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, type: 'text' })
  description: string | null;

  @Field(() => Boolean)
  @Column({ nullable: false, default: true })
  active: boolean;

  @Field(() => String)
  @Column({ nullable: false, default: 'BRL' })
  currency: string;

  @Field(() => SubscriptionInterval)
  @Column({
    nullable: false,
    type: 'enum',
    enum: SubscriptionInterval,
    default: SubscriptionInterval.Month,
  })
  interval: SubscriptionInterval;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true, type: 'integer' })
  trialPeriodDays: number | null;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, type: 'text' })
  paymentGateway: string | null;

  @Field(() => [String], { nullable: true, defaultValue: [] })
  @Column({ nullable: true, type: 'jsonb', default: '[]' })
  features: string[] | null;

  @Field(() => [CustomBillingPlanPriceTierEntity], { nullable: true, defaultValue: [] })
  @OneToMany(
    () => CustomBillingPlanPriceTierEntity,
    (priceTier) => priceTier.customBillingPlan,
    { cascade: true },
  )
  priceTiers?: Relation<CustomBillingPlanPriceTierEntity[]>;

  @Field(() => Int, { nullable: true })
  workspaceCount?: number;
}

