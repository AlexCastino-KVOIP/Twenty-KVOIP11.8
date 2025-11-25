import { gql } from '@apollo/client';

export const DELETE_CUSTOM_BILLING_PLAN = gql`
  mutation DeleteCustomBillingPlan($id: String!) {
    deleteCustomBillingPlan(id: $id)
  }
`;

