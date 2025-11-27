/* @license Enterprise */

import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CustomBillingPlanPriceTierEntity } from 'src/engine/core-modules/billing/entities/custom-billing-plan-price-tier.entity';
import { CustomBillingPlanEntity } from 'src/engine/core-modules/billing/entities/custom-billing-plan.entity';
import { SubscriptionInterval } from 'src/engine/core-modules/billing/enums/billing-subscription-interval.enum';
import { CustomBillingPlanService } from 'src/engine/core-modules/billing/services/custom-billing-plan.service';
import { PreventNestToAutoLogGraphqlErrorsFilter } from 'src/engine/core-modules/graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { AdminPanelGuard } from 'src/engine/guards/admin-panel-guard';
import { UserAuthGuard } from 'src/engine/guards/user-auth.guard';

@Resolver(() => CustomBillingPlanEntity)
@UsePipes(ResolverValidationPipe)
@UseFilters(PreventNestToAutoLogGraphqlErrorsFilter)
export class CustomBillingPlanResolver {
  constructor(
    private readonly customBillingPlanService: CustomBillingPlanService,
  ) {}

  @Query(() => [CustomBillingPlanEntity])
  @UseGuards(AdminPanelGuard)
  async customBillingPlans(): Promise<CustomBillingPlanEntity[]> {
    try {
      console.log('Fetching all custom billing plans...');
      const plans = await this.customBillingPlanService.findAll();
      console.log(`Found ${plans.length} custom billing plans`);
      // Add workspace count to each plan
      const plansWithCount = await Promise.all(
        plans.map(async (plan) => {
          const workspaceCount = await this.customBillingPlanService.getWorkspaceCount(plan.id);
          return { ...plan, workspaceCount };
        }),
      );
      return plansWithCount;
    } catch (error) {
      console.error('Error fetching custom billing plans:', error);
      throw error;
    }
  }

  @Query(() => [CustomBillingPlanEntity])
  @UseGuards(UserAuthGuard)
  async activeCustomBillingPlans(): Promise<CustomBillingPlanEntity[]> {
    // Garante que existam planos padrão se não houver nenhum
    await this.customBillingPlanService.ensureDefaultPlansExist();
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
    @Args('trialPeriodDays', { nullable: true, type: () => Int })
    trialPeriodDays: number | null,
    @Args('paymentGateway', { nullable: true, type: () => String })
    paymentGateway: string | null,
    @Args('active', { defaultValue: true }) active: boolean,
    @Args('features', { nullable: true, type: () => [String] })
    features: string[] | null,
  ): Promise<CustomBillingPlanEntity> {
    try {
      const planData = {
        name,
        description,
        currency,
        interval,
        trialPeriodDays,
        paymentGateway,
        active,
        features: features || [],
      };
      console.log('Creating custom billing plan with data:', JSON.stringify(planData, null, 2));
      console.log('Interval type:', typeof interval, interval);
      console.log('TrialPeriodDays type:', typeof trialPeriodDays, trialPeriodDays);
      const result = await this.customBillingPlanService.create(planData);
      console.log('Plan created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('Error in createCustomBillingPlan resolver:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error name:', error.name);
      }
      throw error;
    }
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
    @Args('trialPeriodDays', { nullable: true, type: () => Int })
    trialPeriodDays: number | null,
    @Args('paymentGateway', { nullable: true, type: () => String })
    paymentGateway: string | null,
    @Args('active', { nullable: true, type: () => Boolean })
    active: boolean | null,
    @Args('features', { nullable: true, type: () => [String] })
    features: string[] | null,
  ): Promise<CustomBillingPlanEntity> {
    const updateData: Partial<CustomBillingPlanEntity> = {};
    if (name !== null) updateData.name = name;
    if (description !== null) updateData.description = description;
    if (currency !== null) updateData.currency = currency;
    if (interval !== null) updateData.interval = interval;
    if (trialPeriodDays !== null) updateData.trialPeriodDays = trialPeriodDays;
    if (paymentGateway !== null) updateData.paymentGateway = paymentGateway;
    if (active !== null) updateData.active = active;
    if (features !== null) updateData.features = features;

    return await this.customBillingPlanService.update(id, updateData);
  }

  @Mutation(() => Boolean)
  @UseGuards(AdminPanelGuard)
  async deleteCustomBillingPlan(@Args('id') id: string): Promise<boolean> {
    await this.customBillingPlanService.delete(id);
    return true;
  }

  @Mutation(() => CustomBillingPlanPriceTierEntity)
  @UseGuards(AdminPanelGuard)
  async createCustomBillingPlanPriceTier(
    @Args('planId') planId: string,
    @Args('upTo', { nullable: true, type: () => Int }) upTo: number | null,
    @Args('unitAmount', { type: () => Int }) unitAmount: number,
  ): Promise<CustomBillingPlanPriceTierEntity> {
    return await this.customBillingPlanService.createPriceTier(
      planId,
      upTo,
      unitAmount,
    );
  }

  @Mutation(() => CustomBillingPlanPriceTierEntity)
  @UseGuards(AdminPanelGuard)
  async updateCustomBillingPlanPriceTier(
    @Args('tierId') tierId: string,
    @Args('upTo', { nullable: true, type: () => Int }) upTo: number | null,
    @Args('unitAmount', { type: () => Int }) unitAmount: number,
  ): Promise<CustomBillingPlanPriceTierEntity> {
    return await this.customBillingPlanService.updatePriceTier(
      tierId,
      upTo,
      unitAmount,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(AdminPanelGuard)
  async deleteCustomBillingPlanPriceTier(
    @Args('tierId') tierId: string,
  ): Promise<boolean> {
    await this.customBillingPlanService.deletePriceTier(tierId);
    return true;
  }

  @Query(() => CustomBillingPlanEntity, { nullable: true })
  @UseGuards(UserAuthGuard)
  async currentWorkspaceCustomBillingPlan(
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<CustomBillingPlanEntity | null> {
    if (!workspace.customBillingPlanId) {
      return null;
    }
    return await this.customBillingPlanService.findOne(workspace.customBillingPlanId);
  }
}

