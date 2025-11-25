/* @license Enterprise */

import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import { CustomBillingPlanEntity } from 'src/engine/core-modules/billing/entities/custom-billing-plan.entity';

@ObjectType()
@Entity({ name: 'customBillingPlanPriceTier', schema: 'core' })
export class CustomBillingPlanPriceTierEntity {
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
  @Column({ nullable: false, type: 'uuid' })
  customBillingPlanId: string;

  @Field(() => Number, { nullable: true })
  @Column({ nullable: true, type: 'integer' })
  upTo: number | null;

  @Field(() => Number)
  @Column({ nullable: false, type: 'numeric', precision: 10, scale: 2 })
  unitAmount: number;

  @Field(() => CustomBillingPlanEntity)
  @ManyToOne(
    () => CustomBillingPlanEntity,
    (plan) => plan.priceTiers,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'customBillingPlanId' })
  customBillingPlan: Relation<CustomBillingPlanEntity>;
}

