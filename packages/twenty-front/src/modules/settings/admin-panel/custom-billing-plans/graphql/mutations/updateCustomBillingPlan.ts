import { gql } from '@apollo/client';

export const UPDATE_CUSTOM_BILLING_PLAN = gql`
  mutation UpdateCustomBillingPlan(
    $id: String!
    $name: String
    $description: String
    $currency: String
    $interval: SubscriptionInterval
    $trialPeriodDays: Int
    $paymentGateway: String
    $active: Boolean
    $features: [String!]
  ) {
    updateCustomBillingPlan(
      id: $id
      name: $name
      description: $description
      currency: $currency
      interval: $interval
      trialPeriodDays: $trialPeriodDays
      paymentGateway: $paymentGateway
      active: $active
      features: $features
    ) {
      id
      name
      description
      active
      currency
      interval
      trialPeriodDays
      paymentGateway
      features
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

