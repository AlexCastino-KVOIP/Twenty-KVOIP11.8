import { useLingui } from '@lingui/react/macro';
import { useRecoilValue } from 'recoil';

import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { SettingsBillingContentLocal } from '@/billing/components/SettingsBillingContentLocal';
import { SettingsBillingCreditsSection } from '@/billing/components/SettingsBillingCreditsSection';
import { SettingsBillingSubscriptionInfo } from '@/billing/components/SettingsBillingSubscriptionInfo';
import { useGetWorkflowNodeExecutionUsage } from '@/billing/hooks/useGetWorkflowNodeExecutionUsage';
import { useRedirect } from '@/domain-manager/hooks/useRedirect';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { useSubscriptionStatus } from '@/workspace/hooks/useSubscriptionStatus';
import { isDefined } from 'twenty-shared/utils';
import { H2Title, IconCircleX, IconCreditCard } from 'twenty-ui/display';
import { Button } from 'twenty-ui/input';
import { Section } from 'twenty-ui/layout';
import {
    SubscriptionStatus,
    useBillingPortalSessionQuery,
} from '~/generated-metadata/graphql';

export const SettingsBillingContent = () => {
  const { t } = useLingui();
  const { redirect } = useRedirect();
  const currentWorkspace = useRecoilValue(currentWorkspaceState);

  // Se o workspace tem customBillingPlanId, usar modo LOCAL
  // TEMPORÁRIO: Para testar, adicione ?local=true na URL
  const urlParams = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams();
  const forceLocal = urlParams.get('local') === 'true';

  const useLocalBilling = forceLocal || isDefined(
    currentWorkspace?.customBillingPlanId,
  );

  // Debug: log para verificar o estado
  if (forceLocal) {
    console.log('🔍 [Billing] Forçando modo LOCAL via parâmetro ?local=true');
    console.log('🔍 [Billing] currentWorkspace?.customBillingPlanId:', currentWorkspace?.customBillingPlanId);
  }

  if (useLocalBilling) {
    return <SettingsBillingContentLocal />;
  }

  const subscriptions = currentWorkspace?.billingSubscriptions;

  const hasSubscriptions = (subscriptions?.length ?? 0) > 0;

  const subscriptionStatus = useSubscriptionStatus();

  const { isGetMeteredProductsUsageQueryLoaded } =
    useGetWorkflowNodeExecutionUsage();

  const hasNotCanceledCurrentSubscription =
    isDefined(subscriptionStatus) &&
    subscriptionStatus !== SubscriptionStatus.Canceled;

  const { data, loading } = useBillingPortalSessionQuery({
    variables: {
      returnUrlPath: '/settings/billing',
    },
    skip: !hasSubscriptions,
  });

  const billingPortalButtonDisabled =
    loading || !isDefined(data) || !isDefined(data.billingPortalSession.url);

  const openBillingPortal = () => {
    if (isDefined(data) && isDefined(data.billingPortalSession.url)) {
      redirect(data.billingPortalSession.url);
    }
  };

  return (
    <SettingsPageContainer>
      {hasNotCanceledCurrentSubscription &&
        currentWorkspace &&
        currentWorkspace.currentBillingSubscription && (
          <SettingsBillingSubscriptionInfo
            currentWorkspace={currentWorkspace}
            currentBillingSubscription={
              currentWorkspace.currentBillingSubscription
            }
          />
        )}
      {hasNotCanceledCurrentSubscription &&
        currentWorkspace &&
        currentWorkspace.currentBillingSubscription &&
        isGetMeteredProductsUsageQueryLoaded && (
          <SettingsBillingCreditsSection
            currentBillingSubscription={
              currentWorkspace.currentBillingSubscription
            }
          />
        )}
      <Section>
        <H2Title
          title={t`Manage billing information`}
          description={t`Edit payment method, see your invoices and more`}
        />
        <Button
          Icon={IconCreditCard}
          title={t`View billing details`}
          variant="secondary"
          onClick={openBillingPortal}
          disabled={billingPortalButtonDisabled}
        />
      </Section>
      {hasNotCanceledCurrentSubscription && (
        <Section>
          <H2Title
            title={t`Cancel your subscription`}
            description={t`Your workspace will be disabled`}
          />
          <Button
            Icon={IconCircleX}
            title={t`Cancel Plan`}
            variant="secondary"
            accent="danger"
            onClick={openBillingPortal}
            disabled={billingPortalButtonDisabled}
          />
        </Section>
      )}
    </SettingsPageContainer>
  );
};
