import { currentUserState } from '@/auth/states/currentUserState';
import { useApolloCoreClient } from '@/object-metadata/hooks/useApolloCoreClient';
import { SettingsAdminTabSkeletonLoader } from '@/settings/admin-panel/components/SettingsAdminTabSkeletonLoader';
import { SettingsAdminTableCard } from '@/settings/admin-panel/components/SettingsAdminTableCard';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { useMutation, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { t } from '@lingui/core/macro';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { H2Title } from 'twenty-ui/display';
import { Button } from 'twenty-ui/input';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    Section,
} from 'twenty-ui/layout';
import { DELETE_CUSTOM_BILLING_PLAN } from '../graphql/mutations/deleteCustomBillingPlan';
import { GET_CUSTOM_BILLING_PLANS } from '../graphql/queries/getCustomBillingPlans';
import {
    CREATE_PLAN_MODAL_ID,
    CustomBillingPlanFormModal,
    EDIT_PLAN_MODAL_ID,
} from './CustomBillingPlanFormModal';

const StyledHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const StyledCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing(4)};
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

const StyledPlanCard = styled(Card)`
  background-color: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const StyledCardHeader = styled(CardHeader)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(4)};
`;

const StyledPlanTitle = styled.h3`
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.font.color.primary};
  margin: 0;
`;

const StyledStatusBadge = styled.span<{ active: boolean }>`
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  background-color: ${({ theme, active }) =>
    active ? theme.color.green10 : theme.color.gray10};
  color: ${({ theme, active }) =>
    active ? theme.color.green11 : theme.color.gray11};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  display: inline-block;
  white-space: nowrap;
`;

const StyledCardContent = styled(CardContent)`
  flex: 1;
  padding: ${({ theme }) => theme.spacing(4)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const StyledInfoRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const StyledInfoLabel = styled.span`
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.font.color.tertiary};
`;

const StyledInfoValue = styled.span`
  font-size: ${({ theme }) => theme.font.size.md};
  color: ${({ theme }) => theme.font.color.primary};
`;

const StyledCardFooter = styled(CardFooter)`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  justify-content: flex-end;
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(4)};
  border-top: 1px solid ${({ theme }) => theme.border.color.medium};
`;

export const SettingsAdminCustomBillingPlans = () => {
  const currentUser = useRecoilValue(currentUserState);
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();
  const { openModal } = useModal();
  const apolloCoreClient = useApolloCoreClient();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const canAccessFullAdminPanel = currentUser?.canAccessFullAdminPanel;

  const { data, loading, error, refetch } = useQuery(GET_CUSTOM_BILLING_PLANS, {
    client: apolloCoreClient,
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
    skip: !canAccessFullAdminPanel,
    onError: (error) => {
      console.error('Error loading custom billing plans:', error);
      console.error('GraphQL Errors:', JSON.stringify(error.graphQLErrors, null, 2));
      console.error('Network Error:', error.networkError);
      if (error.networkError && 'result' in error.networkError) {
        console.error('Error response:', JSON.stringify(error.networkError.result, null, 2));
      }
      enqueueErrorSnackBar({
        apolloError: error,
      });
    },
  });

  const [deletePlan, { loading: deleteLoading }] = useMutation(
    DELETE_CUSTOM_BILLING_PLAN,
    {
      client: apolloCoreClient,
      onCompleted: () => {
        enqueueSuccessSnackBar({ message: t`Plano excluído com sucesso` });
        refetch();
      },
      onError: (error) => {
        enqueueErrorSnackBar({
          apolloError: error,
        });
      },
    },
  );

  if (!canAccessFullAdminPanel) {
    return (
      <Section>
        <SettingsAdminTableCard
          items={[
            {
              label: t`Acesso negado`,
              value: t`Você não tem permissão para acessar esta página`,
            },
          ]}
          rounded
        />
      </Section>
    );
  }

  if (loading) {
    return <SettingsAdminTabSkeletonLoader />;
  }

  if (error) {
    return (
      <Section>
        <SettingsAdminTableCard
          items={[
            {
              label: t`Erro ao carregar planos`,
              value: error.message || t`Verifique o console para mais detalhes`,
            },
          ]}
          rounded
        />
      </Section>
    );
  }

  const plans = data?.customBillingPlans || [];

  console.log('Plans data:', data);
  console.log('Plans array:', plans);
  console.log('Plans length:', plans.length);

  const handleDelete = async (id: string, name: string) => {
    if (
      confirm(
        t`Tem certeza que deseja excluir o plano "${name}"? Esta ação não pode ser desfeita.`,
      )
    ) {
      try {
        await deletePlan({ variables: { id } });
      } catch (error) {
        console.error('Error deleting plan:', error);
      }
    }
  };

  const formatPrice = (
    tiers: Array<{ upTo: number | null; unitAmount: number }>,
    currency: string = 'R$',
  ) => {
    if (tiers.length === 0) return t`Sem faixas de preço`;
    if (tiers.length === 1) {
      const tier = tiers[0];
      if (tier.upTo === null) {
        return `${currency} ${tier.unitAmount.toFixed(2)} ${t`por usuário (ilimitado)`}`;
      }
      return `${currency} ${tier.unitAmount.toFixed(2)} ${t`por usuário (até ${tier.upTo})`}`;
    }
    // Sort tiers by upTo (null last)
    const sortedTiers = [...tiers].sort((a, b) => {
      if (a.upTo === null) return 1;
      if (b.upTo === null) return -1;
      return a.upTo - b.upTo;
    });
    return sortedTiers
      .map((tier) => {
        if (tier.upTo === null) {
          return `${currency} ${tier.unitAmount.toFixed(2)} ${t`(ilimitado)`}`;
        }
        return `${currency} ${tier.unitAmount.toFixed(2)} ${t`(até ${tier.upTo})`}`;
      })
      .join(', ');
  };

  return (
    <>
      <Section>
        <StyledHeaderContainer>
          <H2Title
            title={t`Custom Billing Plans`}
            description={t`Gerencie os planos de assinatura customizados para o modo LOCAL de billing`}
          />
          <Button
            title={t`Criar Novo Plano`}
            variant="primary"
            onClick={() => openModal(CREATE_PLAN_MODAL_ID)}
          />
        </StyledHeaderContainer>

        {plans.length === 0 ? (
          <SettingsAdminTableCard
            items={[
              {
                label: t`Nenhum plano encontrado`,
                value: t`Crie seu primeiro plano customizado para começar`,
              },
            ]}
            rounded
          />
        ) : (
          <StyledCardsContainer>
            {plans.map((plan: any) => (
              <StyledPlanCard key={plan.id} rounded>
                <StyledCardHeader>
                  <StyledPlanTitle>{plan.name}</StyledPlanTitle>
                  <StyledStatusBadge active={plan.active}>
                    {plan.active ? t`Ativo` : t`Inativo`}
                  </StyledStatusBadge>
                </StyledCardHeader>
                <StyledCardContent>
                  {plan.description && (
                    <StyledInfoRow>
                      <StyledInfoLabel>{t`Descrição`}</StyledInfoLabel>
                      <StyledInfoValue>{plan.description}</StyledInfoValue>
                    </StyledInfoRow>
                  )}
                  <StyledInfoRow>
                    <StyledInfoLabel>{t`Moeda`}</StyledInfoLabel>
                    <StyledInfoValue>{plan.currency}</StyledInfoValue>
                  </StyledInfoRow>
                  <StyledInfoRow>
                    <StyledInfoLabel>{t`Intervalo`}</StyledInfoLabel>
                    <StyledInfoValue>
                      {plan.interval === 'Month' || plan.interval === 'month' ? t`Mensal` : t`Anual`}
                    </StyledInfoValue>
                  </StyledInfoRow>
                  <StyledInfoRow>
                    <StyledInfoLabel>{t`Preço`}</StyledInfoLabel>
                    <StyledInfoValue style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                      {plan.priceTiers && plan.priceTiers.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {(() => {
                            const sortedTiers = [...plan.priceTiers].sort(
                              (
                                a: { upTo: number | null },
                                b: { upTo: number | null },
                              ) => {
                                if (a.upTo === null) return 1;
                                if (b.upTo === null) return -1;
                                return a.upTo - b.upTo;
                              },
                            );
                            return sortedTiers.map(
                              (
                                tier: {
                                  id?: string;
                                  upTo: number | null;
                                  unitAmount: number;
                                },
                                idx: number,
                              ) => (
                                <div key={tier.id || idx}>
                                  {tier.upTo === null
                                    ? `${plan.currency} ${tier.unitAmount.toFixed(2)} ${t`por usuário (ilimitado)`}`
                                    : `${plan.currency} ${tier.unitAmount.toFixed(2)} ${t`por usuário (1-${tier.upTo})`}`}
                                </div>
                              ),
                            );
                          })()}
                        </div>
                      ) : (
                        t`Sem faixas de preço`
                      )}
                    </StyledInfoValue>
                  </StyledInfoRow>
                  {plan.workspaceCount !== undefined && (
                    <StyledInfoRow>
                      <StyledInfoLabel>{t`Workspaces`}</StyledInfoLabel>
                      <StyledInfoValue>
                        {plan.workspaceCount} {plan.workspaceCount === 1 ? t`workspace` : t`workspaces`}
                      </StyledInfoValue>
                    </StyledInfoRow>
                  )}
                  {plan.trialPeriodDays && (
                    <StyledInfoRow>
                      <StyledInfoLabel>{t`Período de Teste`}</StyledInfoLabel>
                      <StyledInfoValue>
                        {plan.trialPeriodDays} {t`dias`}
                      </StyledInfoValue>
                    </StyledInfoRow>
                  )}
                  {plan.paymentGateway && (
                    <StyledInfoRow>
                      <StyledInfoLabel>{t`Gateway de Pagamento`}</StyledInfoLabel>
                      <StyledInfoValue>{plan.paymentGateway}</StyledInfoValue>
                    </StyledInfoRow>
                  )}
                </StyledCardContent>
                <StyledCardFooter>
                  <Button
                    title={t`Editar`}
                    variant="secondary"
                    onClick={() => {
                      setSelectedPlan(plan);
                      openModal(EDIT_PLAN_MODAL_ID);
                    }}
                  />
                  <Button
                    title={t`Excluir`}
                    variant="secondary"
                    accent="danger"
                    onClick={() => handleDelete(plan.id, plan.name)}
                    disabled={deleteLoading}
                  />
                </StyledCardFooter>
              </StyledPlanCard>
            ))}
          </StyledCardsContainer>
        )}
      </Section>

      <CustomBillingPlanFormModal
        modalId={CREATE_PLAN_MODAL_ID}
        plan={null}
        onSuccess={() => refetch()}
      />

      <CustomBillingPlanFormModal
        modalId={EDIT_PLAN_MODAL_ID}
        plan={selectedPlan}
        onSuccess={() => {
          setSelectedPlan(null);
          refetch();
        }}
      />
    </>
  );
};


