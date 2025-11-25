/* @license Enterprise */

import { registerEnumType } from '@nestjs/graphql';

export enum BillingMode {
  STRIPE = 'STRIPE',
  LOCAL = 'LOCAL',
}

registerEnumType(BillingMode, {
  name: 'BillingMode',
});

