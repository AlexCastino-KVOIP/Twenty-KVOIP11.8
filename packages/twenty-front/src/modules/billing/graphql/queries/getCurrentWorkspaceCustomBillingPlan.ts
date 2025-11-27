import { gql } from '@apollo/client';

export const GET_CURRENT_WORKSPACE_CUSTOM_BILLING_PLAN = gql`
  query GetCurrentWorkspaceCustomBillingPlan {
    currentWorkspaceCustomBillingPlan {
      id
      name
      description
      currency
      interval
      active
      features
      priceTiers {
        id
        upTo
        unitAmount
      }
    }
  }
`;

