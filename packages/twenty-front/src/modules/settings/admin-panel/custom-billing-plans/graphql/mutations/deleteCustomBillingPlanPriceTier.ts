import { gql } from '@apollo/client';

export const DELETE_CUSTOM_BILLING_PLAN_PRICE_TIER = gql`
  mutation DeleteCustomBillingPlanPriceTier($tierId: String!) {
    deleteCustomBillingPlanPriceTier(tierId: $tierId)
  }
`;

