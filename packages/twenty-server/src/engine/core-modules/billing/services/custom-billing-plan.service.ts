/* @license Enterprise */

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CustomBillingPlanEntity } from 'src/engine/core-modules/billing/entities/custom-billing-plan.entity';
import { CustomBillingPlanPriceTierEntity } from 'src/engine/core-modules/billing/entities/custom-billing-plan-price-tier.entity';

@Injectable()
export class CustomBillingPlanService {
  protected readonly logger = new Logger(CustomBillingPlanService.name);

  constructor(
    @InjectRepository(CustomBillingPlanEntity)
    private readonly customBillingPlanRepository: Repository<CustomBillingPlanEntity>,
    @InjectRepository(CustomBillingPlanPriceTierEntity)
    private readonly customBillingPlanPriceTierRepository: Repository<CustomBillingPlanPriceTierEntity>,
  ) {}

  async findAll(): Promise<CustomBillingPlanEntity[]> {
    return await this.customBillingPlanRepository.find({
      where: { deletedAt: null },
      relations: ['priceTiers'],
      order: { createdAt: 'DESC' },
    });
  }

  async findActive(): Promise<CustomBillingPlanEntity[]> {
    return await this.customBillingPlanRepository.find({
      where: { active: true, deletedAt: null },
      relations: ['priceTiers'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<CustomBillingPlanEntity | null> {
    return await this.customBillingPlanRepository.findOne({
      where: { id, deletedAt: null },
      relations: ['priceTiers'],
    });
  }

  async create(
    planData: Partial<CustomBillingPlanEntity>,
  ): Promise<CustomBillingPlanEntity> {
    const plan = this.customBillingPlanRepository.create(planData);
    return await this.customBillingPlanRepository.save(plan);
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
}

