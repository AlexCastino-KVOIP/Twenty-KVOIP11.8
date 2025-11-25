import { gql } from '@apollo/client';

export const GET_ACTIVE_CUSTOM_BILLING_PLANS = gql`
  query GetActiveCustomBillingPlans {
    activeCustomBillingPlans {
      id
      name
      description
      currency
      interval
      trialPeriodDays
      priceTiers {
        id
        upTo
        unitAmount
      }
    }
  }
`;

