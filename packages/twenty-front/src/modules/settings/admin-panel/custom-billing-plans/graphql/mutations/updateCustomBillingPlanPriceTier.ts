import { gql } from '@apollo/client';

export const UPDATE_CUSTOM_BILLING_PLAN_PRICE_TIER = gql`
  mutation UpdateCustomBillingPlanPriceTier(
    $tierId: String!
    $upTo: Int
    $unitAmount: Int!
  ) {
    updateCustomBillingPlanPriceTier(
      tierId: $tierId
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

