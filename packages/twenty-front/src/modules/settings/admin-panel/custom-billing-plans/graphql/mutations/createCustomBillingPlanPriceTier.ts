import { gql } from '@apollo/client';

export const CREATE_CUSTOM_BILLING_PLAN_PRICE_TIER = gql`
  mutation CreateCustomBillingPlanPriceTier(
    $planId: String!
    $upTo: Int
    $unitAmount: Int!
  ) {
    createCustomBillingPlanPriceTier(
      planId: $planId
      upTo: $upTo
      unitAmount: $unitAmount
    ) {
      id
      upTo
      unitAmount
      createdAt
      updatedAt
    }
  }
`;

