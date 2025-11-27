/* @license Enterprise */

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { CustomBillingPlanPriceTierEntity } from 'src/engine/core-modules/billing/entities/custom-billing-plan-price-tier.entity';
import { CustomBillingPlanEntity } from 'src/engine/core-modules/billing/entities/custom-billing-plan.entity';
import { SubscriptionInterval } from 'src/engine/core-modules/billing/enums/billing-subscription-interval.enum';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';

@Injectable()
export class CustomBillingPlanService {
  protected readonly logger = new Logger(CustomBillingPlanService.name);

  constructor(
    @InjectRepository(CustomBillingPlanEntity)
    private readonly customBillingPlanRepository: Repository<CustomBillingPlanEntity>,
    @InjectRepository(CustomBillingPlanPriceTierEntity)
    private readonly customBillingPlanPriceTierRepository: Repository<CustomBillingPlanPriceTierEntity>,
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
  ) {}

  async findAll(): Promise<CustomBillingPlanEntity[]> {
    return await this.customBillingPlanRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['priceTiers'],
      order: { createdAt: 'DESC' },
    });
  }

  async findActive(): Promise<CustomBillingPlanEntity[]> {
    const plans = await this.customBillingPlanRepository.find({
      where: { active: true, deletedAt: IsNull() },
      relations: ['priceTiers'],
      order: { createdAt: 'DESC' },
    });

    // Sort plans by their first tier's upTo value (ascending)
    return plans.sort((a, b) => {
      const aTiers = (a.priceTiers || []).filter(t => t.upTo !== null).sort((t1, t2) => (t1.upTo || 0) - (t2.upTo || 0));
      const bTiers = (b.priceTiers || []).filter(t => t.upTo !== null).sort((t1, t2) => (t1.upTo || 0) - (t2.upTo || 0));

      const aFirstUpTo = aTiers.length > 0 ? (aTiers[0].upTo || 0) : 999999;
      const bFirstUpTo = bTiers.length > 0 ? (bTiers[0].upTo || 0) : 999999;

      return aFirstUpTo - bFirstUpTo;
    });
  }

  async ensureDefaultPlansExist(): Promise<void> {
    const activePlans = await this.findActive();
    if (activePlans.length > 0) {
      return;
    }

    this.logger.log('Nenhum plano customizado encontrado. Criando planos padrão...');

    // Criar Plano Básico
    const basicPlan = await this.customBillingPlanRepository.save({
      name: 'Plano Básico',
      description: 'Plano básico para pequenas equipes',
      active: true,
      currency: 'BRL',
      interval: SubscriptionInterval.Month,
      trialPeriodDays: null,
      paymentGateway: null,
    });

    await this.customBillingPlanPriceTierRepository.save({
      customBillingPlanId: basicPlan.id,
      upTo: null,
      unitAmount: 0,
    });

    // Criar Plano Profissional
    const professionalPlan = await this.customBillingPlanRepository.save({
      name: 'Plano Profissional',
      description: 'Plano profissional para equipes maiores',
      active: true,
      currency: 'BRL',
      interval: SubscriptionInterval.Month,
      trialPeriodDays: null,
      paymentGateway: null,
    });

    await this.customBillingPlanPriceTierRepository.save({
      customBillingPlanId: professionalPlan.id,
      upTo: null,
      unitAmount: 99.0,
    });

    // Criar Plano Enterprise
    const enterprisePlan = await this.customBillingPlanRepository.save({
      name: 'Plano Enterprise',
      description: 'Plano enterprise com recursos avançados',
      active: true,
      currency: 'BRL',
      interval: SubscriptionInterval.Month,
      trialPeriodDays: null,
      paymentGateway: null,
    });

    await this.customBillingPlanPriceTierRepository.save({
      customBillingPlanId: enterprisePlan.id,
      upTo: null,
      unitAmount: 299.0,
    });

    this.logger.log('Planos padrão criados com sucesso');
  }

  async findOne(id: string): Promise<CustomBillingPlanEntity | null> {
    return await this.customBillingPlanRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['priceTiers'],
    });
  }

  async create(
    planData: Partial<CustomBillingPlanEntity>,
  ): Promise<CustomBillingPlanEntity> {
    try {
      this.logger.log('Creating custom billing plan with data:', planData);
      const plan = this.customBillingPlanRepository.create(planData);
      const savedPlan = await this.customBillingPlanRepository.save(plan);
      this.logger.log('Custom billing plan created successfully:', savedPlan.id);
      // Load the plan with priceTiers relation to ensure it's loaded
      const planWithRelations = await this.customBillingPlanRepository.findOne({
        where: { id: savedPlan.id },
        relations: ['priceTiers'],
      });
      if (!planWithRelations) {
        throw new Error(`Failed to load created plan with id ${savedPlan.id}`);
      }
      // Ensure priceTiers is always an array, never null
      if (!planWithRelations.priceTiers) {
        planWithRelations.priceTiers = [];
      }
      return planWithRelations;
    } catch (error) {
      this.logger.error('Error creating custom billing plan:', error);
      throw error;
    }
  }

  async update(
    id: string,
    planData: Partial<CustomBillingPlanEntity>,
  ): Promise<CustomBillingPlanEntity> {
    await this.customBillingPlanRepository.update(id, planData);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error(`Custom billing plan with id ${id} not found`);
    }
    // Ensure priceTiers is loaded (findOne already loads it, but being explicit)
    if (!updated.priceTiers) {
      updated.priceTiers = [];
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.customBillingPlanRepository.update(id, {
      deletedAt: new Date(),
      active: false,
    });
  }

  async assignToWorkspace(
    workspaceId: string,
    planId: string,
  ): Promise<void> {
    const plan = await this.findOne(planId);
    if (!plan) {
      throw new Error(`Custom billing plan with id ${planId} not found`);
    }
    if (!plan.active) {
      throw new Error(`Custom billing plan with id ${planId} is not active`);
    }
  }

  async getWorkspaceCount(planId: string): Promise<number> {
    return await this.workspaceRepository.count({
      where: { customBillingPlanId: planId, deletedAt: IsNull() },
    });
  }

  async createPriceTier(
    planId: string,
    upTo: number | null,
    unitAmount: number,
  ): Promise<CustomBillingPlanPriceTierEntity> {
    // GraphQL sends unitAmount as Int (cents), but database stores as numeric (reais)
    // Convert cents to reais
    const unitAmountInReais = unitAmount / 100;

    const tier = this.customBillingPlanPriceTierRepository.create({
      customBillingPlanId: planId,
      upTo,
      unitAmount: unitAmountInReais,
    });
    return await this.customBillingPlanPriceTierRepository.save(tier);
  }

  async updatePriceTier(
    tierId: string,
    upTo: number | null,
    unitAmount: number,
  ): Promise<CustomBillingPlanPriceTierEntity> {
    // GraphQL sends unitAmount as Int (cents), but database stores as numeric (reais)
    // Convert cents to reais
    const unitAmountInReais = unitAmount / 100;

    await this.customBillingPlanPriceTierRepository.update(tierId, {
      upTo,
      unitAmount: unitAmountInReais,
    });
    const updated = await this.customBillingPlanPriceTierRepository.findOne({
      where: { id: tierId },
    });
    if (!updated) {
      throw new Error(`Price tier with id ${tierId} not found`);
    }
    return updated;
  }

  async deletePriceTier(tierId: string): Promise<void> {
    await this.customBillingPlanPriceTierRepository.update(tierId, {
      deletedAt: new Date(),
    });
  }
}

