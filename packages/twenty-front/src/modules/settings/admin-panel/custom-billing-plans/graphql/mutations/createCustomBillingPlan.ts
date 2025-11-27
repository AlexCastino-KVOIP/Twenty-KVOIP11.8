import { gql } from '@apollo/client';

export const CREATE_CUSTOM_BILLING_PLAN = gql`
  mutation CreateCustomBillingPlan(
    $name: String!
    $description: String
    $currency: String!
    $interval: SubscriptionInterval!
    $trialPeriodDays: Int
    $paymentGateway: String
    $active: Boolean!
    $features: [String!]
  ) {
    createCustomBillingPlan(
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

