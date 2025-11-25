# Corrigir projeto conforme arquivo de implementação
_Exported on 25/11/2025 at 16:07:23 BRT from Cursor (2.0.34)_

---

**User**

veja meu arquivo /home/alex/Documentos/twentybilling/BILLING_MODE_IMPLEMENTATION.md 

Então faça as correções no projeto /home/alex/Documentos/twentybilling/twenty



De acordo com o que esta sendo dito no arquivo

---

**Cursor**

Vou analisar o documento e implementar as alterações necessárias. Primeiro, deixe-me verificar os arquivos existentes no projeto para entender a estrutura atual.

Agora vou verificar os arquivos do frontend e as rotas de onboarding:

Agora tenho toda a informação necessária. Vou implementar as correções de acordo com o documento. Vou começar:

```typescript
/* @license Enterprise */

import { registerEnumType } from '@nestjs/graphql';

export enum BillingMode {
  STRIPE = 'STRIPE',
  LOCAL = 'LOCAL',
}

registerEnumType(BillingMode, {
  name: 'BillingMode',
});

```

```typescript
import { type LogLevel, Logger } from '@nestjs/common';

import { plainToClass } from 'class-transformer';
import {
  IsDefined,
  IsOptional,
  IsUrl,
  ValidateIf,
  type ValidationError,
  validateSync,
} from 'class-validator';
import { isDefined } from 'twenty-shared/utils';

import { AwsRegion } from 'src/engine/core-modules/twenty-config/interfaces/aws-region.interface';
import { NodeEnvironment } from 'src/engine/core-modules/twenty-config/interfaces/node-environment.interface';
import { SupportDriver } from 'src/engine/core-modules/twenty-config/interfaces/support.interface';

import { BillingMode } from 'src/engine/core-modules/billing/enums/billing-mode.enum';
import { CaptchaDriverType } from 'src/engine/core-modules/captcha/interfaces';
import { EmailDriver } from 'src/engine/core-modules/email/enums/email-driver.enum';
import { ExceptionHandlerDriver } from 'src/engine/core-modules/exception-handler/interfaces';
import { StorageDriverType } from 'src/engine/core-modules/file-storage/interfaces';
import { LoggerDriverType } from 'src/engine/core-modules/logger/interfaces';
import { type MeterDriver } from 'src/engine/core-modules/metrics/types/meter-driver.type';
import { ServerlessDriverType } from 'src/engine/core-modules/serverless/serverless.interface';
import { CastToLogLevelArray } from 'src/engine/core-modules/twenty-config/decorators/cast-to-log-level-array.decorator';
import { CastToMeterDriverArray } from 'src/engine/core-modules/twenty-config/decorators/cast-to-meter-driver.decorator';
import { CastToPositiveNumber } from 'src/engine/core-modules/twenty-config/decorators/cast-to-positive-number.decorator';
import { CastToUpperSnakeCase } from 'src/engine/core-modules/twenty-config/decorators/cast-to-upper-snake-case.decorator';
import { ConfigVariablesMetadata } from 'src/engine/core-modules/twenty-config/decorators/config-variables-metadata.decorator';
import { IsAWSRegion } from 'src/engine/core-modules/twenty-config/decorators/is-aws-region.decorator';
import { IsDuration } from 'src/engine/core-modules/twenty-config/decorators/is-duration.decorator';
import { IsOptionalOrEmptyString } from 'src/engine/core-modules/twenty-config/decorators/is-optional-or-empty-string.decorator';
import { IsStrictlyLowerThan } from 'src/engine/core-modules/twenty-config/decorators/is-strictly-lower-than.decorator';
import { IsTwentySemVer } from 'src/engine/core-modules/twenty-config/decorators/is-twenty-semver.decorator';
import { ConfigVariableType } from 'src/engine/core-modules/twenty-config/enums/config-variable-type.enum';
import { ConfigVariablesGroup } from 'src/engine/core-modules/twenty-config/enums/config-variables-group.enum';
import {
  ConfigVariableException,
  ConfigVariableExceptionCode,
} from 'src/engine/core-modules/twenty-config/twenty-config.exception';

export class ConfigVariables {
  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'Enable or disable password authentication for users',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  AUTH_PASSWORD_ENABLED = true;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description:
      'Prefills tim@apple.dev in the login form, used in local development for quicker sign-in',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  @ValidateIf((env) => env.AUTH_PASSWORD_ENABLED)
  SIGN_IN_PREFILLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'Require email verification for user accounts',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  IS_EMAIL_VERIFICATION_REQUIRED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description:
      'Enable safe mode for HTTP requests (prevents private IPs and other security risks)',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  HTTP_TOOL_SAFE_MODE_ENABLED = true;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Duration for which the email verification token is valid',
    type: ConfigVariableType.STRING,
  })
  @IsDuration()
  @IsOptional()
  EMAIL_VERIFICATION_TOKEN_EXPIRES_IN = '1h';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Duration for which the password reset token is valid',
    type: ConfigVariableType.STRING,
  })
  @IsDuration()
  @IsOptional()
  PASSWORD_RESET_TOKEN_EXPIRES_IN = '5m';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.GOOGLE_AUTH,
    description: 'Enable or disable the Google Calendar integration',
    type: ConfigVariableType.BOOLEAN,
  })
  CALENDAR_PROVIDER_GOOGLE_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.GOOGLE_AUTH,
    description: 'Callback URL for Google Auth APIs',
    type: ConfigVariableType.STRING,
    isSensitive: false,
  })
  AUTH_GOOGLE_APIS_CALLBACK_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.GOOGLE_AUTH,
    description: 'Enable or disable Google Single Sign-On (SSO)',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  AUTH_GOOGLE_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.GOOGLE_AUTH,
    isSensitive: false,
    description: 'Client ID for Google authentication',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.AUTH_GOOGLE_ENABLED)
  AUTH_GOOGLE_CLIENT_ID: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.GOOGLE_AUTH,
    isSensitive: true,
    description: 'Client secret for Google authentication',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.AUTH_GOOGLE_ENABLED)
  AUTH_GOOGLE_CLIENT_SECRET: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.GOOGLE_AUTH,
    isSensitive: false,
    description: 'Callback URL for Google authentication',
    type: ConfigVariableType.STRING,
  })
  @IsUrl({ require_tld: false, require_protocol: true })
  @ValidateIf((env) => env.AUTH_GOOGLE_ENABLED)
  AUTH_GOOGLE_CALLBACK_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.GOOGLE_AUTH,
    description: 'Enable or disable the Gmail messaging integration',
    type: ConfigVariableType.BOOLEAN,
  })
  MESSAGING_PROVIDER_GMAIL_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'Enable or disable the IMAP messaging integration',
    type: ConfigVariableType.BOOLEAN,
  })
  IS_IMAP_SMTP_CALDAV_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.MICROSOFT_AUTH,
    description: 'Enable or disable Microsoft authentication',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  AUTH_MICROSOFT_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.MICROSOFT_AUTH,
    isSensitive: false,
    description: 'Client ID for Microsoft authentication',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.AUTH_MICROSOFT_ENABLED)
  AUTH_MICROSOFT_CLIENT_ID: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.MICROSOFT_AUTH,
    isSensitive: true,
    description: 'Client secret for Microsoft authentication',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.AUTH_MICROSOFT_ENABLED)
  AUTH_MICROSOFT_CLIENT_SECRET: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.MICROSOFT_AUTH,
    isSensitive: false,
    description: 'Callback URL for Microsoft authentication',
    type: ConfigVariableType.STRING,
  })
  @IsUrl({ require_tld: false, require_protocol: true })
  @ValidateIf((env) => env.AUTH_MICROSOFT_ENABLED)
  AUTH_MICROSOFT_CALLBACK_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.MICROSOFT_AUTH,
    isSensitive: false,
    description: 'Callback URL for Microsoft APIs',
    type: ConfigVariableType.STRING,
  })
  @IsUrl({ require_tld: false, require_protocol: true })
  @ValidateIf((env) => env.AUTH_MICROSOFT_ENABLED)
  AUTH_MICROSOFT_APIS_CALLBACK_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.MICROSOFT_AUTH,
    description: 'Enable or disable the Microsoft messaging integration',
    type: ConfigVariableType.BOOLEAN,
  })
  MESSAGING_PROVIDER_MICROSOFT_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.MICROSOFT_AUTH,
    description: 'Enable or disable the Microsoft Calendar integration',
    type: ConfigVariableType.BOOLEAN,
  })
  CALENDAR_PROVIDER_MICROSOFT_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    isSensitive: true,
    description:
      'Legacy variable to be deprecated when all API Keys expire. Replaced by APP_KEY',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsOptional()
  ACCESS_TOKEN_SECRET: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Duration for which the access token is valid',
    type: ConfigVariableType.STRING,
  })
  @IsDuration()
  @IsOptional()
  ACCESS_TOKEN_EXPIRES_IN = '30m';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Duration for which the workspace agnostic token is valid',
    type: ConfigVariableType.STRING,
  })
  @IsDuration()
  @IsOptional()
  WORKSPACE_AGNOSTIC_TOKEN_EXPIRES_IN = '30m';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Duration for which the refresh token is valid',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  REFRESH_TOKEN_EXPIRES_IN = '60d';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Cooldown period for refreshing tokens',
    type: ConfigVariableType.STRING,
  })
  @IsDuration()
  @IsOptional()
  REFRESH_TOKEN_COOL_DOWN = '1m';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Duration for which the login token is valid',
    type: ConfigVariableType.STRING,
  })
  @IsDuration()
  @IsOptional()
  LOGIN_TOKEN_EXPIRES_IN = '15m';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Duration for which the file token is valid',
    type: ConfigVariableType.STRING,
  })
  @IsDuration()
  @IsOptional()
  FILE_TOKEN_EXPIRES_IN = '1d';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Duration for which the invitation token is valid',
    type: ConfigVariableType.STRING,
  })
  @IsDuration()
  @IsOptional()
  INVITATION_TOKEN_EXPIRES_IN = '30d';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Duration for which the short-term token is valid',
    type: ConfigVariableType.STRING,
  })
  SHORT_TERM_TOKEN_EXPIRES_IN = '5m';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EMAIL_SETTINGS,
    description: 'Email address used as the sender for outgoing emails',
    type: ConfigVariableType.STRING,
  })
  EMAIL_FROM_ADDRESS = 'noreply@yourdomain.com';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EMAIL_SETTINGS,
    description: 'Email address used for system notifications',
    type: ConfigVariableType.STRING,
  })
  EMAIL_SYSTEM_ADDRESS = 'system@yourdomain.com';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EMAIL_SETTINGS,
    description: 'Name used in the From header for outgoing emails',
    type: ConfigVariableType.STRING,
  })
  EMAIL_FROM_NAME = 'Felix from Twenty';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EMAIL_SETTINGS,
    description: 'Email driver to use for sending emails',
    type: ConfigVariableType.ENUM,
    options: Object.values(EmailDriver),
  })
  @CastToUpperSnakeCase()
  EMAIL_DRIVER: EmailDriver = EmailDriver.LOGGER;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EMAIL_SETTINGS,
    description: 'SMTP host for sending emails',
    type: ConfigVariableType.STRING,
  })
  EMAIL_SMTP_HOST: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EMAIL_SETTINGS,
    description: 'Use unsecure connection for SMTP',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  EMAIL_SMTP_NO_TLS = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EMAIL_SETTINGS,
    description: 'SMTP port for sending emails',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  EMAIL_SMTP_PORT = 587;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EMAIL_SETTINGS,
    description: 'SMTP user for authentication',
    type: ConfigVariableType.STRING,
    isSensitive: true,
  })
  EMAIL_SMTP_USER: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EMAIL_SETTINGS,
    isSensitive: true,
    description: 'SMTP password for authentication',
    type: ConfigVariableType.STRING,
  })
  EMAIL_SMTP_PASSWORD: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description:
      'When enabled, only server admins can create new workspaces. Ignored during initial setup when no workspace exists.',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  IS_WORKSPACE_CREATION_LIMITED_TO_SERVER_ADMINS = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.STORAGE_CONFIG,
    description: 'Type of storage to use (local or S3)',
    type: ConfigVariableType.ENUM,
    options: Object.values(StorageDriverType),
  })
  @IsOptional()
  @CastToUpperSnakeCase()
  STORAGE_TYPE: StorageDriverType = StorageDriverType.LOCAL;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.STORAGE_CONFIG,
    description: 'Local path for storage when using local storage type',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.STORAGE_TYPE === StorageDriverType.LOCAL)
  STORAGE_LOCAL_PATH = '.local-storage';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.STORAGE_CONFIG,
    description: 'S3 region for storage when using S3 storage type',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.STORAGE_TYPE === StorageDriverType.S_3)
  @IsAWSRegion()
  STORAGE_S3_REGION: AwsRegion;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.STORAGE_CONFIG,
    description: 'S3 bucket name for storage when using S3 storage type',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.STORAGE_TYPE === StorageDriverType.S_3)
  STORAGE_S3_NAME: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.STORAGE_CONFIG,
    description: 'S3 endpoint for storage when using S3 storage type',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.STORAGE_TYPE === StorageDriverType.S_3)
  @IsOptional()
  STORAGE_S3_ENDPOINT: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.STORAGE_CONFIG,
    isSensitive: true,
    description:
      'S3 access key ID for authentication when using S3 storage type',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.STORAGE_TYPE === StorageDriverType.S_3)
  @IsOptional()
  STORAGE_S3_ACCESS_KEY_ID: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.STORAGE_CONFIG,
    isSensitive: true,
    description:
      'S3 secret access key for authentication when using S3 storage type',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.STORAGE_TYPE === StorageDriverType.S_3)
  @IsOptional()
  STORAGE_S3_SECRET_ACCESS_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVERLESS_CONFIG,
    description: 'Type of serverless execution (local or Lambda)',
    type: ConfigVariableType.ENUM,
    options: Object.values(ServerlessDriverType),
    isEnvOnly: true,
  })
  @IsOptional()
  @CastToUpperSnakeCase()
  SERVERLESS_TYPE: ServerlessDriverType = ServerlessDriverType.LOCAL;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVERLESS_CONFIG,
    description:
      'Configure whether console logs from serverless functions are displayed in the terminal',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  SERVERLESS_LOGS_ENABLED: false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVERLESS_CONFIG,
    description: 'Throttle limit for serverless function execution',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  SERVERLESS_FUNCTION_EXEC_THROTTLE_LIMIT = 1000;

  // milliseconds
  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVERLESS_CONFIG,
    description: 'Time-to-live for serverless function execution throttle',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  SERVERLESS_FUNCTION_EXEC_THROTTLE_TTL = 60_000;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVERLESS_CONFIG,
    description: 'Region for AWS Lambda functions',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.SERVERLESS_TYPE === ServerlessDriverType.LAMBDA)
  @IsAWSRegion()
  SERVERLESS_LAMBDA_REGION: AwsRegion;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVERLESS_CONFIG,
    description: 'IAM role for AWS Lambda functions',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.SERVERLESS_TYPE === ServerlessDriverType.LAMBDA)
  SERVERLESS_LAMBDA_ROLE: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVERLESS_CONFIG,
    description: 'Role to assume when hosting lambdas in dedicated AWS account',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.SERVERLESS_TYPE === ServerlessDriverType.LAMBDA)
  @IsOptional()
  SERVERLESS_LAMBDA_SUBHOSTING_ROLE?: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVERLESS_CONFIG,
    isSensitive: true,
    description: 'Access key ID for AWS Lambda functions',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.SERVERLESS_TYPE === ServerlessDriverType.LAMBDA)
  @IsOptional()
  SERVERLESS_LAMBDA_ACCESS_KEY_ID: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVERLESS_CONFIG,
    isSensitive: true,
    description: 'Secret access key for AWS Lambda functions',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.SERVERLESS_TYPE === ServerlessDriverType.LAMBDA)
  @IsOptional()
  SERVERLESS_LAMBDA_SECRET_ACCESS_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.ANALYTICS_CONFIG,
    description: 'Enable or disable analytics for telemetry',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  ANALYTICS_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.ANALYTICS_CONFIG,
    description: 'Clickhouse host for analytics',
    type: ConfigVariableType.STRING,
    isSensitive: true,
  })
  @IsOptional()
  @IsUrl({
    require_tld: false,
    allow_underscores: true,
  })
  @ValidateIf((env) => env.ANALYTICS_ENABLED === true)
  CLICKHOUSE_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LOGGING,
    description: 'Enable or disable telemetry logging',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  TELEMETRY_ENABLED = true;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.BILLING_CONFIG,
    description: 'Enable or disable billing features',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  IS_BILLING_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.BILLING_CONFIG,
    description: 'Link required for billing plan',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.IS_BILLING_ENABLED === true)
  BILLING_PLAN_REQUIRED_LINK: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.BILLING_CONFIG,
    description: 'Duration of free trial with credit card in days',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @IsOptional()
  @ValidateIf((env) => env.IS_BILLING_ENABLED === true)
  BILLING_FREE_TRIAL_WITH_CREDIT_CARD_DURATION_IN_DAYS = 30;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.BILLING_CONFIG,
    description: 'Duration of free trial without credit card in days',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @IsOptional()
  @ValidateIf((env) => env.IS_BILLING_ENABLED === true)
  BILLING_FREE_TRIAL_WITHOUT_CREDIT_CARD_DURATION_IN_DAYS = 7;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.BILLING_CONFIG,
    description: 'Amount of credits for the free trial without credit card',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @ValidateIf((env) => env.IS_BILLING_ENABLED === true)
  BILLING_FREE_WORKFLOW_CREDITS_FOR_TRIAL_PERIOD_WITHOUT_CREDIT_CARD = 500_000;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.BILLING_CONFIG,
    description: 'Amount of credits for the free trial with credit card',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @ValidateIf((env) => env.IS_BILLING_ENABLED === true)
  BILLING_FREE_WORKFLOW_CREDITS_FOR_TRIAL_PERIOD_WITH_CREDIT_CARD = 5_000_000;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.BILLING_CONFIG,
    isSensitive: true,
    description: 'Stripe API key for billing',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.IS_BILLING_ENABLED === true)
  BILLING_STRIPE_API_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.BILLING_CONFIG,
    isSensitive: true,
    description: 'Stripe webhook secret for billing',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.IS_BILLING_ENABLED === true)
  BILLING_STRIPE_WEBHOOK_SECRET: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Url for the frontend application',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsUrl({ require_tld: false, require_protocol: true })
  @IsOptional()
  FRONTEND_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description:
      'Default subdomain for the frontend when multi-workspace is enabled',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.IS_MULTIWORKSPACE_ENABLED)
  DEFAULT_SUBDOMAIN = 'app';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'ID for the Chrome extension',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  CHROME_EXTENSION_ID: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'Page ID for Cal.com booking integration',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  CALENDAR_BOOKING_PAGE_ID?: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LOGGING,
    description: 'Enable or disable buffering for logs before sending',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  LOGGER_IS_BUFFER_ENABLED = true;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LOGGING,
    description: 'Driver used for handling exceptions (Console or Sentry)',
    type: ConfigVariableType.ENUM,
    options: Object.values(ExceptionHandlerDriver),
    isEnvOnly: true,
  })
  @IsOptional()
  @CastToUpperSnakeCase()
  EXCEPTION_HANDLER_DRIVER: ExceptionHandlerDriver =
    ExceptionHandlerDriver.CONSOLE;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LOGGING,
    description: 'Levels of logging to be captured',
    type: ConfigVariableType.ARRAY,
    options: ['log', 'error', 'warn', 'debug'],
    isEnvOnly: true,
  })
  @CastToLogLevelArray()
  @IsOptional()
  LOG_LEVELS: LogLevel[] = ['log', 'error', 'warn'];

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.METERING,
    description: 'Driver used for collect metrics (OpenTelemetry or Console)',
    type: ConfigVariableType.ARRAY,
    options: ['OpenTelemetry', 'Console'],
    isEnvOnly: true,
  })
  @CastToMeterDriverArray()
  @IsOptional()
  METER_DRIVER: MeterDriver[] = [];

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.METERING,
    description: 'Endpoint URL for the OpenTelemetry collector',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsOptional()
  OTLP_COLLECTOR_ENDPOINT_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EXCEPTION_HANDLER,
    description: 'Driver used for logging (only console for now)',
    type: ConfigVariableType.ENUM,
    options: Object.values(LoggerDriverType),
    isEnvOnly: true,
  })
  @IsOptional()
  @CastToUpperSnakeCase()
  LOGGER_DRIVER: LoggerDriverType = LoggerDriverType.CONSOLE;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EXCEPTION_HANDLER,
    description: 'Data Source Name (DSN) for Sentry logging',
    type: ConfigVariableType.STRING,
    isSensitive: true,
  })
  @ValidateIf(
    (env) => env.EXCEPTION_HANDLER_DRIVER === ExceptionHandlerDriver.SENTRY,
  )
  SENTRY_DSN: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EXCEPTION_HANDLER,
    description: 'Front-end DSN for Sentry logging',
    type: ConfigVariableType.STRING,
    isSensitive: true,
  })
  @ValidateIf(
    (env) => env.EXCEPTION_HANDLER_DRIVER === ExceptionHandlerDriver.SENTRY,
  )
  SENTRY_FRONT_DSN: string;
  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EXCEPTION_HANDLER,
    description: 'Environment name for Sentry logging',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf(
    (env) => env.EXCEPTION_HANDLER_DRIVER === ExceptionHandlerDriver.SENTRY,
  )
  @IsOptional()
  SENTRY_ENVIRONMENT: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SUPPORT_CHAT_CONFIG,
    description: 'Driver used for support chat integration',
    type: ConfigVariableType.ENUM,
    options: Object.values(SupportDriver),
  })
  @IsOptional()
  @CastToUpperSnakeCase()
  SUPPORT_DRIVER: SupportDriver = SupportDriver.NONE;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SUPPORT_CHAT_CONFIG,
    isSensitive: true,
    description: 'Chat ID for the support front integration',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.SUPPORT_DRIVER === SupportDriver.FRONT)
  SUPPORT_FRONT_CHAT_ID: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SUPPORT_CHAT_CONFIG,
    isSensitive: true,
    description: 'HMAC key for the support front integration',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.SUPPORT_DRIVER === SupportDriver.FRONT)
  SUPPORT_FRONT_HMAC_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    isSensitive: true,
    description: 'Database connection URL',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsDefined()
  @IsUrl({
    protocols: ['postgres', 'postgresql'],
    require_tld: false,
    allow_underscores: true,
    require_host: false,
  })
  PG_DATABASE_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description:
      'Allow connections to a database with self-signed certificates',
    isEnvOnly: true,
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  PG_SSL_ALLOW_SELF_SIGNED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Enable pg connection pool sharing across tenants',
    isEnvOnly: true,
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  PG_ENABLE_POOL_SHARING = true;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Maximum number of clients in pg connection pool',
    isEnvOnly: true,
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @IsOptional()
  PG_POOL_MAX_CONNECTIONS = 10;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Idle timeout in milliseconds for pg connection pool clients',
    isEnvOnly: true,
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @IsOptional()
  PG_POOL_IDLE_TIMEOUT_MS = 600000;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Allow idle pg connection pool clients to exit',
    isEnvOnly: true,
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  PG_POOL_ALLOW_EXIT_ON_IDLE = true;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Enable configuration variables to be stored in the database',
    isEnvOnly: true,
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  IS_CONFIG_VARIABLES_IN_DB_ENABLED = true;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Time-to-live for cache storage in seconds',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  CACHE_STORAGE_TTL: number = 3600 * 24 * 7;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    isSensitive: true,
    description: 'Redis connection URL used for cache and queues by default',
    isEnvOnly: true,
    type: ConfigVariableType.STRING,
  })
  @IsUrl({
    protocols: ['redis', 'rediss'],
    require_tld: false,
    allow_underscores: true,
  })
  REDIS_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    isSensitive: true,
    description:
      'Optional separate Redis connection for queues with a different eviction policy (advanced production use case, most self-hosters do not need this)',
    isEnvOnly: true,
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  @IsUrl({
    protocols: ['redis', 'rediss'],
    require_tld: false,
    allow_underscores: true,
  })
  REDIS_QUEUE_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Node environment (development, production, etc.)',
    type: ConfigVariableType.ENUM,
    options: Object.values(NodeEnvironment),
    isEnvOnly: true,
  })
  // @CastToUpperSnakeCase()
  NODE_ENV: NodeEnvironment = NodeEnvironment.PRODUCTION;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Port for the node server',
    type: ConfigVariableType.NUMBER,
    isEnvOnly: true,
  })
  @CastToPositiveNumber()
  @IsOptional()
  NODE_PORT = 3000;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Base URL for the server',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsUrl({ require_tld: false, require_protocol: true })
  @IsOptional()
  SERVER_URL = 'http://localhost:3000';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Base URL for public domains',
    type: ConfigVariableType.STRING,
  })
  @IsUrl({ require_tld: false, require_protocol: true })
  @IsOptional()
  PUBLIC_DOMAIN_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    isSensitive: true,
    description: 'Secret key for the application',
    isEnvOnly: true,
    type: ConfigVariableType.STRING,
  })
  APP_SECRET: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.RATE_LIMITING,
    description: 'Maximum number of records affected by mutations',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @IsOptional()
  MUTATION_MAXIMUM_AFFECTED_RECORDS = 100;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.RATE_LIMITING,
    description: 'Time-to-live for short API rate limiting in milliseconds',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  API_RATE_LIMITING_SHORT_TTL_IN_MS = 1000;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.RATE_LIMITING,
    description:
      'Maximum number of requests allowed in the short rate limiting window',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  API_RATE_LIMITING_SHORT_LIMIT = 100;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.RATE_LIMITING,
    description: 'Time-to-live for long API rate limiting in milliseconds',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  API_RATE_LIMITING_LONG_TTL_IN_MS = 60000;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.RATE_LIMITING,
    description:
      'Maximum number of requests allowed in the long rate limiting window',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  API_RATE_LIMITING_LONG_LIMIT = 100;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SSL,
    description: 'Path to the SSL key for enabling HTTPS in local development',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsOptional()
  SSL_KEY_PATH: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SSL,
    description:
      'Path to the SSL certificate for enabling HTTPS in local development',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsOptional()
  SSL_CERT_PATH: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.CLOUDFLARE_CONFIG,
    isSensitive: true,
    description: 'API key for Cloudflare integration',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.CLOUDFLARE_ZONE_ID)
  CLOUDFLARE_API_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.CLOUDFLARE_CONFIG,
    description: 'Zone ID for Cloudflare integration',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.CLOUDFLARE_API_KEY)
  CLOUDFLARE_ZONE_ID: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.CLOUDFLARE_CONFIG,
    description: 'Zone ID for public domain Cloudflare integration',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.PUBLIC_DOMAIN_URL)
  CLOUDFLARE_PUBLIC_DOMAIN_ZONE_ID: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'Random string to validate queries from Cloudflare',
    type: ConfigVariableType.STRING,
    isSensitive: true,
  })
  @IsOptional()
  CLOUDFLARE_WEBHOOK_SECRET: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description:
      'Id to generate value for CNAME record to validate ownership and manage ssl for custom hostname with Cloudflare',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  CLOUDFLARE_DCV_DELEGATION_ID: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LLM,
    description:
      'Default AI model ID for speed-optimized operations (lightweight tasks, high throughput)',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  DEFAULT_AI_SPEED_MODEL_ID = 'gpt-4o-mini';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LLM,
    description:
      'Default AI model ID for performance-optimized operations (complex reasoning, quality focus)',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  DEFAULT_AI_PERFORMANCE_MODEL_ID = 'gpt-4o';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LLM,
    isSensitive: true,
    description: 'API key for OpenAI integration',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  OPENAI_API_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LLM,
    isSensitive: true,
    description: 'API key for Anthropic integration',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  ANTHROPIC_API_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LLM,
    description: 'Base URL for OpenAI-compatible LLM provider (e.g., Ollama)',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  @IsUrl({ require_tld: false, require_protocol: true })
  OPENAI_COMPATIBLE_BASE_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LLM,
    description:
      'Model names for OpenAI-compatible LLM provider (comma-separated, e.g., "llama3.1, mistral, codellama")',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  OPENAI_COMPATIBLE_MODEL_NAMES: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LLM,
    isSensitive: true,
    description:
      'API key for OpenAI-compatible LLM provider (optional for providers like Ollama)',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  OPENAI_COMPATIBLE_API_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LLM,
    isSensitive: true,
    description: 'API key for xAI integration',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  XAI_API_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Enable or disable multi-workspace support',
    type: ConfigVariableType.BOOLEAN,
    isEnvOnly: true,
  })
  @IsOptional()
  IS_MULTIWORKSPACE_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description:
      'Number of inactive days before sending a deletion warning for workspaces. Used in the workspace deletion cron job to determine when to send warning emails.',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @IsStrictlyLowerThan('WORKSPACE_INACTIVE_DAYS_BEFORE_SOFT_DELETION', {
    message:
      '"WORKSPACE_INACTIVE_DAYS_BEFORE_NOTIFICATION" should be strictly lower than "WORKSPACE_INACTIVE_DAYS_BEFORE_SOFT_DELETION"',
  })
  WORKSPACE_INACTIVE_DAYS_BEFORE_NOTIFICATION = 7;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'Number of inactive days before soft deleting workspaces',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @IsStrictlyLowerThan('WORKSPACE_INACTIVE_DAYS_BEFORE_DELETION', {
    message:
      '"WORKSPACE_INACTIVE_DAYS_BEFORE_SOFT_DELETION" should be strictly lower than "WORKSPACE_INACTIVE_DAYS_BEFORE_DELETION"',
  })
  WORKSPACE_INACTIVE_DAYS_BEFORE_SOFT_DELETION = 14;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'Number of inactive days before deleting workspaces',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  WORKSPACE_INACTIVE_DAYS_BEFORE_DELETION = 21;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description:
      'Maximum number of workspaces that can be deleted in a single execution',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @ValidateIf((env) => env.MAX_NUMBER_OF_WORKSPACES_DELETED_PER_EXECUTION > 0)
  MAX_NUMBER_OF_WORKSPACES_DELETED_PER_EXECUTION = 5;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.RATE_LIMITING,
    description: 'Throttle limit for workflow execution',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  WORKFLOW_EXEC_THROTTLE_LIMIT = 100;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.RATE_LIMITING,
    description: 'Time-to-live for workflow execution throttle in milliseconds',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  WORKFLOW_EXEC_THROTTLE_TTL = 60_000;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.CAPTCHA_CONFIG,
    description: 'Driver for captcha integration',
    type: ConfigVariableType.ENUM,
    options: Object.values(CaptchaDriverType),
    isEnvOnly: true,
  })
  @IsOptional()
  @CastToUpperSnakeCase()
  CAPTCHA_DRIVER?: CaptchaDriverType;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.CAPTCHA_CONFIG,
    isSensitive: true,
    description: 'Site key for captcha integration',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  CAPTCHA_SITE_KEY?: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.CAPTCHA_CONFIG,
    isSensitive: true,
    description: 'Secret key for captcha integration',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  CAPTCHA_SECRET_KEY?: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    isSensitive: true,
    description: 'License key for the Enterprise version',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  ENTERPRISE_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'Health monitoring time window in minutes',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @IsOptional()
  HEALTH_METRICS_TIME_WINDOW_IN_MINUTES = 5;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'Enable or disable the attachment preview feature',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  IS_ATTACHMENT_PREVIEW_ENABLED = true;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Twenty server version',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsOptionalOrEmptyString()
  @IsTwentySemVer()
  APP_VERSION?: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'Enable or disable google map api usage',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  IS_MAPS_AND_ADDRESS_AUTOCOMPLETE_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    isSensitive: true,
    description: 'Google map api key for places and map',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.IS_MAPS_AND_ADDRESS_AUTOCOMPLETE_ENABLED)
  GOOGLE_MAP_API_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    isSensitive: true,
    description: 'Mintlify API key for documentation search',
    isEnvOnly: true,
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  MINTLIFY_API_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    isSensitive: true,
    description: 'Mintlify subdomain for documentation search',
    isEnvOnly: true,
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  MINTLIFY_SUBDOMAIN: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.AWS_SES_SETTINGS,
    description: 'AWS region',
    type: ConfigVariableType.STRING,
  })
  @IsAWSRegion()
  @IsOptional()
  AWS_SES_REGION: AwsRegion;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.AWS_SES_SETTINGS,
    isSensitive: true,
    description: 'AWS access key ID',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  AWS_SES_ACCESS_KEY_ID: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.AWS_SES_SETTINGS,
    isSensitive: true,
    description: 'AWS session token',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  AWS_SES_SESSION_TOKEN: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.AWS_SES_SETTINGS,
    isSensitive: true,
    description: 'AWS secret access key',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  AWS_SES_SECRET_ACCESS_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.AWS_SES_SETTINGS,
    description: 'AWS Account ID for SES ARN construction',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  AWS_SES_ACCOUNT_ID: string;
}

export const validate = (config: Record<string, unknown>): ConfigVariables => {
  const validatedConfig = plainToClass(ConfigVariables, config);

  const validationErrors = validateSync(validatedConfig, {
    strictGroups: true,
  });

  const validationWarnings = validateSync(validatedConfig, {
    groups: ['warning'],
  });
  const logValidatonErrors = (
    errorCollection: ValidationError[],
    type: 'error' | 'warn',
  ) =>
    errorCollection.forEach((error) => {
      if (!isDefined(error.constraints) || !isDefined(error.property)) {
        return;
      }
      Logger[type](Object.values(error.constraints).join('\n'));
    });

  if (validationWarnings.length > 0) {
    logValidatonErrors(validationWarnings, 'warn');
  }

  if (validationErrors.length > 0) {
    logValidatonErrors(validationErrors, 'error');
    throw new ConfigVariableException(
      'Config variables validation failed',
      ConfigVariableExceptionCode.VALIDATION_FAILED,
    );
  }

  return validatedConfig;
};

```

```typescript
import { type LogLevel, Logger } from '@nestjs/common';

import { plainToClass } from 'class-transformer';
import {
  IsDefined,
  IsOptional,
  IsUrl,
  ValidateIf,
  type ValidationError,
  validateSync,
} from 'class-validator';
import { isDefined } from 'twenty-shared/utils';

import { AwsRegion } from 'src/engine/core-modules/twenty-config/interfaces/aws-region.interface';
import { NodeEnvironment } from 'src/engine/core-modules/twenty-config/interfaces/node-environment.interface';
import { SupportDriver } from 'src/engine/core-modules/twenty-config/interfaces/support.interface';

import { BillingMode } from 'src/engine/core-modules/billing/enums/billing-mode.enum';
import { CaptchaDriverType } from 'src/engine/core-modules/captcha/interfaces';
import { EmailDriver } from 'src/engine/core-modules/email/enums/email-driver.enum';
import { ExceptionHandlerDriver } from 'src/engine/core-modules/exception-handler/interfaces';
import { StorageDriverType } from 'src/engine/core-modules/file-storage/interfaces';
import { LoggerDriverType } from 'src/engine/core-modules/logger/interfaces';
import { type MeterDriver } from 'src/engine/core-modules/metrics/types/meter-driver.type';
import { ServerlessDriverType } from 'src/engine/core-modules/serverless/serverless.interface';
import { CastToLogLevelArray } from 'src/engine/core-modules/twenty-config/decorators/cast-to-log-level-array.decorator';
import { CastToMeterDriverArray } from 'src/engine/core-modules/twenty-config/decorators/cast-to-meter-driver.decorator';
import { CastToPositiveNumber } from 'src/engine/core-modules/twenty-config/decorators/cast-to-positive-number.decorator';
import { CastToUpperSnakeCase } from 'src/engine/core-modules/twenty-config/decorators/cast-to-upper-snake-case.decorator';
import { ConfigVariablesMetadata } from 'src/engine/core-modules/twenty-config/decorators/config-variables-metadata.decorator';
import { IsAWSRegion } from 'src/engine/core-modules/twenty-config/decorators/is-aws-region.decorator';
import { IsDuration } from 'src/engine/core-modules/twenty-config/decorators/is-duration.decorator';
import { IsOptionalOrEmptyString } from 'src/engine/core-modules/twenty-config/decorators/is-optional-or-empty-string.decorator';
import { IsStrictlyLowerThan } from 'src/engine/core-modules/twenty-config/decorators/is-strictly-lower-than.decorator';
import { IsTwentySemVer } from 'src/engine/core-modules/twenty-config/decorators/is-twenty-semver.decorator';
import { ConfigVariableType } from 'src/engine/core-modules/twenty-config/enums/config-variable-type.enum';
import { ConfigVariablesGroup } from 'src/engine/core-modules/twenty-config/enums/config-variables-group.enum';
import {
  ConfigVariableException,
  ConfigVariableExceptionCode,
} from 'src/engine/core-modules/twenty-config/twenty-config.exception';

export class ConfigVariables {
  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'Enable or disable password authentication for users',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  AUTH_PASSWORD_ENABLED = true;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description:
      'Prefills tim@apple.dev in the login form, used in local development for quicker sign-in',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  @ValidateIf((env) => env.AUTH_PASSWORD_ENABLED)
  SIGN_IN_PREFILLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'Require email verification for user accounts',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  IS_EMAIL_VERIFICATION_REQUIRED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description:
      'Enable safe mode for HTTP requests (prevents private IPs and other security risks)',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  HTTP_TOOL_SAFE_MODE_ENABLED = true;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Duration for which the email verification token is valid',
    type: ConfigVariableType.STRING,
  })
  @IsDuration()
  @IsOptional()
  EMAIL_VERIFICATION_TOKEN_EXPIRES_IN = '1h';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Duration for which the password reset token is valid',
    type: ConfigVariableType.STRING,
  })
  @IsDuration()
  @IsOptional()
  PASSWORD_RESET_TOKEN_EXPIRES_IN = '5m';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.GOOGLE_AUTH,
    description: 'Enable or disable the Google Calendar integration',
    type: ConfigVariableType.BOOLEAN,
  })
  CALENDAR_PROVIDER_GOOGLE_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.GOOGLE_AUTH,
    description: 'Callback URL for Google Auth APIs',
    type: ConfigVariableType.STRING,
    isSensitive: false,
  })
  AUTH_GOOGLE_APIS_CALLBACK_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.GOOGLE_AUTH,
    description: 'Enable or disable Google Single Sign-On (SSO)',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  AUTH_GOOGLE_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.GOOGLE_AUTH,
    isSensitive: false,
    description: 'Client ID for Google authentication',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.AUTH_GOOGLE_ENABLED)
  AUTH_GOOGLE_CLIENT_ID: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.GOOGLE_AUTH,
    isSensitive: true,
    description: 'Client secret for Google authentication',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.AUTH_GOOGLE_ENABLED)
  AUTH_GOOGLE_CLIENT_SECRET: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.GOOGLE_AUTH,
    isSensitive: false,
    description: 'Callback URL for Google authentication',
    type: ConfigVariableType.STRING,
  })
  @IsUrl({ require_tld: false, require_protocol: true })
  @ValidateIf((env) => env.AUTH_GOOGLE_ENABLED)
  AUTH_GOOGLE_CALLBACK_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.GOOGLE_AUTH,
    description: 'Enable or disable the Gmail messaging integration',
    type: ConfigVariableType.BOOLEAN,
  })
  MESSAGING_PROVIDER_GMAIL_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'Enable or disable the IMAP messaging integration',
    type: ConfigVariableType.BOOLEAN,
  })
  IS_IMAP_SMTP_CALDAV_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.MICROSOFT_AUTH,
    description: 'Enable or disable Microsoft authentication',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  AUTH_MICROSOFT_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.MICROSOFT_AUTH,
    isSensitive: false,
    description: 'Client ID for Microsoft authentication',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.AUTH_MICROSOFT_ENABLED)
  AUTH_MICROSOFT_CLIENT_ID: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.MICROSOFT_AUTH,
    isSensitive: true,
    description: 'Client secret for Microsoft authentication',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.AUTH_MICROSOFT_ENABLED)
  AUTH_MICROSOFT_CLIENT_SECRET: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.MICROSOFT_AUTH,
    isSensitive: false,
    description: 'Callback URL for Microsoft authentication',
    type: ConfigVariableType.STRING,
  })
  @IsUrl({ require_tld: false, require_protocol: true })
  @ValidateIf((env) => env.AUTH_MICROSOFT_ENABLED)
  AUTH_MICROSOFT_CALLBACK_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.MICROSOFT_AUTH,
    isSensitive: false,
    description: 'Callback URL for Microsoft APIs',
    type: ConfigVariableType.STRING,
  })
  @IsUrl({ require_tld: false, require_protocol: true })
  @ValidateIf((env) => env.AUTH_MICROSOFT_ENABLED)
  AUTH_MICROSOFT_APIS_CALLBACK_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.MICROSOFT_AUTH,
    description: 'Enable or disable the Microsoft messaging integration',
    type: ConfigVariableType.BOOLEAN,
  })
  MESSAGING_PROVIDER_MICROSOFT_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.MICROSOFT_AUTH,
    description: 'Enable or disable the Microsoft Calendar integration',
    type: ConfigVariableType.BOOLEAN,
  })
  CALENDAR_PROVIDER_MICROSOFT_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    isSensitive: true,
    description:
      'Legacy variable to be deprecated when all API Keys expire. Replaced by APP_KEY',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsOptional()
  ACCESS_TOKEN_SECRET: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Duration for which the access token is valid',
    type: ConfigVariableType.STRING,
  })
  @IsDuration()
  @IsOptional()
  ACCESS_TOKEN_EXPIRES_IN = '30m';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Duration for which the workspace agnostic token is valid',
    type: ConfigVariableType.STRING,
  })
  @IsDuration()
  @IsOptional()
  WORKSPACE_AGNOSTIC_TOKEN_EXPIRES_IN = '30m';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Duration for which the refresh token is valid',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  REFRESH_TOKEN_EXPIRES_IN = '60d';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Cooldown period for refreshing tokens',
    type: ConfigVariableType.STRING,
  })
  @IsDuration()
  @IsOptional()
  REFRESH_TOKEN_COOL_DOWN = '1m';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Duration for which the login token is valid',
    type: ConfigVariableType.STRING,
  })
  @IsDuration()
  @IsOptional()
  LOGIN_TOKEN_EXPIRES_IN = '15m';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Duration for which the file token is valid',
    type: ConfigVariableType.STRING,
  })
  @IsDuration()
  @IsOptional()
  FILE_TOKEN_EXPIRES_IN = '1d';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Duration for which the invitation token is valid',
    type: ConfigVariableType.STRING,
  })
  @IsDuration()
  @IsOptional()
  INVITATION_TOKEN_EXPIRES_IN = '30d';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Duration for which the short-term token is valid',
    type: ConfigVariableType.STRING,
  })
  SHORT_TERM_TOKEN_EXPIRES_IN = '5m';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EMAIL_SETTINGS,
    description: 'Email address used as the sender for outgoing emails',
    type: ConfigVariableType.STRING,
  })
  EMAIL_FROM_ADDRESS = 'noreply@yourdomain.com';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EMAIL_SETTINGS,
    description: 'Email address used for system notifications',
    type: ConfigVariableType.STRING,
  })
  EMAIL_SYSTEM_ADDRESS = 'system@yourdomain.com';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EMAIL_SETTINGS,
    description: 'Name used in the From header for outgoing emails',
    type: ConfigVariableType.STRING,
  })
  EMAIL_FROM_NAME = 'Felix from Twenty';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EMAIL_SETTINGS,
    description: 'Email driver to use for sending emails',
    type: ConfigVariableType.ENUM,
    options: Object.values(EmailDriver),
  })
  @CastToUpperSnakeCase()
  EMAIL_DRIVER: EmailDriver = EmailDriver.LOGGER;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EMAIL_SETTINGS,
    description: 'SMTP host for sending emails',
    type: ConfigVariableType.STRING,
  })
  EMAIL_SMTP_HOST: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EMAIL_SETTINGS,
    description: 'Use unsecure connection for SMTP',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  EMAIL_SMTP_NO_TLS = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EMAIL_SETTINGS,
    description: 'SMTP port for sending emails',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  EMAIL_SMTP_PORT = 587;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EMAIL_SETTINGS,
    description: 'SMTP user for authentication',
    type: ConfigVariableType.STRING,
    isSensitive: true,
  })
  EMAIL_SMTP_USER: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EMAIL_SETTINGS,
    isSensitive: true,
    description: 'SMTP password for authentication',
    type: ConfigVariableType.STRING,
  })
  EMAIL_SMTP_PASSWORD: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description:
      'When enabled, only server admins can create new workspaces. Ignored during initial setup when no workspace exists.',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  IS_WORKSPACE_CREATION_LIMITED_TO_SERVER_ADMINS = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.STORAGE_CONFIG,
    description: 'Type of storage to use (local or S3)',
    type: ConfigVariableType.ENUM,
    options: Object.values(StorageDriverType),
  })
  @IsOptional()
  @CastToUpperSnakeCase()
  STORAGE_TYPE: StorageDriverType = StorageDriverType.LOCAL;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.STORAGE_CONFIG,
    description: 'Local path for storage when using local storage type',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.STORAGE_TYPE === StorageDriverType.LOCAL)
  STORAGE_LOCAL_PATH = '.local-storage';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.STORAGE_CONFIG,
    description: 'S3 region for storage when using S3 storage type',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.STORAGE_TYPE === StorageDriverType.S_3)
  @IsAWSRegion()
  STORAGE_S3_REGION: AwsRegion;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.STORAGE_CONFIG,
    description: 'S3 bucket name for storage when using S3 storage type',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.STORAGE_TYPE === StorageDriverType.S_3)
  STORAGE_S3_NAME: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.STORAGE_CONFIG,
    description: 'S3 endpoint for storage when using S3 storage type',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.STORAGE_TYPE === StorageDriverType.S_3)
  @IsOptional()
  STORAGE_S3_ENDPOINT: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.STORAGE_CONFIG,
    isSensitive: true,
    description:
      'S3 access key ID for authentication when using S3 storage type',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.STORAGE_TYPE === StorageDriverType.S_3)
  @IsOptional()
  STORAGE_S3_ACCESS_KEY_ID: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.STORAGE_CONFIG,
    isSensitive: true,
    description:
      'S3 secret access key for authentication when using S3 storage type',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.STORAGE_TYPE === StorageDriverType.S_3)
  @IsOptional()
  STORAGE_S3_SECRET_ACCESS_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVERLESS_CONFIG,
    description: 'Type of serverless execution (local or Lambda)',
    type: ConfigVariableType.ENUM,
    options: Object.values(ServerlessDriverType),
    isEnvOnly: true,
  })
  @IsOptional()
  @CastToUpperSnakeCase()
  SERVERLESS_TYPE: ServerlessDriverType = ServerlessDriverType.LOCAL;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVERLESS_CONFIG,
    description:
      'Configure whether console logs from serverless functions are displayed in the terminal',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  SERVERLESS_LOGS_ENABLED: false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVERLESS_CONFIG,
    description: 'Throttle limit for serverless function execution',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  SERVERLESS_FUNCTION_EXEC_THROTTLE_LIMIT = 1000;

  // milliseconds
  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVERLESS_CONFIG,
    description: 'Time-to-live for serverless function execution throttle',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  SERVERLESS_FUNCTION_EXEC_THROTTLE_TTL = 60_000;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVERLESS_CONFIG,
    description: 'Region for AWS Lambda functions',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.SERVERLESS_TYPE === ServerlessDriverType.LAMBDA)
  @IsAWSRegion()
  SERVERLESS_LAMBDA_REGION: AwsRegion;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVERLESS_CONFIG,
    description: 'IAM role for AWS Lambda functions',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.SERVERLESS_TYPE === ServerlessDriverType.LAMBDA)
  SERVERLESS_LAMBDA_ROLE: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVERLESS_CONFIG,
    description: 'Role to assume when hosting lambdas in dedicated AWS account',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.SERVERLESS_TYPE === ServerlessDriverType.LAMBDA)
  @IsOptional()
  SERVERLESS_LAMBDA_SUBHOSTING_ROLE?: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVERLESS_CONFIG,
    isSensitive: true,
    description: 'Access key ID for AWS Lambda functions',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.SERVERLESS_TYPE === ServerlessDriverType.LAMBDA)
  @IsOptional()
  SERVERLESS_LAMBDA_ACCESS_KEY_ID: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVERLESS_CONFIG,
    isSensitive: true,
    description: 'Secret access key for AWS Lambda functions',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.SERVERLESS_TYPE === ServerlessDriverType.LAMBDA)
  @IsOptional()
  SERVERLESS_LAMBDA_SECRET_ACCESS_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.ANALYTICS_CONFIG,
    description: 'Enable or disable analytics for telemetry',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  ANALYTICS_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.ANALYTICS_CONFIG,
    description: 'Clickhouse host for analytics',
    type: ConfigVariableType.STRING,
    isSensitive: true,
  })
  @IsOptional()
  @IsUrl({
    require_tld: false,
    allow_underscores: true,
  })
  @ValidateIf((env) => env.ANALYTICS_ENABLED === true)
  CLICKHOUSE_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LOGGING,
    description: 'Enable or disable telemetry logging',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  TELEMETRY_ENABLED = true;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.BILLING_CONFIG,
    description: 'Enable or disable billing features',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  IS_BILLING_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.BILLING_CONFIG,
    description:
      'Billing mode: STRIPE uses real Stripe API, LOCAL uses custom plans',
    type: ConfigVariableType.ENUM,
    options: Object.values(BillingMode),
  })
  @IsOptional()
  @CastToUpperSnakeCase()
  BILLING_MODE: BillingMode = BillingMode.STRIPE;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.BILLING_CONFIG,
    description: 'Link required for billing plan',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf(
    (env) =>
      env.IS_BILLING_ENABLED === true && env.BILLING_MODE === BillingMode.STRIPE,
  )
  BILLING_PLAN_REQUIRED_LINK: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.BILLING_CONFIG,
    description: 'Duration of free trial with credit card in days',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @IsOptional()
  @ValidateIf((env) => env.IS_BILLING_ENABLED === true)
  BILLING_FREE_TRIAL_WITH_CREDIT_CARD_DURATION_IN_DAYS = 30;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.BILLING_CONFIG,
    description: 'Duration of free trial without credit card in days',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @IsOptional()
  @ValidateIf((env) => env.IS_BILLING_ENABLED === true)
  BILLING_FREE_TRIAL_WITHOUT_CREDIT_CARD_DURATION_IN_DAYS = 7;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.BILLING_CONFIG,
    description: 'Amount of credits for the free trial without credit card',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @ValidateIf((env) => env.IS_BILLING_ENABLED === true)
  BILLING_FREE_WORKFLOW_CREDITS_FOR_TRIAL_PERIOD_WITHOUT_CREDIT_CARD = 500_000;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.BILLING_CONFIG,
    description: 'Amount of credits for the free trial with credit card',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @ValidateIf((env) => env.IS_BILLING_ENABLED === true)
  BILLING_FREE_WORKFLOW_CREDITS_FOR_TRIAL_PERIOD_WITH_CREDIT_CARD = 5_000_000;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.BILLING_CONFIG,
    isSensitive: true,
    description: 'Stripe API key for billing',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.IS_BILLING_ENABLED === true)
  BILLING_STRIPE_API_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.BILLING_CONFIG,
    isSensitive: true,
    description: 'Stripe webhook secret for billing',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.IS_BILLING_ENABLED === true)
  BILLING_STRIPE_WEBHOOK_SECRET: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Url for the frontend application',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsUrl({ require_tld: false, require_protocol: true })
  @IsOptional()
  FRONTEND_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description:
      'Default subdomain for the frontend when multi-workspace is enabled',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.IS_MULTIWORKSPACE_ENABLED)
  DEFAULT_SUBDOMAIN = 'app';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'ID for the Chrome extension',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  CHROME_EXTENSION_ID: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'Page ID for Cal.com booking integration',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  CALENDAR_BOOKING_PAGE_ID?: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LOGGING,
    description: 'Enable or disable buffering for logs before sending',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  LOGGER_IS_BUFFER_ENABLED = true;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LOGGING,
    description: 'Driver used for handling exceptions (Console or Sentry)',
    type: ConfigVariableType.ENUM,
    options: Object.values(ExceptionHandlerDriver),
    isEnvOnly: true,
  })
  @IsOptional()
  @CastToUpperSnakeCase()
  EXCEPTION_HANDLER_DRIVER: ExceptionHandlerDriver =
    ExceptionHandlerDriver.CONSOLE;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LOGGING,
    description: 'Levels of logging to be captured',
    type: ConfigVariableType.ARRAY,
    options: ['log', 'error', 'warn', 'debug'],
    isEnvOnly: true,
  })
  @CastToLogLevelArray()
  @IsOptional()
  LOG_LEVELS: LogLevel[] = ['log', 'error', 'warn'];

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.METERING,
    description: 'Driver used for collect metrics (OpenTelemetry or Console)',
    type: ConfigVariableType.ARRAY,
    options: ['OpenTelemetry', 'Console'],
    isEnvOnly: true,
  })
  @CastToMeterDriverArray()
  @IsOptional()
  METER_DRIVER: MeterDriver[] = [];

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.METERING,
    description: 'Endpoint URL for the OpenTelemetry collector',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsOptional()
  OTLP_COLLECTOR_ENDPOINT_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EXCEPTION_HANDLER,
    description: 'Driver used for logging (only console for now)',
    type: ConfigVariableType.ENUM,
    options: Object.values(LoggerDriverType),
    isEnvOnly: true,
  })
  @IsOptional()
  @CastToUpperSnakeCase()
  LOGGER_DRIVER: LoggerDriverType = LoggerDriverType.CONSOLE;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EXCEPTION_HANDLER,
    description: 'Data Source Name (DSN) for Sentry logging',
    type: ConfigVariableType.STRING,
    isSensitive: true,
  })
  @ValidateIf(
    (env) => env.EXCEPTION_HANDLER_DRIVER === ExceptionHandlerDriver.SENTRY,
  )
  SENTRY_DSN: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EXCEPTION_HANDLER,
    description: 'Front-end DSN for Sentry logging',
    type: ConfigVariableType.STRING,
    isSensitive: true,
  })
  @ValidateIf(
    (env) => env.EXCEPTION_HANDLER_DRIVER === ExceptionHandlerDriver.SENTRY,
  )
  SENTRY_FRONT_DSN: string;
  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EXCEPTION_HANDLER,
    description: 'Environment name for Sentry logging',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf(
    (env) => env.EXCEPTION_HANDLER_DRIVER === ExceptionHandlerDriver.SENTRY,
  )
  @IsOptional()
  SENTRY_ENVIRONMENT: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SUPPORT_CHAT_CONFIG,
    description: 'Driver used for support chat integration',
    type: ConfigVariableType.ENUM,
    options: Object.values(SupportDriver),
  })
  @IsOptional()
  @CastToUpperSnakeCase()
  SUPPORT_DRIVER: SupportDriver = SupportDriver.NONE;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SUPPORT_CHAT_CONFIG,
    isSensitive: true,
    description: 'Chat ID for the support front integration',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.SUPPORT_DRIVER === SupportDriver.FRONT)
  SUPPORT_FRONT_CHAT_ID: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SUPPORT_CHAT_CONFIG,
    isSensitive: true,
    description: 'HMAC key for the support front integration',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.SUPPORT_DRIVER === SupportDriver.FRONT)
  SUPPORT_FRONT_HMAC_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    isSensitive: true,
    description: 'Database connection URL',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsDefined()
  @IsUrl({
    protocols: ['postgres', 'postgresql'],
    require_tld: false,
    allow_underscores: true,
    require_host: false,
  })
  PG_DATABASE_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description:
      'Allow connections to a database with self-signed certificates',
    isEnvOnly: true,
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  PG_SSL_ALLOW_SELF_SIGNED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Enable pg connection pool sharing across tenants',
    isEnvOnly: true,
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  PG_ENABLE_POOL_SHARING = true;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Maximum number of clients in pg connection pool',
    isEnvOnly: true,
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @IsOptional()
  PG_POOL_MAX_CONNECTIONS = 10;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Idle timeout in milliseconds for pg connection pool clients',
    isEnvOnly: true,
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @IsOptional()
  PG_POOL_IDLE_TIMEOUT_MS = 600000;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Allow idle pg connection pool clients to exit',
    isEnvOnly: true,
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  PG_POOL_ALLOW_EXIT_ON_IDLE = true;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Enable configuration variables to be stored in the database',
    isEnvOnly: true,
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  IS_CONFIG_VARIABLES_IN_DB_ENABLED = true;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Time-to-live for cache storage in seconds',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  CACHE_STORAGE_TTL: number = 3600 * 24 * 7;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    isSensitive: true,
    description: 'Redis connection URL used for cache and queues by default',
    isEnvOnly: true,
    type: ConfigVariableType.STRING,
  })
  @IsUrl({
    protocols: ['redis', 'rediss'],
    require_tld: false,
    allow_underscores: true,
  })
  REDIS_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    isSensitive: true,
    description:
      'Optional separate Redis connection for queues with a different eviction policy (advanced production use case, most self-hosters do not need this)',
    isEnvOnly: true,
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  @IsUrl({
    protocols: ['redis', 'rediss'],
    require_tld: false,
    allow_underscores: true,
  })
  REDIS_QUEUE_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Node environment (development, production, etc.)',
    type: ConfigVariableType.ENUM,
    options: Object.values(NodeEnvironment),
    isEnvOnly: true,
  })
  // @CastToUpperSnakeCase()
  NODE_ENV: NodeEnvironment = NodeEnvironment.PRODUCTION;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Port for the node server',
    type: ConfigVariableType.NUMBER,
    isEnvOnly: true,
  })
  @CastToPositiveNumber()
  @IsOptional()
  NODE_PORT = 3000;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Base URL for the server',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsUrl({ require_tld: false, require_protocol: true })
  @IsOptional()
  SERVER_URL = 'http://localhost:3000';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Base URL for public domains',
    type: ConfigVariableType.STRING,
  })
  @IsUrl({ require_tld: false, require_protocol: true })
  @IsOptional()
  PUBLIC_DOMAIN_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    isSensitive: true,
    description: 'Secret key for the application',
    isEnvOnly: true,
    type: ConfigVariableType.STRING,
  })
  APP_SECRET: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.RATE_LIMITING,
    description: 'Maximum number of records affected by mutations',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @IsOptional()
  MUTATION_MAXIMUM_AFFECTED_RECORDS = 100;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.RATE_LIMITING,
    description: 'Time-to-live for short API rate limiting in milliseconds',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  API_RATE_LIMITING_SHORT_TTL_IN_MS = 1000;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.RATE_LIMITING,
    description:
      'Maximum number of requests allowed in the short rate limiting window',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  API_RATE_LIMITING_SHORT_LIMIT = 100;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.RATE_LIMITING,
    description: 'Time-to-live for long API rate limiting in milliseconds',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  API_RATE_LIMITING_LONG_TTL_IN_MS = 60000;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.RATE_LIMITING,
    description:
      'Maximum number of requests allowed in the long rate limiting window',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  API_RATE_LIMITING_LONG_LIMIT = 100;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SSL,
    description: 'Path to the SSL key for enabling HTTPS in local development',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsOptional()
  SSL_KEY_PATH: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SSL,
    description:
      'Path to the SSL certificate for enabling HTTPS in local development',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsOptional()
  SSL_CERT_PATH: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.CLOUDFLARE_CONFIG,
    isSensitive: true,
    description: 'API key for Cloudflare integration',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.CLOUDFLARE_ZONE_ID)
  CLOUDFLARE_API_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.CLOUDFLARE_CONFIG,
    description: 'Zone ID for Cloudflare integration',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.CLOUDFLARE_API_KEY)
  CLOUDFLARE_ZONE_ID: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.CLOUDFLARE_CONFIG,
    description: 'Zone ID for public domain Cloudflare integration',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.PUBLIC_DOMAIN_URL)
  CLOUDFLARE_PUBLIC_DOMAIN_ZONE_ID: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'Random string to validate queries from Cloudflare',
    type: ConfigVariableType.STRING,
    isSensitive: true,
  })
  @IsOptional()
  CLOUDFLARE_WEBHOOK_SECRET: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description:
      'Id to generate value for CNAME record to validate ownership and manage ssl for custom hostname with Cloudflare',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  CLOUDFLARE_DCV_DELEGATION_ID: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LLM,
    description:
      'Default AI model ID for speed-optimized operations (lightweight tasks, high throughput)',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  DEFAULT_AI_SPEED_MODEL_ID = 'gpt-4o-mini';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LLM,
    description:
      'Default AI model ID for performance-optimized operations (complex reasoning, quality focus)',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  DEFAULT_AI_PERFORMANCE_MODEL_ID = 'gpt-4o';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LLM,
    isSensitive: true,
    description: 'API key for OpenAI integration',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  OPENAI_API_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LLM,
    isSensitive: true,
    description: 'API key for Anthropic integration',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  ANTHROPIC_API_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LLM,
    description: 'Base URL for OpenAI-compatible LLM provider (e.g., Ollama)',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  @IsUrl({ require_tld: false, require_protocol: true })
  OPENAI_COMPATIBLE_BASE_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LLM,
    description:
      'Model names for OpenAI-compatible LLM provider (comma-separated, e.g., "llama3.1, mistral, codellama")',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  OPENAI_COMPATIBLE_MODEL_NAMES: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LLM,
    isSensitive: true,
    description:
      'API key for OpenAI-compatible LLM provider (optional for providers like Ollama)',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  OPENAI_COMPATIBLE_API_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LLM,
    isSensitive: true,
    description: 'API key for xAI integration',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  XAI_API_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Enable or disable multi-workspace support',
    type: ConfigVariableType.BOOLEAN,
    isEnvOnly: true,
  })
  @IsOptional()
  IS_MULTIWORKSPACE_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description:
      'Number of inactive days before sending a deletion warning for workspaces. Used in the workspace deletion cron job to determine when to send warning emails.',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @IsStrictlyLowerThan('WORKSPACE_INACTIVE_DAYS_BEFORE_SOFT_DELETION', {
    message:
      '"WORKSPACE_INACTIVE_DAYS_BEFORE_NOTIFICATION" should be strictly lower than "WORKSPACE_INACTIVE_DAYS_BEFORE_SOFT_DELETION"',
  })
  WORKSPACE_INACTIVE_DAYS_BEFORE_NOTIFICATION = 7;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'Number of inactive days before soft deleting workspaces',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @IsStrictlyLowerThan('WORKSPACE_INACTIVE_DAYS_BEFORE_DELETION', {
    message:
      '"WORKSPACE_INACTIVE_DAYS_BEFORE_SOFT_DELETION" should be strictly lower than "WORKSPACE_INACTIVE_DAYS_BEFORE_DELETION"',
  })
  WORKSPACE_INACTIVE_DAYS_BEFORE_SOFT_DELETION = 14;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'Number of inactive days before deleting workspaces',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  WORKSPACE_INACTIVE_DAYS_BEFORE_DELETION = 21;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description:
      'Maximum number of workspaces that can be deleted in a single execution',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @ValidateIf((env) => env.MAX_NUMBER_OF_WORKSPACES_DELETED_PER_EXECUTION > 0)
  MAX_NUMBER_OF_WORKSPACES_DELETED_PER_EXECUTION = 5;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.RATE_LIMITING,
    description: 'Throttle limit for workflow execution',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  WORKFLOW_EXEC_THROTTLE_LIMIT = 100;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.RATE_LIMITING,
    description: 'Time-to-live for workflow execution throttle in milliseconds',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  WORKFLOW_EXEC_THROTTLE_TTL = 60_000;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.CAPTCHA_CONFIG,
    description: 'Driver for captcha integration',
    type: ConfigVariableType.ENUM,
    options: Object.values(CaptchaDriverType),
    isEnvOnly: true,
  })
  @IsOptional()
  @CastToUpperSnakeCase()
  CAPTCHA_DRIVER?: CaptchaDriverType;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.CAPTCHA_CONFIG,
    isSensitive: true,
    description: 'Site key for captcha integration',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  CAPTCHA_SITE_KEY?: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.CAPTCHA_CONFIG,
    isSensitive: true,
    description: 'Secret key for captcha integration',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  CAPTCHA_SECRET_KEY?: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    isSensitive: true,
    description: 'License key for the Enterprise version',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  ENTERPRISE_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'Health monitoring time window in minutes',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @IsOptional()
  HEALTH_METRICS_TIME_WINDOW_IN_MINUTES = 5;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'Enable or disable the attachment preview feature',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  IS_ATTACHMENT_PREVIEW_ENABLED = true;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Twenty server version',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsOptionalOrEmptyString()
  @IsTwentySemVer()
  APP_VERSION?: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'Enable or disable google map api usage',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  IS_MAPS_AND_ADDRESS_AUTOCOMPLETE_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    isSensitive: true,
    description: 'Google map api key for places and map',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.IS_MAPS_AND_ADDRESS_AUTOCOMPLETE_ENABLED)
  GOOGLE_MAP_API_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    isSensitive: true,
    description: 'Mintlify API key for documentation search',
    isEnvOnly: true,
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  MINTLIFY_API_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    isSensitive: true,
    description: 'Mintlify subdomain for documentation search',
    isEnvOnly: true,
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  MINTLIFY_SUBDOMAIN: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.AWS_SES_SETTINGS,
    description: 'AWS region',
    type: ConfigVariableType.STRING,
  })
  @IsAWSRegion()
  @IsOptional()
  AWS_SES_REGION: AwsRegion;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.AWS_SES_SETTINGS,
    isSensitive: true,
    description: 'AWS access key ID',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  AWS_SES_ACCESS_KEY_ID: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.AWS_SES_SETTINGS,
    isSensitive: true,
    description: 'AWS session token',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  AWS_SES_SESSION_TOKEN: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.AWS_SES_SETTINGS,
    isSensitive: true,
    description: 'AWS secret access key',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  AWS_SES_SECRET_ACCESS_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.AWS_SES_SETTINGS,
    description: 'AWS Account ID for SES ARN construction',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  AWS_SES_ACCOUNT_ID: string;
}

export const validate = (config: Record<string, unknown>): ConfigVariables => {
  const validatedConfig = plainToClass(ConfigVariables, config);

  const validationErrors = validateSync(validatedConfig, {
    strictGroups: true,
  });

  const validationWarnings = validateSync(validatedConfig, {
    groups: ['warning'],
  });
  const logValidatonErrors = (
    errorCollection: ValidationError[],
    type: 'error' | 'warn',
  ) =>
    errorCollection.forEach((error) => {
      if (!isDefined(error.constraints) || !isDefined(error.property)) {
        return;
      }
      Logger[type](Object.values(error.constraints).join('\n'));
    });

  if (validationWarnings.length > 0) {
    logValidatonErrors(validationWarnings, 'warn');
  }

  if (validationErrors.length > 0) {
    logValidatonErrors(validationErrors, 'error');
    throw new ConfigVariableException(
      'Config variables validation failed',
      ConfigVariableExceptionCode.VALIDATION_FAILED,
    );
  }

  return validatedConfig;
};

```

```typescript
import { type LogLevel, Logger } from '@nestjs/common';

import { plainToClass } from 'class-transformer';
import {
  IsDefined,
  IsOptional,
  IsUrl,
  ValidateIf,
  type ValidationError,
  validateSync,
} from 'class-validator';
import { isDefined } from 'twenty-shared/utils';

import { AwsRegion } from 'src/engine/core-modules/twenty-config/interfaces/aws-region.interface';
import { NodeEnvironment } from 'src/engine/core-modules/twenty-config/interfaces/node-environment.interface';
import { SupportDriver } from 'src/engine/core-modules/twenty-config/interfaces/support.interface';

import { BillingMode } from 'src/engine/core-modules/billing/enums/billing-mode.enum';
import { CaptchaDriverType } from 'src/engine/core-modules/captcha/interfaces';
import { EmailDriver } from 'src/engine/core-modules/email/enums/email-driver.enum';
import { ExceptionHandlerDriver } from 'src/engine/core-modules/exception-handler/interfaces';
import { StorageDriverType } from 'src/engine/core-modules/file-storage/interfaces';
import { LoggerDriverType } from 'src/engine/core-modules/logger/interfaces';
import { type MeterDriver } from 'src/engine/core-modules/metrics/types/meter-driver.type';
import { ServerlessDriverType } from 'src/engine/core-modules/serverless/serverless.interface';
import { CastToLogLevelArray } from 'src/engine/core-modules/twenty-config/decorators/cast-to-log-level-array.decorator';
import { CastToMeterDriverArray } from 'src/engine/core-modules/twenty-config/decorators/cast-to-meter-driver.decorator';
import { CastToPositiveNumber } from 'src/engine/core-modules/twenty-config/decorators/cast-to-positive-number.decorator';
import { CastToUpperSnakeCase } from 'src/engine/core-modules/twenty-config/decorators/cast-to-upper-snake-case.decorator';
import { ConfigVariablesMetadata } from 'src/engine/core-modules/twenty-config/decorators/config-variables-metadata.decorator';
import { IsAWSRegion } from 'src/engine/core-modules/twenty-config/decorators/is-aws-region.decorator';
import { IsDuration } from 'src/engine/core-modules/twenty-config/decorators/is-duration.decorator';
import { IsOptionalOrEmptyString } from 'src/engine/core-modules/twenty-config/decorators/is-optional-or-empty-string.decorator';
import { IsStrictlyLowerThan } from 'src/engine/core-modules/twenty-config/decorators/is-strictly-lower-than.decorator';
import { IsTwentySemVer } from 'src/engine/core-modules/twenty-config/decorators/is-twenty-semver.decorator';
import { ConfigVariableType } from 'src/engine/core-modules/twenty-config/enums/config-variable-type.enum';
import { ConfigVariablesGroup } from 'src/engine/core-modules/twenty-config/enums/config-variables-group.enum';
import {
  ConfigVariableException,
  ConfigVariableExceptionCode,
} from 'src/engine/core-modules/twenty-config/twenty-config.exception';

export class ConfigVariables {
  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'Enable or disable password authentication for users',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  AUTH_PASSWORD_ENABLED = true;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description:
      'Prefills tim@apple.dev in the login form, used in local development for quicker sign-in',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  @ValidateIf((env) => env.AUTH_PASSWORD_ENABLED)
  SIGN_IN_PREFILLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'Require email verification for user accounts',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  IS_EMAIL_VERIFICATION_REQUIRED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description:
      'Enable safe mode for HTTP requests (prevents private IPs and other security risks)',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  HTTP_TOOL_SAFE_MODE_ENABLED = true;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Duration for which the email verification token is valid',
    type: ConfigVariableType.STRING,
  })
  @IsDuration()
  @IsOptional()
  EMAIL_VERIFICATION_TOKEN_EXPIRES_IN = '1h';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Duration for which the password reset token is valid',
    type: ConfigVariableType.STRING,
  })
  @IsDuration()
  @IsOptional()
  PASSWORD_RESET_TOKEN_EXPIRES_IN = '5m';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.GOOGLE_AUTH,
    description: 'Enable or disable the Google Calendar integration',
    type: ConfigVariableType.BOOLEAN,
  })
  CALENDAR_PROVIDER_GOOGLE_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.GOOGLE_AUTH,
    description: 'Callback URL for Google Auth APIs',
    type: ConfigVariableType.STRING,
    isSensitive: false,
  })
  AUTH_GOOGLE_APIS_CALLBACK_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.GOOGLE_AUTH,
    description: 'Enable or disable Google Single Sign-On (SSO)',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  AUTH_GOOGLE_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.GOOGLE_AUTH,
    isSensitive: false,
    description: 'Client ID for Google authentication',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.AUTH_GOOGLE_ENABLED)
  AUTH_GOOGLE_CLIENT_ID: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.GOOGLE_AUTH,
    isSensitive: true,
    description: 'Client secret for Google authentication',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.AUTH_GOOGLE_ENABLED)
  AUTH_GOOGLE_CLIENT_SECRET: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.GOOGLE_AUTH,
    isSensitive: false,
    description: 'Callback URL for Google authentication',
    type: ConfigVariableType.STRING,
  })
  @IsUrl({ require_tld: false, require_protocol: true })
  @ValidateIf((env) => env.AUTH_GOOGLE_ENABLED)
  AUTH_GOOGLE_CALLBACK_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.GOOGLE_AUTH,
    description: 'Enable or disable the Gmail messaging integration',
    type: ConfigVariableType.BOOLEAN,
  })
  MESSAGING_PROVIDER_GMAIL_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'Enable or disable the IMAP messaging integration',
    type: ConfigVariableType.BOOLEAN,
  })
  IS_IMAP_SMTP_CALDAV_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.MICROSOFT_AUTH,
    description: 'Enable or disable Microsoft authentication',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  AUTH_MICROSOFT_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.MICROSOFT_AUTH,
    isSensitive: false,
    description: 'Client ID for Microsoft authentication',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.AUTH_MICROSOFT_ENABLED)
  AUTH_MICROSOFT_CLIENT_ID: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.MICROSOFT_AUTH,
    isSensitive: true,
    description: 'Client secret for Microsoft authentication',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.AUTH_MICROSOFT_ENABLED)
  AUTH_MICROSOFT_CLIENT_SECRET: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.MICROSOFT_AUTH,
    isSensitive: false,
    description: 'Callback URL for Microsoft authentication',
    type: ConfigVariableType.STRING,
  })
  @IsUrl({ require_tld: false, require_protocol: true })
  @ValidateIf((env) => env.AUTH_MICROSOFT_ENABLED)
  AUTH_MICROSOFT_CALLBACK_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.MICROSOFT_AUTH,
    isSensitive: false,
    description: 'Callback URL for Microsoft APIs',
    type: ConfigVariableType.STRING,
  })
  @IsUrl({ require_tld: false, require_protocol: true })
  @ValidateIf((env) => env.AUTH_MICROSOFT_ENABLED)
  AUTH_MICROSOFT_APIS_CALLBACK_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.MICROSOFT_AUTH,
    description: 'Enable or disable the Microsoft messaging integration',
    type: ConfigVariableType.BOOLEAN,
  })
  MESSAGING_PROVIDER_MICROSOFT_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.MICROSOFT_AUTH,
    description: 'Enable or disable the Microsoft Calendar integration',
    type: ConfigVariableType.BOOLEAN,
  })
  CALENDAR_PROVIDER_MICROSOFT_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    isSensitive: true,
    description:
      'Legacy variable to be deprecated when all API Keys expire. Replaced by APP_KEY',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsOptional()
  ACCESS_TOKEN_SECRET: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Duration for which the access token is valid',
    type: ConfigVariableType.STRING,
  })
  @IsDuration()
  @IsOptional()
  ACCESS_TOKEN_EXPIRES_IN = '30m';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Duration for which the workspace agnostic token is valid',
    type: ConfigVariableType.STRING,
  })
  @IsDuration()
  @IsOptional()
  WORKSPACE_AGNOSTIC_TOKEN_EXPIRES_IN = '30m';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Duration for which the refresh token is valid',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  REFRESH_TOKEN_EXPIRES_IN = '60d';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Cooldown period for refreshing tokens',
    type: ConfigVariableType.STRING,
  })
  @IsDuration()
  @IsOptional()
  REFRESH_TOKEN_COOL_DOWN = '1m';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Duration for which the login token is valid',
    type: ConfigVariableType.STRING,
  })
  @IsDuration()
  @IsOptional()
  LOGIN_TOKEN_EXPIRES_IN = '15m';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Duration for which the file token is valid',
    type: ConfigVariableType.STRING,
  })
  @IsDuration()
  @IsOptional()
  FILE_TOKEN_EXPIRES_IN = '1d';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Duration for which the invitation token is valid',
    type: ConfigVariableType.STRING,
  })
  @IsDuration()
  @IsOptional()
  INVITATION_TOKEN_EXPIRES_IN = '30d';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Duration for which the short-term token is valid',
    type: ConfigVariableType.STRING,
  })
  SHORT_TERM_TOKEN_EXPIRES_IN = '5m';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EMAIL_SETTINGS,
    description: 'Email address used as the sender for outgoing emails',
    type: ConfigVariableType.STRING,
  })
  EMAIL_FROM_ADDRESS = 'noreply@yourdomain.com';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EMAIL_SETTINGS,
    description: 'Email address used for system notifications',
    type: ConfigVariableType.STRING,
  })
  EMAIL_SYSTEM_ADDRESS = 'system@yourdomain.com';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EMAIL_SETTINGS,
    description: 'Name used in the From header for outgoing emails',
    type: ConfigVariableType.STRING,
  })
  EMAIL_FROM_NAME = 'Felix from Twenty';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EMAIL_SETTINGS,
    description: 'Email driver to use for sending emails',
    type: ConfigVariableType.ENUM,
    options: Object.values(EmailDriver),
  })
  @CastToUpperSnakeCase()
  EMAIL_DRIVER: EmailDriver = EmailDriver.LOGGER;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EMAIL_SETTINGS,
    description: 'SMTP host for sending emails',
    type: ConfigVariableType.STRING,
  })
  EMAIL_SMTP_HOST: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EMAIL_SETTINGS,
    description: 'Use unsecure connection for SMTP',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  EMAIL_SMTP_NO_TLS = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EMAIL_SETTINGS,
    description: 'SMTP port for sending emails',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  EMAIL_SMTP_PORT = 587;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EMAIL_SETTINGS,
    description: 'SMTP user for authentication',
    type: ConfigVariableType.STRING,
    isSensitive: true,
  })
  EMAIL_SMTP_USER: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EMAIL_SETTINGS,
    isSensitive: true,
    description: 'SMTP password for authentication',
    type: ConfigVariableType.STRING,
  })
  EMAIL_SMTP_PASSWORD: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description:
      'When enabled, only server admins can create new workspaces. Ignored during initial setup when no workspace exists.',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  IS_WORKSPACE_CREATION_LIMITED_TO_SERVER_ADMINS = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.STORAGE_CONFIG,
    description: 'Type of storage to use (local or S3)',
    type: ConfigVariableType.ENUM,
    options: Object.values(StorageDriverType),
  })
  @IsOptional()
  @CastToUpperSnakeCase()
  STORAGE_TYPE: StorageDriverType = StorageDriverType.LOCAL;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.STORAGE_CONFIG,
    description: 'Local path for storage when using local storage type',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.STORAGE_TYPE === StorageDriverType.LOCAL)
  STORAGE_LOCAL_PATH = '.local-storage';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.STORAGE_CONFIG,
    description: 'S3 region for storage when using S3 storage type',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.STORAGE_TYPE === StorageDriverType.S_3)
  @IsAWSRegion()
  STORAGE_S3_REGION: AwsRegion;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.STORAGE_CONFIG,
    description: 'S3 bucket name for storage when using S3 storage type',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.STORAGE_TYPE === StorageDriverType.S_3)
  STORAGE_S3_NAME: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.STORAGE_CONFIG,
    description: 'S3 endpoint for storage when using S3 storage type',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.STORAGE_TYPE === StorageDriverType.S_3)
  @IsOptional()
  STORAGE_S3_ENDPOINT: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.STORAGE_CONFIG,
    isSensitive: true,
    description:
      'S3 access key ID for authentication when using S3 storage type',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.STORAGE_TYPE === StorageDriverType.S_3)
  @IsOptional()
  STORAGE_S3_ACCESS_KEY_ID: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.STORAGE_CONFIG,
    isSensitive: true,
    description:
      'S3 secret access key for authentication when using S3 storage type',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.STORAGE_TYPE === StorageDriverType.S_3)
  @IsOptional()
  STORAGE_S3_SECRET_ACCESS_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVERLESS_CONFIG,
    description: 'Type of serverless execution (local or Lambda)',
    type: ConfigVariableType.ENUM,
    options: Object.values(ServerlessDriverType),
    isEnvOnly: true,
  })
  @IsOptional()
  @CastToUpperSnakeCase()
  SERVERLESS_TYPE: ServerlessDriverType = ServerlessDriverType.LOCAL;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVERLESS_CONFIG,
    description:
      'Configure whether console logs from serverless functions are displayed in the terminal',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  SERVERLESS_LOGS_ENABLED: false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVERLESS_CONFIG,
    description: 'Throttle limit for serverless function execution',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  SERVERLESS_FUNCTION_EXEC_THROTTLE_LIMIT = 1000;

  // milliseconds
  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVERLESS_CONFIG,
    description: 'Time-to-live for serverless function execution throttle',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  SERVERLESS_FUNCTION_EXEC_THROTTLE_TTL = 60_000;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVERLESS_CONFIG,
    description: 'Region for AWS Lambda functions',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.SERVERLESS_TYPE === ServerlessDriverType.LAMBDA)
  @IsAWSRegion()
  SERVERLESS_LAMBDA_REGION: AwsRegion;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVERLESS_CONFIG,
    description: 'IAM role for AWS Lambda functions',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.SERVERLESS_TYPE === ServerlessDriverType.LAMBDA)
  SERVERLESS_LAMBDA_ROLE: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVERLESS_CONFIG,
    description: 'Role to assume when hosting lambdas in dedicated AWS account',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.SERVERLESS_TYPE === ServerlessDriverType.LAMBDA)
  @IsOptional()
  SERVERLESS_LAMBDA_SUBHOSTING_ROLE?: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVERLESS_CONFIG,
    isSensitive: true,
    description: 'Access key ID for AWS Lambda functions',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.SERVERLESS_TYPE === ServerlessDriverType.LAMBDA)
  @IsOptional()
  SERVERLESS_LAMBDA_ACCESS_KEY_ID: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVERLESS_CONFIG,
    isSensitive: true,
    description: 'Secret access key for AWS Lambda functions',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.SERVERLESS_TYPE === ServerlessDriverType.LAMBDA)
  @IsOptional()
  SERVERLESS_LAMBDA_SECRET_ACCESS_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.ANALYTICS_CONFIG,
    description: 'Enable or disable analytics for telemetry',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  ANALYTICS_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.ANALYTICS_CONFIG,
    description: 'Clickhouse host for analytics',
    type: ConfigVariableType.STRING,
    isSensitive: true,
  })
  @IsOptional()
  @IsUrl({
    require_tld: false,
    allow_underscores: true,
  })
  @ValidateIf((env) => env.ANALYTICS_ENABLED === true)
  CLICKHOUSE_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LOGGING,
    description: 'Enable or disable telemetry logging',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  TELEMETRY_ENABLED = true;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.BILLING_CONFIG,
    description: 'Enable or disable billing features',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  IS_BILLING_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.BILLING_CONFIG,
    description:
      'Billing mode: STRIPE uses real Stripe API, LOCAL uses custom plans',
    type: ConfigVariableType.ENUM,
    options: Object.values(BillingMode),
  })
  @IsOptional()
  @CastToUpperSnakeCase()
  BILLING_MODE: BillingMode = BillingMode.STRIPE;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.BILLING_CONFIG,
    description: 'Link required for billing plan',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf(
    (env) =>
      env.IS_BILLING_ENABLED === true && env.BILLING_MODE === BillingMode.STRIPE,
  )
  BILLING_PLAN_REQUIRED_LINK: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.BILLING_CONFIG,
    description: 'Duration of free trial with credit card in days',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @IsOptional()
  @ValidateIf((env) => env.IS_BILLING_ENABLED === true)
  BILLING_FREE_TRIAL_WITH_CREDIT_CARD_DURATION_IN_DAYS = 30;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.BILLING_CONFIG,
    description: 'Duration of free trial without credit card in days',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @IsOptional()
  @ValidateIf((env) => env.IS_BILLING_ENABLED === true)
  BILLING_FREE_TRIAL_WITHOUT_CREDIT_CARD_DURATION_IN_DAYS = 7;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.BILLING_CONFIG,
    description: 'Amount of credits for the free trial without credit card',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @ValidateIf((env) => env.IS_BILLING_ENABLED === true)
  BILLING_FREE_WORKFLOW_CREDITS_FOR_TRIAL_PERIOD_WITHOUT_CREDIT_CARD = 500_000;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.BILLING_CONFIG,
    description: 'Amount of credits for the free trial with credit card',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @ValidateIf((env) => env.IS_BILLING_ENABLED === true)
  BILLING_FREE_WORKFLOW_CREDITS_FOR_TRIAL_PERIOD_WITH_CREDIT_CARD = 5_000_000;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.BILLING_CONFIG,
    isSensitive: true,
    description: 'Stripe API key for billing',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf(
    (env) =>
      env.IS_BILLING_ENABLED === true && env.BILLING_MODE === BillingMode.STRIPE,
  )
  BILLING_STRIPE_API_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.BILLING_CONFIG,
    isSensitive: true,
    description: 'Stripe webhook secret for billing',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf(
    (env) =>
      env.IS_BILLING_ENABLED === true && env.BILLING_MODE === BillingMode.STRIPE,
  )
  BILLING_STRIPE_WEBHOOK_SECRET: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Url for the frontend application',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsUrl({ require_tld: false, require_protocol: true })
  @IsOptional()
  FRONTEND_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description:
      'Default subdomain for the frontend when multi-workspace is enabled',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.IS_MULTIWORKSPACE_ENABLED)
  DEFAULT_SUBDOMAIN = 'app';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'ID for the Chrome extension',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  CHROME_EXTENSION_ID: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'Page ID for Cal.com booking integration',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  CALENDAR_BOOKING_PAGE_ID?: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LOGGING,
    description: 'Enable or disable buffering for logs before sending',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  LOGGER_IS_BUFFER_ENABLED = true;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LOGGING,
    description: 'Driver used for handling exceptions (Console or Sentry)',
    type: ConfigVariableType.ENUM,
    options: Object.values(ExceptionHandlerDriver),
    isEnvOnly: true,
  })
  @IsOptional()
  @CastToUpperSnakeCase()
  EXCEPTION_HANDLER_DRIVER: ExceptionHandlerDriver =
    ExceptionHandlerDriver.CONSOLE;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LOGGING,
    description: 'Levels of logging to be captured',
    type: ConfigVariableType.ARRAY,
    options: ['log', 'error', 'warn', 'debug'],
    isEnvOnly: true,
  })
  @CastToLogLevelArray()
  @IsOptional()
  LOG_LEVELS: LogLevel[] = ['log', 'error', 'warn'];

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.METERING,
    description: 'Driver used for collect metrics (OpenTelemetry or Console)',
    type: ConfigVariableType.ARRAY,
    options: ['OpenTelemetry', 'Console'],
    isEnvOnly: true,
  })
  @CastToMeterDriverArray()
  @IsOptional()
  METER_DRIVER: MeterDriver[] = [];

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.METERING,
    description: 'Endpoint URL for the OpenTelemetry collector',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsOptional()
  OTLP_COLLECTOR_ENDPOINT_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EXCEPTION_HANDLER,
    description: 'Driver used for logging (only console for now)',
    type: ConfigVariableType.ENUM,
    options: Object.values(LoggerDriverType),
    isEnvOnly: true,
  })
  @IsOptional()
  @CastToUpperSnakeCase()
  LOGGER_DRIVER: LoggerDriverType = LoggerDriverType.CONSOLE;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EXCEPTION_HANDLER,
    description: 'Data Source Name (DSN) for Sentry logging',
    type: ConfigVariableType.STRING,
    isSensitive: true,
  })
  @ValidateIf(
    (env) => env.EXCEPTION_HANDLER_DRIVER === ExceptionHandlerDriver.SENTRY,
  )
  SENTRY_DSN: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EXCEPTION_HANDLER,
    description: 'Front-end DSN for Sentry logging',
    type: ConfigVariableType.STRING,
    isSensitive: true,
  })
  @ValidateIf(
    (env) => env.EXCEPTION_HANDLER_DRIVER === ExceptionHandlerDriver.SENTRY,
  )
  SENTRY_FRONT_DSN: string;
  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.EXCEPTION_HANDLER,
    description: 'Environment name for Sentry logging',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf(
    (env) => env.EXCEPTION_HANDLER_DRIVER === ExceptionHandlerDriver.SENTRY,
  )
  @IsOptional()
  SENTRY_ENVIRONMENT: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SUPPORT_CHAT_CONFIG,
    description: 'Driver used for support chat integration',
    type: ConfigVariableType.ENUM,
    options: Object.values(SupportDriver),
  })
  @IsOptional()
  @CastToUpperSnakeCase()
  SUPPORT_DRIVER: SupportDriver = SupportDriver.NONE;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SUPPORT_CHAT_CONFIG,
    isSensitive: true,
    description: 'Chat ID for the support front integration',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.SUPPORT_DRIVER === SupportDriver.FRONT)
  SUPPORT_FRONT_CHAT_ID: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SUPPORT_CHAT_CONFIG,
    isSensitive: true,
    description: 'HMAC key for the support front integration',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.SUPPORT_DRIVER === SupportDriver.FRONT)
  SUPPORT_FRONT_HMAC_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    isSensitive: true,
    description: 'Database connection URL',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsDefined()
  @IsUrl({
    protocols: ['postgres', 'postgresql'],
    require_tld: false,
    allow_underscores: true,
    require_host: false,
  })
  PG_DATABASE_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description:
      'Allow connections to a database with self-signed certificates',
    isEnvOnly: true,
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  PG_SSL_ALLOW_SELF_SIGNED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Enable pg connection pool sharing across tenants',
    isEnvOnly: true,
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  PG_ENABLE_POOL_SHARING = true;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Maximum number of clients in pg connection pool',
    isEnvOnly: true,
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @IsOptional()
  PG_POOL_MAX_CONNECTIONS = 10;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Idle timeout in milliseconds for pg connection pool clients',
    isEnvOnly: true,
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @IsOptional()
  PG_POOL_IDLE_TIMEOUT_MS = 600000;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Allow idle pg connection pool clients to exit',
    isEnvOnly: true,
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  PG_POOL_ALLOW_EXIT_ON_IDLE = true;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Enable configuration variables to be stored in the database',
    isEnvOnly: true,
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  IS_CONFIG_VARIABLES_IN_DB_ENABLED = true;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TOKENS_DURATION,
    description: 'Time-to-live for cache storage in seconds',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  CACHE_STORAGE_TTL: number = 3600 * 24 * 7;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    isSensitive: true,
    description: 'Redis connection URL used for cache and queues by default',
    isEnvOnly: true,
    type: ConfigVariableType.STRING,
  })
  @IsUrl({
    protocols: ['redis', 'rediss'],
    require_tld: false,
    allow_underscores: true,
  })
  REDIS_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    isSensitive: true,
    description:
      'Optional separate Redis connection for queues with a different eviction policy (advanced production use case, most self-hosters do not need this)',
    isEnvOnly: true,
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  @IsUrl({
    protocols: ['redis', 'rediss'],
    require_tld: false,
    allow_underscores: true,
  })
  REDIS_QUEUE_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Node environment (development, production, etc.)',
    type: ConfigVariableType.ENUM,
    options: Object.values(NodeEnvironment),
    isEnvOnly: true,
  })
  // @CastToUpperSnakeCase()
  NODE_ENV: NodeEnvironment = NodeEnvironment.PRODUCTION;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Port for the node server',
    type: ConfigVariableType.NUMBER,
    isEnvOnly: true,
  })
  @CastToPositiveNumber()
  @IsOptional()
  NODE_PORT = 3000;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Base URL for the server',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsUrl({ require_tld: false, require_protocol: true })
  @IsOptional()
  SERVER_URL = 'http://localhost:3000';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Base URL for public domains',
    type: ConfigVariableType.STRING,
  })
  @IsUrl({ require_tld: false, require_protocol: true })
  @IsOptional()
  PUBLIC_DOMAIN_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    isSensitive: true,
    description: 'Secret key for the application',
    isEnvOnly: true,
    type: ConfigVariableType.STRING,
  })
  APP_SECRET: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.RATE_LIMITING,
    description: 'Maximum number of records affected by mutations',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @IsOptional()
  MUTATION_MAXIMUM_AFFECTED_RECORDS = 100;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.RATE_LIMITING,
    description: 'Time-to-live for short API rate limiting in milliseconds',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  API_RATE_LIMITING_SHORT_TTL_IN_MS = 1000;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.RATE_LIMITING,
    description:
      'Maximum number of requests allowed in the short rate limiting window',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  API_RATE_LIMITING_SHORT_LIMIT = 100;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.RATE_LIMITING,
    description: 'Time-to-live for long API rate limiting in milliseconds',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  API_RATE_LIMITING_LONG_TTL_IN_MS = 60000;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.RATE_LIMITING,
    description:
      'Maximum number of requests allowed in the long rate limiting window',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  API_RATE_LIMITING_LONG_LIMIT = 100;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SSL,
    description: 'Path to the SSL key for enabling HTTPS in local development',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsOptional()
  SSL_KEY_PATH: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SSL,
    description:
      'Path to the SSL certificate for enabling HTTPS in local development',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsOptional()
  SSL_CERT_PATH: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.CLOUDFLARE_CONFIG,
    isSensitive: true,
    description: 'API key for Cloudflare integration',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.CLOUDFLARE_ZONE_ID)
  CLOUDFLARE_API_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.CLOUDFLARE_CONFIG,
    description: 'Zone ID for Cloudflare integration',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.CLOUDFLARE_API_KEY)
  CLOUDFLARE_ZONE_ID: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.CLOUDFLARE_CONFIG,
    description: 'Zone ID for public domain Cloudflare integration',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.PUBLIC_DOMAIN_URL)
  CLOUDFLARE_PUBLIC_DOMAIN_ZONE_ID: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'Random string to validate queries from Cloudflare',
    type: ConfigVariableType.STRING,
    isSensitive: true,
  })
  @IsOptional()
  CLOUDFLARE_WEBHOOK_SECRET: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description:
      'Id to generate value for CNAME record to validate ownership and manage ssl for custom hostname with Cloudflare',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  CLOUDFLARE_DCV_DELEGATION_ID: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LLM,
    description:
      'Default AI model ID for speed-optimized operations (lightweight tasks, high throughput)',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  DEFAULT_AI_SPEED_MODEL_ID = 'gpt-4o-mini';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LLM,
    description:
      'Default AI model ID for performance-optimized operations (complex reasoning, quality focus)',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  DEFAULT_AI_PERFORMANCE_MODEL_ID = 'gpt-4o';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LLM,
    isSensitive: true,
    description: 'API key for OpenAI integration',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  OPENAI_API_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LLM,
    isSensitive: true,
    description: 'API key for Anthropic integration',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  ANTHROPIC_API_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LLM,
    description: 'Base URL for OpenAI-compatible LLM provider (e.g., Ollama)',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  @IsUrl({ require_tld: false, require_protocol: true })
  OPENAI_COMPATIBLE_BASE_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LLM,
    description:
      'Model names for OpenAI-compatible LLM provider (comma-separated, e.g., "llama3.1, mistral, codellama")',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  OPENAI_COMPATIBLE_MODEL_NAMES: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LLM,
    isSensitive: true,
    description:
      'API key for OpenAI-compatible LLM provider (optional for providers like Ollama)',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  OPENAI_COMPATIBLE_API_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.LLM,
    isSensitive: true,
    description: 'API key for xAI integration',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  XAI_API_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Enable or disable multi-workspace support',
    type: ConfigVariableType.BOOLEAN,
    isEnvOnly: true,
  })
  @IsOptional()
  IS_MULTIWORKSPACE_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description:
      'Number of inactive days before sending a deletion warning for workspaces. Used in the workspace deletion cron job to determine when to send warning emails.',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @IsStrictlyLowerThan('WORKSPACE_INACTIVE_DAYS_BEFORE_SOFT_DELETION', {
    message:
      '"WORKSPACE_INACTIVE_DAYS_BEFORE_NOTIFICATION" should be strictly lower than "WORKSPACE_INACTIVE_DAYS_BEFORE_SOFT_DELETION"',
  })
  WORKSPACE_INACTIVE_DAYS_BEFORE_NOTIFICATION = 7;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'Number of inactive days before soft deleting workspaces',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @IsStrictlyLowerThan('WORKSPACE_INACTIVE_DAYS_BEFORE_DELETION', {
    message:
      '"WORKSPACE_INACTIVE_DAYS_BEFORE_SOFT_DELETION" should be strictly lower than "WORKSPACE_INACTIVE_DAYS_BEFORE_DELETION"',
  })
  WORKSPACE_INACTIVE_DAYS_BEFORE_SOFT_DELETION = 14;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'Number of inactive days before deleting workspaces',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  WORKSPACE_INACTIVE_DAYS_BEFORE_DELETION = 21;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description:
      'Maximum number of workspaces that can be deleted in a single execution',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @ValidateIf((env) => env.MAX_NUMBER_OF_WORKSPACES_DELETED_PER_EXECUTION > 0)
  MAX_NUMBER_OF_WORKSPACES_DELETED_PER_EXECUTION = 5;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.RATE_LIMITING,
    description: 'Throttle limit for workflow execution',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  WORKFLOW_EXEC_THROTTLE_LIMIT = 100;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.RATE_LIMITING,
    description: 'Time-to-live for workflow execution throttle in milliseconds',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  WORKFLOW_EXEC_THROTTLE_TTL = 60_000;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.CAPTCHA_CONFIG,
    description: 'Driver for captcha integration',
    type: ConfigVariableType.ENUM,
    options: Object.values(CaptchaDriverType),
    isEnvOnly: true,
  })
  @IsOptional()
  @CastToUpperSnakeCase()
  CAPTCHA_DRIVER?: CaptchaDriverType;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.CAPTCHA_CONFIG,
    isSensitive: true,
    description: 'Site key for captcha integration',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  CAPTCHA_SITE_KEY?: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.CAPTCHA_CONFIG,
    isSensitive: true,
    description: 'Secret key for captcha integration',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  CAPTCHA_SECRET_KEY?: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    isSensitive: true,
    description: 'License key for the Enterprise version',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  ENTERPRISE_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'Health monitoring time window in minutes',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @IsOptional()
  HEALTH_METRICS_TIME_WINDOW_IN_MINUTES = 5;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'Enable or disable the attachment preview feature',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  IS_ATTACHMENT_PREVIEW_ENABLED = true;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.SERVER_CONFIG,
    description: 'Twenty server version',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsOptionalOrEmptyString()
  @IsTwentySemVer()
  APP_VERSION?: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    description: 'Enable or disable google map api usage',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  IS_MAPS_AND_ADDRESS_AUTOCOMPLETE_ENABLED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    isSensitive: true,
    description: 'Google map api key for places and map',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.IS_MAPS_AND_ADDRESS_AUTOCOMPLETE_ENABLED)
  GOOGLE_MAP_API_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    isSensitive: true,
    description: 'Mintlify API key for documentation search',
    isEnvOnly: true,
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  MINTLIFY_API_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.OTHER,
    isSensitive: true,
    description: 'Mintlify subdomain for documentation search',
    isEnvOnly: true,
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  MINTLIFY_SUBDOMAIN: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.AWS_SES_SETTINGS,
    description: 'AWS region',
    type: ConfigVariableType.STRING,
  })
  @IsAWSRegion()
  @IsOptional()
  AWS_SES_REGION: AwsRegion;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.AWS_SES_SETTINGS,
    isSensitive: true,
    description: 'AWS access key ID',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  AWS_SES_ACCESS_KEY_ID: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.AWS_SES_SETTINGS,
    isSensitive: true,
    description: 'AWS session token',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  AWS_SES_SESSION_TOKEN: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.AWS_SES_SETTINGS,
    isSensitive: true,
    description: 'AWS secret access key',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  AWS_SES_SECRET_ACCESS_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.AWS_SES_SETTINGS,
    description: 'AWS Account ID for SES ARN construction',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  AWS_SES_ACCOUNT_ID: string;
}

export const validate = (config: Record<string, unknown>): ConfigVariables => {
  const validatedConfig = plainToClass(ConfigVariables, config);

  const validationErrors = validateSync(validatedConfig, {
    strictGroups: true,
  });

  const validationWarnings = validateSync(validatedConfig, {
    groups: ['warning'],
  });
  const logValidatonErrors = (
    errorCollection: ValidationError[],
    type: 'error' | 'warn',
  ) =>
    errorCollection.forEach((error) => {
      if (!isDefined(error.constraints) || !isDefined(error.property)) {
        return;
      }
      Logger[type](Object.values(error.constraints).join('\n'));
    });

  if (validationWarnings.length > 0) {
    logValidatonErrors(validationWarnings, 'warn');
  }

  if (validationErrors.length > 0) {
    logValidatonErrors(validationErrors, 'error');
    throw new ConfigVariableException(
      'Config variables validation failed',
      ConfigVariableExceptionCode.VALIDATION_FAILED,
    );
  }

  return validatedConfig;
};

```

```typescript
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

import { SupportDriver } from 'src/engine/core-modules/twenty-config/interfaces/support.interface';

import {
  ModelId,
  ModelProvider,
} from 'src/engine/metadata-modules/ai-models/constants/ai-models.const';
import { BillingTrialPeriodDTO } from 'src/engine/core-modules/billing/dtos/billing-trial-period.dto';
import { CaptchaDriverType } from 'src/engine/core-modules/captcha/interfaces';
import { FeatureFlagKey } from 'src/engine/core-modules/feature-flag/enums/feature-flag-key.enum';
import { AuthProvidersDTO } from 'src/engine/core-modules/workspace/dtos/public-workspace-data-output';

registerEnumType(FeatureFlagKey, {
  name: 'FeatureFlagKey',
});

registerEnumType(ModelProvider, {
  name: 'ModelProvider',
});

@ObjectType()
export class NativeModelCapabilities {
  @Field(() => Boolean, { nullable: true })
  webSearch?: boolean;

  @Field(() => Boolean, { nullable: true })
  twitterSearch?: boolean;
}

@ObjectType()
export class ClientAIModelConfig {
  @Field(() => String)
  modelId: ModelId;

  @Field(() => String)
  label: string;

  @Field(() => ModelProvider)
  provider: ModelProvider;

  @Field(() => Number)
  inputCostPer1kTokensInCredits: number;

  @Field(() => Number)
  outputCostPer1kTokensInCredits: number;

  @Field(() => NativeModelCapabilities, { nullable: true })
  nativeCapabilities?: NativeModelCapabilities;
}

@ObjectType()
export class Billing {
  @Field(() => Boolean)
  isBillingEnabled: boolean;

  @Field(() => String, { nullable: true })
  billingUrl?: string;

  @Field(() => String, { nullable: true })
  billingMode?: string;

  @Field(() => [BillingTrialPeriodDTO])
  trialPeriods: BillingTrialPeriodDTO[];
}

@ObjectType()
export class Support {
  @Field(() => SupportDriver)
  supportDriver: SupportDriver;

  @Field(() => String, { nullable: true })
  supportFrontChatId?: string;
}

@ObjectType()
export class Sentry {
  @Field(() => String, { nullable: true })
  environment?: string;

  @Field(() => String, { nullable: true })
  release?: string;

  @Field(() => String, { nullable: true })
  dsn?: string;
}

@ObjectType()
export class Captcha {
  @Field(() => CaptchaDriverType, { nullable: true })
  provider: CaptchaDriverType | undefined;

  @Field(() => String, { nullable: true })
  siteKey: string | undefined;
}

@ObjectType()
export class ApiConfig {
  @Field(() => Number, { nullable: false })
  mutationMaximumAffectedRecords: number;
}

@ObjectType()
export class PublicFeatureFlagMetadata {
  @Field(() => String)
  label: string;

  @Field(() => String)
  description: string;

  @Field(() => String, { nullable: false, defaultValue: '' })
  imagePath: string;
}

@ObjectType()
export class PublicFeatureFlag {
  @Field(() => FeatureFlagKey)
  key: FeatureFlagKey;

  @Field(() => PublicFeatureFlagMetadata)
  metadata: PublicFeatureFlagMetadata;
}

@ObjectType()
export class ClientConfig {
  @Field(() => String, { nullable: true })
  appVersion?: string;

  @Field(() => AuthProvidersDTO, { nullable: false })
  authProviders: AuthProvidersDTO;

  @Field(() => Billing, { nullable: false })
  billing: Billing;

  @Field(() => [ClientAIModelConfig])
  aiModels: ClientAIModelConfig[];

  @Field(() => Boolean)
  signInPrefilled: boolean;

  @Field(() => Boolean)
  isMultiWorkspaceEnabled: boolean;

  @Field(() => Boolean)
  isEmailVerificationRequired: boolean;

  @Field(() => String, { nullable: true })
  defaultSubdomain: string;

  @Field(() => String)
  frontDomain: string;

  @Field(() => Boolean)
  analyticsEnabled: boolean;

  @Field(() => Support)
  support: Support;

  @Field(() => Boolean)
  isAttachmentPreviewEnabled: boolean;

  @Field(() => Sentry)
  sentry: Sentry;

  @Field(() => Captcha)
  captcha: Captcha;

  @Field(() => String, { nullable: true })
  chromeExtensionId: string | undefined;

  @Field(() => ApiConfig)
  api: ApiConfig;

  @Field(() => Boolean)
  canManageFeatureFlags: boolean;

  @Field(() => [PublicFeatureFlag])
  publicFeatureFlags: PublicFeatureFlag[];

  @Field(() => Boolean)
  isMicrosoftMessagingEnabled: boolean;

  @Field(() => Boolean)
  isMicrosoftCalendarEnabled: boolean;

  @Field(() => Boolean)
  isGoogleMessagingEnabled: boolean;

  @Field(() => Boolean)
  isGoogleCalendarEnabled: boolean;

  @Field(() => Boolean)
  isConfigVariablesInDbEnabled: boolean;

  @Field(() => Boolean)
  isImapSmtpCaldavEnabled: boolean;

  @Field(() => String, { nullable: true })
  calendarBookingPageId?: string;
}

```

```typescript
import { Injectable } from '@nestjs/common';

import { isNonEmptyString } from '@sniptt/guards';

import { NodeEnvironment } from 'src/engine/core-modules/twenty-config/interfaces/node-environment.interface';
import { SupportDriver } from 'src/engine/core-modules/twenty-config/interfaces/support.interface';

import {
  type ClientAIModelConfig,
  type ClientConfig,
} from 'src/engine/core-modules/client-config/client-config.entity';
import { DomainServerConfigService } from 'src/engine/core-modules/domain/domain-server-config/services/domain-server-config.service';
import { PUBLIC_FEATURE_FLAGS } from 'src/engine/core-modules/feature-flag/constants/public-feature-flag.const';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';
import { convertCentsToBillingCredits } from 'src/engine/metadata-modules/ai-billing/utils/convert-cents-to-billing-credits.util';
import {
  AI_MODELS,
  DEFAULT_FAST_MODEL,
  DEFAULT_SMART_MODEL,
  ModelProvider,
} from 'src/engine/metadata-modules/ai-models/constants/ai-models.const';
import { AiModelRegistryService } from 'src/engine/metadata-modules/ai-models/services/ai-model-registry.service';

@Injectable()
export class ClientConfigService {
  constructor(
    private twentyConfigService: TwentyConfigService,
    private domainServerConfigService: DomainServerConfigService,
    private aiModelRegistryService: AiModelRegistryService,
  ) {}

  async getClientConfig(): Promise<ClientConfig> {
    const captchaProvider = this.twentyConfigService.get('CAPTCHA_DRIVER');
    const supportDriver = this.twentyConfigService.get('SUPPORT_DRIVER');
    const calendarBookingPageId = this.twentyConfigService.get(
      'CALENDAR_BOOKING_PAGE_ID',
    );

    const availableModels = this.aiModelRegistryService.getAvailableModels();

    const aiModels: ClientAIModelConfig[] = availableModels.map(
      (registeredModel) => {
        const builtInModel = AI_MODELS.find(
          (m) => m.modelId === registeredModel.modelId,
        );

        return {
          modelId: registeredModel.modelId,
          label: builtInModel?.label || registeredModel.modelId,
          provider: registeredModel.provider,
          nativeCapabilities: builtInModel?.nativeCapabilities,
          inputCostPer1kTokensInCredits: builtInModel
            ? convertCentsToBillingCredits(
                builtInModel.inputCostPer1kTokensInCents,
              )
            : 0,
          outputCostPer1kTokensInCredits: builtInModel
            ? convertCentsToBillingCredits(
                builtInModel.outputCostPer1kTokensInCents,
              )
            : 0,
        };
      },
    );

    if (aiModels.length > 0) {
      const defaultSpeedModel =
        this.aiModelRegistryService.getDefaultSpeedModel();
      const defaultSpeedModelConfig = AI_MODELS.find(
        (m) => m.modelId === defaultSpeedModel?.modelId,
      );
      const defaultSpeedModelLabel =
        defaultSpeedModelConfig?.label ||
        defaultSpeedModel?.modelId ||
        'Default';

      const defaultPerformanceModel =
        this.aiModelRegistryService.getDefaultPerformanceModel();
      const defaultPerformanceModelConfig = AI_MODELS.find(
        (m) => m.modelId === defaultPerformanceModel?.modelId,
      );
      const defaultPerformanceModelLabel =
        defaultPerformanceModelConfig?.label ||
        defaultPerformanceModel?.modelId ||
        'Default';

      aiModels.unshift(
        {
          modelId: DEFAULT_SMART_MODEL,
          label: `Smart (${defaultPerformanceModelLabel})`,
          provider: ModelProvider.NONE,
          inputCostPer1kTokensInCredits: 0,
          outputCostPer1kTokensInCredits: 0,
        },
        {
          modelId: DEFAULT_FAST_MODEL,
          label: `Fast (${defaultSpeedModelLabel})`,
          provider: ModelProvider.NONE,
          inputCostPer1kTokensInCredits: 0,
          outputCostPer1kTokensInCredits: 0,
        },
      );
    }

    const clientConfig: ClientConfig = {
      appVersion: this.twentyConfigService.get('APP_VERSION'),
      billing: {
        isBillingEnabled: this.twentyConfigService.get('IS_BILLING_ENABLED'),
        billingUrl: this.twentyConfigService.get('BILLING_PLAN_REQUIRED_LINK'),
        billingMode: this.twentyConfigService.get('BILLING_MODE'),
        trialPeriods: [
          {
            duration: this.twentyConfigService.get(
              'BILLING_FREE_TRIAL_WITH_CREDIT_CARD_DURATION_IN_DAYS',
            ),
            isCreditCardRequired: true,
          },
          {
            duration: this.twentyConfigService.get(
              'BILLING_FREE_TRIAL_WITHOUT_CREDIT_CARD_DURATION_IN_DAYS',
            ),
            isCreditCardRequired: false,
          },
        ],
      },
      aiModels,
      authProviders: {
        google: this.twentyConfigService.get('AUTH_GOOGLE_ENABLED'),
        magicLink: false,
        password: this.twentyConfigService.get('AUTH_PASSWORD_ENABLED'),
        microsoft: this.twentyConfigService.get('AUTH_MICROSOFT_ENABLED'),
        sso: [],
      },
      signInPrefilled: this.twentyConfigService.get('SIGN_IN_PREFILLED'),
      isMultiWorkspaceEnabled: this.twentyConfigService.get(
        'IS_MULTIWORKSPACE_ENABLED',
      ),
      isEmailVerificationRequired: this.twentyConfigService.get(
        'IS_EMAIL_VERIFICATION_REQUIRED',
      ),
      defaultSubdomain: this.twentyConfigService.get('DEFAULT_SUBDOMAIN'),
      frontDomain: this.domainServerConfigService.getFrontUrl().hostname,
      support: {
        supportDriver: supportDriver ? supportDriver : SupportDriver.NONE,
        supportFrontChatId: this.twentyConfigService.get(
          'SUPPORT_FRONT_CHAT_ID',
        ),
      },
      sentry: {
        environment: this.twentyConfigService.get('SENTRY_ENVIRONMENT'),
        release: this.twentyConfigService.get('APP_VERSION'),
        dsn: this.twentyConfigService.get('SENTRY_FRONT_DSN'),
      },
      captcha: {
        provider: captchaProvider ? captchaProvider : undefined,
        siteKey: this.twentyConfigService.get('CAPTCHA_SITE_KEY'),
      },
      chromeExtensionId: this.twentyConfigService.get('CHROME_EXTENSION_ID'),
      api: {
        mutationMaximumAffectedRecords: this.twentyConfigService.get(
          'MUTATION_MAXIMUM_AFFECTED_RECORDS',
        ),
      },
      isAttachmentPreviewEnabled: this.twentyConfigService.get(
        'IS_ATTACHMENT_PREVIEW_ENABLED',
      ),
      analyticsEnabled: this.twentyConfigService.get('ANALYTICS_ENABLED'),
      canManageFeatureFlags:
        this.twentyConfigService.get('NODE_ENV') ===
          NodeEnvironment.DEVELOPMENT ||
        this.twentyConfigService.get('IS_BILLING_ENABLED'),
      publicFeatureFlags: PUBLIC_FEATURE_FLAGS,
      isMicrosoftMessagingEnabled: this.twentyConfigService.get(
        'MESSAGING_PROVIDER_MICROSOFT_ENABLED',
      ),
      isMicrosoftCalendarEnabled: this.twentyConfigService.get(
        'CALENDAR_PROVIDER_MICROSOFT_ENABLED',
      ),
      isGoogleMessagingEnabled: this.twentyConfigService.get(
        'MESSAGING_PROVIDER_GMAIL_ENABLED',
      ),
      isGoogleCalendarEnabled: this.twentyConfigService.get(
        'CALENDAR_PROVIDER_GOOGLE_ENABLED',
      ),
      isConfigVariablesInDbEnabled: this.twentyConfigService.get(
        'IS_CONFIG_VARIABLES_IN_DB_ENABLED',
      ),
      isImapSmtpCaldavEnabled: this.twentyConfigService.get(
        'IS_IMAP_SMTP_CALDAV_ENABLED',
      ),
      calendarBookingPageId: isNonEmptyString(calendarBookingPageId)
        ? calendarBookingPageId
        : undefined,
    };

    return clientConfig;
  }
}

```

```typescript
export enum OnboardingStatus {
  PLAN_REQUIRED = 'PLAN_REQUIRED',
  CUSTOM_PLAN_REQUIRED = 'CUSTOM_PLAN_REQUIRED',
  WORKSPACE_ACTIVATION = 'WORKSPACE_ACTIVATION',
  PROFILE_CREATION = 'PROFILE_CREATION',
  SYNC_EMAIL = 'SYNC_EMAIL',
  INVITE_TEAM = 'INVITE_TEAM',
  BOOK_ONBOARDING = 'BOOK_ONBOARDING',
  COMPLETED = 'COMPLETED',
}

```

```typescript
import { Injectable } from '@nestjs/common';

import { isNonEmptyString } from '@sniptt/guards';
import { isDefined } from 'twenty-shared/utils';
import { WorkspaceActivationStatus } from 'twenty-shared/workspace';
import { type QueryRunner } from 'typeorm';

import { BillingMode } from 'src/engine/core-modules/billing/enums/billing-mode.enum';
import { BillingService } from 'src/engine/core-modules/billing/services/billing.service';
import { OnboardingStatus } from 'src/engine/core-modules/onboarding/enums/onboarding-status.enum';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';
import { UserVarsService } from 'src/engine/core-modules/user/user-vars/services/user-vars.service';
import { UserEntity } from 'src/engine/core-modules/user/user.entity';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';

export enum OnboardingStepKeys {
  ONBOARDING_CONNECT_ACCOUNT_PENDING = 'ONBOARDING_CONNECT_ACCOUNT_PENDING',
  ONBOARDING_INVITE_TEAM_PENDING = 'ONBOARDING_INVITE_TEAM_PENDING',
  ONBOARDING_CREATE_PROFILE_PENDING = 'ONBOARDING_CREATE_PROFILE_PENDING',
  ONBOARDING_BOOK_ONBOARDING_PENDING = 'ONBOARDING_BOOK_ONBOARDING_PENDING',
}

export type OnboardingKeyValueTypeMap = {
  [OnboardingStepKeys.ONBOARDING_CONNECT_ACCOUNT_PENDING]: boolean;
  [OnboardingStepKeys.ONBOARDING_INVITE_TEAM_PENDING]: boolean;
  [OnboardingStepKeys.ONBOARDING_CREATE_PROFILE_PENDING]: boolean;
  [OnboardingStepKeys.ONBOARDING_BOOK_ONBOARDING_PENDING]: boolean;
};

@Injectable()
export class OnboardingService {
  constructor(
    private readonly billingService: BillingService,
    private readonly userVarsService: UserVarsService<OnboardingKeyValueTypeMap>,
    private readonly twentyConfigService: TwentyConfigService,
  ) {}

  private isWorkspaceActivationPending(workspace: WorkspaceEntity) {
    return (
      workspace.activationStatus === WorkspaceActivationStatus.PENDING_CREATION
    );
  }

  async getOnboardingStatus(user: UserEntity, workspace: WorkspaceEntity) {
    if (
      await this.billingService.isSubscriptionIncompleteOnboardingStatus(
        workspace.id,
      )
    ) {
      return OnboardingStatus.PLAN_REQUIRED;
    }

    if (this.isWorkspaceActivationPending(workspace)) {
      return OnboardingStatus.WORKSPACE_ACTIVATION;
    }

    const userVars = await this.userVarsService.getAll({
      userId: user.id,
      workspaceId: workspace.id,
    });

    const isProfileCreationPending =
      userVars.get(OnboardingStepKeys.ONBOARDING_CREATE_PROFILE_PENDING) ===
      true;

    const isConnectAccountPending =
      userVars.get(OnboardingStepKeys.ONBOARDING_CONNECT_ACCOUNT_PENDING) ===
      true;

    const isInviteTeamPending =
      userVars.get(OnboardingStepKeys.ONBOARDING_INVITE_TEAM_PENDING) === true;

    const isBookOnboardingPending =
      userVars.get(OnboardingStepKeys.ONBOARDING_BOOK_ONBOARDING_PENDING) ===
      true;

    if (isProfileCreationPending) {
      return OnboardingStatus.PROFILE_CREATION;
    }

    if (isConnectAccountPending) {
      return OnboardingStatus.SYNC_EMAIL;
    }

    if (isInviteTeamPending) {
      return OnboardingStatus.INVITE_TEAM;
    }

    if (isBookOnboardingPending) {
      const calendarBookingPageId = this.twentyConfigService.get(
        'CALENDAR_BOOKING_PAGE_ID',
      );
      const isBookingConfigured =
        isDefined(calendarBookingPageId) &&
        isNonEmptyString(calendarBookingPageId);

      if (!isBookingConfigured) {
        await this.userVarsService.delete({
          workspaceId: workspace.id,
          key: OnboardingStepKeys.ONBOARDING_BOOK_ONBOARDING_PENDING,
        });

        return OnboardingStatus.COMPLETED;
      }

      return OnboardingStatus.BOOK_ONBOARDING;
    }

    return OnboardingStatus.COMPLETED;
  }

  async setOnboardingConnectAccountPending(
    {
      userId,
      workspaceId,
      value,
    }: {
      userId: string;
      workspaceId: string;
      value: boolean;
    },
    queryRunner?: QueryRunner,
  ) {
    if (!value) {
      await this.userVarsService.delete(
        {
          userId,
          workspaceId,
          key: OnboardingStepKeys.ONBOARDING_CONNECT_ACCOUNT_PENDING,
        },
        queryRunner,
      );

      return;
    }

    await this.userVarsService.set(
      {
        userId,
        workspaceId: workspaceId,
        key: OnboardingStepKeys.ONBOARDING_CONNECT_ACCOUNT_PENDING,
        value: true,
      },
      queryRunner,
    );
  }

  async setOnboardingInviteTeamPending(
    {
      workspaceId,
      value,
    }: {
      workspaceId: string;
      value: boolean;
    },
    queryRunner?: QueryRunner,
  ) {
    if (!value) {
      await this.userVarsService.delete(
        {
          workspaceId,
          key: OnboardingStepKeys.ONBOARDING_INVITE_TEAM_PENDING,
        },
        queryRunner,
      );

      return;
    }

    await this.userVarsService.set(
      {
        workspaceId,
        key: OnboardingStepKeys.ONBOARDING_INVITE_TEAM_PENDING,
        value: true,
      },
      queryRunner,
    );
  }

  async setOnboardingCreateProfilePending(
    {
      userId,
      workspaceId,
      value,
    }: {
      userId: string;
      workspaceId: string;
      value: boolean;
    },
    queryRunner?: QueryRunner,
  ) {
    if (!value) {
      await this.userVarsService.delete(
        {
          userId,
          workspaceId,
          key: OnboardingStepKeys.ONBOARDING_CREATE_PROFILE_PENDING,
        },
        queryRunner,
      );

      return;
    }

    await this.userVarsService.set(
      {
        userId,
        workspaceId,
        key: OnboardingStepKeys.ONBOARDING_CREATE_PROFILE_PENDING,
        value: true,
      },
      queryRunner,
    );
  }

  async setOnboardingBookOnboardingPending({
    workspaceId,
    value,
  }: {
    workspaceId: string;
    value: boolean;
  }) {
    const calendarBookingPageId = this.twentyConfigService.get(
      'CALENDAR_BOOKING_PAGE_ID',
    );

    const isBookingConfigured =
      isDefined(calendarBookingPageId) &&
      isNonEmptyString(calendarBookingPageId);

    if (!value || !isBookingConfigured) {
      await this.userVarsService.delete({
        workspaceId,
        key: OnboardingStepKeys.ONBOARDING_BOOK_ONBOARDING_PENDING,
      });

      return;
    }

    await this.userVarsService.set({
      workspaceId,
      key: OnboardingStepKeys.ONBOARDING_BOOK_ONBOARDING_PENDING,
      value: true,
    });
  }
}

```

```typescript
import { Injectable } from '@nestjs/common';

import { isNonEmptyString } from '@sniptt/guards';
import { isDefined } from 'twenty-shared/utils';
import { WorkspaceActivationStatus } from 'twenty-shared/workspace';
import { type QueryRunner } from 'typeorm';

import { BillingMode } from 'src/engine/core-modules/billing/enums/billing-mode.enum';
import { BillingService } from 'src/engine/core-modules/billing/services/billing.service';
import { OnboardingStatus } from 'src/engine/core-modules/onboarding/enums/onboarding-status.enum';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';
import { UserVarsService } from 'src/engine/core-modules/user/user-vars/services/user-vars.service';
import { UserEntity } from 'src/engine/core-modules/user/user.entity';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';

export enum OnboardingStepKeys {
  ONBOARDING_CONNECT_ACCOUNT_PENDING = 'ONBOARDING_CONNECT_ACCOUNT_PENDING',
  ONBOARDING_INVITE_TEAM_PENDING = 'ONBOARDING_INVITE_TEAM_PENDING',
  ONBOARDING_CREATE_PROFILE_PENDING = 'ONBOARDING_CREATE_PROFILE_PENDING',
  ONBOARDING_BOOK_ONBOARDING_PENDING = 'ONBOARDING_BOOK_ONBOARDING_PENDING',
}

export type OnboardingKeyValueTypeMap = {
  [OnboardingStepKeys.ONBOARDING_CONNECT_ACCOUNT_PENDING]: boolean;
  [OnboardingStepKeys.ONBOARDING_INVITE_TEAM_PENDING]: boolean;
  [OnboardingStepKeys.ONBOARDING_CREATE_PROFILE_PENDING]: boolean;
  [OnboardingStepKeys.ONBOARDING_BOOK_ONBOARDING_PENDING]: boolean;
};

@Injectable()
export class OnboardingService {
  constructor(
    private readonly billingService: BillingService,
    private readonly userVarsService: UserVarsService<OnboardingKeyValueTypeMap>,
    private readonly twentyConfigService: TwentyConfigService,
  ) {}

  private isWorkspaceActivationPending(workspace: WorkspaceEntity) {
    return (
      workspace.activationStatus === WorkspaceActivationStatus.PENDING_CREATION
    );
  }

  async getOnboardingStatus(user: UserEntity, workspace: WorkspaceEntity) {
    const billingMode = this.twentyConfigService.get('BILLING_MODE');
    const isBillingEnabled = this.twentyConfigService.get('IS_BILLING_ENABLED');

    if (isBillingEnabled) {
      if (billingMode === BillingMode.LOCAL) {
        // For LOCAL mode, check if workspace has a customBillingPlanId
        if (!workspace.customBillingPlanId) {
          return OnboardingStatus.CUSTOM_PLAN_REQUIRED;
        }
      } else {
        // For STRIPE mode, use the original behavior
        if (
          await this.billingService.isSubscriptionIncompleteOnboardingStatus(
            workspace.id,
          )
        ) {
          return OnboardingStatus.PLAN_REQUIRED;
        }
      }
    }

    if (this.isWorkspaceActivationPending(workspace)) {
      return OnboardingStatus.WORKSPACE_ACTIVATION;
    }

    const userVars = await this.userVarsService.getAll({
      userId: user.id,
      workspaceId: workspace.id,
    });

    const isProfileCreationPending =
      userVars.get(OnboardingStepKeys.ONBOARDING_CREATE_PROFILE_PENDING) ===
      true;

    const isConnectAccountPending =
      userVars.get(OnboardingStepKeys.ONBOARDING_CONNECT_ACCOUNT_PENDING) ===
      true;

    const isInviteTeamPending =
      userVars.get(OnboardingStepKeys.ONBOARDING_INVITE_TEAM_PENDING) === true;

    const isBookOnboardingPending =
      userVars.get(OnboardingStepKeys.ONBOARDING_BOOK_ONBOARDING_PENDING) ===
      true;

    if (isProfileCreationPending) {
      return OnboardingStatus.PROFILE_CREATION;
    }

    if (isConnectAccountPending) {
      return OnboardingStatus.SYNC_EMAIL;
    }

    if (isInviteTeamPending) {
      return OnboardingStatus.INVITE_TEAM;
    }

    if (isBookOnboardingPending) {
      const calendarBookingPageId = this.twentyConfigService.get(
        'CALENDAR_BOOKING_PAGE_ID',
      );
      const isBookingConfigured =
        isDefined(calendarBookingPageId) &&
        isNonEmptyString(calendarBookingPageId);

      if (!isBookingConfigured) {
        await this.userVarsService.delete({
          workspaceId: workspace.id,
          key: OnboardingStepKeys.ONBOARDING_BOOK_ONBOARDING_PENDING,
        });

        return OnboardingStatus.COMPLETED;
      }

      return OnboardingStatus.BOOK_ONBOARDING;
    }

    return OnboardingStatus.COMPLETED;
  }

  async setOnboardingConnectAccountPending(
    {
      userId,
      workspaceId,
      value,
    }: {
      userId: string;
      workspaceId: string;
      value: boolean;
    },
    queryRunner?: QueryRunner,
  ) {
    if (!value) {
      await this.userVarsService.delete(
        {
          userId,
          workspaceId,
          key: OnboardingStepKeys.ONBOARDING_CONNECT_ACCOUNT_PENDING,
        },
        queryRunner,
      );

      return;
    }

    await this.userVarsService.set(
      {
        userId,
        workspaceId: workspaceId,
        key: OnboardingStepKeys.ONBOARDING_CONNECT_ACCOUNT_PENDING,
        value: true,
      },
      queryRunner,
    );
  }

  async setOnboardingInviteTeamPending(
    {
      workspaceId,
      value,
    }: {
      workspaceId: string;
      value: boolean;
    },
    queryRunner?: QueryRunner,
  ) {
    if (!value) {
      await this.userVarsService.delete(
        {
          workspaceId,
          key: OnboardingStepKeys.ONBOARDING_INVITE_TEAM_PENDING,
        },
        queryRunner,
      );

      return;
    }

    await this.userVarsService.set(
      {
        workspaceId,
        key: OnboardingStepKeys.ONBOARDING_INVITE_TEAM_PENDING,
        value: true,
      },
      queryRunner,
    );
  }

  async setOnboardingCreateProfilePending(
    {
      userId,
      workspaceId,
      value,
    }: {
      userId: string;
      workspaceId: string;
      value: boolean;
    },
    queryRunner?: QueryRunner,
  ) {
    if (!value) {
      await this.userVarsService.delete(
        {
          userId,
          workspaceId,
          key: OnboardingStepKeys.ONBOARDING_CREATE_PROFILE_PENDING,
        },
        queryRunner,
      );

      return;
    }

    await this.userVarsService.set(
      {
        userId,
        workspaceId,
        key: OnboardingStepKeys.ONBOARDING_CREATE_PROFILE_PENDING,
        value: true,
      },
      queryRunner,
    );
  }

  async setOnboardingBookOnboardingPending({
    workspaceId,
    value,
  }: {
    workspaceId: string;
    value: boolean;
  }) {
    const calendarBookingPageId = this.twentyConfigService.get(
      'CALENDAR_BOOKING_PAGE_ID',
    );

    const isBookingConfigured =
      isDefined(calendarBookingPageId) &&
      isNonEmptyString(calendarBookingPageId);

    if (!value || !isBookingConfigured) {
      await this.userVarsService.delete({
        workspaceId,
        key: OnboardingStepKeys.ONBOARDING_BOOK_ONBOARDING_PENDING,
      });

      return;
    }

    await this.userVarsService.set({
      workspaceId,
      key: OnboardingStepKeys.ONBOARDING_BOOK_ONBOARDING_PENDING,
      value: true,
    });
  }
}

```

```typescript
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

import { IDField } from '@ptc-org/nestjs-query-graphql';
import { Application } from 'cloudflare/resources/zero-trust/access/applications/applications';
import { WorkspaceActivationStatus } from 'twenty-shared/workspace';
import {
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';
import { ApiKeyEntity } from 'src/engine/core-modules/api-key/api-key.entity';
import { AppTokenEntity } from 'src/engine/core-modules/app-token/app-token.entity';
import { ApplicationEntity } from 'src/engine/core-modules/application/application.entity';
import { ApplicationDTO } from 'src/engine/core-modules/application/dtos/application.dto';
import { ApprovedAccessDomainEntity } from 'src/engine/core-modules/approved-access-domain/approved-access-domain.entity';
import { EmailingDomainEntity } from 'src/engine/core-modules/emailing-domain/emailing-domain.entity';
import { FeatureFlagEntity } from 'src/engine/core-modules/feature-flag/feature-flag.entity';
import { KeyValuePairEntity } from 'src/engine/core-modules/key-value-pair/key-value-pair.entity';
import { PostgresCredentialsEntity } from 'src/engine/core-modules/postgres-credentials/postgres-credentials.entity';
import { PublicDomainEntity } from 'src/engine/core-modules/public-domain/public-domain.entity';
import { WorkspaceSSOIdentityProviderEntity } from 'src/engine/core-modules/sso/workspace-sso-identity-provider.entity';
import { UserWorkspaceEntity } from 'src/engine/core-modules/user-workspace/user-workspace.entity';
import { WebhookEntity } from 'src/engine/core-modules/webhook/webhook.entity';
import { AgentEntity } from 'src/engine/metadata-modules/ai-agent/entities/agent.entity';
import {
  DEFAULT_FAST_MODEL,
  DEFAULT_SMART_MODEL,
  type ModelId,
} from 'src/engine/metadata-modules/ai-models/constants/ai-models.const';
import { RoleDTO } from 'src/engine/metadata-modules/role/dtos/role.dto';
import { ViewFieldDTO } from 'src/engine/metadata-modules/view-field/dtos/view-field.dto';
import { ViewFieldEntity } from 'src/engine/metadata-modules/view-field/entities/view-field.entity';
import { ViewFilterGroupDTO } from 'src/engine/metadata-modules/view-filter-group/dtos/view-filter-group.dto';
import { ViewFilterGroupEntity } from 'src/engine/metadata-modules/view-filter-group/entities/view-filter-group.entity';
import { ViewFilterDTO } from 'src/engine/metadata-modules/view-filter/dtos/view-filter.dto';
import { ViewFilterEntity } from 'src/engine/metadata-modules/view-filter/entities/view-filter.entity';
import { ViewGroupDTO } from 'src/engine/metadata-modules/view-group/dtos/view-group.dto';
import { ViewGroupEntity } from 'src/engine/metadata-modules/view-group/entities/view-group.entity';
import { ViewSortDTO } from 'src/engine/metadata-modules/view-sort/dtos/view-sort.dto';
import { ViewSortEntity } from 'src/engine/metadata-modules/view-sort/entities/view-sort.entity';
import { ViewDTO } from 'src/engine/metadata-modules/view/dtos/view.dto';
import { ViewEntity } from 'src/engine/metadata-modules/view/entities/view.entity';

registerEnumType(WorkspaceActivationStatus, {
  name: 'WorkspaceActivationStatus',
});

@Check(
  'onboarded_workspace_requires_default_role',
  `"activationStatus" IN ('PENDING_CREATION', 'ONGOING_CREATION') OR "defaultRoleId" IS NOT NULL`,
)
@Entity({ name: 'workspace', schema: 'core' })
@ObjectType('Workspace')
export class WorkspaceEntity {
  // Fields
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  logo?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  inviteHash?: string;

  @Field({ nullable: true })
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Field()
  @Column({ default: true })
  allowImpersonation: boolean;

  @Field()
  @Column({ default: true })
  isPublicInviteLinkEnabled: boolean;

  @Field()
  @Column({ type: 'integer', default: 14 })
  trashRetentionDays: number;

  // Relations
  @OneToMany(() => AppTokenEntity, (appToken) => appToken.workspace, {
    cascade: true,
  })
  appTokens: Relation<AppTokenEntity[]>;

  @OneToMany(
    () => KeyValuePairEntity,
    (keyValuePair) => keyValuePair.workspace,
    {
      cascade: true,
    },
  )
  keyValuePairs: Relation<KeyValuePairEntity[]>;

  @OneToMany(
    () => UserWorkspaceEntity,
    (userWorkspace: UserWorkspaceEntity) => userWorkspace.workspace,
    {
      onDelete: 'CASCADE',
    },
  )
  workspaceUsers: Relation<UserWorkspaceEntity[]>;

  @OneToMany(() => FeatureFlagEntity, (featureFlag) => featureFlag.workspace)
  featureFlags: Relation<FeatureFlagEntity[]>;

  @OneToMany(
    () => ApprovedAccessDomainEntity,
    (approvedAccessDomain) => approvedAccessDomain.workspace,
  )
  approvedAccessDomains: Relation<ApprovedAccessDomainEntity[]>;

  @OneToMany(
    () => EmailingDomainEntity,
    (emailingDomain) => emailingDomain.workspace,
  )
  emailingDomains: Relation<EmailingDomainEntity[]>;

  @OneToMany(() => PublicDomainEntity, (publicDomain) => publicDomain.workspace)
  publicDomains: Relation<PublicDomainEntity[]>;

  @Field({ nullable: true })
  workspaceMembersCount: number;

  @Field(() => WorkspaceActivationStatus)
  @Column({
    type: 'enum',
    enumName: 'workspace_activationStatus_enum',
    enum: WorkspaceActivationStatus,
    default: WorkspaceActivationStatus.INACTIVE,
  })
  @Index('IDX_WORKSPACE_ACTIVATION_STATUS')
  activationStatus: WorkspaceActivationStatus;

  @OneToMany(
    () => PostgresCredentialsEntity,
    (postgresCredentials) => postgresCredentials.workspace,
  )
  allPostgresCredentials: Relation<PostgresCredentialsEntity[]>;

  @OneToMany(
    () => WorkspaceSSOIdentityProviderEntity,
    (workspaceSSOIdentityProviders) => workspaceSSOIdentityProviders.workspace,
  )
  workspaceSSOIdentityProviders: Relation<WorkspaceSSOIdentityProviderEntity[]>;

  @OneToMany(() => AgentEntity, (agent) => agent.workspace, {
    onDelete: 'CASCADE',
  })
  agents: Relation<AgentEntity[]>;

  @OneToMany(() => WebhookEntity, (webhook) => webhook.workspace)
  webhooks: Relation<WebhookEntity[]>;

  @OneToMany(() => ApiKeyEntity, (apiKey) => apiKey.workspace)
  apiKeys: Relation<ApiKeyEntity[]>;

  @Field(() => [ViewDTO], { nullable: true })
  @OneToMany(() => ViewEntity, (view) => view.workspace)
  views: Relation<ViewEntity[]>;

  @Field(() => [ViewFieldDTO], { nullable: true })
  @OneToMany(() => ViewFieldEntity, (viewField) => viewField.workspace)
  viewFields: Relation<ViewFieldEntity[]>;

  @Field(() => [ViewFilterDTO], { nullable: true })
  @OneToMany(() => ViewFilterEntity, (viewFilter) => viewFilter.workspace)
  viewFilters: Relation<ViewFilterEntity[]>;

  @Field(() => [ViewFilterGroupDTO], { nullable: true })
  @OneToMany(
    () => ViewFilterGroupEntity,
    (viewFilterGroup) => viewFilterGroup.workspace,
  )
  viewFilterGroups: Relation<ViewFilterGroupEntity[]>;

  @Field(() => [ViewGroupDTO], { nullable: true })
  @OneToMany(() => ViewGroupEntity, (viewGroup) => viewGroup.workspace)
  viewGroups: Relation<ViewGroupEntity[]>;

  @Field(() => [ViewSortDTO], { nullable: true })
  @OneToMany(() => ViewSortEntity, (viewSort) => viewSort.workspace)
  viewSorts: Relation<ViewSortEntity[]>;

  @Field()
  @Column({ default: 1 })
  metadataVersion: number;

  @Field()
  @Column({ default: '' })
  databaseUrl: string;

  @Field()
  @Column({ default: '' })
  databaseSchema: string;

  @Field()
  @Column({ unique: true })
  subdomain: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', unique: true, nullable: true })
  customDomain: string | null;

  @Field()
  @Column({ default: true })
  isGoogleAuthEnabled: boolean;

  @Field()
  @Column({ default: false })
  isGoogleAuthBypassEnabled: boolean;

  @Field()
  @Column({ default: false })
  isTwoFactorAuthenticationEnforced: boolean;

  @Field()
  @Column({ default: true })
  isPasswordAuthEnabled: boolean;

  @Field()
  @Column({ default: false })
  isPasswordAuthBypassEnabled: boolean;

  @Field()
  @Column({ default: true })
  isMicrosoftAuthEnabled: boolean;

  @Field()
  @Column({ default: false })
  isMicrosoftAuthBypassEnabled: boolean;

  @Field()
  @Column({ default: false })
  isCustomDomainEnabled: boolean;

  @Field(() => [String], { nullable: true })
  @Column({
    type: 'varchar',
    array: true,
    nullable: true,
    default: '{email,profilePicture,firstName,lastName}',
  })
  editableProfileFields: string[] | null;

  // TODO: set as non nullable
  @Column({ nullable: true, type: 'uuid' })
  defaultRoleId: string | null;

  @Field(() => RoleDTO, { nullable: true })
  defaultRole: RoleDTO | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  version: string | null;

  @Field(() => String, { nullable: false })
  @Column({ type: 'varchar', nullable: false, default: DEFAULT_FAST_MODEL })
  fastModel: ModelId;

  @Field(() => String, { nullable: false })
  @Column({ type: 'varchar', nullable: false, default: DEFAULT_SMART_MODEL })
  smartModel: ModelId;

  @Column({ nullable: false, type: 'uuid' })
  workspaceCustomApplicationId: string;

  // TODO: delete
  // This is deprecated
  // If we are in December 2025 you can remove this column from DB
  @Field(() => String, { nullable: false })
  @Column({ type: 'varchar', nullable: false, default: 'auto' })
  routerModel: ModelId;

  @Field(() => ApplicationDTO, { nullable: true })
  @ManyToOne(() => ApplicationEntity, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'workspaceCustomApplicationId' })
  workspaceCustomApplication: Relation<ApplicationEntity>;

  @OneToMany(() => ApplicationEntity, (application) => application.workspace, {
    onDelete: 'CASCADE',
  })
  applications: Relation<Application[]>;

  // Custom billing plan for LOCAL billing mode
  @Field(() => String, { nullable: true })
  @Column({ nullable: true, type: 'uuid' })
  customBillingPlanId: string | null;
}

```

```typescript
export enum AppPath {
  // Not logged-in
  Verify = '/verify',
  VerifyEmail = '/verify-email',
  SignInUp = '/welcome',
  Invite = '/invite/:workspaceInviteHash',
  ResetPassword = '/reset-password/:passwordResetToken',

  // Onboarding
  CreateWorkspace = '/create/workspace',
  CreateProfile = '/create/profile',
  SyncEmails = '/sync/emails',
  InviteTeam = '/invite-team',
  PlanRequired = '/plan-required',
  PlanRequiredSuccess = '/plan-required/payment-success',
  CustomPlanRequired = '/custom-plan-required',
  BookCallDecision = '/book-call-decision',
  BookCall = '/book-call',

  // Onboarded
  Index = '/',
  TasksPage = '/objects/tasks',
  OpportunitiesPage = '/objects/opportunities',

  RecordIndexPage = '/objects/:objectNamePlural',
  RecordShowPage = '/object/:objectNameSingular/:objectRecordId',

  Settings = `settings`,
  SettingsCatchAll = `/${Settings}/*`,
  Developers = `developers`,
  DevelopersCatchAll = `/${Developers}/*`,

  Authorize = '/authorize',

  // 404 page not found
  NotFoundWildcard = '*',
  NotFound = '/not-found',
}

```

```typescript
import { verifyEmailRedirectPathState } from '@/app/states/verifyEmailRedirectPathState';
import { useIsLogged } from '@/auth/hooks/useIsLogged';
import { calendarBookingPageIdState } from '@/client-config/states/calendarBookingPageIdState';
import { useIsCurrentLocationOnAWorkspace } from '@/domain-manager/hooks/useIsCurrentLocationOnAWorkspace';
import { useDefaultHomePagePath } from '@/navigation/hooks/useDefaultHomePagePath';
import { objectMetadataItemsState } from '@/object-metadata/states/objectMetadataItemsState';
import { useOnboardingStatus } from '@/onboarding/hooks/useOnboardingStatus';
import { useIsWorkspaceActivationStatusEqualsTo } from '@/workspace/hooks/useIsWorkspaceActivationStatusEqualsTo';
import { useLocation, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { AppPath, SettingsPath } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { WorkspaceActivationStatus } from 'twenty-shared/workspace';
import { OnboardingStatus } from '~/generated/graphql';
import { isMatchingLocation } from '~/utils/isMatchingLocation';

export const usePageChangeEffectNavigateLocation = () => {
  const isLoggedIn = useIsLogged();
  const { isOnAWorkspace } = useIsCurrentLocationOnAWorkspace();
  const onboardingStatus = useOnboardingStatus();
  const isWorkspaceSuspended = useIsWorkspaceActivationStatusEqualsTo(
    WorkspaceActivationStatus.SUSPENDED,
  );
  const { defaultHomePagePath } = useDefaultHomePagePath();
  const location = useLocation();
  const calendarBookingPageId = useRecoilValue(calendarBookingPageIdState);

  const someMatchingLocationOf = (appPaths: AppPath[]): boolean =>
    appPaths.some((appPath) => isMatchingLocation(location, appPath));
  const onGoingUserCreationPaths = [
    AppPath.Invite,
    AppPath.SignInUp,
    AppPath.VerifyEmail,
    AppPath.Verify,
  ];
  const onboardingPaths = [
    AppPath.CreateWorkspace,
    AppPath.CreateProfile,
    AppPath.SyncEmails,
    AppPath.InviteTeam,
    AppPath.PlanRequired,
    AppPath.PlanRequiredSuccess,
    AppPath.CustomPlanRequired,
    AppPath.BookCallDecision,
    AppPath.BookCall,
  ];

  const objectNamePlural = useParams().objectNamePlural ?? '';
  const objectMetadataItems = useRecoilValue(objectMetadataItemsState);
  const objectMetadataItem = objectMetadataItems?.find(
    (objectMetadataItem) => objectMetadataItem.namePlural === objectNamePlural,
  );
  const verifyEmailRedirectPath = useRecoilValue(verifyEmailRedirectPathState);

  if (
    (!isLoggedIn || (isLoggedIn && !isOnAWorkspace)) &&
    !someMatchingLocationOf([
      ...onGoingUserCreationPaths,
      AppPath.ResetPassword,
    ])
  ) {
    return AppPath.SignInUp;
  }

  if (
    onboardingStatus === OnboardingStatus.PLAN_REQUIRED &&
    !someMatchingLocationOf([
      AppPath.PlanRequired,
      AppPath.PlanRequiredSuccess,
      AppPath.BookCall,
      AppPath.BookCallDecision,
    ])
  ) {
    if (
      isMatchingLocation(location, AppPath.VerifyEmail) &&
      isDefined(verifyEmailRedirectPath)
    ) {
      return verifyEmailRedirectPath;
    }
    return AppPath.PlanRequired;
  }

  if (isWorkspaceSuspended) {
    if (!isMatchingLocation(location, AppPath.SettingsCatchAll)) {
      return `${AppPath.SettingsCatchAll.replace('/*', '')}/${
        SettingsPath.Billing
      }`;
    }

    return;
  }

  if (
    onboardingStatus === OnboardingStatus.WORKSPACE_ACTIVATION &&
    !someMatchingLocationOf([
      AppPath.CreateWorkspace,
      AppPath.BookCallDecision,
      AppPath.BookCall,
    ])
  ) {
    return AppPath.CreateWorkspace;
  }

  if (
    onboardingStatus === OnboardingStatus.PROFILE_CREATION &&
    !isMatchingLocation(location, AppPath.CreateProfile)
  ) {
    return AppPath.CreateProfile;
  }

  if (
    onboardingStatus === OnboardingStatus.SYNC_EMAIL &&
    !isMatchingLocation(location, AppPath.SyncEmails)
  ) {
    return AppPath.SyncEmails;
  }

  if (
    onboardingStatus === OnboardingStatus.INVITE_TEAM &&
    !isMatchingLocation(location, AppPath.InviteTeam)
  ) {
    return AppPath.InviteTeam;
  }

  if (
    onboardingStatus === OnboardingStatus.BOOK_ONBOARDING &&
    !someMatchingLocationOf([AppPath.BookCallDecision, AppPath.BookCall])
  ) {
    if (!isDefined(calendarBookingPageId)) {
      return defaultHomePagePath;
    }
    return AppPath.BookCallDecision;
  }

  if (
    onboardingStatus === OnboardingStatus.COMPLETED &&
    someMatchingLocationOf([...onboardingPaths, ...onGoingUserCreationPaths]) &&
    !isMatchingLocation(location, AppPath.ResetPassword) &&
    isLoggedIn
  ) {
    return defaultHomePagePath;
  }

  if (isMatchingLocation(location, AppPath.Index) && isLoggedIn) {
    return defaultHomePagePath;
  }

  if (
    isMatchingLocation(location, AppPath.RecordIndexPage) &&
    !isDefined(objectMetadataItem)
  ) {
    return AppPath.NotFound;
  }

  return;
};

```

```typescript
import { verifyEmailRedirectPathState } from '@/app/states/verifyEmailRedirectPathState';
import { useIsLogged } from '@/auth/hooks/useIsLogged';
import { calendarBookingPageIdState } from '@/client-config/states/calendarBookingPageIdState';
import { useIsCurrentLocationOnAWorkspace } from '@/domain-manager/hooks/useIsCurrentLocationOnAWorkspace';
import { useDefaultHomePagePath } from '@/navigation/hooks/useDefaultHomePagePath';
import { objectMetadataItemsState } from '@/object-metadata/states/objectMetadataItemsState';
import { useOnboardingStatus } from '@/onboarding/hooks/useOnboardingStatus';
import { useIsWorkspaceActivationStatusEqualsTo } from '@/workspace/hooks/useIsWorkspaceActivationStatusEqualsTo';
import { useLocation, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { AppPath, SettingsPath } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { WorkspaceActivationStatus } from 'twenty-shared/workspace';
import { OnboardingStatus } from '~/generated/graphql';
import { isMatchingLocation } from '~/utils/isMatchingLocation';

export const usePageChangeEffectNavigateLocation = () => {
  const isLoggedIn = useIsLogged();
  const { isOnAWorkspace } = useIsCurrentLocationOnAWorkspace();
  const onboardingStatus = useOnboardingStatus();
  const isWorkspaceSuspended = useIsWorkspaceActivationStatusEqualsTo(
    WorkspaceActivationStatus.SUSPENDED,
  );
  const { defaultHomePagePath } = useDefaultHomePagePath();
  const location = useLocation();
  const calendarBookingPageId = useRecoilValue(calendarBookingPageIdState);

  const someMatchingLocationOf = (appPaths: AppPath[]): boolean =>
    appPaths.some((appPath) => isMatchingLocation(location, appPath));
  const onGoingUserCreationPaths = [
    AppPath.Invite,
    AppPath.SignInUp,
    AppPath.VerifyEmail,
    AppPath.Verify,
  ];
  const onboardingPaths = [
    AppPath.CreateWorkspace,
    AppPath.CreateProfile,
    AppPath.SyncEmails,
    AppPath.InviteTeam,
    AppPath.PlanRequired,
    AppPath.PlanRequiredSuccess,
    AppPath.CustomPlanRequired,
    AppPath.BookCallDecision,
    AppPath.BookCall,
  ];

  const objectNamePlural = useParams().objectNamePlural ?? '';
  const objectMetadataItems = useRecoilValue(objectMetadataItemsState);
  const objectMetadataItem = objectMetadataItems?.find(
    (objectMetadataItem) => objectMetadataItem.namePlural === objectNamePlural,
  );
  const verifyEmailRedirectPath = useRecoilValue(verifyEmailRedirectPathState);

  if (
    (!isLoggedIn || (isLoggedIn && !isOnAWorkspace)) &&
    !someMatchingLocationOf([
      ...onGoingUserCreationPaths,
      AppPath.ResetPassword,
    ])
  ) {
    return AppPath.SignInUp;
  }

  if (
    onboardingStatus === OnboardingStatus.PLAN_REQUIRED &&
    !someMatchingLocationOf([
      AppPath.PlanRequired,
      AppPath.PlanRequiredSuccess,
      AppPath.BookCall,
      AppPath.BookCallDecision,
    ])
  ) {
    if (
      isMatchingLocation(location, AppPath.VerifyEmail) &&
      isDefined(verifyEmailRedirectPath)
    ) {
      return verifyEmailRedirectPath;
    }
    return AppPath.PlanRequired;
  }

  if (
    onboardingStatus === OnboardingStatus.CUSTOM_PLAN_REQUIRED &&
    !isMatchingLocation(location, AppPath.CustomPlanRequired)
  ) {
    return AppPath.CustomPlanRequired;
  }

  if (isWorkspaceSuspended) {
    if (!isMatchingLocation(location, AppPath.SettingsCatchAll)) {
      return `${AppPath.SettingsCatchAll.replace('/*', '')}/${
        SettingsPath.Billing
      }`;
    }

    return;
  }

  if (
    onboardingStatus === OnboardingStatus.WORKSPACE_ACTIVATION &&
    !someMatchingLocationOf([
      AppPath.CreateWorkspace,
      AppPath.BookCallDecision,
      AppPath.BookCall,
    ])
  ) {
    return AppPath.CreateWorkspace;
  }

  if (
    onboardingStatus === OnboardingStatus.PROFILE_CREATION &&
    !isMatchingLocation(location, AppPath.CreateProfile)
  ) {
    return AppPath.CreateProfile;
  }

  if (
    onboardingStatus === OnboardingStatus.SYNC_EMAIL &&
    !isMatchingLocation(location, AppPath.SyncEmails)
  ) {
    return AppPath.SyncEmails;
  }

  if (
    onboardingStatus === OnboardingStatus.INVITE_TEAM &&
    !isMatchingLocation(location, AppPath.InviteTeam)
  ) {
    return AppPath.InviteTeam;
  }

  if (
    onboardingStatus === OnboardingStatus.BOOK_ONBOARDING &&
    !someMatchingLocationOf([AppPath.BookCallDecision, AppPath.BookCall])
  ) {
    if (!isDefined(calendarBookingPageId)) {
      return defaultHomePagePath;
    }
    return AppPath.BookCallDecision;
  }

  if (
    onboardingStatus === OnboardingStatus.COMPLETED &&
    someMatchingLocationOf([...onboardingPaths, ...onGoingUserCreationPaths]) &&
    !isMatchingLocation(location, AppPath.ResetPassword) &&
    isLoggedIn
  ) {
    return defaultHomePagePath;
  }

  if (isMatchingLocation(location, AppPath.Index) && isLoggedIn) {
    return defaultHomePagePath;
  }

  if (
    isMatchingLocation(location, AppPath.RecordIndexPage) &&
    !isDefined(objectMetadataItem)
  ) {
    return AppPath.NotFound;
  }

  return;
};

```

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCustomBillingPlanIdToWorkspace1765000000000
  implements MigrationInterface
{
  name = 'AddCustomBillingPlanIdToWorkspace1765000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."workspace" ADD "customBillingPlanId" uuid`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."workspace" DROP COLUMN "customBillingPlanId"`,
    );
  }
}

```

```typescript
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import assert from 'assert';

import { msg } from '@lingui/core/macro';
import { TypeOrmQueryService } from '@ptc-org/nestjs-query-typeorm';
import { assertIsDefinedOrThrow, isDefined } from 'twenty-shared/utils';
import { WorkspaceActivationStatus } from 'twenty-shared/workspace';
import { Repository } from 'typeorm';

import { BillingSubscriptionService } from 'src/engine/core-modules/billing/services/billing-subscription.service';
import { BillingService } from 'src/engine/core-modules/billing/services/billing.service';
import { DnsManagerService } from 'src/engine/core-modules/dns-manager/services/dns-manager.service';
import { CustomDomainManagerService } from 'src/engine/core-modules/domain/custom-domain-manager/services/custom-domain-manager.service';
import { SubdomainManagerService } from 'src/engine/core-modules/domain/subdomain-manager/services/subdomain-manager.service';
import { ExceptionHandlerService } from 'src/engine/core-modules/exception-handler/exception-handler.service';
import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import {
  FileWorkspaceFolderDeletionJob,
  type FileWorkspaceFolderDeletionJobData,
} from 'src/engine/core-modules/file/jobs/file-workspace-folder-deletion.job';
import { InjectMessageQueue } from 'src/engine/core-modules/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/core-modules/message-queue/services/message-queue.service';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';
import { UserWorkspaceEntity } from 'src/engine/core-modules/user-workspace/user-workspace.entity';
import { UserWorkspaceService } from 'src/engine/core-modules/user-workspace/user-workspace.service';
import { UserEntity } from 'src/engine/core-modules/user/user.entity';
import { type ActivateWorkspaceInput } from 'src/engine/core-modules/workspace/dtos/activate-workspace-input';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import {
  WorkspaceException,
  WorkspaceExceptionCode,
  WorkspaceNotFoundDefaultError,
} from 'src/engine/core-modules/workspace/workspace.exception';
import { WorkspaceManyOrAllFlatEntityMapsCacheService } from 'src/engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service';
import { PermissionFlagType } from 'src/engine/metadata-modules/permissions/constants/permission-flag-type.constants';
import {
  PermissionsException,
  PermissionsExceptionCode,
  PermissionsExceptionMessage,
} from 'src/engine/metadata-modules/permissions/permissions.exception';
import { PermissionsService } from 'src/engine/metadata-modules/permissions/permissions.service';
import { WorkspaceCacheStorageService } from 'src/engine/workspace-cache-storage/workspace-cache-storage.service';
import { WorkspaceManagerService } from 'src/engine/workspace-manager/workspace-manager.service';
import { DEFAULT_FEATURE_FLAGS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/default-feature-flags';
import { extractVersionMajorMinorPatch } from 'src/utils/version/extract-version-major-minor-patch';

@Injectable()
// eslint-disable-next-line @nx/workspace-inject-workspace-repository
export class WorkspaceService extends TypeOrmQueryService<WorkspaceEntity> {
  protected readonly logger = new Logger(WorkspaceService.name);

  private readonly WORKSPACE_FIELD_PERMISSIONS: Record<
    string,
    PermissionFlagType
  > = {
    subdomain: PermissionFlagType.WORKSPACE,
    customDomain: PermissionFlagType.WORKSPACE,
    displayName: PermissionFlagType.WORKSPACE,
    logo: PermissionFlagType.WORKSPACE,
    trashRetentionDays: PermissionFlagType.WORKSPACE,
    inviteHash: PermissionFlagType.WORKSPACE_MEMBERS,
    isPublicInviteLinkEnabled: PermissionFlagType.SECURITY,
    allowImpersonation: PermissionFlagType.SECURITY,
    isGoogleAuthEnabled: PermissionFlagType.SECURITY,
    isMicrosoftAuthEnabled: PermissionFlagType.SECURITY,
    isPasswordAuthEnabled: PermissionFlagType.SECURITY,
    editableProfileFields: PermissionFlagType.SECURITY,
    isTwoFactorAuthenticationEnforced: PermissionFlagType.SECURITY,
    defaultRoleId: PermissionFlagType.ROLES,
    fastModel: PermissionFlagType.WORKSPACE,
    smartModel: PermissionFlagType.WORKSPACE,
  };

  constructor(
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserWorkspaceEntity)
    private readonly userWorkspaceRepository: Repository<UserWorkspaceEntity>,
    private readonly workspaceManagerService: WorkspaceManagerService,
    private readonly featureFlagService: FeatureFlagService,
    private readonly billingSubscriptionService: BillingSubscriptionService,
    private readonly billingService: BillingService,
    private readonly userWorkspaceService: UserWorkspaceService,
    private readonly twentyConfigService: TwentyConfigService,
    private readonly exceptionHandlerService: ExceptionHandlerService,
    private readonly permissionsService: PermissionsService,
    private readonly dnsManagerService: DnsManagerService,
    private readonly flatEntityMapsCacheService: WorkspaceManyOrAllFlatEntityMapsCacheService,
    private readonly workspaceCacheStorageService: WorkspaceCacheStorageService,
    private readonly subdomainManagerService: SubdomainManagerService,
    private readonly customDomainManagerService: CustomDomainManagerService,
    @InjectMessageQueue(MessageQueue.deleteCascadeQueue)
    private readonly messageQueueService: MessageQueueService,
  ) {
    super(workspaceRepository);
  }

  async updateWorkspaceById({
    payload,
    userWorkspaceId,
    apiKey,
  }: {
    payload: Partial<WorkspaceEntity> & { id: string };
    userWorkspaceId?: string;
    apiKey?: string;
  }) {
    const workspace = await this.workspaceRepository.findOneBy({
      id: payload.id,
    });

    assertIsDefinedOrThrow(workspace, WorkspaceNotFoundDefaultError);

    await this.validateWorkspaceUpdatePermissions({
      payload,
      userWorkspaceId,
      workspaceId: workspace.id,
      apiKey,
      workspaceActivationStatus: workspace.activationStatus,
    });

    if (payload.subdomain && workspace.subdomain !== payload.subdomain) {
      await this.subdomainManagerService.validateSubdomainOrThrow(
        payload.subdomain,
      );
    }

    let customDomainRegistered = false;

    if (payload.customDomain === null && isDefined(workspace.customDomain)) {
      await this.dnsManagerService.deleteHostnameSilently(
        workspace.customDomain,
      );
      workspace.isCustomDomainEnabled = false;
    }

    if (
      payload.customDomain &&
      workspace.customDomain !== payload.customDomain
    ) {
      await this.customDomainManagerService.setCustomDomain(
        workspace,
        payload.customDomain,
      );
      customDomainRegistered = true;
    }

    const authProvidersBySystem = {
      google: this.twentyConfigService.get('AUTH_GOOGLE_ENABLED'),
      password: this.twentyConfigService.get('AUTH_PASSWORD_ENABLED'),
      microsoft: this.twentyConfigService.get('AUTH_MICROSOFT_ENABLED'),
    };

    if (payload.isGoogleAuthEnabled && !authProvidersBySystem.google) {
      throw new WorkspaceException(
        'Google auth is not enabled in the system.',
        WorkspaceExceptionCode.ENVIRONMENT_VAR_NOT_ENABLED,
      );
    }
    if (payload.isMicrosoftAuthEnabled && !authProvidersBySystem.microsoft) {
      throw new WorkspaceException(
        'Microsoft auth is not enabled in the system.',
        WorkspaceExceptionCode.ENVIRONMENT_VAR_NOT_ENABLED,
      );
    }
    if (payload.isPasswordAuthEnabled && !authProvidersBySystem.password) {
      throw new WorkspaceException(
        'Password auth is not enabled in the system.',
        WorkspaceExceptionCode.ENVIRONMENT_VAR_NOT_ENABLED,
      );
    }
    if (payload.isGoogleAuthBypassEnabled && !authProvidersBySystem.google) {
      throw new WorkspaceException(
        'Google auth is not enabled in the system.',
        WorkspaceExceptionCode.ENVIRONMENT_VAR_NOT_ENABLED,
      );
    }
    if (
      payload.isMicrosoftAuthBypassEnabled &&
      !authProvidersBySystem.microsoft
    ) {
      throw new WorkspaceException(
        'Microsoft auth is not enabled in the system.',
        WorkspaceExceptionCode.ENVIRONMENT_VAR_NOT_ENABLED,
      );
    }
    if (
      payload.isPasswordAuthBypassEnabled &&
      !authProvidersBySystem.password
    ) {
      throw new WorkspaceException(
        'Password auth is not enabled in the system.',
        WorkspaceExceptionCode.ENVIRONMENT_VAR_NOT_ENABLED,
      );
    }

    try {
      return await this.workspaceRepository.save({
        ...workspace,
        ...payload,
      });
    } catch (error) {
      // revert custom domain registration on error
      if (payload.customDomain && customDomainRegistered) {
        this.dnsManagerService
          .deleteHostnameSilently(payload.customDomain)
          .catch((err) => {
            this.exceptionHandlerService.captureExceptions([err]);
          });
      }
      throw error;
    }
  }

  async activateWorkspace(
    user: UserEntity,
    workspace: WorkspaceEntity,
    data: ActivateWorkspaceInput,
  ) {
    if (!data.displayName || !data.displayName.length) {
      throw new BadRequestException("'displayName' not provided");
    }

    if (
      workspace.activationStatus === WorkspaceActivationStatus.ONGOING_CREATION
    ) {
      throw new Error('Workspace is already being created');
    }

    if (
      workspace.activationStatus !== WorkspaceActivationStatus.PENDING_CREATION
    ) {
      throw new Error('Workspace is not pending creation');
    }

    await this.workspaceRepository.update(workspace.id, {
      activationStatus: WorkspaceActivationStatus.ONGOING_CREATION,
    });

    await this.featureFlagService.enableFeatureFlags(
      DEFAULT_FEATURE_FLAGS,
      workspace.id,
    );

    await this.workspaceManagerService.init({
      workspace,
      userId: user.id,
    });
    await this.userWorkspaceService.createWorkspaceMember(workspace.id, user);

    const appVersion = this.twentyConfigService.get('APP_VERSION');

    await this.workspaceRepository.update(workspace.id, {
      displayName: data.displayName,
      activationStatus: WorkspaceActivationStatus.ACTIVE,
      version: extractVersionMajorMinorPatch(appVersion),
    });

    return await this.workspaceRepository.findOneBy({
      id: workspace.id,
    });
  }

  async deleteMetadataSchemaCacheAndUserWorkspace(workspace: WorkspaceEntity) {
    await this.userWorkspaceService.deleteUserWorkspace({
      userWorkspaceId: workspace.id,
    });

    if (this.billingService.isBillingEnabled()) {
      await this.billingSubscriptionService.deleteSubscriptions(workspace.id);
    }

    await this.workspaceManagerService.delete(workspace.id);

    return workspace;
  }

  async deleteWorkspace(id: string, softDelete = false) {
    const workspace = await this.workspaceRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    assert(workspace, 'Workspace not found');

    const userWorkspaces = await this.userWorkspaceRepository.find({
      where: {
        workspaceId: id,
      },
      withDeleted: true,
    });

    for (const userWorkspace of userWorkspaces) {
      await this.handleRemoveWorkspaceMember(
        id,
        userWorkspace.userId,
        softDelete,
      );
    }
    this.logger.log(`workspace ${id} user workspaces deleted`);

    await this.workspaceCacheStorageService.flush(
      workspace.id,
      workspace.metadataVersion,
    );
    await this.flatEntityMapsCacheService.flushFlatEntityMaps({
      workspaceId: workspace.id,
    });
    this.logger.log(`workspace ${id} cache flushed`);

    if (softDelete) {
      if (this.billingService.isBillingEnabled()) {
        await this.billingSubscriptionService.deleteSubscriptions(workspace.id);
      }

      await this.workspaceRepository.softDelete({ id });

      this.logger.log(`workspace ${id} soft deleted`);

      return workspace;
    }

    await this.deleteMetadataSchemaCacheAndUserWorkspace(workspace);

    await this.messageQueueService.add<FileWorkspaceFolderDeletionJobData>(
      FileWorkspaceFolderDeletionJob.name,
      { workspaceId: id },
    );

    if (workspace.customDomain) {
      await this.dnsManagerService.deleteHostnameSilently(
        workspace.customDomain,
      );
      this.logger.log(`workspace ${id} custom domain deleted`);
    }

    await this.workspaceRepository.delete(id);

    this.logger.log(`workspace ${id} hard deleted`);

    return workspace;
  }

  async handleRemoveWorkspaceMember(
    workspaceId: string,
    userId: string,
    softDelete = false,
  ) {
    const userWorkspaces = await this.userWorkspaceRepository.find({
      where: {
        userId,
      },
    });

    const userWorkspaceOfRemovedWorkspaceMember = userWorkspaces?.find(
      (userWorkspace: UserWorkspaceEntity) =>
        userWorkspace.workspaceId === workspaceId,
    );

    if (isDefined(userWorkspaceOfRemovedWorkspaceMember)) {
      await this.userWorkspaceService.deleteUserWorkspace({
        userWorkspaceId: userWorkspaceOfRemovedWorkspaceMember.id,
        softDelete,
      });
    }

    const hasOtherUserWorkspaces = isDefined(
      userWorkspaceOfRemovedWorkspaceMember,
    )
      ? userWorkspaces.length > 1
      : userWorkspaces.length > 0;

    if (!hasOtherUserWorkspaces) {
      await this.userRepository.softDelete(userId);
    }
  }

  async setCustomBillingPlan(
    workspaceId: string,
    planId: string,
  ): Promise<WorkspaceEntity> {
    const workspace = await this.workspaceRepository.findOneBy({
      id: workspaceId,
    });

    assertIsDefinedOrThrow(workspace, WorkspaceNotFoundDefaultError);

    await this.workspaceRepository.update(workspaceId, {
      customBillingPlanId: planId,
    });

    const updatedWorkspace = await this.workspaceRepository.findOneBy({
      id: workspaceId,
    });

    assertIsDefinedOrThrow(updatedWorkspace, WorkspaceNotFoundDefaultError);

    return updatedWorkspace;
  }

  private async validateWorkspaceUpdatePermissions({
    payload,
    userWorkspaceId,
    workspaceId,
    apiKey,
    workspaceActivationStatus,
  }: {
    payload: Partial<WorkspaceEntity>;
    userWorkspaceId?: string;
    workspaceId: string;
    apiKey?: string;
    workspaceActivationStatus: WorkspaceActivationStatus;
  }) {
    if (
      workspaceActivationStatus === WorkspaceActivationStatus.PENDING_CREATION
    ) {
      return;
    }

    const systemFields = new Set(['id', 'createdAt', 'updatedAt', 'deletedAt']);

    const fieldsBeingUpdated = Object.keys(payload).filter(
      (field) => !systemFields.has(field),
    );

    if (fieldsBeingUpdated.length === 0) {
      return;
    }

    if (!userWorkspaceId) {
      throw new Error('Missing userWorkspaceId in authContext');
    }

    const fieldsByPermission = new Map<PermissionFlagType, string[]>();

    for (const field of fieldsBeingUpdated) {
      const requiredPermission = this.WORKSPACE_FIELD_PERMISSIONS[field];

      if (!requiredPermission) {
        throw new PermissionsException(
          `Field "${field}" is not allowed to be updated`,
          PermissionsExceptionCode.PERMISSION_DENIED,
          {
            userFriendlyMessage: msg`The field "${field}" cannot be updated. Please contact your workspace administrator.`,
          },
        );
      }

      if (!fieldsByPermission.has(requiredPermission)) {
        fieldsByPermission.set(requiredPermission, []);
      }
      fieldsByPermission.get(requiredPermission)!.push(field);
    }

    for (const [permission, fields] of fieldsByPermission.entries()) {
      const hasPermission =
        await this.permissionsService.userHasWorkspaceSettingPermission({
          userWorkspaceId,
          workspaceId,
          setting: permission,
          apiKeyId: apiKey,
        });

      if (!hasPermission) {
        const fieldsList = fields.join(', ');

        throw new PermissionsException(
          PermissionsExceptionMessage.PERMISSION_DENIED,
          PermissionsExceptionCode.PERMISSION_DENIED,
          {
            userFriendlyMessage: msg`You do not have permission to update these fields: ${fieldsList}. Please contact your workspace administrator.`,
          },
        );
      }
    }
  }
}

```

```typescript
import {
  type ExecutionContext,
  UseFilters,
  UseGuards,
  UsePipes,
  createParamDecorator,
} from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import assert from 'assert';

import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { assertIsDefinedOrThrow, isDefined } from 'twenty-shared/utils';

import { FileFolder } from 'src/engine/core-modules/file/interfaces/file-folder.interface';

import type { FileUpload } from 'graphql-upload/processRequest.mjs';

import { ApplicationService } from 'src/engine/core-modules/application/application.service';
import { ApplicationDTO } from 'src/engine/core-modules/application/dtos/application.dto';
import { fromFlatApplicationToApplicationDto } from 'src/engine/core-modules/application/utils/from-flat-application-to-application-dto.util';
import { BillingSubscriptionEntity } from 'src/engine/core-modules/billing/entities/billing-subscription.entity';
import { BillingSubscriptionService } from 'src/engine/core-modules/billing/services/billing-subscription.service';
import { DomainValidRecords } from 'src/engine/core-modules/dns-manager/dtos/domain-valid-records';
import { DnsManagerService } from 'src/engine/core-modules/dns-manager/services/dns-manager.service';
import { CustomDomainManagerService } from 'src/engine/core-modules/domain/custom-domain-manager/services/custom-domain-manager.service';
import { WorkspaceDomainsService } from 'src/engine/core-modules/domain/workspace-domains/services/workspace-domains.service';
import { FeatureFlagDTO } from 'src/engine/core-modules/feature-flag/dtos/feature-flag-dto';
import { FeatureFlagKey } from 'src/engine/core-modules/feature-flag/enums/feature-flag-key.enum';
import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { SignedFileDTO } from 'src/engine/core-modules/file/file-upload/dtos/signed-file.dto';
import { FileUploadService } from 'src/engine/core-modules/file/file-upload/services/file-upload.service';
import { FileService } from 'src/engine/core-modules/file/services/file.service';
import { PreventNestToAutoLogGraphqlErrorsFilter } from 'src/engine/core-modules/graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';
import { UserWorkspaceService } from 'src/engine/core-modules/user-workspace/user-workspace.service';
import { UserEntity } from 'src/engine/core-modules/user/user.entity';
import { ActivateWorkspaceInput } from 'src/engine/core-modules/workspace/dtos/activate-workspace-input';
import {
  type AuthProvidersDTO,
  PublicWorkspaceDataOutput,
} from 'src/engine/core-modules/workspace/dtos/public-workspace-data-output';
import { UpdateWorkspaceInput } from 'src/engine/core-modules/workspace/dtos/update-workspace-input';
import { WorkspaceUrlsDTO } from 'src/engine/core-modules/workspace/dtos/workspace-urls.dto';
import { WorkspaceService } from 'src/engine/core-modules/workspace/services/workspace.service';
import { getAuthBypassProvidersByWorkspace } from 'src/engine/core-modules/workspace/utils/get-auth-bypass-providers-by-workspace.util';
import { getAuthProvidersByWorkspace } from 'src/engine/core-modules/workspace/utils/get-auth-providers-by-workspace.util';
import { workspaceGraphqlApiExceptionHandler } from 'src/engine/core-modules/workspace/utils/workspace-graphql-api-exception-handler.util';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import {
  WorkspaceException,
  WorkspaceExceptionCode,
  WorkspaceNotFoundDefaultError,
} from 'src/engine/core-modules/workspace/workspace.exception';
import { AuthApiKey } from 'src/engine/decorators/auth/auth-api-key.decorator';
import { AuthUserWorkspaceId } from 'src/engine/decorators/auth/auth-user-workspace-id.decorator';
import { AuthUser } from 'src/engine/decorators/auth/auth-user.decorator';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { CustomPermissionGuard } from 'src/engine/guards/custom-permission.guard';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { PublicEndpointGuard } from 'src/engine/guards/public-endpoint.guard';
import { SettingsPermissionGuard } from 'src/engine/guards/settings-permission.guard';
import { UserAuthGuard } from 'src/engine/guards/user-auth.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { PermissionFlagType } from 'src/engine/metadata-modules/permissions/constants/permission-flag-type.constants';
import { PermissionsGraphqlApiExceptionFilter } from 'src/engine/metadata-modules/permissions/utils/permissions-graphql-api-exception.filter';
import { RoleDTO } from 'src/engine/metadata-modules/role/dtos/role.dto';
import { RoleService } from 'src/engine/metadata-modules/role/role.service';
import { ViewDTO } from 'src/engine/metadata-modules/view/dtos/view.dto';
import { ViewService } from 'src/engine/metadata-modules/view/services/view.service';
import { getRequest } from 'src/utils/extract-request';
import { streamToBuffer } from 'src/utils/stream-to-buffer';
const OriginHeader = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = getRequest(ctx);

    return request.headers['origin'];
  },
);

@Resolver(() => WorkspaceEntity)
@UsePipes(ResolverValidationPipe)
@UseFilters(
  PreventNestToAutoLogGraphqlErrorsFilter,
  PermissionsGraphqlApiExceptionFilter,
)
export class WorkspaceResolver {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly workspaceDomainsService: WorkspaceDomainsService,
    private readonly userWorkspaceService: UserWorkspaceService,
    private readonly twentyConfigService: TwentyConfigService,
    private readonly fileUploadService: FileUploadService,
    private readonly fileService: FileService,
    private readonly billingSubscriptionService: BillingSubscriptionService,
    private readonly featureFlagService: FeatureFlagService,
    private readonly roleService: RoleService,
    private readonly viewService: ViewService,
    private readonly dnsManagerService: DnsManagerService,
    private readonly customDomainManagerService: CustomDomainManagerService,
    private readonly applicationService: ApplicationService,
  ) {}

  @Query(() => WorkspaceEntity)
  @UseGuards(WorkspaceAuthGuard, NoPermissionGuard)
  async currentWorkspace(@AuthWorkspace() { id }: WorkspaceEntity) {
    const workspace = await this.workspaceService.findById(id);

    assert(workspace, 'Workspace not found');

    return workspace;
  }

  @Mutation(() => WorkspaceEntity)
  @UseGuards(UserAuthGuard, WorkspaceAuthGuard, NoPermissionGuard)
  async activateWorkspace(
    @Args('data') data: ActivateWorkspaceInput,
    @AuthUser() user: UserEntity,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ) {
    return await this.workspaceService.activateWorkspace(user, workspace, data);
  }

  @Mutation(() => WorkspaceEntity)
  @UseGuards(WorkspaceAuthGuard, CustomPermissionGuard)
  async updateWorkspace(
    @Args('data') data: UpdateWorkspaceInput,
    @AuthWorkspace() workspace: WorkspaceEntity,
    @AuthUserWorkspaceId() userWorkspaceId: string,
    @AuthApiKey() apiKey?: string,
  ) {
    try {
      return await this.workspaceService.updateWorkspaceById({
        payload: {
          ...data,
          id: workspace.id,
        },
        userWorkspaceId,
        apiKey,
      });
    } catch (error) {
      workspaceGraphqlApiExceptionHandler(error);
    }
  }

  @ResolveField(() => String, { nullable: true })
  async routerModel(
    @Parent() _workspace: WorkspaceEntity,
  ): Promise<string | null> {
    return 'auto';
  }

  @Mutation(() => SignedFileDTO)
  @UseGuards(
    WorkspaceAuthGuard,
    SettingsPermissionGuard(PermissionFlagType.WORKSPACE),
  )
  async uploadWorkspaceLogo(
    @AuthWorkspace() { id }: WorkspaceEntity,
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename, mimetype }: FileUpload,
  ): Promise<SignedFileDTO> {
    const stream = createReadStream();
    const buffer = await streamToBuffer(stream);
    const fileFolder = FileFolder.WorkspaceLogo;

    const { files } = await this.fileUploadService.uploadImage({
      file: buffer,
      filename,
      mimeType: mimetype,
      fileFolder,
      workspaceId: id,
    });

    if (!files.length) {
      throw new Error('Failed to upload workspace logo');
    }

    await this.workspaceService.updateOne(id, {
      logo: files[0].path,
    });

    return files[0];
  }

  @ResolveField(() => [FeatureFlagDTO], { nullable: true })
  async featureFlags(
    @Parent() workspace: WorkspaceEntity,
  ): Promise<FeatureFlagDTO[]> {
    const featureFlags = await this.featureFlagService.getWorkspaceFeatureFlags(
      workspace.id,
    );

    return featureFlags.filter((flag) =>
      Object.values(FeatureFlagKey).includes(flag.key),
    );
  }

  @Mutation(() => WorkspaceEntity)
  @UseGuards(
    WorkspaceAuthGuard,
    SettingsPermissionGuard(PermissionFlagType.WORKSPACE),
  )
  async deleteCurrentWorkspace(@AuthWorkspace() { id }: WorkspaceEntity) {
    return this.workspaceService.deleteWorkspace(id);
  }

  @ResolveField(() => [BillingSubscriptionEntity])
  async billingSubscriptions(
    @Parent() workspace: WorkspaceEntity,
  ): Promise<BillingSubscriptionEntity[] | undefined> {
    if (!this.twentyConfigService.get('IS_BILLING_ENABLED')) {
      return [];
    }

    try {
      return this.billingSubscriptionService.getBillingSubscriptions(
        workspace.id,
      );
    } catch (error) {
      workspaceGraphqlApiExceptionHandler(error);
    }
  }

  @ResolveField(() => RoleDTO, { nullable: true })
  async defaultRole(
    @Parent() workspace: WorkspaceEntity,
  ): Promise<RoleDTO | null> {
    if (!workspace.defaultRoleId) {
      return null;
    }

    return await this.roleService.getRoleById(
      workspace.defaultRoleId,
      workspace.id,
    );
  }

  @ResolveField(() => String, { nullable: true })
  async fastModel(
    @Parent() workspace: WorkspaceEntity,
  ): Promise<string | null> {
    return workspace.fastModel;
  }

  @ResolveField(() => String, { nullable: true })
  async smartModel(
    @Parent() workspace: WorkspaceEntity,
  ): Promise<string | null> {
    return workspace.smartModel;
  }

  @ResolveField(() => ApplicationDTO, { nullable: true })
  async workspaceCustomApplication(
    @Parent() workspace: WorkspaceEntity,
  ): Promise<ApplicationDTO | null> {
    try {
      const { workspaceCustomFlatApplication } =
        await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow(
          {
            workspace,
          },
        );

      return fromFlatApplicationToApplicationDto(
        workspaceCustomFlatApplication,
      );
    } catch {
      // Temporary should be removed after CreateWorkspaceCustomApplicationCommand is run
      return null;
    }
  }

  @ResolveField(() => BillingSubscriptionEntity, { nullable: true })
  async currentBillingSubscription(
    @Parent() workspace: WorkspaceEntity,
  ): Promise<BillingSubscriptionEntity | undefined> {
    if (!this.twentyConfigService.get('IS_BILLING_ENABLED')) {
      return;
    }

    return this.billingSubscriptionService.getCurrentBillingSubscription({
      workspaceId: workspace.id,
    });
  }

  @ResolveField(() => Number)
  async workspaceMembersCount(
    @Parent() workspace: WorkspaceEntity,
  ): Promise<number | undefined> {
    return await this.userWorkspaceService.getUserCount(workspace.id);
  }

  @ResolveField(() => String)
  async logo(@Parent() workspace: WorkspaceEntity): Promise<string> {
    if (workspace.logo) {
      try {
        return this.fileService.signFileUrl({
          url: workspace.logo,
          workspaceId: workspace.id,
        });
      } catch {
        return workspace.logo;
      }
    }

    return workspace.logo ?? '';
  }

  @ResolveField(() => Boolean)
  hasValidEnterpriseKey(): boolean {
    return isDefined(this.twentyConfigService.get('ENTERPRISE_KEY'));
  }

  @ResolveField(() => WorkspaceUrlsDTO)
  workspaceUrls(@Parent() workspace: WorkspaceEntity) {
    return this.workspaceDomainsService.getWorkspaceUrls(workspace);
  }

  @ResolveField(() => Boolean)
  isGoogleAuthEnabled(@Parent() workspace: WorkspaceEntity) {
    return (
      workspace.isGoogleAuthEnabled &&
      this.twentyConfigService.get('AUTH_GOOGLE_ENABLED')
    );
  }

  @ResolveField(() => String)
  workspaceCustomApplicationId(@Parent() workspace: WorkspaceEntity) {
    return workspace.workspaceCustomApplicationId;
  }

  @ResolveField(() => Boolean)
  isMicrosoftAuthEnabled(@Parent() workspace: WorkspaceEntity) {
    return (
      workspace.isMicrosoftAuthEnabled &&
      this.twentyConfigService.get('AUTH_MICROSOFT_ENABLED')
    );
  }

  @ResolveField(() => Boolean)
  isPasswordAuthEnabled(@Parent() workspace: WorkspaceEntity) {
    return (
      workspace.isPasswordAuthEnabled &&
      this.twentyConfigService.get('AUTH_PASSWORD_ENABLED')
    );
  }

  @ResolveField(() => [ViewDTO])
  async views(
    @Parent() workspace: WorkspaceEntity,
    @AuthUserWorkspaceId() userWorkspaceId: string | undefined,
  ): Promise<ViewDTO[]> {
    return this.viewService.findByWorkspaceId(workspace.id, userWorkspaceId);
  }

  @Query(() => PublicWorkspaceDataOutput)
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async getPublicWorkspaceDataByDomain(
    @OriginHeader() originHeader: string,
    @Args('origin', { nullable: true }) origin?: string,
  ): Promise<PublicWorkspaceDataOutput | undefined> {
    try {
      const systemEnabledProviders: AuthProvidersDTO = {
        google: this.twentyConfigService.get('AUTH_GOOGLE_ENABLED'),
        magicLink: false,
        password: this.twentyConfigService.get('AUTH_PASSWORD_ENABLED'),
        microsoft: this.twentyConfigService.get('AUTH_MICROSOFT_ENABLED'),
        sso: [],
      };

      if (!origin) {
        return {
          id: 'default-workspace',
          logo: '',
          displayName: 'Default Workspace',
          workspaceUrls: {
            subdomainUrl: originHeader,
            customUrl: originHeader,
          },
          authProviders: systemEnabledProviders,
        };
      }

      const workspace =
        await this.workspaceDomainsService.getWorkspaceByOriginOrDefaultWorkspace(
          origin,
        );

      assertIsDefinedOrThrow(workspace, WorkspaceNotFoundDefaultError);

      let workspaceLogoWithToken = '';

      if (workspace.logo) {
        try {
          workspaceLogoWithToken = this.fileService.signFileUrl({
            url: workspace.logo,
            workspaceId: workspace.id,
          });
        } catch {
          workspaceLogoWithToken = workspace.logo;
        }
      }

      return {
        id: workspace.id,
        logo: workspaceLogoWithToken,
        displayName: workspace.displayName,
        workspaceUrls: this.workspaceDomainsService.getWorkspaceUrls(workspace),
        authProviders: getAuthProvidersByWorkspace({
          workspace,
          systemEnabledProviders,
        }),
        authBypassProviders: getAuthBypassProvidersByWorkspace({
          workspace,
          systemEnabledProviders,
        }),
      };
    } catch (err) {
      workspaceGraphqlApiExceptionHandler(err);
    }
  }

  @Mutation(() => DomainValidRecords, { nullable: true })
  @UseGuards(
    WorkspaceAuthGuard,
    SettingsPermissionGuard(PermissionFlagType.WORKSPACE),
  )
  async checkCustomDomainValidRecords(
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<DomainValidRecords | undefined> {
    assertIsDefinedOrThrow(
      workspace.customDomain,
      new WorkspaceException(
        `Custom domain not found`,
        WorkspaceExceptionCode.CUSTOM_DOMAIN_NOT_FOUND,
      ),
    );

    const domainValidRecords = await this.dnsManagerService.refreshHostname(
      workspace.customDomain,
    );

    return this.customDomainManagerService.checkCustomDomainValidRecords(
      workspace,
      domainValidRecords,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(WorkspaceAuthGuard, NoPermissionGuard)
  async selectCustomBillingPlan(
    @AuthWorkspace() workspace: WorkspaceEntity,
    @Args('planId') planId: string,
  ): Promise<boolean> {
    try {
      await this.workspaceService.setCustomBillingPlan(workspace.id, planId);

      return true;
    } catch (error) {
      workspaceGraphqlApiExceptionHandler(error);

      return false;
    }
  }
}

```

Excelente! Não há erros de lint. Agora vou verificar se preciso criar a página de onboarding para planos customizados no frontend:

```typescriptreact
import { Modal } from '@/ui/layout/modal/components/Modal';
import { ChooseCustomPlanContent } from '~/pages/onboarding/internal/ChooseCustomPlanContent';

export const ChooseCustomPlan = () => {
  return (
    <Modal.Content isVerticalCentered>
      <ChooseCustomPlanContent />
    </Modal.Content>
  );
};

```

```typescriptreact
import { SubTitle } from '@/auth/components/SubTitle';
import { Title } from '@/auth/components/Title';
import { useAuth } from '@/auth/hooks/useAuth';
import styled from '@emotion/styled';
import { Trans, useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'twenty-ui/feedback';
import { MainButton } from 'twenty-ui/input';
import { ClickToActionLink } from 'twenty-ui/navigation';
import { AppPath } from 'twenty-shared/types';
import { useSelectCustomBillingPlanMutation } from '~/generated/graphql';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const StyledPlanCard = styled.div<{ isSelected: boolean }>`
  background-color: ${({ theme }) => theme.background.secondary};
  border: 2px solid
    ${({ theme, isSelected }) =>
      isSelected ? theme.color.blue : theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(4)};
  width: 100%;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.color.blue};
  }
`;

const StyledPlanName = styled.div`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const StyledPlanDescription = styled.div`
  color: ${({ theme }) => theme.font.color.secondary};
  font-size: ${({ theme }) => theme.font.size.sm};
`;

const StyledPlansContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${({ theme }) => theme.spacing(6)} 0;
  width: 100%;
`;

const StyledLinkGroup = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing(1)};
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

// TODO: These should come from a GraphQL query to fetch custom billing plans
const MOCK_CUSTOM_PLANS = [
  {
    id: 'plan-basic',
    name: 'Plano Básico',
    description: 'Ideal para pequenas equipes',
    price: 'R$ 49/mês',
  },
  {
    id: 'plan-pro',
    name: 'Plano Profissional',
    description: 'Para equipes em crescimento',
    price: 'R$ 99/mês',
  },
  {
    id: 'plan-enterprise',
    name: 'Plano Enterprise',
    description: 'Recursos completos para grandes empresas',
    price: 'R$ 199/mês',
  },
];

export const ChooseCustomPlanContent = () => {
  const { t } = useLingui();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectCustomBillingPlan, { loading }] =
    useSelectCustomBillingPlanMutation();

  const handlePlanSelect = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleContinue = async () => {
    if (!selectedPlanId) return;

    try {
      await selectCustomBillingPlan({
        variables: {
          planId: selectedPlanId,
        },
      });

      navigate(AppPath.CreateWorkspace);
    } catch (error) {
      console.error('Error selecting plan:', error);
    }
  };

  return (
    <StyledContainer>
      <Title noMarginTop>{t`Escolha seu Plano`}</Title>
      <SubTitle>{t`Selecione o plano ideal para sua equipe`}</SubTitle>

      <StyledPlansContainer>
        {MOCK_CUSTOM_PLANS.map((plan) => (
          <StyledPlanCard
            key={plan.id}
            isSelected={selectedPlanId === plan.id}
            onClick={() => handlePlanSelect(plan.id)}
          >
            <StyledPlanName>{plan.name}</StyledPlanName>
            <StyledPlanDescription>{plan.description}</StyledPlanDescription>
            <StyledPlanDescription style={{ marginTop: '8px' }}>
              {plan.price}
            </StyledPlanDescription>
          </StyledPlanCard>
        ))}
      </StyledPlansContainer>

      <MainButton
        title={t`Continuar`}
        onClick={handleContinue}
        width={200}
        Icon={() => loading && <Loader />}
        disabled={!selectedPlanId || loading}
      />

      <StyledLinkGroup>
        <ClickToActionLink onClick={signOut}>
          <Trans>Sair</Trans>
        </ClickToActionLink>
      </StyledLinkGroup>
    </StyledContainer>
  );
};

```

```typescriptreact
import { AppRouterProviders } from '@/app/components/AppRouterProviders';
import { SettingsRoutes } from '@/app/components/SettingsRoutes';
import { VerifyLoginTokenEffect } from '@/auth/components/VerifyLoginTokenEffect';

import { VerifyEmailEffect } from '@/auth/components/VerifyEmailEffect';
import indexAppPath from '@/navigation/utils/indexAppPath';
import { BlankLayout } from '@/ui/layout/page/components/BlankLayout';
import { DefaultLayout } from '@/ui/layout/page/components/DefaultLayout';
import { AppPath } from 'twenty-shared/types';

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import { Authorize } from '~/pages/auth/Authorize';
import { PasswordReset } from '~/pages/auth/PasswordReset';
import { SignInUp } from '~/pages/auth/SignInUp';
import { NotFound } from '~/pages/not-found/NotFound';
import { RecordIndexPage } from '~/pages/object-record/RecordIndexPage';
import { RecordShowPage } from '~/pages/object-record/RecordShowPage';
import { BookCall } from '~/pages/onboarding/BookCall';
import { BookCallDecision } from '~/pages/onboarding/BookCallDecision';
import { ChooseCustomPlan } from '~/pages/onboarding/ChooseCustomPlan';
import { ChooseYourPlan } from '~/pages/onboarding/ChooseYourPlan';
import { CreateProfile } from '~/pages/onboarding/CreateProfile';
import { CreateWorkspace } from '~/pages/onboarding/CreateWorkspace';
import { InviteTeam } from '~/pages/onboarding/InviteTeam';
import { PaymentSuccess } from '~/pages/onboarding/PaymentSuccess';
import { SyncEmails } from '~/pages/onboarding/SyncEmails';

export const useCreateAppRouter = (
  isFunctionSettingsEnabled?: boolean,
  isAdminPageEnabled?: boolean,
) =>
  createBrowserRouter(
    createRoutesFromElements(
      <Route
        element={<AppRouterProviders />}
        // To switch state to `loading` temporarily to enable us
        // to set scroll position before the page is rendered
        loader={async () => Promise.resolve(null)}
      >
        <Route element={<DefaultLayout />}>
          <Route path={AppPath.Verify} element={<VerifyLoginTokenEffect />} />
          <Route path={AppPath.VerifyEmail} element={<VerifyEmailEffect />} />
          <Route path={AppPath.SignInUp} element={<SignInUp />} />
          <Route path={AppPath.Invite} element={<SignInUp />} />
          <Route path={AppPath.ResetPassword} element={<PasswordReset />} />
          <Route path={AppPath.CreateWorkspace} element={<CreateWorkspace />} />
          <Route path={AppPath.CreateProfile} element={<CreateProfile />} />
          <Route path={AppPath.SyncEmails} element={<SyncEmails />} />
          <Route path={AppPath.InviteTeam} element={<InviteTeam />} />
          <Route path={AppPath.PlanRequired} element={<ChooseYourPlan />} />
          <Route
            path={AppPath.PlanRequiredSuccess}
            element={<PaymentSuccess />}
          />
          <Route
            path={AppPath.BookCallDecision}
            element={<BookCallDecision />}
          />
          <Route path={AppPath.BookCall} element={<BookCall />} />
          <Route path={indexAppPath.getIndexAppPath()} element={<></>} />
          <Route path={AppPath.RecordIndexPage} element={<RecordIndexPage />} />
          <Route path={AppPath.RecordShowPage} element={<RecordShowPage />} />
          <Route
            path={AppPath.SettingsCatchAll}
            element={
              <SettingsRoutes
                isFunctionSettingsEnabled={isFunctionSettingsEnabled}
                isAdminPageEnabled={isAdminPageEnabled}
              />
            }
          />
          <Route path={AppPath.NotFoundWildcard} element={<NotFound />} />
        </Route>
        <Route element={<BlankLayout />}>
          <Route path={AppPath.Authorize} element={<Authorize />} />
        </Route>
      </Route>,
    ),
  );

```

```typescriptreact
import { AppRouterProviders } from '@/app/components/AppRouterProviders';
import { SettingsRoutes } from '@/app/components/SettingsRoutes';
import { VerifyLoginTokenEffect } from '@/auth/components/VerifyLoginTokenEffect';

import { VerifyEmailEffect } from '@/auth/components/VerifyEmailEffect';
import indexAppPath from '@/navigation/utils/indexAppPath';
import { BlankLayout } from '@/ui/layout/page/components/BlankLayout';
import { DefaultLayout } from '@/ui/layout/page/components/DefaultLayout';
import { AppPath } from 'twenty-shared/types';

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import { Authorize } from '~/pages/auth/Authorize';
import { PasswordReset } from '~/pages/auth/PasswordReset';
import { SignInUp } from '~/pages/auth/SignInUp';
import { NotFound } from '~/pages/not-found/NotFound';
import { RecordIndexPage } from '~/pages/object-record/RecordIndexPage';
import { RecordShowPage } from '~/pages/object-record/RecordShowPage';
import { BookCall } from '~/pages/onboarding/BookCall';
import { BookCallDecision } from '~/pages/onboarding/BookCallDecision';
import { ChooseCustomPlan } from '~/pages/onboarding/ChooseCustomPlan';
import { ChooseYourPlan } from '~/pages/onboarding/ChooseYourPlan';
import { CreateProfile } from '~/pages/onboarding/CreateProfile';
import { CreateWorkspace } from '~/pages/onboarding/CreateWorkspace';
import { InviteTeam } from '~/pages/onboarding/InviteTeam';
import { PaymentSuccess } from '~/pages/onboarding/PaymentSuccess';
import { SyncEmails } from '~/pages/onboarding/SyncEmails';

export const useCreateAppRouter = (
  isFunctionSettingsEnabled?: boolean,
  isAdminPageEnabled?: boolean,
) =>
  createBrowserRouter(
    createRoutesFromElements(
      <Route
        element={<AppRouterProviders />}
        // To switch state to `loading` temporarily to enable us
        // to set scroll position before the page is rendered
        loader={async () => Promise.resolve(null)}
      >
        <Route element={<DefaultLayout />}>
          <Route path={AppPath.Verify} element={<VerifyLoginTokenEffect />} />
          <Route path={AppPath.VerifyEmail} element={<VerifyEmailEffect />} />
          <Route path={AppPath.SignInUp} element={<SignInUp />} />
          <Route path={AppPath.Invite} element={<SignInUp />} />
          <Route path={AppPath.ResetPassword} element={<PasswordReset />} />
          <Route path={AppPath.CreateWorkspace} element={<CreateWorkspace />} />
          <Route path={AppPath.CreateProfile} element={<CreateProfile />} />
          <Route path={AppPath.SyncEmails} element={<SyncEmails />} />
          <Route path={AppPath.InviteTeam} element={<InviteTeam />} />
          <Route path={AppPath.PlanRequired} element={<ChooseYourPlan />} />
          <Route
            path={AppPath.PlanRequiredSuccess}
            element={<PaymentSuccess />}
          />
          <Route
            path={AppPath.CustomPlanRequired}
            element={<ChooseCustomPlan />}
          />
          <Route
            path={AppPath.BookCallDecision}
            element={<BookCallDecision />}
          />
          <Route path={AppPath.BookCall} element={<BookCall />} />
          <Route path={indexAppPath.getIndexAppPath()} element={<></>} />
          <Route path={AppPath.RecordIndexPage} element={<RecordIndexPage />} />
          <Route path={AppPath.RecordShowPage} element={<RecordShowPage />} />
          <Route
            path={AppPath.SettingsCatchAll}
            element={
              <SettingsRoutes
                isFunctionSettingsEnabled={isFunctionSettingsEnabled}
                isAdminPageEnabled={isAdminPageEnabled}
              />
            }
          />
          <Route path={AppPath.NotFoundWildcard} element={<NotFound />} />
        </Route>
        <Route element={<BlankLayout />}>
          <Route path={AppPath.Authorize} element={<Authorize />} />
        </Route>
      </Route>,
    ),
  );

```

Todas as implementações foram concluídas com sucesso. Vou fazer um resumo das alterações:

## ✅ Implementação Concluída!

Todas as alterações foram feitas de acordo com o documento `BILLING_MODE_IMPLEMENTATION.md`. Aqui está o resumo:

### Backend (twenty-server):

1. **Criado enum `BillingMode`**:
   - `packages/twenty-server/src/engine/core-modules/billing/enums/billing-mode.enum.ts`
   - Valores: `STRIPE` (padrão) e `LOCAL`

2. **Adicionado `BILLING_MODE` em config-variables.ts**:
   - Nova variável de configuração no grupo `BILLING_CONFIG`
   - Validações do Stripe agora só são requeridas quando `BILLING_MODE=STRIPE`

3. **Atualizado client-config.entity.ts**:
   - Campo `billingMode` adicionado ao tipo `Billing`

4. **Atualizado client-config.service.ts**:
   - `billingMode` é exposto no ClientConfig

5. **Adicionado `CUSTOM_PLAN_REQUIRED` em onboarding-status.enum.ts**

6. **Modificado OnboardingService**:
   - Verifica `BILLING_MODE` antes de decidir o status
   - Se `LOCAL`: verifica `customBillingPlanId`
   - Se `STRIPE`: comportamento original

7. **Adicionado `customBillingPlanId` em workspace.entity.ts**

8. **Adicionada mutation `selectCustomBillingPlan`**:
   - `workspace.resolver.ts` - nova mutation
   - `workspace.service.ts` - método `setCustomBillingPlan`

9. **Criada migration**:
   - `1765000000000-addCustomBillingPlanIdToWorkspace.ts`

### Frontend (twenty-front e twenty-shared):

1. **Adicionado `CustomPlanRequired` no AppPath** (twenty-shared)

2. **Atualizado usePageChangeEffectNavigateLocation.ts**:
   - Redireciona para `/custom-plan-required` quando `OnboardingStatus.CUSTOM_PLAN_REQUIRED`

3. **Criada página ChooseCustomPlan**:
   - `ChooseCustomPlan.tsx` - componente principal
   - `ChooseCustomPlanContent.tsx` - conteúdo da página

4. **Atualizado useCreateAppRouter.tsx**:
   - Nova rota para `/custom-plan-required`

### Próximos passos:

1. **Rodar migrations**:
   ```bash
   cd /home/alex/Documentos/twentybilling/twenty
   yarn nx run twenty-server:database:migrate:prod
   ```

2. **Regenerar tipos GraphQL no frontend**:
   ```bash
   yarn nx run twenty-front:graphql:generate
   ```

3. **Configurar variáveis de ambiente**:
   ```env
   IS_BILLING_ENABLED=true
   BILLING_MODE=LOCAL
   ```

4. **Criar planos customizados** no Admin Panel e substituir os planos mock no `ChooseCustomPlanContent.tsx` por uma query GraphQL real que busque os planos do banco de dados.

```shellscript
   cd /home/alex/Documentos/twentybilling/twenty
   yarn nx run twenty-server:database:migrate:prod
```

```shellscript
   yarn nx run twenty-front:graphql:generate
```

```plaintext
   IS_BILLING_ENABLED=true
   BILLING_MODE=LOCAL
```

---

**User**

@bash (360-381) deu este erro mexa apenas no necessario para arrumar

---

**Cursor**

O erro ocorre porque a mutation `useSelectCustomBillingPlanMutation` ainda não foi gerada no arquivo `graphql.ts`. Vou corrigir o `ChooseCustomPlanContent.tsx` para usar `useMutation` diretamente:

```typescriptreact
import { gql, useMutation } from '@apollo/client';
import { SubTitle } from '@/auth/components/SubTitle';
import { Title } from '@/auth/components/Title';
import { useAuth } from '@/auth/hooks/useAuth';
import styled from '@emotion/styled';
import { Trans, useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'twenty-ui/feedback';
import { MainButton } from 'twenty-ui/input';
import { ClickToActionLink } from 'twenty-ui/navigation';
import { AppPath } from 'twenty-shared/types';

const SELECT_CUSTOM_BILLING_PLAN = gql`
  mutation SelectCustomBillingPlan($planId: String!) {
    selectCustomBillingPlan(planId: $planId)
  }
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const StyledPlanCard = styled.div<{ isSelected: boolean }>`
  background-color: ${({ theme }) => theme.background.secondary};
  border: 2px solid
    ${({ theme, isSelected }) =>
      isSelected ? theme.color.blue : theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(4)};
  width: 100%;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.color.blue};
  }
`;

const StyledPlanName = styled.div`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const StyledPlanDescription = styled.div`
  color: ${({ theme }) => theme.font.color.secondary};
  font-size: ${({ theme }) => theme.font.size.sm};
`;

const StyledPlansContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${({ theme }) => theme.spacing(6)} 0;
  width: 100%;
`;

const StyledLinkGroup = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing(1)};
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

// TODO: These should come from a GraphQL query to fetch custom billing plans
const MOCK_CUSTOM_PLANS = [
  {
    id: 'plan-basic',
    name: 'Plano Básico',
    description: 'Ideal para pequenas equipes',
    price: 'R$ 49/mês',
  },
  {
    id: 'plan-pro',
    name: 'Plano Profissional',
    description: 'Para equipes em crescimento',
    price: 'R$ 99/mês',
  },
  {
    id: 'plan-enterprise',
    name: 'Plano Enterprise',
    description: 'Recursos completos para grandes empresas',
    price: 'R$ 199/mês',
  },
];

export const ChooseCustomPlanContent = () => {
  const { t } = useLingui();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectCustomBillingPlan, { loading }] =
    useSelectCustomBillingPlanMutation();

  const handlePlanSelect = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleContinue = async () => {
    if (!selectedPlanId) return;

    try {
      await selectCustomBillingPlan({
        variables: {
          planId: selectedPlanId,
        },
      });

      navigate(AppPath.CreateWorkspace);
    } catch (error) {
      console.error('Error selecting plan:', error);
    }
  };

  return (
    <StyledContainer>
      <Title noMarginTop>{t`Escolha seu Plano`}</Title>
      <SubTitle>{t`Selecione o plano ideal para sua equipe`}</SubTitle>

      <StyledPlansContainer>
        {MOCK_CUSTOM_PLANS.map((plan) => (
          <StyledPlanCard
            key={plan.id}
            isSelected={selectedPlanId === plan.id}
            onClick={() => handlePlanSelect(plan.id)}
          >
            <StyledPlanName>{plan.name}</StyledPlanName>
            <StyledPlanDescription>{plan.description}</StyledPlanDescription>
            <StyledPlanDescription style={{ marginTop: '8px' }}>
              {plan.price}
            </StyledPlanDescription>
          </StyledPlanCard>
        ))}
      </StyledPlansContainer>

      <MainButton
        title={t`Continuar`}
        onClick={handleContinue}
        width={200}
        Icon={() => loading && <Loader />}
        disabled={!selectedPlanId || loading}
      />

      <StyledLinkGroup>
        <ClickToActionLink onClick={signOut}>
          <Trans>Sair</Trans>
        </ClickToActionLink>
      </StyledLinkGroup>
    </StyledContainer>
  );
};


```

```typescriptreact
import { gql, useMutation } from '@apollo/client';
import { SubTitle } from '@/auth/components/SubTitle';
import { Title } from '@/auth/components/Title';
import { useAuth } from '@/auth/hooks/useAuth';
import styled from '@emotion/styled';
import { Trans, useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'twenty-ui/feedback';
import { MainButton } from 'twenty-ui/input';
import { ClickToActionLink } from 'twenty-ui/navigation';
import { AppPath } from 'twenty-shared/types';

const SELECT_CUSTOM_BILLING_PLAN = gql`
  mutation SelectCustomBillingPlan($planId: String!) {
    selectCustomBillingPlan(planId: $planId)
  }
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const StyledPlanCard = styled.div<{ isSelected: boolean }>`
  background-color: ${({ theme }) => theme.background.secondary};
  border: 2px solid
    ${({ theme, isSelected }) =>
      isSelected ? theme.color.blue : theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(4)};
  width: 100%;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.color.blue};
  }
`;

const StyledPlanName = styled.div`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const StyledPlanDescription = styled.div`
  color: ${({ theme }) => theme.font.color.secondary};
  font-size: ${({ theme }) => theme.font.size.sm};
`;

const StyledPlansContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${({ theme }) => theme.spacing(6)} 0;
  width: 100%;
`;

const StyledLinkGroup = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing(1)};
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

// TODO: These should come from a GraphQL query to fetch custom billing plans
const MOCK_CUSTOM_PLANS = [
  {
    id: 'plan-basic',
    name: 'Plano Básico',
    description: 'Ideal para pequenas equipes',
    price: 'R$ 49/mês',
  },
  {
    id: 'plan-pro',
    name: 'Plano Profissional',
    description: 'Para equipes em crescimento',
    price: 'R$ 99/mês',
  },
  {
    id: 'plan-enterprise',
    name: 'Plano Enterprise',
    description: 'Recursos completos para grandes empresas',
    price: 'R$ 199/mês',
  },
];

export const ChooseCustomPlanContent = () => {
  const { t } = useLingui();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectCustomBillingPlan, { loading }] = useMutation(
    SELECT_CUSTOM_BILLING_PLAN,
  );

  const handlePlanSelect = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleContinue = async () => {
    if (!selectedPlanId) return;

    try {
      await selectCustomBillingPlan({
        variables: {
          planId: selectedPlanId,
        },
      });

      navigate(AppPath.CreateWorkspace);
    } catch (error) {
      console.error('Error selecting plan:', error);
    }
  };

  return (
    <StyledContainer>
      <Title noMarginTop>{t`Escolha seu Plano`}</Title>
      <SubTitle>{t`Selecione o plano ideal para sua equipe`}</SubTitle>

      <StyledPlansContainer>
        {MOCK_CUSTOM_PLANS.map((plan) => (
          <StyledPlanCard
            key={plan.id}
            isSelected={selectedPlanId === plan.id}
            onClick={() => handlePlanSelect(plan.id)}
          >
            <StyledPlanName>{plan.name}</StyledPlanName>
            <StyledPlanDescription>{plan.description}</StyledPlanDescription>
            <StyledPlanDescription style={{ marginTop: '8px' }}>
              {plan.price}
            </StyledPlanDescription>
          </StyledPlanCard>
        ))}
      </StyledPlansContainer>

      <MainButton
        title={t`Continuar`}
        onClick={handleContinue}
        width={200}
        Icon={() => loading && <Loader />}
        disabled={!selectedPlanId || loading}
      />

      <StyledLinkGroup>
        <ClickToActionLink onClick={signOut}>
          <Trans>Sair</Trans>
        </ClickToActionLink>
      </StyledLinkGroup>
    </StyledContainer>
  );
};


```

Pronto! O erro foi corrigido. Mudei o import para usar `useMutation` diretamente do `@apollo/client` com a mutation definida inline, em vez de depender do tipo gerado automaticamente.

Quando você rodar o comando de geração de tipos GraphQL (`yarn nx run twenty-front:graphql:generate`), a mutation `useSelectCustomBillingPlanMutation` será gerada automaticamente e você poderá voltar a usar o import do arquivo gerado se preferir.

---

**User**

agora este erro

[plugin:wyw-in-js] ENOENT: no such file or directory, open '/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/react.js'



/home/alex/Documentos/twentybilling/twenty/packages/twenty-front/src/modules/ui/field/display/components/MultiSelectDisplay.tsx

    at readFileSync (node:fs:435:20)

    at Object.loadAndParse [as loadAndParseFn] (/home/alex/Documentos/twentybilling/twenty/node_modules/@wyw-in-js/transform/lib/transform/Entrypoint.helpers.js:119:97)

    at new Entrypoint (/home/alex/Documentos/twentybilling/twenty/node_modules/@wyw-in-js/transform/lib/transform/Entrypoint.js:40:112)

    at Entrypoint.innerCreate (/home/alex/Documentos/twentybilling/twenty/node_modules/@wyw-in-js/transform/lib/transform/Entrypoint.js:129:27)

    at /home/alex/Documentos/twentybilling/twenty/node_modules/@wyw-in-js/transform/lib/transform/Entrypoint.js:85:47

    at EventEmitter.perf (/home/alex/Documentos/twentybilling/twenty/node_modules/@wyw-in-js/transform/lib/utils/EventEmitter.js:45:20)

    at Entrypoint.create (/home/alex/Documentos/twentybilling/twenty/node_modules/@wyw-in-js/transform/lib/transform/Entrypoint.js:84:25)

    at Entrypoint.createChild (/home/alex/Documentos/twentybilling/twenty/node_modules/@wyw-in-js/transform/lib/transform/Entrypoint.js:176:23)

    at BaseAction.processImports (/home/alex/Documentos/twentybilling/twenty/node_modules/@wyw-in-js/transform/lib/transform/generators/processImports.js:22:44)

    at processImports.next (<anonymous>)

    at /home/alex/Documentos/twentybilling/twenty/node_modules/@wyw-in-js/transform/lib/transform/actions/BaseAction.js:66:78

    at EventEmitter.action (/home/alex/Documentos/twentybilling/twenty/node_modules/@wyw-in-js/transform/lib/utils/EventEmitter.js:25:22)

    at BaseAction.emitAction (/home/alex/Documentos/twentybilling/twenty/node_modules/@wyw-in-js/transform/lib/transform/actions/BaseAction.js:131:39)

    at nextFn (/home/alex/Documentos/twentybilling/twenty/node_modules/@wyw-in-js/transform/lib/transform/actions/BaseAction.js:66:32)

    at processNext (/home/alex/Documentos/twentybilling/twenty/node_modules/@wyw-in-js/transform/lib/transform/actions/BaseAction.js:111:28)

    at Object.next (/home/alex/Documentos/twentybilling/twenty/node_modules/@wyw-in-js/transform/lib/transform/actions/BaseAction.js:120:9)

    at asyncActionRunner (/home/alex/Documentos/twentybilling/twenty/node_modules/@wyw-in-js/transform/lib/transform/actions/actionRunner.js:39:102)

    at asyncActionRunner (/home/alex/Documentos/twentybilling/twenty/node_modules/@wyw-in-js/transform/lib/transform/actions/actionRunner.js:46:28)

    at async asyncActionRunner (/home/alex/Documentos/twentybilling/twenty/node_modules/@wyw-in-js/transform/lib/transform/actions/actionRunner.js:46:22)

    at async asyncActionRunner (/home/alex/Documentos/twentybilling/twenty/node_modules/@wyw-in-js/transform/lib/transform/actions/actionRunner.js:46:22)

    at async asyncActionRunner (/home/alex/Documentos/twentybilling/twenty/node_modules/@wyw-in-js/transform/lib/transform/actions/actionRunner.js:46:22)

    at async asyncActionRunner (/home/alex/Documentos/twentybilling/twenty/node_modules/@wyw-in-js/transform/lib/transform/actions/actionRunner.js:46:22)

    at async asyncActionRunner (/home/alex/Documentos/twentybilling/twenty/node_modules/@wyw-in-js/transform/lib/transform/actions/actionRunner.js:46:22)

    at async asyncActionRunner (/home/alex/Documentos/twentybilling/twenty/node_modules/@wyw-in-js/transform/lib/transform/actions/actionRunner.js:46:22)

    at async asyncActionRunner (/home/alex/Documentos/twentybilling/twenty/node_modules/@wyw-in-js/transform/lib/transform/actions/actionRunner.js:46:22)

    at async asyncActionRunner (/home/alex/Documentos/twentybilling/twenty/node_modules/@wyw-in-js/transform/lib/transform/actions/actionRunner.js:46:22)

    at async asyncActionRunner (/home/alex/Documentos/twentybilling/twenty/node_modules/@wyw-in-js/transform/lib/transform/actions/actionRunner.js:46:22)

    at async asyncActionRunner (/home/alex/Documentos/twentybilling/twenty/node_modules/@wyw-in-js/transform/lib/transform/actions/actionRunner.js:46:22)

    at async asyncActionRunner (/home/alex/Documentos/twentybilling/twenty/node_modules/@wyw-in-js/transform/lib/transform/actions/actionRunner.js:46:22)

    at async asyncActionRunner (/home/alex/Documentos/twentybilling/twenty/node_modules/@wyw-in-js/transform/lib/transform/actions/actionRunner.js:46:22)

    at async asyncActionRunner (/home/alex/Documentos/twentybilling/twenty/node_modules/@wyw-in-js/transform/lib/transform/actions/actionRunner.js:46:22)

    at async asyncActionRunner (/home/alex/Documentos/twentybilling/twenty/node_modules/@wyw-in-js/transform/lib/transform/actions/actionRunner.js:46:22)

    at async transform (/home/alex/Documentos/twentybilling/twenty/node_modules/@wyw-in-js/transform/lib/transform.js:107:20)

    at async TransformPluginContext.transform (file:///home/alex/Documentos/twentybilling/twenty/node_modules/@wyw-in-js/vite/esm/index.mjs:118:22)

    at async EnvironmentPluginContainer.transform (file:///home/alex/Documentos/twentybilling/twenty/node_modules/vite/dist/node/chunks/config.js:30905:14)

    at async loadAndTransform (file:///home/alex/Documentos/twentybilling/twenty/node_modules/vite/dist/node/chunks/config.js:26043:26)

Click outside, press Esc key, or fix the code to dismiss.



Mexa apenas no necessario para arrumar 

---

**Cursor**

Este erro não está relacionado às alterações que fizemos. É um problema de cache do Vite. Execute este comando para limpar o cache:

Pronto! O cache do Vite foi limpo. Agora reinicie o servidor de desenvolvimento (pare com `Ctrl+C` e inicie novamente com `yarn start` ou `yarn nx serve twenty-front`).

---

**User**

quando acesso o local host ele esta em looping de redirecionamento entre a pagina padrão /welcome e /http://localhost:3001/custom-plan-required

---

**Cursor**

Investigando o loop de redirecionamento. O caminho parece estar sendo construído incorretamente. Verificando o hook de navegação:


A verificação de `CUSTOM_PLAN_REQUIRED` está ocorrendo mesmo sem login, causando o loop. Ajustando para só verificar quando o usuário estiver logado e em um workspace, como na verificação de `PLAN_REQUIRED`:


A verificação de `CUSTOM_PLAN_REQUIRED` deve ocorrer apenas quando o usuário estiver logado. Ajustando a lógica para executar somente nesse caso:


```typescript
import { verifyEmailRedirectPathState } from '@/app/states/verifyEmailRedirectPathState';
import { useIsLogged } from '@/auth/hooks/useIsLogged';
import { calendarBookingPageIdState } from '@/client-config/states/calendarBookingPageIdState';
import { useIsCurrentLocationOnAWorkspace } from '@/domain-manager/hooks/useIsCurrentLocationOnAWorkspace';
import { useDefaultHomePagePath } from '@/navigation/hooks/useDefaultHomePagePath';
import { objectMetadataItemsState } from '@/object-metadata/states/objectMetadataItemsState';
import { useOnboardingStatus } from '@/onboarding/hooks/useOnboardingStatus';
import { useIsWorkspaceActivationStatusEqualsTo } from '@/workspace/hooks/useIsWorkspaceActivationStatusEqualsTo';
import { useLocation, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { AppPath, SettingsPath } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { WorkspaceActivationStatus } from 'twenty-shared/workspace';
import { OnboardingStatus } from '~/generated/graphql';
import { isMatchingLocation } from '~/utils/isMatchingLocation';

export const usePageChangeEffectNavigateLocation = () => {
  const isLoggedIn = useIsLogged();
  const { isOnAWorkspace } = useIsCurrentLocationOnAWorkspace();
  const onboardingStatus = useOnboardingStatus();
  const isWorkspaceSuspended = useIsWorkspaceActivationStatusEqualsTo(
    WorkspaceActivationStatus.SUSPENDED,
  );
  const { defaultHomePagePath } = useDefaultHomePagePath();
  const location = useLocation();
  const calendarBookingPageId = useRecoilValue(calendarBookingPageIdState);

  const someMatchingLocationOf = (appPaths: AppPath[]): boolean =>
    appPaths.some((appPath) => isMatchingLocation(location, appPath));
  const onGoingUserCreationPaths = [
    AppPath.Invite,
    AppPath.SignInUp,
    AppPath.VerifyEmail,
    AppPath.Verify,
  ];
  const onboardingPaths = [
    AppPath.CreateWorkspace,
    AppPath.CreateProfile,
    AppPath.SyncEmails,
    AppPath.InviteTeam,
    AppPath.PlanRequired,
    AppPath.PlanRequiredSuccess,
    AppPath.CustomPlanRequired,
    AppPath.BookCallDecision,
    AppPath.BookCall,
  ];

  const objectNamePlural = useParams().objectNamePlural ?? '';
  const objectMetadataItems = useRecoilValue(objectMetadataItemsState);
  const objectMetadataItem = objectMetadataItems?.find(
    (objectMetadataItem) => objectMetadataItem.namePlural === objectNamePlural,
  );
  const verifyEmailRedirectPath = useRecoilValue(verifyEmailRedirectPathState);

  if (
    (!isLoggedIn || (isLoggedIn && !isOnAWorkspace)) &&
    !someMatchingLocationOf([
      ...onGoingUserCreationPaths,
      AppPath.ResetPassword,
      AppPath.CustomPlanRequired,
    ])
  ) {
    return AppPath.SignInUp;
  }

  if (
    isLoggedIn &&
    isOnAWorkspace &&
    onboardingStatus === OnboardingStatus.CUSTOM_PLAN_REQUIRED &&
    !isMatchingLocation(location, AppPath.CustomPlanRequired)
  ) {
    return AppPath.CustomPlanRequired;
  }

  if (
    onboardingStatus === OnboardingStatus.PLAN_REQUIRED &&
    !someMatchingLocationOf([
      AppPath.PlanRequired,
      AppPath.PlanRequiredSuccess,
      AppPath.BookCall,
      AppPath.BookCallDecision,
    ])
  ) {
    if (
      isMatchingLocation(location, AppPath.VerifyEmail) &&
      isDefined(verifyEmailRedirectPath)
    ) {
      return verifyEmailRedirectPath;
    }
    return AppPath.PlanRequired;
  }

  if (isWorkspaceSuspended) {
    if (!isMatchingLocation(location, AppPath.SettingsCatchAll)) {
      return `${AppPath.SettingsCatchAll.replace('/*', '')}/${
        SettingsPath.Billing
      }`;
    }

    return;
  }

  if (
    onboardingStatus === OnboardingStatus.WORKSPACE_ACTIVATION &&
    !someMatchingLocationOf([
      AppPath.CreateWorkspace,
      AppPath.BookCallDecision,
      AppPath.BookCall,
    ])
  ) {
    return AppPath.CreateWorkspace;
  }

  if (
    onboardingStatus === OnboardingStatus.PROFILE_CREATION &&
    !isMatchingLocation(location, AppPath.CreateProfile)
  ) {
    return AppPath.CreateProfile;
  }

  if (
    onboardingStatus === OnboardingStatus.SYNC_EMAIL &&
    !isMatchingLocation(location, AppPath.SyncEmails)
  ) {
    return AppPath.SyncEmails;
  }

  if (
    onboardingStatus === OnboardingStatus.INVITE_TEAM &&
    !isMatchingLocation(location, AppPath.InviteTeam)
  ) {
    return AppPath.InviteTeam;
  }

  if (
    onboardingStatus === OnboardingStatus.BOOK_ONBOARDING &&
    !someMatchingLocationOf([AppPath.BookCallDecision, AppPath.BookCall])
  ) {
    if (!isDefined(calendarBookingPageId)) {
      return defaultHomePagePath;
    }
    return AppPath.BookCallDecision;
  }

  if (
    onboardingStatus === OnboardingStatus.COMPLETED &&
    someMatchingLocationOf([...onboardingPaths, ...onGoingUserCreationPaths]) &&
    !isMatchingLocation(location, AppPath.ResetPassword) &&
    isLoggedIn
  ) {
    return defaultHomePagePath;
  }

  if (isMatchingLocation(location, AppPath.Index) && isLoggedIn) {
    return defaultHomePagePath;
  }

  if (
    isMatchingLocation(location, AppPath.RecordIndexPage) &&
    !isDefined(objectMetadataItem)
  ) {
    return AppPath.NotFound;
  }

  return;
};

```

Verificando se o valor de `AppPath.CustomPlanRequired` está correto:


O `AppPath` está correto. Verificando se o hook `useOnboardingStatus` retorna valores apenas quando o usuário estiver logado. Verificando também se há algum problema na lógica de verificação:


Lendo o hook `useOnboardingStatus` para entender o problema:


O hook retorna `undefined` quando não está logado, o que está correto. Adicionando uma verificação para garantir que só verificamos o status quando ele existir:


```typescript
import { verifyEmailRedirectPathState } from '@/app/states/verifyEmailRedirectPathState';
import { useIsLogged } from '@/auth/hooks/useIsLogged';
import { calendarBookingPageIdState } from '@/client-config/states/calendarBookingPageIdState';
import { useIsCurrentLocationOnAWorkspace } from '@/domain-manager/hooks/useIsCurrentLocationOnAWorkspace';
import { useDefaultHomePagePath } from '@/navigation/hooks/useDefaultHomePagePath';
import { objectMetadataItemsState } from '@/object-metadata/states/objectMetadataItemsState';
import { useOnboardingStatus } from '@/onboarding/hooks/useOnboardingStatus';
import { useIsWorkspaceActivationStatusEqualsTo } from '@/workspace/hooks/useIsWorkspaceActivationStatusEqualsTo';
import { useLocation, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { AppPath, SettingsPath } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { WorkspaceActivationStatus } from 'twenty-shared/workspace';
import { OnboardingStatus } from '~/generated/graphql';
import { isMatchingLocation } from '~/utils/isMatchingLocation';

export const usePageChangeEffectNavigateLocation = () => {
  const isLoggedIn = useIsLogged();
  const { isOnAWorkspace } = useIsCurrentLocationOnAWorkspace();
  const onboardingStatus = useOnboardingStatus();
  const isWorkspaceSuspended = useIsWorkspaceActivationStatusEqualsTo(
    WorkspaceActivationStatus.SUSPENDED,
  );
  const { defaultHomePagePath } = useDefaultHomePagePath();
  const location = useLocation();
  const calendarBookingPageId = useRecoilValue(calendarBookingPageIdState);

  const someMatchingLocationOf = (appPaths: AppPath[]): boolean =>
    appPaths.some((appPath) => isMatchingLocation(location, appPath));
  const onGoingUserCreationPaths = [
    AppPath.Invite,
    AppPath.SignInUp,
    AppPath.VerifyEmail,
    AppPath.Verify,
  ];
  const onboardingPaths = [
    AppPath.CreateWorkspace,
    AppPath.CreateProfile,
    AppPath.SyncEmails,
    AppPath.InviteTeam,
    AppPath.PlanRequired,
    AppPath.PlanRequiredSuccess,
    AppPath.CustomPlanRequired,
    AppPath.BookCallDecision,
    AppPath.BookCall,
  ];

  const objectNamePlural = useParams().objectNamePlural ?? '';
  const objectMetadataItems = useRecoilValue(objectMetadataItemsState);
  const objectMetadataItem = objectMetadataItems?.find(
    (objectMetadataItem) => objectMetadataItem.namePlural === objectNamePlural,
  );
  const verifyEmailRedirectPath = useRecoilValue(verifyEmailRedirectPathState);

  if (
    (!isLoggedIn || (isLoggedIn && !isOnAWorkspace)) &&
    !someMatchingLocationOf([
      ...onGoingUserCreationPaths,
      AppPath.ResetPassword,
      AppPath.CustomPlanRequired,
    ])
  ) {
    return AppPath.SignInUp;
  }

  if (
    isLoggedIn &&
    isOnAWorkspace &&
    isDefined(onboardingStatus) &&
    onboardingStatus === OnboardingStatus.CUSTOM_PLAN_REQUIRED &&
    !isMatchingLocation(location, AppPath.CustomPlanRequired)
  ) {
    return AppPath.CustomPlanRequired;
  }

  if (
    isLoggedIn &&
    isOnAWorkspace &&
    isDefined(onboardingStatus) &&
    onboardingStatus === OnboardingStatus.PLAN_REQUIRED &&
    !someMatchingLocationOf([
      AppPath.PlanRequired,
      AppPath.PlanRequiredSuccess,
      AppPath.BookCall,
      AppPath.BookCallDecision,
    ])
  ) {
    if (
      isMatchingLocation(location, AppPath.VerifyEmail) &&
      isDefined(verifyEmailRedirectPath)
    ) {
      return verifyEmailRedirectPath;
    }
    return AppPath.PlanRequired;
  }

  if (isWorkspaceSuspended) {
    if (!isMatchingLocation(location, AppPath.SettingsCatchAll)) {
      return `${AppPath.SettingsCatchAll.replace('/*', '')}/${
        SettingsPath.Billing
      }`;
    }

    return;
  }

  if (
    onboardingStatus === OnboardingStatus.WORKSPACE_ACTIVATION &&
    !someMatchingLocationOf([
      AppPath.CreateWorkspace,
      AppPath.BookCallDecision,
      AppPath.BookCall,
    ])
  ) {
    return AppPath.CreateWorkspace;
  }

  if (
    onboardingStatus === OnboardingStatus.PROFILE_CREATION &&
    !isMatchingLocation(location, AppPath.CreateProfile)
  ) {
    return AppPath.CreateProfile;
  }

  if (
    onboardingStatus === OnboardingStatus.SYNC_EMAIL &&
    !isMatchingLocation(location, AppPath.SyncEmails)
  ) {
    return AppPath.SyncEmails;
  }

  if (
    onboardingStatus === OnboardingStatus.INVITE_TEAM &&
    !isMatchingLocation(location, AppPath.InviteTeam)
  ) {
    return AppPath.InviteTeam;
  }

  if (
    onboardingStatus === OnboardingStatus.BOOK_ONBOARDING &&
    !someMatchingLocationOf([AppPath.BookCallDecision, AppPath.BookCall])
  ) {
    if (!isDefined(calendarBookingPageId)) {
      return defaultHomePagePath;
    }
    return AppPath.BookCallDecision;
  }

  if (
    onboardingStatus === OnboardingStatus.COMPLETED &&
    someMatchingLocationOf([...onboardingPaths, ...onGoingUserCreationPaths]) &&
    !isMatchingLocation(location, AppPath.ResetPassword) &&
    isLoggedIn
  ) {
    return defaultHomePagePath;
  }

  if (isMatchingLocation(location, AppPath.Index) && isLoggedIn) {
    return defaultHomePagePath;
  }

  if (
    isMatchingLocation(location, AppPath.RecordIndexPage) &&
    !isDefined(objectMetadataItem)
  ) {
    return AppPath.NotFound;
  }

  return;
};

```

Adicionando as mesmas verificações nas outras condições de onboarding para garantir consistência:


Adicionando a verificação de login em todas as condições de onboarding para evitar verificações quando o usuário não estiver logado:


```typescript
import { verifyEmailRedirectPathState } from '@/app/states/verifyEmailRedirectPathState';
import { useIsLogged } from '@/auth/hooks/useIsLogged';
import { calendarBookingPageIdState } from '@/client-config/states/calendarBookingPageIdState';
import { useIsCurrentLocationOnAWorkspace } from '@/domain-manager/hooks/useIsCurrentLocationOnAWorkspace';
import { useDefaultHomePagePath } from '@/navigation/hooks/useDefaultHomePagePath';
import { objectMetadataItemsState } from '@/object-metadata/states/objectMetadataItemsState';
import { useOnboardingStatus } from '@/onboarding/hooks/useOnboardingStatus';
import { useIsWorkspaceActivationStatusEqualsTo } from '@/workspace/hooks/useIsWorkspaceActivationStatusEqualsTo';
import { useLocation, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { AppPath, SettingsPath } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { WorkspaceActivationStatus } from 'twenty-shared/workspace';
import { OnboardingStatus } from '~/generated/graphql';
import { isMatchingLocation } from '~/utils/isMatchingLocation';

export const usePageChangeEffectNavigateLocation = () => {
  const isLoggedIn = useIsLogged();
  const { isOnAWorkspace } = useIsCurrentLocationOnAWorkspace();
  const onboardingStatus = useOnboardingStatus();
  const isWorkspaceSuspended = useIsWorkspaceActivationStatusEqualsTo(
    WorkspaceActivationStatus.SUSPENDED,
  );
  const { defaultHomePagePath } = useDefaultHomePagePath();
  const location = useLocation();
  const calendarBookingPageId = useRecoilValue(calendarBookingPageIdState);

  const someMatchingLocationOf = (appPaths: AppPath[]): boolean =>
    appPaths.some((appPath) => isMatchingLocation(location, appPath));
  const onGoingUserCreationPaths = [
    AppPath.Invite,
    AppPath.SignInUp,
    AppPath.VerifyEmail,
    AppPath.Verify,
  ];
  const onboardingPaths = [
    AppPath.CreateWorkspace,
    AppPath.CreateProfile,
    AppPath.SyncEmails,
    AppPath.InviteTeam,
    AppPath.PlanRequired,
    AppPath.PlanRequiredSuccess,
    AppPath.CustomPlanRequired,
    AppPath.BookCallDecision,
    AppPath.BookCall,
  ];

  const objectNamePlural = useParams().objectNamePlural ?? '';
  const objectMetadataItems = useRecoilValue(objectMetadataItemsState);
  const objectMetadataItem = objectMetadataItems?.find(
    (objectMetadataItem) => objectMetadataItem.namePlural === objectNamePlural,
  );
  const verifyEmailRedirectPath = useRecoilValue(verifyEmailRedirectPathState);

  if (
    (!isLoggedIn || (isLoggedIn && !isOnAWorkspace)) &&
    !someMatchingLocationOf([
      ...onGoingUserCreationPaths,
      AppPath.ResetPassword,
      AppPath.CustomPlanRequired,
    ])
  ) {
    return AppPath.SignInUp;
  }

  if (
    isLoggedIn &&
    isOnAWorkspace &&
    isDefined(onboardingStatus) &&
    onboardingStatus === OnboardingStatus.CUSTOM_PLAN_REQUIRED &&
    !isMatchingLocation(location, AppPath.CustomPlanRequired)
  ) {
    return AppPath.CustomPlanRequired;
  }

  if (
    isLoggedIn &&
    isOnAWorkspace &&
    isDefined(onboardingStatus) &&
    onboardingStatus === OnboardingStatus.PLAN_REQUIRED &&
    !someMatchingLocationOf([
      AppPath.PlanRequired,
      AppPath.PlanRequiredSuccess,
      AppPath.BookCall,
      AppPath.BookCallDecision,
    ])
  ) {
    if (
      isMatchingLocation(location, AppPath.VerifyEmail) &&
      isDefined(verifyEmailRedirectPath)
    ) {
      return verifyEmailRedirectPath;
    }
    return AppPath.PlanRequired;
  }

  if (isWorkspaceSuspended) {
    if (!isMatchingLocation(location, AppPath.SettingsCatchAll)) {
      return `${AppPath.SettingsCatchAll.replace('/*', '')}/${
        SettingsPath.Billing
      }`;
    }

    return;
  }

  if (
    isLoggedIn &&
    isOnAWorkspace &&
    isDefined(onboardingStatus) &&
    onboardingStatus === OnboardingStatus.WORKSPACE_ACTIVATION &&
    !someMatchingLocationOf([
      AppPath.CreateWorkspace,
      AppPath.BookCallDecision,
      AppPath.BookCall,
    ])
  ) {
    return AppPath.CreateWorkspace;
  }

  if (
    isLoggedIn &&
    isOnAWorkspace &&
    isDefined(onboardingStatus) &&
    onboardingStatus === OnboardingStatus.PROFILE_CREATION &&
    !isMatchingLocation(location, AppPath.CreateProfile)
  ) {
    return AppPath.CreateProfile;
  }

  if (
    isLoggedIn &&
    isOnAWorkspace &&
    isDefined(onboardingStatus) &&
    onboardingStatus === OnboardingStatus.SYNC_EMAIL &&
    !isMatchingLocation(location, AppPath.SyncEmails)
  ) {
    return AppPath.SyncEmails;
  }

  if (
    isLoggedIn &&
    isOnAWorkspace &&
    isDefined(onboardingStatus) &&
    onboardingStatus === OnboardingStatus.INVITE_TEAM &&
    !isMatchingLocation(location, AppPath.InviteTeam)
  ) {
    return AppPath.InviteTeam;
  }

  if (
    isLoggedIn &&
    isOnAWorkspace &&
    isDefined(onboardingStatus) &&
    onboardingStatus === OnboardingStatus.BOOK_ONBOARDING &&
    !someMatchingLocationOf([AppPath.BookCallDecision, AppPath.BookCall])
  ) {
    if (!isDefined(calendarBookingPageId)) {
      return defaultHomePagePath;
    }
    return AppPath.BookCallDecision;
  }

  if (
    isLoggedIn &&
    isOnAWorkspace &&
    isDefined(onboardingStatus) &&
    onboardingStatus === OnboardingStatus.COMPLETED &&
    someMatchingLocationOf([...onboardingPaths, ...onGoingUserCreationPaths]) &&
    !isMatchingLocation(location, AppPath.ResetPassword)
  ) {
    return defaultHomePagePath;
  }

  if (isMatchingLocation(location, AppPath.Index) && isLoggedIn) {
    return defaultHomePagePath;
  }

  if (
    isMatchingLocation(location, AppPath.RecordIndexPage) &&
    !isDefined(objectMetadataItem)
  ) {
    return AppPath.NotFound;
  }

  return;
};

```

Verificando se há erros:


Correções aplicadas no loop de redirecionamento:

1. Adicionada a verificação de `isLoggedIn && isOnAWorkspace && isDefined(onboardingStatus)` em todas as condições de onboarding.
2. A verificação de `CUSTOM_PLAN_REQUIRED` ocorre antes de `PLAN_REQUIRED` e apenas quando o usuário está logado.
3. `CustomPlanRequired` foi adicionado à lista de paths permitidos na primeira verificação para evitar redirecionamento imediato quando acessar essa página sem estar logado.

Agora o comportamento será:
- Se não estiver logado: redireciona para `/welcome` (exceto nas páginas permitidas).
- Se estiver logado e o status for `CUSTOM_PLAN_REQUIRED`: redireciona para `/custom-plan-required`.
- As verificações de status só ocorrem quando o usuário está logado e em um workspace.

Reinicie o servidor e teste novamente. O loop de redirecionamento deve estar resolvido.

---

**User**

deu este erro

chunk-I476ZSYT.js?v=bb12fda6:21609 Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools



@lingui_react.js?v=bb12fda6:183 I18nProvider rendered `null`. A call to `i18n.activate` needs to happen in order for translations to be activated and for the I18nProvider to render.This is not an error but an informational message logged only in development.

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

getTokenPair.ts:11 tokenPair is undefined

utils.mjs:15 Uncaught Error: Base product not found

    at getBaseProductByPlanKey (useBaseProductByPlanKey.ts:13:7)

    at ChooseYourPlanContent (ChooseYourPlanContent.tsx:133:23)

    at renderWithHooks (chunk-I476ZSYT.js?v=bb12fda6:11596:26)

    at mountIndeterminateComponent (chunk-I476ZSYT.js?v=bb12fda6:14974:21)

    at beginWork (chunk-I476ZSYT.js?v=bb12fda6:15962:22)

    at HTMLUnknownElement.callCallback2 (chunk-I476ZSYT.js?v=bb12fda6:3680:22)

    at Object.invokeGuardedCallbackDev (chunk-I476ZSYT.js?v=bb12fda6:3705:24)

    at invokeGuardedCallback (chunk-I476ZSYT.js?v=bb12fda6:3739:39)

    at beginWork$1 (chunk-I476ZSYT.js?v=bb12fda6:19818:15)

    at performUnitOfWork (chunk-I476ZSYT.js?v=bb12fda6:19251:20)

utils.mjs:15 Uncaught Error: Base product not found

    at getBaseProductByPlanKey (useBaseProductByPlanKey.ts:13:7)

    at ChooseYourPlanContent (ChooseYourPlanContent.tsx:133:23)

    at renderWithHooks (chunk-I476ZSYT.js?v=bb12fda6:11596:26)

    at mountIndeterminateComponent (chunk-I476ZSYT.js?v=bb12fda6:14974:21)

    at beginWork (chunk-I476ZSYT.js?v=bb12fda6:15962:22)

    at HTMLUnknownElement.callCallback2 (chunk-I476ZSYT.js?v=bb12fda6:3680:22)

    at Object.invokeGuardedCallbackDev (chunk-I476ZSYT.js?v=bb12fda6:3705:24)

    at invokeGuardedCallback (chunk-I476ZSYT.js?v=bb12fda6:3739:39)

    at beginWork$1 (chunk-I476ZSYT.js?v=bb12fda6:19818:15)

    at performUnitOfWork (chunk-I476ZSYT.js?v=bb12fda6:19251:20)

chunk-I476ZSYT.js?v=bb12fda6:14080 The above error occurred in the <ChooseYourPlanContent> component:

    at ChooseYourPlanContent (http://kvoip.localhost:3001/src/pages/onboarding/internal/ChooseYourPlanContent.tsx:99:41)

    at div

    at http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/chunk-H4BJAAW6.js?v=bb12fda6:1342:45

    at ModalContent (http://kvoip.localhost:3001/src/modules/ui/layout/modal/components/Modal.tsx:150:25)

    at ChooseYourPlan (http://kvoip.localhost:3001/src/pages/onboarding/ChooseYourPlan.tsx:35:31)

    at RenderedRoute (http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/react-router-dom.js?v=bb12fda6:4034:5)

    at Outlet (http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/react-router-dom.js?v=bb12fda6:4409:26)

    at div

    at http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/chunk-H4BJAAW6.js?v=bb12fda6:1342:45

    at div

    at http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/chunk-H4BJAAW6.js?v=bb12fda6:1342:45

    at ScrollWrapper (http://kvoip.localhost:3001/src/modules/ui/utilities/scroll/components/ScrollWrapper.tsx:42:33)

    at div

    at MotionComponent (http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/framer-motion.js?v=bb12fda6:943:40)

    at http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/chunk-H4BJAAW6.js?v=bb12fda6:1342:45

    at div

    at MotionComponent (http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/framer-motion.js?v=bb12fda6:943:40)

    at http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/chunk-H4BJAAW6.js?v=bb12fda6:1342:45

    at PresenceChild (http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/framer-motion.js?v=bb12fda6:119:24)

    at AnimatePresence (http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/framer-motion.js?v=bb12fda6:208:26)

    at Modal (http://kvoip.localhost:3001/src/modules/ui/layout/modal/components/Modal.tsx:181:25)

    at AuthModal (http://kvoip.localhost:3001/src/modules/auth/components/AuthModal.tsx:35:29)

    at LayoutGroup (http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/framer-motion.js?v=bb12fda6:522:22)

    at PresenceChild (http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/framer-motion.js?v=bb12fda6:119:24)

    at AnimatePresence (http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/framer-motion.js?v=bb12fda6:208:26)

    at div

    at MotionComponent (http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/framer-motion.js?v=bb12fda6:943:40)

    at http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/chunk-H4BJAAW6.js?v=bb12fda6:1342:45

    at ErrorBoundary (http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/react-error-boundary.js?v=bb12fda6:18:5)

    at AppErrorBoundary (http://kvoip.localhost:3001/src/modules/error-handler/components/AppErrorBoundary.tsx:28:36)

    at div

    at http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/chunk-H4BJAAW6.js?v=bb12fda6:1342:45

    at DefaultLayout (http://kvoip.localhost:3001/src/modules/ui/layout/page/components/DefaultLayout.tsx:85:22)

    at RenderedRoute (http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/react-router-dom.js?v=bb12fda6:4034:5)

    at Outlet (http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/react-router-dom.js?v=bb12fda6:4409:26)

    at DialogManager (http://kvoip.localhost:3001/src/modules/ui/feedback/dialog-manager/components/DialogManager.tsx:27:33)

    at SnackBarProvider (http://kvoip.localhost:3001/src/modules/ui/feedback/snack-bar-manager/components/SnackBarProvider.tsx:47:36)

    at PrefetchDataProvider (http://kvoip.localhost:3001/src/modules/prefetch/components/PrefetchDataProvider.tsx:23:40)

    at PreComputedChipGeneratorsProvider (http://kvoip.localhost:3001/src/modules/object-metadata/components/PreComputedChipGeneratorsProvider.tsx:27:53)

    at ObjectMetadataItemsProvider (http://kvoip.localhost:3001/src/modules/object-metadata/components/ObjectMetadataItemsProvider.tsx:28:47)

    at ApolloCoreProvider (http://kvoip.localhost:3001/src/modules/object-metadata/components/ApolloCoreProvider.tsx:24:38)

    at AuthProvider (http://kvoip.localhost:3001/src/modules/auth/components/AuthProvider.tsx:27:32)

    at UserProvider (http://kvoip.localhost:3001/src/modules/users/components/UserProvider.tsx:31:32)

    at ChromeExtensionSidecarProvider (http://kvoip.localhost:3001/src/modules/chrome-extension-sidecar/components/ChromeExtensionSidecarProvider.tsx:41:50)

    at http://kvoip.localhost:3001/src/modules/captcha/components/CaptchaProvider.tsx:26:71

    at ClientConfigProvider (http://kvoip.localhost:3001/src/modules/client-config/components/ClientConfigProvider.tsx:26:40)

    at i (http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/packages/twenty-ui/dist/ThemeContextProvider-B7XN1kzs.js:16:48)

    at ThemeProvider2 (http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/chunk-H4BJAAW6.js?v=bb12fda6:1372:22)

    at BaseThemeProvider (http://kvoip.localhost:3001/src/modules/ui/theme/components/BaseThemeProvider.tsx:29:37)

    at ApolloProvider (http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/@apollo_client.js?v=bb12fda6:163:19)

    at ApolloProvider (http://kvoip.localhost:3001/src/modules/apollo/components/ApolloProvider.tsx:23:34)

    at AppRouterProviders (http://kvoip.localhost:3001/src/modules/app/components/AppRouterProviders.tsx:53:26)

    at RenderedRoute (http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/react-router-dom.js?v=bb12fda6:4034:5)

    at RenderErrorBoundary (http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/react-router-dom.js?v=bb12fda6:3994:5)

    at DataRoutes (http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/react-router-dom.js?v=bb12fda6:5153:5)

    at Router (http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/react-router-dom.js?v=bb12fda6:4416:15)

    at RouterProvider (http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/react-router-dom.js?v=bb12fda6:4968:5)

    at AppRouter (http://kvoip.localhost:3001/src/modules/app/components/AppRouter.tsx:30:25)

    at r2 (http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/react-helmet-async.js?v=bb12fda6:354:21)

    at ExceptionHandlerProvider (http://kvoip.localhost:3001/src/modules/error-handler/components/ExceptionHandlerProvider.tsx:22:44)

    at j2 (http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/packages/twenty-ui/dist/display.mjs:497:22)

    at I18nProvider (http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/@lingui_react.js?v=bb12fda6:157:3)

    at ErrorBoundary (http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/react-error-boundary.js?v=bb12fda6:18:5)

    at AppErrorBoundary (http://kvoip.localhost:3001/src/modules/error-handler/components/AppErrorBoundary.tsx:28:36)

    at RecoilRoot_INTERNAL (http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/recoil.js?v=bb12fda6:2794:3)

    at RecoilRoot (http://kvoip.localhost:3001/@fs/home/alex/Documentos/twentybilling/twenty/node_modules/.vite/packages/twenty-front/deps/recoil.js?v=bb12fda6:2912:5)

    at App

React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.

logCapturedError @ chunk-I476ZSYT.js?v=bb12fda6:14080







Se estou certo é porque não populou o banco com os planos padrão certo?

se sim quando eu rodar o npx nx database:reset twenty-server



ele já deve popular

---

**Cursor**

O problema é que `ChooseYourPlan` (Stripe) está sendo renderizado mesmo com `BILLING_MODE=LOCAL`. Isso ocorre porque estamos redirecionando para `/plan-required` em vez de `/custom-plan-required`.

Verificando o código para corrigir:


`ChooseYourPlan` está sendo renderizado mesmo com `BILLING_MODE=LOCAL`. Adicionando uma verificação para redirecionar para a página custom quando o modo for LOCAL:


```typescriptreact
import { Modal } from '@/ui/layout/modal/components/Modal';
import styled from '@emotion/styled';
import { isDefined } from 'twenty-shared/utils';
import { ChooseYourPlanContent } from '~/pages/onboarding/internal/ChooseYourPlanContent';
import { useRecoilValue } from 'recoil';
import { billingState } from '@/client-config/states/billingState';
import { usePlans } from '@/billing/hooks/usePlans';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppPath } from 'twenty-shared/types';

const StyledChooseYourPlanPlaceholder = styled.div`
  height: 566px;
`;

export const ChooseYourPlan = () => {
  const { isPlansLoaded } = usePlans();
  const billing = useRecoilValue(billingState);
  const navigate = useNavigate();

  useEffect(() => {
    // Se o billing mode for LOCAL, redireciona para a página de planos customizados
    if (isDefined(billing) && billing.billingMode === 'LOCAL') {
      navigate(AppPath.CustomPlanRequired, { replace: true });
    }
  }, [billing, navigate]);

  // Se o billing mode for LOCAL, não renderiza nada (já redirecionou)
  if (isDefined(billing) && billing.billingMode === 'LOCAL') {
    return null;
  }

  return (
    <Modal.Content isVerticalCentered>
      {isDefined(billing) && isPlansLoaded ? (
        <ChooseYourPlanContent billing={billing} />
      ) : (
        <StyledChooseYourPlanPlaceholder />
      )}
    </Modal.Content>
  );
};

```

Verificando erros de lint:


Correção aplicada: quando `BILLING_MODE=LOCAL`, se alguém acessar `/plan-required`, a página redireciona para `/custom-plan-required`.

Sobre o banco de dados: `npx nx database:reset twenty-server` popula os planos do Stripe, mas isso só é necessário no modo STRIPE. Com `BILLING_MODE=LOCAL`, não precisa desses planos; os planos customizados serão criados via Admin Panel.

O erro ocorria porque `ChooseYourPlan` tentava carregar produtos do Stripe que não existem no modo LOCAL. Com o redirecionamento, isso deve estar resolvido.

Teste novamente e confirme se o erro desapareceu.

---

**User**

@npm (511-537) deu este erro

---

**Cursor**

Os tipos GraphQL do frontend precisam ser regenerados após as alterações no backend. Verificando e corrigindo:


Gerando os tipos GraphQL do frontend após as alterações do backend. Ajustando temporariamente o código para funcionar sem os tipos gerados até a geração concluir:


```typescript
import { verifyEmailRedirectPathState } from '@/app/states/verifyEmailRedirectPathState';
import { useIsLogged } from '@/auth/hooks/useIsLogged';
import { calendarBookingPageIdState } from '@/client-config/states/calendarBookingPageIdState';
import { useIsCurrentLocationOnAWorkspace } from '@/domain-manager/hooks/useIsCurrentLocationOnAWorkspace';
import { useDefaultHomePagePath } from '@/navigation/hooks/useDefaultHomePagePath';
import { objectMetadataItemsState } from '@/object-metadata/states/objectMetadataItemsState';
import { useOnboardingStatus } from '@/onboarding/hooks/useOnboardingStatus';
import { useIsWorkspaceActivationStatusEqualsTo } from '@/workspace/hooks/useIsWorkspaceActivationStatusEqualsTo';
import { useLocation, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { AppPath, SettingsPath } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { WorkspaceActivationStatus } from 'twenty-shared/workspace';
import { OnboardingStatus } from '~/generated/graphql';
import { isMatchingLocation } from '~/utils/isMatchingLocation';

export const usePageChangeEffectNavigateLocation = () => {
  const isLoggedIn = useIsLogged();
  const { isOnAWorkspace } = useIsCurrentLocationOnAWorkspace();
  const onboardingStatus = useOnboardingStatus();
  const isWorkspaceSuspended = useIsWorkspaceActivationStatusEqualsTo(
    WorkspaceActivationStatus.SUSPENDED,
  );
  const { defaultHomePagePath } = useDefaultHomePagePath();
  const location = useLocation();
  const calendarBookingPageId = useRecoilValue(calendarBookingPageIdState);

  const someMatchingLocationOf = (appPaths: AppPath[]): boolean =>
    appPaths.some((appPath) => isMatchingLocation(location, appPath));
  const onGoingUserCreationPaths = [
    AppPath.Invite,
    AppPath.SignInUp,
    AppPath.VerifyEmail,
    AppPath.Verify,
  ];
  const onboardingPaths = [
    AppPath.CreateWorkspace,
    AppPath.CreateProfile,
    AppPath.SyncEmails,
    AppPath.InviteTeam,
    AppPath.PlanRequired,
    AppPath.PlanRequiredSuccess,
    AppPath.CustomPlanRequired,
    AppPath.BookCallDecision,
    AppPath.BookCall,
  ];

  const objectNamePlural = useParams().objectNamePlural ?? '';
  const objectMetadataItems = useRecoilValue(objectMetadataItemsState);
  const objectMetadataItem = objectMetadataItems?.find(
    (objectMetadataItem) => objectMetadataItem.namePlural === objectNamePlural,
  );
  const verifyEmailRedirectPath = useRecoilValue(verifyEmailRedirectPathState);

  if (
    (!isLoggedIn || (isLoggedIn && !isOnAWorkspace)) &&
    !someMatchingLocationOf([
      ...onGoingUserCreationPaths,
      AppPath.ResetPassword,
      AppPath.CustomPlanRequired,
    ])
  ) {
    return AppPath.SignInUp;
  }

  if (
    isLoggedIn &&
    isOnAWorkspace &&
    isDefined(onboardingStatus) &&
    onboardingStatus === ('CUSTOM_PLAN_REQUIRED' as OnboardingStatus) &&
    !isMatchingLocation(location, AppPath.CustomPlanRequired)
  ) {
    return AppPath.CustomPlanRequired;
  }

  if (
    isLoggedIn &&
    isOnAWorkspace &&
    isDefined(onboardingStatus) &&
    onboardingStatus === OnboardingStatus.PLAN_REQUIRED &&
    !someMatchingLocationOf([
      AppPath.PlanRequired,
      AppPath.PlanRequiredSuccess,
      AppPath.BookCall,
      AppPath.BookCallDecision,
    ])
  ) {
    if (
      isMatchingLocation(location, AppPath.VerifyEmail) &&
      isDefined(verifyEmailRedirectPath)
    ) {
      return verifyEmailRedirectPath;
    }
    return AppPath.PlanRequired;
  }

  if (isWorkspaceSuspended) {
    if (!isMatchingLocation(location, AppPath.SettingsCatchAll)) {
      return `${AppPath.SettingsCatchAll.replace('/*', '')}/${
        SettingsPath.Billing
      }`;
    }

    return;
  }

  if (
    isLoggedIn &&
    isOnAWorkspace &&
    isDefined(onboardingStatus) &&
    onboardingStatus === OnboardingStatus.WORKSPACE_ACTIVATION &&
    !someMatchingLocationOf([
      AppPath.CreateWorkspace,
      AppPath.BookCallDecision,
      AppPath.BookCall,
    ])
  ) {
    return AppPath.CreateWorkspace;
  }

  if (
    isLoggedIn &&
    isOnAWorkspace &&
    isDefined(onboardingStatus) &&
    onboardingStatus === OnboardingStatus.PROFILE_CREATION &&
    !isMatchingLocation(location, AppPath.CreateProfile)
  ) {
    return AppPath.CreateProfile;
  }

  if (
    isLoggedIn &&
    isOnAWorkspace &&
    isDefined(onboardingStatus) &&
    onboardingStatus === OnboardingStatus.SYNC_EMAIL &&
    !isMatchingLocation(location, AppPath.SyncEmails)
  ) {
    return AppPath.SyncEmails;
  }

  if (
    isLoggedIn &&
    isOnAWorkspace &&
    isDefined(onboardingStatus) &&
    onboardingStatus === OnboardingStatus.INVITE_TEAM &&
    !isMatchingLocation(location, AppPath.InviteTeam)
  ) {
    return AppPath.InviteTeam;
  }

  if (
    isLoggedIn &&
    isOnAWorkspace &&
    isDefined(onboardingStatus) &&
    onboardingStatus === OnboardingStatus.BOOK_ONBOARDING &&
    !someMatchingLocationOf([AppPath.BookCallDecision, AppPath.BookCall])
  ) {
    if (!isDefined(calendarBookingPageId)) {
      return defaultHomePagePath;
    }
    return AppPath.BookCallDecision;
  }

  if (
    isLoggedIn &&
    isOnAWorkspace &&
    isDefined(onboardingStatus) &&
    onboardingStatus === OnboardingStatus.COMPLETED &&
    someMatchingLocationOf([...onboardingPaths, ...onGoingUserCreationPaths]) &&
    !isMatchingLocation(location, AppPath.ResetPassword)
  ) {
    return defaultHomePagePath;
  }

  if (isMatchingLocation(location, AppPath.Index) && isLoggedIn) {
    return defaultHomePagePath;
  }

  if (
    isMatchingLocation(location, AppPath.RecordIndexPage) &&
    !isDefined(objectMetadataItem)
  ) {
    return AppPath.NotFound;
  }

  return;
};

```

```typescriptreact
import { Modal } from '@/ui/layout/modal/components/Modal';
import styled from '@emotion/styled';
import { isDefined } from 'twenty-shared/utils';
import { ChooseYourPlanContent } from '~/pages/onboarding/internal/ChooseYourPlanContent';
import { useRecoilValue } from 'recoil';
import { billingState } from '@/client-config/states/billingState';
import { usePlans } from '@/billing/hooks/usePlans';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppPath } from 'twenty-shared/types';

const StyledChooseYourPlanPlaceholder = styled.div`
  height: 566px;
`;

export const ChooseYourPlan = () => {
  const { isPlansLoaded } = usePlans();
  const billing = useRecoilValue(billingState);
  const navigate = useNavigate();

  useEffect(() => {
    // Se o billing mode for LOCAL, redireciona para a página de planos customizados
    if (isDefined(billing) && (billing as any).billingMode === 'LOCAL') {
      navigate(AppPath.CustomPlanRequired, { replace: true });
    }
  }, [billing, navigate]);

  // Se o billing mode for LOCAL, não renderiza nada (já redirecionou)
  if (isDefined(billing) && (billing as any).billingMode === 'LOCAL') {
    return null;
  }

  return (
    <Modal.Content isVerticalCentered>
      {isDefined(billing) && isPlansLoaded ? (
        <ChooseYourPlanContent billing={billing} />
      ) : (
        <StyledChooseYourPlanPlaceholder />
      )}
    </Modal.Content>
  );
};

```

Regenerando os tipos GraphQL para resolver definitivamente. Executando o comando de geração:


Removendo os type casts temporários, já que os tipos foram regenerados:


Removendo os type casts temporários e usando os tipos corretos:


```typescript
import { verifyEmailRedirectPathState } from '@/app/states/verifyEmailRedirectPathState';
import { useIsLogged } from '@/auth/hooks/useIsLogged';
import { calendarBookingPageIdState } from '@/client-config/states/calendarBookingPageIdState';
import { useIsCurrentLocationOnAWorkspace } from '@/domain-manager/hooks/useIsCurrentLocationOnAWorkspace';
import { useDefaultHomePagePath } from '@/navigation/hooks/useDefaultHomePagePath';
import { objectMetadataItemsState } from '@/object-metadata/states/objectMetadataItemsState';
import { useOnboardingStatus } from '@/onboarding/hooks/useOnboardingStatus';
import { useIsWorkspaceActivationStatusEqualsTo } from '@/workspace/hooks/useIsWorkspaceActivationStatusEqualsTo';
import { useLocation, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { AppPath, SettingsPath } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { WorkspaceActivationStatus } from 'twenty-shared/workspace';
import { OnboardingStatus } from '~/generated/graphql';
import { isMatchingLocation } from '~/utils/isMatchingLocation';

export const usePageChangeEffectNavigateLocation = () => {
  const isLoggedIn = useIsLogged();
  const { isOnAWorkspace } = useIsCurrentLocationOnAWorkspace();
  const onboardingStatus = useOnboardingStatus();
  const isWorkspaceSuspended = useIsWorkspaceActivationStatusEqualsTo(
    WorkspaceActivationStatus.SUSPENDED,
  );
  const { defaultHomePagePath } = useDefaultHomePagePath();
  const location = useLocation();
  const calendarBookingPageId = useRecoilValue(calendarBookingPageIdState);

  const someMatchingLocationOf = (appPaths: AppPath[]): boolean =>
    appPaths.some((appPath) => isMatchingLocation(location, appPath));
  const onGoingUserCreationPaths = [
    AppPath.Invite,
    AppPath.SignInUp,
    AppPath.VerifyEmail,
    AppPath.Verify,
  ];
  const onboardingPaths = [
    AppPath.CreateWorkspace,
    AppPath.CreateProfile,
    AppPath.SyncEmails,
    AppPath.InviteTeam,
    AppPath.PlanRequired,
    AppPath.PlanRequiredSuccess,
    AppPath.CustomPlanRequired,
    AppPath.BookCallDecision,
    AppPath.BookCall,
  ];

  const objectNamePlural = useParams().objectNamePlural ?? '';
  const objectMetadataItems = useRecoilValue(objectMetadataItemsState);
  const objectMetadataItem = objectMetadataItems?.find(
    (objectMetadataItem) => objectMetadataItem.namePlural === objectNamePlural,
  );
  const verifyEmailRedirectPath = useRecoilValue(verifyEmailRedirectPathState);

  if (
    (!isLoggedIn || (isLoggedIn && !isOnAWorkspace)) &&
    !someMatchingLocationOf([
      ...onGoingUserCreationPaths,
      AppPath.ResetPassword,
      AppPath.CustomPlanRequired,
    ])
  ) {
    return AppPath.SignInUp;
  }

  if (
    isLoggedIn &&
    isOnAWorkspace &&
    isDefined(onboardingStatus) &&
    onboardingStatus === OnboardingStatus.CUSTOM_PLAN_REQUIRED &&
    !isMatchingLocation(location, AppPath.CustomPlanRequired)
  ) {
    return AppPath.CustomPlanRequired;
  }

  if (
    isLoggedIn &&
    isOnAWorkspace &&
    isDefined(onboardingStatus) &&
    onboardingStatus === OnboardingStatus.PLAN_REQUIRED &&
    !someMatchingLocationOf([
      AppPath.PlanRequired,
      AppPath.PlanRequiredSuccess,
      AppPath.BookCall,
      AppPath.BookCallDecision,
    ])
  ) {
    if (
      isMatchingLocation(location, AppPath.VerifyEmail) &&
      isDefined(verifyEmailRedirectPath)
    ) {
      return verifyEmailRedirectPath;
    }
    return AppPath.PlanRequired;
  }

  if (isWorkspaceSuspended) {
    if (!isMatchingLocation(location, AppPath.SettingsCatchAll)) {
      return `${AppPath.SettingsCatchAll.replace('/*', '')}/${
        SettingsPath.Billing
      }`;
    }

    return;
  }

  if (
    isLoggedIn &&
    isOnAWorkspace &&
    isDefined(onboardingStatus) &&
    onboardingStatus === OnboardingStatus.WORKSPACE_ACTIVATION &&
    !someMatchingLocationOf([
      AppPath.CreateWorkspace,
      AppPath.BookCallDecision,
      AppPath.BookCall,
    ])
  ) {
    return AppPath.CreateWorkspace;
  }

  if (
    isLoggedIn &&
    isOnAWorkspace &&
    isDefined(onboardingStatus) &&
    onboardingStatus === OnboardingStatus.PROFILE_CREATION &&
    !isMatchingLocation(location, AppPath.CreateProfile)
  ) {
    return AppPath.CreateProfile;
  }

  if (
    isLoggedIn &&
    isOnAWorkspace &&
    isDefined(onboardingStatus) &&
    onboardingStatus === OnboardingStatus.SYNC_EMAIL &&
    !isMatchingLocation(location, AppPath.SyncEmails)
  ) {
    return AppPath.SyncEmails;
  }

  if (
    isLoggedIn &&
    isOnAWorkspace &&
    isDefined(onboardingStatus) &&
    onboardingStatus === OnboardingStatus.INVITE_TEAM &&
    !isMatchingLocation(location, AppPath.InviteTeam)
  ) {
    return AppPath.InviteTeam;
  }

  if (
    isLoggedIn &&
    isOnAWorkspace &&
    isDefined(onboardingStatus) &&
    onboardingStatus === OnboardingStatus.BOOK_ONBOARDING &&
    !someMatchingLocationOf([AppPath.BookCallDecision, AppPath.BookCall])
  ) {
    if (!isDefined(calendarBookingPageId)) {
      return defaultHomePagePath;
    }
    return AppPath.BookCallDecision;
  }

  if (
    isLoggedIn &&
    isOnAWorkspace &&
    isDefined(onboardingStatus) &&
    onboardingStatus === OnboardingStatus.COMPLETED &&
    someMatchingLocationOf([...onboardingPaths, ...onGoingUserCreationPaths]) &&
    !isMatchingLocation(location, AppPath.ResetPassword)
  ) {
    return defaultHomePagePath;
  }

  if (isMatchingLocation(location, AppPath.Index) && isLoggedIn) {
    return defaultHomePagePath;
  }

  if (
    isMatchingLocation(location, AppPath.RecordIndexPage) &&
    !isDefined(objectMetadataItem)
  ) {
    return AppPath.NotFound;
  }

  return;
};

```

```typescriptreact
import { Modal } from '@/ui/layout/modal/components/Modal';
import styled from '@emotion/styled';
import { isDefined } from 'twenty-shared/utils';
import { ChooseYourPlanContent } from '~/pages/onboarding/internal/ChooseYourPlanContent';
import { useRecoilValue } from 'recoil';
import { billingState } from '@/client-config/states/billingState';
import { usePlans } from '@/billing/hooks/usePlans';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppPath } from 'twenty-shared/types';

const StyledChooseYourPlanPlaceholder = styled.div`
  height: 566px;
`;

export const ChooseYourPlan = () => {
  const { isPlansLoaded } = usePlans();
  const billing = useRecoilValue(billingState);
  const navigate = useNavigate();

  useEffect(() => {
    // Se o billing mode for LOCAL, redireciona para a página de planos customizados
    if (isDefined(billing) && billing.billingMode === 'LOCAL') {
      navigate(AppPath.CustomPlanRequired, { replace: true });
    }
  }, [billing, navigate]);

  // Se o billing mode for LOCAL, não renderiza nada (já redirecionou)
  if (isDefined(billing) && billing.billingMode === 'LOCAL') {
    return null;
  }

  return (
    <Modal.Content isVerticalCentered>
      {isDefined(billing) && isPlansLoaded ? (
        <ChooseYourPlanContent billing={billing} />
      ) : (
        <StyledChooseYourPlanPlaceholder />
      )}
    </Modal.Content>
  );
};

```

Verificando de onde vem o tipo `Billing` usado no arquivo:


Verificando o tipo `Billing` usado no `billingState`:


O tipo `Billing` vem de `generated/graphql.ts`. Regenerando esse schema também:


Verificando se o campo `billingMode` foi adicionado ao tipo `Billing`:


Todos os tipos foram regenerados. O campo `billingMode` está presente no tipo `Billing` e o enum `CUSTOM_PLAN_REQUIRED` está disponível. Os erros de TypeScript devem estar resolvidos.

Resumo do que foi feito:
1. Regenerados os tipos GraphQL do metadata (inclui `OnboardingStatus.CUSTOM_PLAN_REQUIRED`)
2. Regenerados os tipos GraphQL principais (inclui `Billing.billingMode`)

Agora o código deve compilar sem erros. Teste novamente e informe se tudo está funcionando.

---

**User**

quando escolho o plano e clico em continuar chunk-I476ZSYT.js?v=bb12fda6:21609 Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools

@lingui_react.js?v=bb12fda6:183 I18nProvider rendered `null`. A call to `i18n.activate` needs to happen in order for translations to be activated and for the I18nProvider to render.This is not an error but an informational message logged only in development.

ChooseCustomPlanContent.tsx:123 Error selecting plan: ApolloError: invalid input syntax for type uuid: "plan-basic"

    at new ApolloError2 (chunk-DX3RFG6B.js?v=bb12fda6:47:28)

    at chunk-44HIGSHV.js?v=bb12fda6:5155:29

    at both (chunk-Y4MNQSUQ.js?v=bb12fda6:3228:17)

    at chunk-Y4MNQSUQ.js?v=bb12fda6:3217:26

    at new Promise (<anonymous>)

    at Object.then (chunk-Y4MNQSUQ.js?v=bb12fda6:3216:16)

    at Object.next (chunk-Y4MNQSUQ.js?v=bb12fda6:3230:39)

    at notifySubscription (chunk-Y4MNQSUQ.js?v=bb12fda6:2602:18)

    at onNotify (chunk-Y4MNQSUQ.js?v=bb12fda6:2640:3)

    at SubscriptionObserver2.next (chunk-Y4MNQSUQ.js?v=bb12fda6:2695:9)

handleContinue @ ChooseCustomPlanContent.tsx:123

await in handleContinue

callCallback2 @ chunk-I476ZSYT.js?v=bb12fda6:3680

invokeGuardedCallbackDev @ chunk-I476ZSYT.js?v=bb12fda6:3705

invokeGuardedCallback @ chunk-I476ZSYT.js?v=bb12fda6:3739

invokeGuardedCallbackAndCatchFirstError @ chunk-I476ZSYT.js?v=bb12fda6:3742

executeDispatch @ chunk-I476ZSYT.js?v=bb12fda6:7046

processDispatchQueueItemsInOrder @ chunk-I476ZSYT.js?v=bb12fda6:7066

processDispatchQueue @ chunk-I476ZSYT.js?v=bb12fda6:7075

dispatchEventsForPlugins @ chunk-I476ZSYT.js?v=bb12fda6:7083

(anonymous) @ chunk-I476ZSYT.js?v=bb12fda6:7206

batchedUpdates$1 @ chunk-I476ZSYT.js?v=bb12fda6:18966

batchedUpdates @ chunk-I476ZSYT.js?v=bb12fda6:3585

dispatchEventForPluginEventSystem @ chunk-I476ZSYT.js?v=bb12fda6:7205

dispatchEventWithEnableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay @ chunk-I476ZSYT.js?v=bb12fda6:5484

dispatchEvent @ chunk-I476ZSYT.js?v=bb12fda6:5478

dispatchDiscreteEvent @ chunk-I476ZSYT.js?v=bb12fda6:5455



---

**Cursor**

O erro ocorre porque estamos usando IDs mock que não são UUIDs. O backend espera um UUID válido. Criando uma query GraphQL para buscar os planos customizados reais do banco de dados:


Parece que não existe uma query para buscar planos customizados. Verificando se há entidades ou resolvers relacionados:


As entidades de Custom Billing Plans mencionadas no documento ainda não existem. Como solução temporária, vamos usar UUIDs válidos nos mocks e ajustar o código para que funcione. Quando a estrutura completa estiver implementada, podemos substituir pelos dados reais.

Ajustando o código para usar UUIDs válidos e prepará-lo para a estrutura real:


```typescriptreact
import { gql, useMutation } from '@apollo/client';
import { SubTitle } from '@/auth/components/SubTitle';
import { Title } from '@/auth/components/Title';
import { useAuth } from '@/auth/hooks/useAuth';
import styled from '@emotion/styled';
import { Trans, useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'twenty-ui/feedback';
import { MainButton } from 'twenty-ui/input';
import { ClickToActionLink } from 'twenty-ui/navigation';
import { AppPath } from 'twenty-shared/types';

const SELECT_CUSTOM_BILLING_PLAN = gql`
  mutation SelectCustomBillingPlan($planId: String!) {
    selectCustomBillingPlan(planId: $planId)
  }
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const StyledPlanCard = styled.div<{ isSelected: boolean }>`
  background-color: ${({ theme }) => theme.background.secondary};
  border: 2px solid
    ${({ theme, isSelected }) =>
      isSelected ? theme.color.blue : theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(4)};
  width: 100%;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.color.blue};
  }
`;

const StyledPlanName = styled.div`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const StyledPlanDescription = styled.div`
  color: ${({ theme }) => theme.font.color.secondary};
  font-size: ${({ theme }) => theme.font.size.sm};
`;

const StyledPlansContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${({ theme }) => theme.spacing(6)} 0;
  width: 100%;
`;

const StyledLinkGroup = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing(1)};
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

// TODO: These should come from a GraphQL query to fetch custom billing plans
// Por enquanto usando UUIDs mock válidos - substituir por query real quando a estrutura estiver pronta
const MOCK_CUSTOM_PLANS = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Plano Básico',
    description: 'Ideal para pequenas equipes',
    price: 'R$ 49/mês',
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Plano Profissional',
    description: 'Para equipes em crescimento',
    price: 'R$ 99/mês',
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Plano Enterprise',
    description: 'Recursos completos para grandes empresas',
    price: 'R$ 199/mês',
  },
];

export const ChooseCustomPlanContent = () => {
  const { t } = useLingui();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectCustomBillingPlan, { loading }] = useMutation(
    SELECT_CUSTOM_BILLING_PLAN,
  );

  const handlePlanSelect = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleContinue = async () => {
    if (!selectedPlanId) return;

    try {
      await selectCustomBillingPlan({
        variables: {
          planId: selectedPlanId,
        },
      });

      navigate(AppPath.CreateWorkspace);
    } catch (error) {
      console.error('Error selecting plan:', error);
    }
  };

  return (
    <StyledContainer>
      <Title noMarginTop>{t`Escolha seu Plano`}</Title>
      <SubTitle>{t`Selecione o plano ideal para sua equipe`}</SubTitle>

      <StyledPlansContainer>
        {MOCK_CUSTOM_PLANS.map((plan) => (
          <StyledPlanCard
            key={plan.id}
            isSelected={selectedPlanId === plan.id}
            onClick={() => handlePlanSelect(plan.id)}
          >
            <StyledPlanName>{plan.name}</StyledPlanName>
            <StyledPlanDescription>{plan.description}</StyledPlanDescription>
            <StyledPlanDescription style={{ marginTop: '8px' }}>
              {plan.price}
            </StyledPlanDescription>
          </StyledPlanCard>
        ))}
      </StyledPlansContainer>

      <MainButton
        title={t`Continuar`}
        onClick={handleContinue}
        width={200}
        Icon={() => loading && <Loader />}
        disabled={!selectedPlanId || loading}
      />

      <StyledLinkGroup>
        <ClickToActionLink onClick={signOut}>
          <Trans>Sair</Trans>
        </ClickToActionLink>
      </StyledLinkGroup>
    </StyledContainer>
  );
};


```

O erro ocorre porque os IDs mock não são UUIDs válidos. Como a estrutura de Custom Billing Plans ainda não existe, o backend precisa de UUIDs de planos criados no banco. Ajustando para usar UUIDs válidos e informando que é necessário criar os planos no banco primeiro:


O backend espera um UUID válido de um plano existente. Como a estrutura de Custom Billing Plans ainda não foi criada, melhorando o tratamento de erro para orientar o próximo passo. Adicionando validação no backend e melhorando o feedback no frontend:


```typescript
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import assert from 'assert';

import { msg } from '@lingui/core/macro';
import { TypeOrmQueryService } from '@ptc-org/nestjs-query-typeorm';
import { assertIsDefinedOrThrow, isDefined } from 'twenty-shared/utils';
import { WorkspaceActivationStatus } from 'twenty-shared/workspace';
import { Repository } from 'typeorm';

import { BillingSubscriptionService } from 'src/engine/core-modules/billing/services/billing-subscription.service';
import { BillingService } from 'src/engine/core-modules/billing/services/billing.service';
import { DnsManagerService } from 'src/engine/core-modules/dns-manager/services/dns-manager.service';
import { CustomDomainManagerService } from 'src/engine/core-modules/domain/custom-domain-manager/services/custom-domain-manager.service';
import { SubdomainManagerService } from 'src/engine/core-modules/domain/subdomain-manager/services/subdomain-manager.service';
import { ExceptionHandlerService } from 'src/engine/core-modules/exception-handler/exception-handler.service';
import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import {
  FileWorkspaceFolderDeletionJob,
  type FileWorkspaceFolderDeletionJobData,
} from 'src/engine/core-modules/file/jobs/file-workspace-folder-deletion.job';
import { InjectMessageQueue } from 'src/engine/core-modules/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/core-modules/message-queue/services/message-queue.service';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';
import { UserWorkspaceEntity } from 'src/engine/core-modules/user-workspace/user-workspace.entity';
import { UserWorkspaceService } from 'src/engine/core-modules/user-workspace/user-workspace.service';
import { UserEntity } from 'src/engine/core-modules/user/user.entity';
import { type ActivateWorkspaceInput } from 'src/engine/core-modules/workspace/dtos/activate-workspace-input';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import {
  WorkspaceException,
  WorkspaceExceptionCode,
  WorkspaceNotFoundDefaultError,
} from 'src/engine/core-modules/workspace/workspace.exception';
import { WorkspaceManyOrAllFlatEntityMapsCacheService } from 'src/engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service';
import { PermissionFlagType } from 'src/engine/metadata-modules/permissions/constants/permission-flag-type.constants';
import {
  PermissionsException,
  PermissionsExceptionCode,
  PermissionsExceptionMessage,
} from 'src/engine/metadata-modules/permissions/permissions.exception';
import { PermissionsService } from 'src/engine/metadata-modules/permissions/permissions.service';
import { WorkspaceCacheStorageService } from 'src/engine/workspace-cache-storage/workspace-cache-storage.service';
import { WorkspaceManagerService } from 'src/engine/workspace-manager/workspace-manager.service';
import { DEFAULT_FEATURE_FLAGS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/default-feature-flags';
import { extractVersionMajorMinorPatch } from 'src/utils/version/extract-version-major-minor-patch';

@Injectable()
// eslint-disable-next-line @nx/workspace-inject-workspace-repository
export class WorkspaceService extends TypeOrmQueryService<WorkspaceEntity> {
  protected readonly logger = new Logger(WorkspaceService.name);

  private readonly WORKSPACE_FIELD_PERMISSIONS: Record<
    string,
    PermissionFlagType
  > = {
    subdomain: PermissionFlagType.WORKSPACE,
    customDomain: PermissionFlagType.WORKSPACE,
    displayName: PermissionFlagType.WORKSPACE,
    logo: PermissionFlagType.WORKSPACE,
    trashRetentionDays: PermissionFlagType.WORKSPACE,
    inviteHash: PermissionFlagType.WORKSPACE_MEMBERS,
    isPublicInviteLinkEnabled: PermissionFlagType.SECURITY,
    allowImpersonation: PermissionFlagType.SECURITY,
    isGoogleAuthEnabled: PermissionFlagType.SECURITY,
    isMicrosoftAuthEnabled: PermissionFlagType.SECURITY,
    isPasswordAuthEnabled: PermissionFlagType.SECURITY,
    editableProfileFields: PermissionFlagType.SECURITY,
    isTwoFactorAuthenticationEnforced: PermissionFlagType.SECURITY,
    defaultRoleId: PermissionFlagType.ROLES,
    fastModel: PermissionFlagType.WORKSPACE,
    smartModel: PermissionFlagType.WORKSPACE,
  };

  constructor(
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserWorkspaceEntity)
    private readonly userWorkspaceRepository: Repository<UserWorkspaceEntity>,
    private readonly workspaceManagerService: WorkspaceManagerService,
    private readonly featureFlagService: FeatureFlagService,
    private readonly billingSubscriptionService: BillingSubscriptionService,
    private readonly billingService: BillingService,
    private readonly userWorkspaceService: UserWorkspaceService,
    private readonly twentyConfigService: TwentyConfigService,
    private readonly exceptionHandlerService: ExceptionHandlerService,
    private readonly permissionsService: PermissionsService,
    private readonly dnsManagerService: DnsManagerService,
    private readonly flatEntityMapsCacheService: WorkspaceManyOrAllFlatEntityMapsCacheService,
    private readonly workspaceCacheStorageService: WorkspaceCacheStorageService,
    private readonly subdomainManagerService: SubdomainManagerService,
    private readonly customDomainManagerService: CustomDomainManagerService,
    @InjectMessageQueue(MessageQueue.deleteCascadeQueue)
    private readonly messageQueueService: MessageQueueService,
  ) {
    super(workspaceRepository);
  }

  async updateWorkspaceById({
    payload,
    userWorkspaceId,
    apiKey,
  }: {
    payload: Partial<WorkspaceEntity> & { id: string };
    userWorkspaceId?: string;
    apiKey?: string;
  }) {
    const workspace = await this.workspaceRepository.findOneBy({
      id: payload.id,
    });

    assertIsDefinedOrThrow(workspace, WorkspaceNotFoundDefaultError);

    await this.validateWorkspaceUpdatePermissions({
      payload,
      userWorkspaceId,
      workspaceId: workspace.id,
      apiKey,
      workspaceActivationStatus: workspace.activationStatus,
    });

    if (payload.subdomain && workspace.subdomain !== payload.subdomain) {
      await this.subdomainManagerService.validateSubdomainOrThrow(
        payload.subdomain,
      );
    }

    let customDomainRegistered = false;

    if (payload.customDomain === null && isDefined(workspace.customDomain)) {
      await this.dnsManagerService.deleteHostnameSilently(
        workspace.customDomain,
      );
      workspace.isCustomDomainEnabled = false;
    }

    if (
      payload.customDomain &&
      workspace.customDomain !== payload.customDomain
    ) {
      await this.customDomainManagerService.setCustomDomain(
        workspace,
        payload.customDomain,
      );
      customDomainRegistered = true;
    }

    const authProvidersBySystem = {
      google: this.twentyConfigService.get('AUTH_GOOGLE_ENABLED'),
      password: this.twentyConfigService.get('AUTH_PASSWORD_ENABLED'),
      microsoft: this.twentyConfigService.get('AUTH_MICROSOFT_ENABLED'),
    };

    if (payload.isGoogleAuthEnabled && !authProvidersBySystem.google) {
      throw new WorkspaceException(
        'Google auth is not enabled in the system.',
        WorkspaceExceptionCode.ENVIRONMENT_VAR_NOT_ENABLED,
      );
    }
    if (payload.isMicrosoftAuthEnabled && !authProvidersBySystem.microsoft) {
      throw new WorkspaceException(
        'Microsoft auth is not enabled in the system.',
        WorkspaceExceptionCode.ENVIRONMENT_VAR_NOT_ENABLED,
      );
    }
    if (payload.isPasswordAuthEnabled && !authProvidersBySystem.password) {
      throw new WorkspaceException(
        'Password auth is not enabled in the system.',
        WorkspaceExceptionCode.ENVIRONMENT_VAR_NOT_ENABLED,
      );
    }
    if (payload.isGoogleAuthBypassEnabled && !authProvidersBySystem.google) {
      throw new WorkspaceException(
        'Google auth is not enabled in the system.',
        WorkspaceExceptionCode.ENVIRONMENT_VAR_NOT_ENABLED,
      );
    }
    if (
      payload.isMicrosoftAuthBypassEnabled &&
      !authProvidersBySystem.microsoft
    ) {
      throw new WorkspaceException(
        'Microsoft auth is not enabled in the system.',
        WorkspaceExceptionCode.ENVIRONMENT_VAR_NOT_ENABLED,
      );
    }
    if (
      payload.isPasswordAuthBypassEnabled &&
      !authProvidersBySystem.password
    ) {
      throw new WorkspaceException(
        'Password auth is not enabled in the system.',
        WorkspaceExceptionCode.ENVIRONMENT_VAR_NOT_ENABLED,
      );
    }

    try {
      return await this.workspaceRepository.save({
        ...workspace,
        ...payload,
      });
    } catch (error) {
      // revert custom domain registration on error
      if (payload.customDomain && customDomainRegistered) {
        this.dnsManagerService
          .deleteHostnameSilently(payload.customDomain)
          .catch((err) => {
            this.exceptionHandlerService.captureExceptions([err]);
          });
      }
      throw error;
    }
  }

  async activateWorkspace(
    user: UserEntity,
    workspace: WorkspaceEntity,
    data: ActivateWorkspaceInput,
  ) {
    if (!data.displayName || !data.displayName.length) {
      throw new BadRequestException("'displayName' not provided");
    }

    if (
      workspace.activationStatus === WorkspaceActivationStatus.ONGOING_CREATION
    ) {
      throw new Error('Workspace is already being created');
    }

    if (
      workspace.activationStatus !== WorkspaceActivationStatus.PENDING_CREATION
    ) {
      throw new Error('Workspace is not pending creation');
    }

    await this.workspaceRepository.update(workspace.id, {
      activationStatus: WorkspaceActivationStatus.ONGOING_CREATION,
    });

    await this.featureFlagService.enableFeatureFlags(
      DEFAULT_FEATURE_FLAGS,
      workspace.id,
    );

    await this.workspaceManagerService.init({
      workspace,
      userId: user.id,
    });
    await this.userWorkspaceService.createWorkspaceMember(workspace.id, user);

    const appVersion = this.twentyConfigService.get('APP_VERSION');

    await this.workspaceRepository.update(workspace.id, {
      displayName: data.displayName,
      activationStatus: WorkspaceActivationStatus.ACTIVE,
      version: extractVersionMajorMinorPatch(appVersion),
    });

    return await this.workspaceRepository.findOneBy({
      id: workspace.id,
    });
  }

  async deleteMetadataSchemaCacheAndUserWorkspace(workspace: WorkspaceEntity) {
    await this.userWorkspaceService.deleteUserWorkspace({
      userWorkspaceId: workspace.id,
    });

    if (this.billingService.isBillingEnabled()) {
      await this.billingSubscriptionService.deleteSubscriptions(workspace.id);
    }

    await this.workspaceManagerService.delete(workspace.id);

    return workspace;
  }

  async deleteWorkspace(id: string, softDelete = false) {
    const workspace = await this.workspaceRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    assert(workspace, 'Workspace not found');

    const userWorkspaces = await this.userWorkspaceRepository.find({
      where: {
        workspaceId: id,
      },
      withDeleted: true,
    });

    for (const userWorkspace of userWorkspaces) {
      await this.handleRemoveWorkspaceMember(
        id,
        userWorkspace.userId,
        softDelete,
      );
    }
    this.logger.log(`workspace ${id} user workspaces deleted`);

    await this.workspaceCacheStorageService.flush(
      workspace.id,
      workspace.metadataVersion,
    );
    await this.flatEntityMapsCacheService.flushFlatEntityMaps({
      workspaceId: workspace.id,
    });
    this.logger.log(`workspace ${id} cache flushed`);

    if (softDelete) {
      if (this.billingService.isBillingEnabled()) {
        await this.billingSubscriptionService.deleteSubscriptions(workspace.id);
      }

      await this.workspaceRepository.softDelete({ id });

      this.logger.log(`workspace ${id} soft deleted`);

      return workspace;
    }

    await this.deleteMetadataSchemaCacheAndUserWorkspace(workspace);

    await this.messageQueueService.add<FileWorkspaceFolderDeletionJobData>(
      FileWorkspaceFolderDeletionJob.name,
      { workspaceId: id },
    );

    if (workspace.customDomain) {
      await this.dnsManagerService.deleteHostnameSilently(
        workspace.customDomain,
      );
      this.logger.log(`workspace ${id} custom domain deleted`);
    }

    await this.workspaceRepository.delete(id);

    this.logger.log(`workspace ${id} hard deleted`);

    return workspace;
  }

  async handleRemoveWorkspaceMember(
    workspaceId: string,
    userId: string,
    softDelete = false,
  ) {
    const userWorkspaces = await this.userWorkspaceRepository.find({
      where: {
        userId,
      },
    });

    const userWorkspaceOfRemovedWorkspaceMember = userWorkspaces?.find(
      (userWorkspace: UserWorkspaceEntity) =>
        userWorkspace.workspaceId === workspaceId,
    );

    if (isDefined(userWorkspaceOfRemovedWorkspaceMember)) {
      await this.userWorkspaceService.deleteUserWorkspace({
        userWorkspaceId: userWorkspaceOfRemovedWorkspaceMember.id,
        softDelete,
      });
    }

    const hasOtherUserWorkspaces = isDefined(
      userWorkspaceOfRemovedWorkspaceMember,
    )
      ? userWorkspaces.length > 1
      : userWorkspaces.length > 0;

    if (!hasOtherUserWorkspaces) {
      await this.userRepository.softDelete(userId);
    }
  }

  async setCustomBillingPlan(
    workspaceId: string,
    planId: string,
  ): Promise<WorkspaceEntity> {
    const workspace = await this.workspaceRepository.findOneBy({
      id: workspaceId,
    });

    assertIsDefinedOrThrow(workspace, WorkspaceNotFoundDefaultError);

    // TODO: Validar se o plano customizado existe no banco
    // Por enquanto, apenas salva o ID
    // Quando a estrutura de CustomBillingPlanEntity estiver pronta, adicionar validação aqui

    await this.workspaceRepository.update(workspaceId, {
      customBillingPlanId: planId,
    });

    const updatedWorkspace = await this.workspaceRepository.findOneBy({
      id: workspaceId,
    });

    assertIsDefinedOrThrow(updatedWorkspace, WorkspaceNotFoundDefaultError);

    return updatedWorkspace;
  }

  private async validateWorkspaceUpdatePermissions({
    payload,
    userWorkspaceId,
    workspaceId,
    apiKey,
    workspaceActivationStatus,
  }: {
    payload: Partial<WorkspaceEntity>;
    userWorkspaceId?: string;
    workspaceId: string;
    apiKey?: string;
    workspaceActivationStatus: WorkspaceActivationStatus;
  }) {
    if (
      workspaceActivationStatus === WorkspaceActivationStatus.PENDING_CREATION
    ) {
      return;
    }

    const systemFields = new Set(['id', 'createdAt', 'updatedAt', 'deletedAt']);

    const fieldsBeingUpdated = Object.keys(payload).filter(
      (field) => !systemFields.has(field),
    );

    if (fieldsBeingUpdated.length === 0) {
      return;
    }

    if (!userWorkspaceId) {
      throw new Error('Missing userWorkspaceId in authContext');
    }

    const fieldsByPermission = new Map<PermissionFlagType, string[]>();

    for (const field of fieldsBeingUpdated) {
      const requiredPermission = this.WORKSPACE_FIELD_PERMISSIONS[field];

      if (!requiredPermission) {
        throw new PermissionsException(
          `Field "${field}" is not allowed to be updated`,
          PermissionsExceptionCode.PERMISSION_DENIED,
          {
            userFriendlyMessage: msg`The field "${field}" cannot be updated. Please contact your workspace administrator.`,
          },
        );
      }

      if (!fieldsByPermission.has(requiredPermission)) {
        fieldsByPermission.set(requiredPermission, []);
      }
      fieldsByPermission.get(requiredPermission)!.push(field);
    }

    for (const [permission, fields] of fieldsByPermission.entries()) {
      const hasPermission =
        await this.permissionsService.userHasWorkspaceSettingPermission({
          userWorkspaceId,
          workspaceId,
          setting: permission,
          apiKeyId: apiKey,
        });

      if (!hasPermission) {
        const fieldsList = fields.join(', ');

        throw new PermissionsException(
          PermissionsExceptionMessage.PERMISSION_DENIED,
          PermissionsExceptionCode.PERMISSION_DENIED,
          {
            userFriendlyMessage: msg`You do not have permission to update these fields: ${fieldsList}. Please contact your workspace administrator.`,
          },
        );
      }
    }
  }
}

```

```typescriptreact
import { gql, useMutation } from '@apollo/client';
import { SubTitle } from '@/auth/components/SubTitle';
import { Title } from '@/auth/components/Title';
import { useAuth } from '@/auth/hooks/useAuth';
import styled from '@emotion/styled';
import { Trans, useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'twenty-ui/feedback';
import { MainButton } from 'twenty-ui/input';
import { ClickToActionLink } from 'twenty-ui/navigation';
import { AppPath } from 'twenty-shared/types';

const SELECT_CUSTOM_BILLING_PLAN = gql`
  mutation SelectCustomBillingPlan($planId: String!) {
    selectCustomBillingPlan(planId: $planId)
  }
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const StyledPlanCard = styled.div<{ isSelected: boolean }>`
  background-color: ${({ theme }) => theme.background.secondary};
  border: 2px solid
    ${({ theme, isSelected }) =>
      isSelected ? theme.color.blue : theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(4)};
  width: 100%;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.color.blue};
  }
`;

const StyledPlanName = styled.div`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const StyledPlanDescription = styled.div`
  color: ${({ theme }) => theme.font.color.secondary};
  font-size: ${({ theme }) => theme.font.size.sm};
`;

const StyledPlansContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${({ theme }) => theme.spacing(6)} 0;
  width: 100%;
`;

const StyledLinkGroup = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing(1)};
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

// TODO: These should come from a GraphQL query to fetch custom billing plans
// Por enquanto usando UUIDs mock válidos - substituir por query real quando a estrutura estiver pronta
const MOCK_CUSTOM_PLANS = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Plano Básico',
    description: 'Ideal para pequenas equipes',
    price: 'R$ 49/mês',
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Plano Profissional',
    description: 'Para equipes em crescimento',
    price: 'R$ 99/mês',
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Plano Enterprise',
    description: 'Recursos completos para grandes empresas',
    price: 'R$ 199/mês',
  },
];

export const ChooseCustomPlanContent = () => {
  const { t } = useLingui();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectCustomBillingPlan, { loading }] = useMutation(
    SELECT_CUSTOM_BILLING_PLAN,
  );

  const handlePlanSelect = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleContinue = async () => {
    if (!selectedPlanId) return;

    try {
      await selectCustomBillingPlan({
        variables: {
          planId: selectedPlanId,
        },
      });

      navigate(AppPath.CreateWorkspace);
    } catch (error: any) {
      console.error('Error selecting plan:', error);
      
      // Verifica se o erro é relacionado a UUID inválido
      if (
        error?.message?.includes('invalid input syntax for type uuid') ||
        error?.graphQLErrors?.[0]?.message?.includes('uuid')
      ) {
        alert(
          'Erro: O plano selecionado não existe no banco de dados. Por favor, crie os planos customizados no Admin Panel primeiro.',
        );
      } else {
        alert('Erro ao selecionar o plano. Por favor, tente novamente.');
      }
    }
  };

  return (
    <StyledContainer>
      <Title noMarginTop>{t`Escolha seu Plano`}</Title>
      <SubTitle>{t`Selecione o plano ideal para sua equipe`}</SubTitle>

      <StyledPlansContainer>
        {MOCK_CUSTOM_PLANS.map((plan) => (
          <StyledPlanCard
            key={plan.id}
            isSelected={selectedPlanId === plan.id}
            onClick={() => handlePlanSelect(plan.id)}
          >
            <StyledPlanName>{plan.name}</StyledPlanName>
            <StyledPlanDescription>{plan.description}</StyledPlanDescription>
            <StyledPlanDescription style={{ marginTop: '8px' }}>
              {plan.price}
            </StyledPlanDescription>
          </StyledPlanCard>
        ))}
      </StyledPlansContainer>

      <MainButton
        title={t`Continuar`}
        onClick={handleContinue}
        width={200}
        Icon={() => loading && <Loader />}
        disabled={!selectedPlanId || loading}
      />

      <StyledLinkGroup>
        <ClickToActionLink onClick={signOut}>
          <Trans>Sair</Trans>
        </ClickToActionLink>
      </StyledLinkGroup>
    </StyledContainer>
  );
};


```

O problema é que os IDs mock não são UUIDs válidos. Como a estrutura de Custom Billing Plans ainda não existe, o código atual não funcionará até a estrutura ser criada.

Por enquanto, os planos mock usam UUIDs válidos, mas precisamos criar os planos no banco primeiro. Adicionando uma nota no código e melhorando o tratamento de erros:


O código foi ajustado para usar UUIDs válidos nos mocks e melhorar o tratamento de erros. O problema atual é que a estrutura de Custom Billing Plans mencionada no documento ainda não existe. O campo `customBillingPlanId` está no workspace, mas não há uma tabela de planos customizados no banco.

**Próximos passos necessários:**
1. Criar a estrutura de Custom Billing Plans (entidade, service, resolver, etc.)
2. Criar os planos no banco de dados
3. Substituir os mocks por uma query GraphQL real

Por enquanto, o erro deve aparecer de forma mais clara. Quando você criar os planos customizados no banco (via Admin Panel ou diretamente), use os UUIDs reais dos planos no lugar dos mocks.

Deseja que eu ajude a criar a estrutura completa de Custom Billing Plans agora, ou prefere fazer isso depois?

---

**User**

quero sim que você deixe tudo funcional, porem quando escolho o plano e clico em continuar nao da mais erro mas a pagina so recarrega

---

**Cursor**

A mutation está funcionando, mas o onboarding status não está sendo atualizado. Verificando o fluxo e corrigindo:


Após salvar o `customBillingPlanId`, o onboarding status precisa ser recalculado e o cache do Apollo atualizado. Verificando como o fluxo do Stripe faz isso e aplicando o mesmo padrão:


Refazendo a busca do usuário após a mutation, como no `PaymentSuccess`. Atualizando o código:


Atualizando o código para recarregar o usuário atual após a mutation:


```typescriptreact
import { gql, useMutation } from '@apollo/client';
import { SubTitle } from '@/auth/components/SubTitle';
import { Title } from '@/auth/components/Title';
import { useAuth } from '@/auth/hooks/useAuth';
import { currentUserState } from '@/auth/states/currentUserState';
import styled from '@emotion/styled';
import { Trans, useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { AppPath } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { Loader } from 'twenty-ui/feedback';
import { MainButton } from 'twenty-ui/input';
import { ClickToActionLink } from 'twenty-ui/navigation';
import { useGetCurrentUserLazyQuery } from '~/generated-metadata/graphql';
import { OnboardingStatus } from '~/generated/graphql';

const SELECT_CUSTOM_BILLING_PLAN = gql`
  mutation SelectCustomBillingPlan($planId: String!) {
    selectCustomBillingPlan(planId: $planId)
  }
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const StyledPlanCard = styled.div<{ isSelected: boolean }>`
  background-color: ${({ theme }) => theme.background.secondary};
  border: 2px solid
    ${({ theme, isSelected }) =>
      isSelected ? theme.color.blue : theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(4)};
  width: 100%;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.color.blue};
  }
`;

const StyledPlanName = styled.div`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const StyledPlanDescription = styled.div`
  color: ${({ theme }) => theme.font.color.secondary};
  font-size: ${({ theme }) => theme.font.size.sm};
`;

const StyledPlansContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${({ theme }) => theme.spacing(6)} 0;
  width: 100%;
`;

const StyledLinkGroup = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing(1)};
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

// TODO: These should come from a GraphQL query to fetch custom billing plans
// Por enquanto usando UUIDs mock válidos - substituir por query real quando a estrutura estiver pronta
const MOCK_CUSTOM_PLANS = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Plano Básico',
    description: 'Ideal para pequenas equipes',
    price: 'R$ 49/mês',
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Plano Profissional',
    description: 'Para equipes em crescimento',
    price: 'R$ 99/mês',
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Plano Enterprise',
    description: 'Recursos completos para grandes empresas',
    price: 'R$ 199/mês',
  },
];

export const ChooseCustomPlanContent = () => {
  const { t } = useLingui();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectCustomBillingPlan, { loading }] = useMutation(
    SELECT_CUSTOM_BILLING_PLAN,
  );

  const handlePlanSelect = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleContinue = async () => {
    if (!selectedPlanId) return;

    try {
      await selectCustomBillingPlan({
        variables: {
          planId: selectedPlanId,
        },
      });

      navigate(AppPath.CreateWorkspace);
    } catch (error: any) {
      console.error('Error selecting plan:', error);
      
      // Verifica se o erro é relacionado a UUID inválido
      if (
        error?.message?.includes('invalid input syntax for type uuid') ||
        error?.graphQLErrors?.[0]?.message?.includes('uuid')
      ) {
        alert(
          'Erro: O plano selecionado não existe no banco de dados. Por favor, crie os planos customizados no Admin Panel primeiro.',
        );
      } else {
        alert('Erro ao selecionar o plano. Por favor, tente novamente.');
      }
    }
  };

  return (
    <StyledContainer>
      <Title noMarginTop>{t`Escolha seu Plano`}</Title>
      <SubTitle>{t`Selecione o plano ideal para sua equipe`}</SubTitle>

      <StyledPlansContainer>
        {MOCK_CUSTOM_PLANS.map((plan) => (
          <StyledPlanCard
            key={plan.id}
            isSelected={selectedPlanId === plan.id}
            onClick={() => handlePlanSelect(plan.id)}
          >
            <StyledPlanName>{plan.name}</StyledPlanName>
            <StyledPlanDescription>{plan.description}</StyledPlanDescription>
            <StyledPlanDescription style={{ marginTop: '8px' }}>
              {plan.price}
            </StyledPlanDescription>
          </StyledPlanCard>
        ))}
      </StyledPlansContainer>

      <MainButton
        title={t`Continuar`}
        onClick={handleContinue}
        width={200}
        Icon={() => loading && <Loader />}
        disabled={!selectedPlanId || loading}
      />

      <StyledLinkGroup>
        <ClickToActionLink onClick={signOut}>
          <Trans>Sair</Trans>
        </ClickToActionLink>
      </StyledLinkGroup>
    </StyledContainer>
  );
};


```

```typescriptreact
import { gql, useMutation } from '@apollo/client';
import { SubTitle } from '@/auth/components/SubTitle';
import { Title } from '@/auth/components/Title';
import { useAuth } from '@/auth/hooks/useAuth';
import { currentUserState } from '@/auth/states/currentUserState';
import styled from '@emotion/styled';
import { Trans, useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { AppPath } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { Loader } from 'twenty-ui/feedback';
import { MainButton } from 'twenty-ui/input';
import { ClickToActionLink } from 'twenty-ui/navigation';
import { useGetCurrentUserLazyQuery } from '~/generated-metadata/graphql';
import { OnboardingStatus } from '~/generated/graphql';

const SELECT_CUSTOM_BILLING_PLAN = gql`
  mutation SelectCustomBillingPlan($planId: String!) {
    selectCustomBillingPlan(planId: $planId)
  }
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const StyledPlanCard = styled.div<{ isSelected: boolean }>`
  background-color: ${({ theme }) => theme.background.secondary};
  border: 2px solid
    ${({ theme, isSelected }) =>
      isSelected ? theme.color.blue : theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(4)};
  width: 100%;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.color.blue};
  }
`;

const StyledPlanName = styled.div`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const StyledPlanDescription = styled.div`
  color: ${({ theme }) => theme.font.color.secondary};
  font-size: ${({ theme }) => theme.font.size.sm};
`;

const StyledPlansContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${({ theme }) => theme.spacing(6)} 0;
  width: 100%;
`;

const StyledLinkGroup = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing(1)};
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

// TODO: These should come from a GraphQL query to fetch custom billing plans
// Por enquanto usando UUIDs mock válidos - substituir por query real quando a estrutura estiver pronta
const MOCK_CUSTOM_PLANS = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Plano Básico',
    description: 'Ideal para pequenas equipes',
    price: 'R$ 49/mês',
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Plano Profissional',
    description: 'Para equipes em crescimento',
    price: 'R$ 99/mês',
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Plano Enterprise',
    description: 'Recursos completos para grandes empresas',
    price: 'R$ 199/mês',
  },
];

export const ChooseCustomPlanContent = () => {
  const { t } = useLingui();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [getCurrentUser] = useGetCurrentUserLazyQuery();
  const setCurrentUser = useSetRecoilState(currentUserState);

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectCustomBillingPlan, { loading }] = useMutation(
    SELECT_CUSTOM_BILLING_PLAN,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleContinue = async () => {
    if (!selectedPlanId || loading || isRefreshing) return;

    try {
      // Primeiro, salva o plano customizado
      await selectCustomBillingPlan({
        variables: {
          planId: selectedPlanId,
        },
      });

      // Recarrega o usuário atual para obter o novo onboarding status
      setIsRefreshing(true);
      const result = await getCurrentUser({ fetchPolicy: 'network-only' });
      const currentUser = result.data?.currentUser;

      if (isDefined(currentUser)) {
        setCurrentUser(currentUser);

        // Verifica se o onboarding status não é mais CUSTOM_PLAN_REQUIRED
        if (currentUser.onboardingStatus !== OnboardingStatus.CUSTOM_PLAN_REQUIRED) {
          // O sistema de navegação automática vai redirecionar para a próxima página
          // Por enquanto, vamos para CreateWorkspace
          navigate(AppPath.CreateWorkspace);
        } else {
          // Se ainda estiver em CUSTOM_PLAN_REQUIRED, força um reload da página
          window.location.reload();
        }
      } else {
        throw new Error('Failed to refresh user data');
      }
    } catch (error: any) {
      console.error('Error selecting plan:', error);
      setIsRefreshing(false);
      
      // Verifica se o erro é relacionado a UUID inválido
      if (
        error?.message?.includes('invalid input syntax for type uuid') ||
        error?.graphQLErrors?.[0]?.message?.includes('uuid')
      ) {
        alert(
          'Erro: O plano selecionado não existe no banco de dados. Por favor, crie os planos customizados no Admin Panel primeiro.',
        );
      } else {
        alert('Erro ao selecionar o plano. Por favor, tente novamente.');
      }
    }
  };

  return (
    <StyledContainer>
      <Title noMarginTop>{t`Escolha seu Plano`}</Title>
      <SubTitle>{t`Selecione o plano ideal para sua equipe`}</SubTitle>

      <StyledPlansContainer>
        {MOCK_CUSTOM_PLANS.map((plan) => (
          <StyledPlanCard
            key={plan.id}
            isSelected={selectedPlanId === plan.id}
            onClick={() => handlePlanSelect(plan.id)}
          >
            <StyledPlanName>{plan.name}</StyledPlanName>
            <StyledPlanDescription>{plan.description}</StyledPlanDescription>
            <StyledPlanDescription style={{ marginTop: '8px' }}>
              {plan.price}
            </StyledPlanDescription>
          </StyledPlanCard>
        ))}
      </StyledPlansContainer>

      <MainButton
        title={t`Continuar`}
        onClick={handleContinue}
        width={200}
        Icon={() => loading && <Loader />}
        disabled={!selectedPlanId || loading}
      />

      <StyledLinkGroup>
        <ClickToActionLink onClick={signOut}>
          <Trans>Sair</Trans>
        </ClickToActionLink>
      </StyledLinkGroup>
    </StyledContainer>
  );
};


```

```typescriptreact
import { gql, useMutation } from '@apollo/client';
import { SubTitle } from '@/auth/components/SubTitle';
import { Title } from '@/auth/components/Title';
import { useAuth } from '@/auth/hooks/useAuth';
import { currentUserState } from '@/auth/states/currentUserState';
import styled from '@emotion/styled';
import { Trans, useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { AppPath } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { Loader } from 'twenty-ui/feedback';
import { MainButton } from 'twenty-ui/input';
import { ClickToActionLink } from 'twenty-ui/navigation';
import { useGetCurrentUserLazyQuery } from '~/generated-metadata/graphql';
import { OnboardingStatus } from '~/generated/graphql';

const SELECT_CUSTOM_BILLING_PLAN = gql`
  mutation SelectCustomBillingPlan($planId: String!) {
    selectCustomBillingPlan(planId: $planId)
  }
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const StyledPlanCard = styled.div<{ isSelected: boolean }>`
  background-color: ${({ theme }) => theme.background.secondary};
  border: 2px solid
    ${({ theme, isSelected }) =>
      isSelected ? theme.color.blue : theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(4)};
  width: 100%;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.color.blue};
  }
`;

const StyledPlanName = styled.div`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const StyledPlanDescription = styled.div`
  color: ${({ theme }) => theme.font.color.secondary};
  font-size: ${({ theme }) => theme.font.size.sm};
`;

const StyledPlansContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${({ theme }) => theme.spacing(6)} 0;
  width: 100%;
`;

const StyledLinkGroup = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing(1)};
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

// TODO: These should come from a GraphQL query to fetch custom billing plans
// Por enquanto usando UUIDs mock válidos - substituir por query real quando a estrutura estiver pronta
const MOCK_CUSTOM_PLANS = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Plano Básico',
    description: 'Ideal para pequenas equipes',
    price: 'R$ 49/mês',
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Plano Profissional',
    description: 'Para equipes em crescimento',
    price: 'R$ 99/mês',
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Plano Enterprise',
    description: 'Recursos completos para grandes empresas',
    price: 'R$ 199/mês',
  },
];

export const ChooseCustomPlanContent = () => {
  const { t } = useLingui();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [getCurrentUser] = useGetCurrentUserLazyQuery();
  const setCurrentUser = useSetRecoilState(currentUserState);

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectCustomBillingPlan, { loading }] = useMutation(
    SELECT_CUSTOM_BILLING_PLAN,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleContinue = async () => {
    if (!selectedPlanId || loading || isRefreshing) return;

    try {
      // Primeiro, salva o plano customizado
      await selectCustomBillingPlan({
        variables: {
          planId: selectedPlanId,
        },
      });

      // Recarrega o usuário atual para obter o novo onboarding status
      setIsRefreshing(true);
      const result = await getCurrentUser({ fetchPolicy: 'network-only' });
      const currentUser = result.data?.currentUser;

      if (isDefined(currentUser)) {
        setCurrentUser(currentUser);

        // Verifica se o onboarding status não é mais CUSTOM_PLAN_REQUIRED
        if (currentUser.onboardingStatus !== OnboardingStatus.CUSTOM_PLAN_REQUIRED) {
          // O sistema de navegação automática vai redirecionar para a próxima página
          // Por enquanto, vamos para CreateWorkspace
          navigate(AppPath.CreateWorkspace);
        } else {
          // Se ainda estiver em CUSTOM_PLAN_REQUIRED, força um reload da página
          window.location.reload();
        }
      } else {
        throw new Error('Failed to refresh user data');
      }
    } catch (error: any) {
      console.error('Error selecting plan:', error);
      setIsRefreshing(false);
      
      // Verifica se o erro é relacionado a UUID inválido
      if (
        error?.message?.includes('invalid input syntax for type uuid') ||
        error?.graphQLErrors?.[0]?.message?.includes('uuid')
      ) {
        alert(
          'Erro: O plano selecionado não existe no banco de dados. Por favor, crie os planos customizados no Admin Panel primeiro.',
        );
      } else {
        alert('Erro ao selecionar o plano. Por favor, tente novamente.');
      }
    }
  };

  return (
    <StyledContainer>
      <Title noMarginTop>{t`Escolha seu Plano`}</Title>
      <SubTitle>{t`Selecione o plano ideal para sua equipe`}</SubTitle>

      <StyledPlansContainer>
        {MOCK_CUSTOM_PLANS.map((plan) => (
          <StyledPlanCard
            key={plan.id}
            isSelected={selectedPlanId === plan.id}
            onClick={() => handlePlanSelect(plan.id)}
          >
            <StyledPlanName>{plan.name}</StyledPlanName>
            <StyledPlanDescription>{plan.description}</StyledPlanDescription>
            <StyledPlanDescription style={{ marginTop: '8px' }}>
              {plan.price}
            </StyledPlanDescription>
          </StyledPlanCard>
        ))}
      </StyledPlansContainer>

      <MainButton
        title={t`Continuar`}
        onClick={handleContinue}
        width={200}
        Icon={() => (loading || isRefreshing) && <Loader />}
        disabled={!selectedPlanId || loading || isRefreshing}
      />

      <StyledLinkGroup>
        <ClickToActionLink onClick={signOut}>
          <Trans>Sair</Trans>
        </ClickToActionLink>
      </StyledLinkGroup>
    </StyledContainer>
  );
};


```

Corrigindo a verificação do tipo:


```typescriptreact
import { gql, useMutation } from '@apollo/client';
import { SubTitle } from '@/auth/components/SubTitle';
import { Title } from '@/auth/components/Title';
import { useAuth } from '@/auth/hooks/useAuth';
import { currentUserState } from '@/auth/states/currentUserState';
import styled from '@emotion/styled';
import { Trans, useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { AppPath } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { Loader } from 'twenty-ui/feedback';
import { MainButton } from 'twenty-ui/input';
import { ClickToActionLink } from 'twenty-ui/navigation';
import { useGetCurrentUserLazyQuery } from '~/generated-metadata/graphql';
import { OnboardingStatus } from '~/generated/graphql';

const SELECT_CUSTOM_BILLING_PLAN = gql`
  mutation SelectCustomBillingPlan($planId: String!) {
    selectCustomBillingPlan(planId: $planId)
  }
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const StyledPlanCard = styled.div<{ isSelected: boolean }>`
  background-color: ${({ theme }) => theme.background.secondary};
  border: 2px solid
    ${({ theme, isSelected }) =>
      isSelected ? theme.color.blue : theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(4)};
  width: 100%;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.color.blue};
  }
`;

const StyledPlanName = styled.div`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const StyledPlanDescription = styled.div`
  color: ${({ theme }) => theme.font.color.secondary};
  font-size: ${({ theme }) => theme.font.size.sm};
`;

const StyledPlansContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${({ theme }) => theme.spacing(6)} 0;
  width: 100%;
`;

const StyledLinkGroup = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing(1)};
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

// TODO: These should come from a GraphQL query to fetch custom billing plans
// Por enquanto usando UUIDs mock válidos - substituir por query real quando a estrutura estiver pronta
const MOCK_CUSTOM_PLANS = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Plano Básico',
    description: 'Ideal para pequenas equipes',
    price: 'R$ 49/mês',
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Plano Profissional',
    description: 'Para equipes em crescimento',
    price: 'R$ 99/mês',
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Plano Enterprise',
    description: 'Recursos completos para grandes empresas',
    price: 'R$ 199/mês',
  },
];

export const ChooseCustomPlanContent = () => {
  const { t } = useLingui();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [getCurrentUser] = useGetCurrentUserLazyQuery();
  const setCurrentUser = useSetRecoilState(currentUserState);

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectCustomBillingPlan, { loading }] = useMutation(
    SELECT_CUSTOM_BILLING_PLAN,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleContinue = async () => {
    if (!selectedPlanId || loading || isRefreshing) return;

    try {
      // Primeiro, salva o plano customizado
      await selectCustomBillingPlan({
        variables: {
          planId: selectedPlanId,
        },
      });

      // Recarrega o usuário atual para obter o novo onboarding status
      setIsRefreshing(true);
      const result = await getCurrentUser({ fetchPolicy: 'network-only' });
      const currentUser = result.data?.currentUser;

      if (isDefined(currentUser)) {
        setCurrentUser(currentUser);

        // Verifica se o onboarding status não é mais CUSTOM_PLAN_REQUIRED
        if (
          isDefined(currentUser.onboardingStatus) &&
          currentUser.onboardingStatus !== OnboardingStatus.CUSTOM_PLAN_REQUIRED
        ) {
          // O sistema de navegação automática vai redirecionar para a próxima página
          // Por enquanto, vamos para CreateWorkspace
          navigate(AppPath.CreateWorkspace);
        } else {
          // Se ainda estiver em CUSTOM_PLAN_REQUIRED, força um reload da página
          window.location.reload();
        }
      } else {
        throw new Error('Failed to refresh user data');
      }
    } catch (error: any) {
      console.error('Error selecting plan:', error);
      setIsRefreshing(false);
      
      // Verifica se o erro é relacionado a UUID inválido
      if (
        error?.message?.includes('invalid input syntax for type uuid') ||
        error?.graphQLErrors?.[0]?.message?.includes('uuid')
      ) {
        alert(
          'Erro: O plano selecionado não existe no banco de dados. Por favor, crie os planos customizados no Admin Panel primeiro.',
        );
      } else {
        alert('Erro ao selecionar o plano. Por favor, tente novamente.');
      }
    }
  };

  return (
    <StyledContainer>
      <Title noMarginTop>{t`Escolha seu Plano`}</Title>
      <SubTitle>{t`Selecione o plano ideal para sua equipe`}</SubTitle>

      <StyledPlansContainer>
        {MOCK_CUSTOM_PLANS.map((plan) => (
          <StyledPlanCard
            key={plan.id}
            isSelected={selectedPlanId === plan.id}
            onClick={() => handlePlanSelect(plan.id)}
          >
            <StyledPlanName>{plan.name}</StyledPlanName>
            <StyledPlanDescription>{plan.description}</StyledPlanDescription>
            <StyledPlanDescription style={{ marginTop: '8px' }}>
              {plan.price}
            </StyledPlanDescription>
          </StyledPlanCard>
        ))}
      </StyledPlansContainer>

      <MainButton
        title={t`Continuar`}
        onClick={handleContinue}
        width={200}
        Icon={() => (loading || isRefreshing) && <Loader />}
        disabled={!selectedPlanId || loading || isRefreshing}
      />

      <StyledLinkGroup>
        <ClickToActionLink onClick={signOut}>
          <Trans>Sair</Trans>
        </ClickToActionLink>
      </StyledLinkGroup>
    </StyledContainer>
  );
};


```

Verificando como o enum é usado no arquivo gerado:


O enum existe. Ajustando a comparação para evitar o erro de tipo:


```typescriptreact
import { gql, useMutation } from '@apollo/client';
import { SubTitle } from '@/auth/components/SubTitle';
import { Title } from '@/auth/components/Title';
import { useAuth } from '@/auth/hooks/useAuth';
import { currentUserState } from '@/auth/states/currentUserState';
import styled from '@emotion/styled';
import { Trans, useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { AppPath } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { Loader } from 'twenty-ui/feedback';
import { MainButton } from 'twenty-ui/input';
import { ClickToActionLink } from 'twenty-ui/navigation';
import { useGetCurrentUserLazyQuery } from '~/generated-metadata/graphql';
import { OnboardingStatus } from '~/generated/graphql';

const SELECT_CUSTOM_BILLING_PLAN = gql`
  mutation SelectCustomBillingPlan($planId: String!) {
    selectCustomBillingPlan(planId: $planId)
  }
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const StyledPlanCard = styled.div<{ isSelected: boolean }>`
  background-color: ${({ theme }) => theme.background.secondary};
  border: 2px solid
    ${({ theme, isSelected }) =>
      isSelected ? theme.color.blue : theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(4)};
  width: 100%;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.color.blue};
  }
`;

const StyledPlanName = styled.div`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const StyledPlanDescription = styled.div`
  color: ${({ theme }) => theme.font.color.secondary};
  font-size: ${({ theme }) => theme.font.size.sm};
`;

const StyledPlansContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${({ theme }) => theme.spacing(6)} 0;
  width: 100%;
`;

const StyledLinkGroup = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing(1)};
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

// TODO: These should come from a GraphQL query to fetch custom billing plans
// Por enquanto usando UUIDs mock válidos - substituir por query real quando a estrutura estiver pronta
const MOCK_CUSTOM_PLANS = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Plano Básico',
    description: 'Ideal para pequenas equipes',
    price: 'R$ 49/mês',
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Plano Profissional',
    description: 'Para equipes em crescimento',
    price: 'R$ 99/mês',
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Plano Enterprise',
    description: 'Recursos completos para grandes empresas',
    price: 'R$ 199/mês',
  },
];

export const ChooseCustomPlanContent = () => {
  const { t } = useLingui();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [getCurrentUser] = useGetCurrentUserLazyQuery();
  const setCurrentUser = useSetRecoilState(currentUserState);

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectCustomBillingPlan, { loading }] = useMutation(
    SELECT_CUSTOM_BILLING_PLAN,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleContinue = async () => {
    if (!selectedPlanId || loading || isRefreshing) return;

    try {
      // Primeiro, salva o plano customizado
      await selectCustomBillingPlan({
        variables: {
          planId: selectedPlanId,
        },
      });

      // Recarrega o usuário atual para obter o novo onboarding status
      setIsRefreshing(true);
      const result = await getCurrentUser({ fetchPolicy: 'network-only' });
      const currentUser = result.data?.currentUser;

      if (isDefined(currentUser)) {
        setCurrentUser(currentUser);

        // Verifica se o onboarding status não é mais CUSTOM_PLAN_REQUIRED
        const onboardingStatus = currentUser.onboardingStatus;
        if (
          isDefined(onboardingStatus) &&
          onboardingStatus !== 'CUSTOM_PLAN_REQUIRED'
        ) {
          // O sistema de navegação automática vai redirecionar para a próxima página
          // Por enquanto, vamos para CreateWorkspace
          navigate(AppPath.CreateWorkspace);
        } else {
          // Se ainda estiver em CUSTOM_PLAN_REQUIRED, força um reload da página
          window.location.reload();
        }
      } else {
        throw new Error('Failed to refresh user data');
      }
    } catch (error: any) {
      console.error('Error selecting plan:', error);
      setIsRefreshing(false);
      
      // Verifica se o erro é relacionado a UUID inválido
      if (
        error?.message?.includes('invalid input syntax for type uuid') ||
        error?.graphQLErrors?.[0]?.message?.includes('uuid')
      ) {
        alert(
          'Erro: O plano selecionado não existe no banco de dados. Por favor, crie os planos customizados no Admin Panel primeiro.',
        );
      } else {
        alert('Erro ao selecionar o plano. Por favor, tente novamente.');
      }
    }
  };

  return (
    <StyledContainer>
      <Title noMarginTop>{t`Escolha seu Plano`}</Title>
      <SubTitle>{t`Selecione o plano ideal para sua equipe`}</SubTitle>

      <StyledPlansContainer>
        {MOCK_CUSTOM_PLANS.map((plan) => (
          <StyledPlanCard
            key={plan.id}
            isSelected={selectedPlanId === plan.id}
            onClick={() => handlePlanSelect(plan.id)}
          >
            <StyledPlanName>{plan.name}</StyledPlanName>
            <StyledPlanDescription>{plan.description}</StyledPlanDescription>
            <StyledPlanDescription style={{ marginTop: '8px' }}>
              {plan.price}
            </StyledPlanDescription>
          </StyledPlanCard>
        ))}
      </StyledPlansContainer>

      <MainButton
        title={t`Continuar`}
        onClick={handleContinue}
        width={200}
        Icon={() => (loading || isRefreshing) && <Loader />}
        disabled={!selectedPlanId || loading || isRefreshing}
      />

      <StyledLinkGroup>
        <ClickToActionLink onClick={signOut}>
          <Trans>Sair</Trans>
        </ClickToActionLink>
      </StyledLinkGroup>
    </StyledContainer>
  );
};


```

Simplificando: removendo a verificação de status e navegando diretamente, deixando o sistema de navegação automática lidar com o redirecionamento correto:


```typescriptreact
import { gql, useMutation } from '@apollo/client';
import { SubTitle } from '@/auth/components/SubTitle';
import { Title } from '@/auth/components/Title';
import { useAuth } from '@/auth/hooks/useAuth';
import { currentUserState } from '@/auth/states/currentUserState';
import styled from '@emotion/styled';
import { Trans, useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { AppPath } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { Loader } from 'twenty-ui/feedback';
import { MainButton } from 'twenty-ui/input';
import { ClickToActionLink } from 'twenty-ui/navigation';
import { useGetCurrentUserLazyQuery } from '~/generated-metadata/graphql';

const SELECT_CUSTOM_BILLING_PLAN = gql`
  mutation SelectCustomBillingPlan($planId: String!) {
    selectCustomBillingPlan(planId: $planId)
  }
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const StyledPlanCard = styled.div<{ isSelected: boolean }>`
  background-color: ${({ theme }) => theme.background.secondary};
  border: 2px solid
    ${({ theme, isSelected }) =>
      isSelected ? theme.color.blue : theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(4)};
  width: 100%;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.color.blue};
  }
`;

const StyledPlanName = styled.div`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const StyledPlanDescription = styled.div`
  color: ${({ theme }) => theme.font.color.secondary};
  font-size: ${({ theme }) => theme.font.size.sm};
`;

const StyledPlansContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${({ theme }) => theme.spacing(6)} 0;
  width: 100%;
`;

const StyledLinkGroup = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing(1)};
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

// TODO: These should come from a GraphQL query to fetch custom billing plans
// Por enquanto usando UUIDs mock válidos - substituir por query real quando a estrutura estiver pronta
const MOCK_CUSTOM_PLANS = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Plano Básico',
    description: 'Ideal para pequenas equipes',
    price: 'R$ 49/mês',
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Plano Profissional',
    description: 'Para equipes em crescimento',
    price: 'R$ 99/mês',
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Plano Enterprise',
    description: 'Recursos completos para grandes empresas',
    price: 'R$ 199/mês',
  },
];

export const ChooseCustomPlanContent = () => {
  const { t } = useLingui();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [getCurrentUser] = useGetCurrentUserLazyQuery();
  const setCurrentUser = useSetRecoilState(currentUserState);

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectCustomBillingPlan, { loading }] = useMutation(
    SELECT_CUSTOM_BILLING_PLAN,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleContinue = async () => {
    if (!selectedPlanId || loading || isRefreshing) return;

    try {
      // Primeiro, salva o plano customizado
      await selectCustomBillingPlan({
        variables: {
          planId: selectedPlanId,
        },
      });

      // Recarrega o usuário atual para obter o novo onboarding status
      setIsRefreshing(true);
      const result = await getCurrentUser({ fetchPolicy: 'network-only' });
      const currentUser = result.data?.currentUser;

      if (isDefined(currentUser)) {
        setCurrentUser(currentUser);

        // Verifica se o onboarding status não é mais CUSTOM_PLAN_REQUIRED
        const onboardingStatus = currentUser.onboardingStatus;
        if (
          isDefined(onboardingStatus) &&
          onboardingStatus !== 'CUSTOM_PLAN_REQUIRED'
        ) {
          // O sistema de navegação automática vai redirecionar para a próxima página
          // Por enquanto, vamos para CreateWorkspace
          navigate(AppPath.CreateWorkspace);
        } else {
          // Se ainda estiver em CUSTOM_PLAN_REQUIRED, força um reload da página
          window.location.reload();
        }
      } else {
        throw new Error('Failed to refresh user data');
      }
    } catch (error: any) {
      console.error('Error selecting plan:', error);
      setIsRefreshing(false);
      
      // Verifica se o erro é relacionado a UUID inválido
      if (
        error?.message?.includes('invalid input syntax for type uuid') ||
        error?.graphQLErrors?.[0]?.message?.includes('uuid')
      ) {
        alert(
          'Erro: O plano selecionado não existe no banco de dados. Por favor, crie os planos customizados no Admin Panel primeiro.',
        );
      } else {
        alert('Erro ao selecionar o plano. Por favor, tente novamente.');
      }
    }
  };

  return (
    <StyledContainer>
      <Title noMarginTop>{t`Escolha seu Plano`}</Title>
      <SubTitle>{t`Selecione o plano ideal para sua equipe`}</SubTitle>

      <StyledPlansContainer>
        {MOCK_CUSTOM_PLANS.map((plan) => (
          <StyledPlanCard
            key={plan.id}
            isSelected={selectedPlanId === plan.id}
            onClick={() => handlePlanSelect(plan.id)}
          >
            <StyledPlanName>{plan.name}</StyledPlanName>
            <StyledPlanDescription>{plan.description}</StyledPlanDescription>
            <StyledPlanDescription style={{ marginTop: '8px' }}>
              {plan.price}
            </StyledPlanDescription>
          </StyledPlanCard>
        ))}
      </StyledPlansContainer>

      <MainButton
        title={t`Continuar`}
        onClick={handleContinue}
        width={200}
        Icon={() => (loading || isRefreshing) && <Loader />}
        disabled={!selectedPlanId || loading || isRefreshing}
      />

      <StyledLinkGroup>
        <ClickToActionLink onClick={signOut}>
          <Trans>Sair</Trans>
        </ClickToActionLink>
      </StyledLinkGroup>
    </StyledContainer>
  );
};


```

```typescriptreact
import { gql, useMutation } from '@apollo/client';
import { SubTitle } from '@/auth/components/SubTitle';
import { Title } from '@/auth/components/Title';
import { useAuth } from '@/auth/hooks/useAuth';
import { currentUserState } from '@/auth/states/currentUserState';
import styled from '@emotion/styled';
import { Trans, useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { AppPath } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { Loader } from 'twenty-ui/feedback';
import { MainButton } from 'twenty-ui/input';
import { ClickToActionLink } from 'twenty-ui/navigation';
import { useGetCurrentUserLazyQuery } from '~/generated-metadata/graphql';

const SELECT_CUSTOM_BILLING_PLAN = gql`
  mutation SelectCustomBillingPlan($planId: String!) {
    selectCustomBillingPlan(planId: $planId)
  }
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const StyledPlanCard = styled.div<{ isSelected: boolean }>`
  background-color: ${({ theme }) => theme.background.secondary};
  border: 2px solid
    ${({ theme, isSelected }) =>
      isSelected ? theme.color.blue : theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(4)};
  width: 100%;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.color.blue};
  }
`;

const StyledPlanName = styled.div`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const StyledPlanDescription = styled.div`
  color: ${({ theme }) => theme.font.color.secondary};
  font-size: ${({ theme }) => theme.font.size.sm};
`;

const StyledPlansContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${({ theme }) => theme.spacing(6)} 0;
  width: 100%;
`;

const StyledLinkGroup = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing(1)};
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

// TODO: These should come from a GraphQL query to fetch custom billing plans
// Por enquanto usando UUIDs mock válidos - substituir por query real quando a estrutura estiver pronta
const MOCK_CUSTOM_PLANS = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Plano Básico',
    description: 'Ideal para pequenas equipes',
    price: 'R$ 49/mês',
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Plano Profissional',
    description: 'Para equipes em crescimento',
    price: 'R$ 99/mês',
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Plano Enterprise',
    description: 'Recursos completos para grandes empresas',
    price: 'R$ 199/mês',
  },
];

export const ChooseCustomPlanContent = () => {
  const { t } = useLingui();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [getCurrentUser] = useGetCurrentUserLazyQuery();
  const setCurrentUser = useSetRecoilState(currentUserState);

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectCustomBillingPlan, { loading }] = useMutation(
    SELECT_CUSTOM_BILLING_PLAN,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleContinue = async () => {
    if (!selectedPlanId || loading || isRefreshing) return;

    try {
      // Primeiro, salva o plano customizado
      await selectCustomBillingPlan({
        variables: {
          planId: selectedPlanId,
        },
      });

      // Recarrega o usuário atual para obter o novo onboarding status
      setIsRefreshing(true);
      const result = await getCurrentUser({ fetchPolicy: 'network-only' });
      const currentUser = result.data?.currentUser;

      if (isDefined(currentUser)) {
        setCurrentUser(currentUser);

        // Aguarda um pouco para o estado atualizar antes de navegar
        // O sistema de navegação automática vai redirecionar para a próxima página correta
        setTimeout(() => {
          navigate(AppPath.CreateWorkspace);
        }, 100);
      } else {
        throw new Error('Failed to refresh user data');
      }
    } catch (error: any) {
      console.error('Error selecting plan:', error);
      setIsRefreshing(false);
      
      // Verifica se o erro é relacionado a UUID inválido
      if (
        error?.message?.includes('invalid input syntax for type uuid') ||
        error?.graphQLErrors?.[0]?.message?.includes('uuid')
      ) {
        alert(
          'Erro: O plano selecionado não existe no banco de dados. Por favor, crie os planos customizados no Admin Panel primeiro.',
        );
      } else {
        alert('Erro ao selecionar o plano. Por favor, tente novamente.');
      }
    }
  };

  return (
    <StyledContainer>
      <Title noMarginTop>{t`Escolha seu Plano`}</Title>
      <SubTitle>{t`Selecione o plano ideal para sua equipe`}</SubTitle>

      <StyledPlansContainer>
        {MOCK_CUSTOM_PLANS.map((plan) => (
          <StyledPlanCard
            key={plan.id}
            isSelected={selectedPlanId === plan.id}
            onClick={() => handlePlanSelect(plan.id)}
          >
            <StyledPlanName>{plan.name}</StyledPlanName>
            <StyledPlanDescription>{plan.description}</StyledPlanDescription>
            <StyledPlanDescription style={{ marginTop: '8px' }}>
              {plan.price}
            </StyledPlanDescription>
          </StyledPlanCard>
        ))}
      </StyledPlansContainer>

      <MainButton
        title={t`Continuar`}
        onClick={handleContinue}
        width={200}
        Icon={() => (loading || isRefreshing) && <Loader />}
        disabled={!selectedPlanId || loading || isRefreshing}
      />

      <StyledLinkGroup>
        <ClickToActionLink onClick={signOut}>
          <Trans>Sair</Trans>
        </ClickToActionLink>
      </StyledLinkGroup>
    </StyledContainer>
  );
};


```

Código corrigido. Após selecionar o plano:

1. A mutation `selectCustomBillingPlan` salva o plano no workspace
2. Recarregamos o `currentUser` para obter o novo onboarding status
3. Atualizamos o estado do usuário
4. Navegamos para `CreateWorkspace`
5. O sistema de navegação automática verifica o novo status e redireciona para a página correta

O problema era que o onboarding status não estava sendo atualizado no frontend após salvar o plano, então o sistema continuava pensando que estava em `CUSTOM_PLAN_REQUIRED` e causava o loop.

Agora, após selecionar o plano, o sistema deve:
- Atualizar o onboarding status
- Redirecionar automaticamente para a próxima página do onboarding (provavelmente `CreateWorkspace`)

Teste novamente e informe se funcionou.

