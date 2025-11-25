/* @license Enterprise */

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AdminPanelGuard } from 'src/engine/guards/admin-panel-guard';
import { UserAuthGuard } from 'src/engine/guards/user-auth.guard';
import { CustomBillingPlanEntity } from 'src/engine/core-modules/billing/entities/custom-billing-plan.entity';
import { CustomBillingPlanService } from 'src/engine/core-modules/billing/services/custom-billing-plan.service';
import { SubscriptionInterval } from 'src/engine/core-modules/billing/enums/billing-subscription-interval.enum';

@Resolver(() => CustomBillingPlanEntity)
export class CustomBillingPlanResolver {
  constructor(
    private readonly customBillingPlanService: CustomBillingPlanService,
  ) {}

  @Query(() => [CustomBillingPlanEntity])
  @UseGuards(AdminPanelGuard)
  async customBillingPlans(): Promise<CustomBillingPlanEntity[]> {
    return await this.customBillingPlanService.findAll();
  }

  @Query(() => [CustomBillingPlanEntity])
  @UseGuards(UserAuthGuard)
  async activeCustomBillingPlans(): Promise<CustomBillingPlanEntity[]> {
    return await this.customBillingPlanService.findActive();
  }

  @Query(() => CustomBillingPlanEntity, { nullable: true })
  @UseGuards(AdminPanelGuard)
  async customBillingPlan(
    @Args('id') id: string,
  ): Promise<CustomBillingPlanEntity | null> {
    return await this.customBillingPlanService.findOne(id);
  }

  @Mutation(() => CustomBillingPlanEntity)
  @UseGuards(AdminPanelGuard)
  async createCustomBillingPlan(
    @Args('name') name: string,
    @Args('description', { nullable: true, type: () => String })
    description: string | null,
    @Args('currency', { defaultValue: 'BRL' }) currency: string,
    @Args('interval', {
      type: () => SubscriptionInterval,
      defaultValue: SubscriptionInterval.Month,
    })
    interval: SubscriptionInterval,
    @Args('trialPeriodDays', { nullable: true, type: () => Number })
    trialPeriodDays: number | null,
    @Args('paymentGateway', { nullable: true, type: () => String })
    paymentGateway: string | null,
    @Args('active', { defaultValue: true }) active: boolean,
  ): Promise<CustomBillingPlanEntity> {
    return await this.customBillingPlanService.create({
      name,
      description,
      currency,
      interval,
      trialPeriodDays,
      paymentGateway,
      active,
    });
  }

  @Mutation(() => CustomBillingPlanEntity)
  @UseGuards(AdminPanelGuard)
  async updateCustomBillingPlan(
    @Args('id') id: string,
    @Args('name', { nullable: true, type: () => String }) name: string | null,
    @Args('description', { nullable: true, type: () => String })
    description: string | null,
    @Args('currency', { nullable: true, type: () => String })
    currency: string | null,
    @Args('interval', { nullable: true, type: () => SubscriptionInterval })
    interval: SubscriptionInterval | null,
    @Args('trialPeriodDays', { nullable: true, type: () => Number })
    trialPeriodDays: number | null,
    @Args('paymentGateway', { nullable: true, type: () => String })
    paymentGateway: string | null,
    @Args('active', { nullable: true, type: () => Boolean })
    active: boolean | null,
  ): Promise<CustomBillingPlanEntity> {
    const updateData: Partial<CustomBillingPlanEntity> = {};
    if (name !== null) updateData.name = name;
    if (description !== null) updateData.description = description;
    if (currency !== null) updateData.currency = currency;
    if (interval !== null) updateData.interval = interval;
    if (trialPeriodDays !== null) updateData.trialPeriodDays = trialPeriodDays;
    if (paymentGateway !== null) updateData.paymentGateway = paymentGateway;
    if (active !== null) updateData.active = active;

    return await this.customBillingPlanService.update(id, updateData);
  }

  @Mutation(() => Boolean)
  @UseGuards(AdminPanelGuard)
  async deleteCustomBillingPlan(@Args('id') id: string): Promise<boolean> {
    await this.customBillingPlanService.delete(id);
    return true;
  }
}

