import { gql } from '@apollo/client';

export const GET_CUSTOM_BILLING_PLANS = gql`
  query GetCustomBillingPlans {
    customBillingPlans {
      id
      name
      description
      active
      currency
      interval
      trialPeriodDays
      paymentGateway
      createdAt
      updatedAt
      priceTiers {
        id
        upTo
        unitAmount
      }
    }
  }
`;

