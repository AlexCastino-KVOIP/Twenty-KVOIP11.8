import { currentUserState } from '@/auth/states/currentUserState';
import { SettingsAdminTabSkeletonLoader } from '@/settings/admin-panel/components/SettingsAdminTabSkeletonLoader';
import { SettingsAdminTableCard } from '@/settings/admin-panel/components/SettingsAdminTableCard';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { Table } from '@/ui/layout/table/components/Table';
import { TableBody } from '@/ui/layout/table/components/TableBody';
import { TableCell } from '@/ui/layout/table/components/TableCell';
import { TableHeader } from '@/ui/layout/table/components/TableHeader';
import { TableRow } from '@/ui/layout/table/components/TableRow';
import styled from '@emotion/styled';
import { t } from '@lingui/core/macro';
import { useMutation, useQuery } from '@apollo/client';
import { useRecoilValue } from 'recoil';
import { H2Title } from 'twenty-ui/display';
import { Button } from 'twenty-ui/input';
import { Section } from 'twenty-ui/layout';
import { DELETE_CUSTOM_BILLING_PLAN } from '../graphql/mutations/deleteCustomBillingPlan';
import { GET_CUSTOM_BILLING_PLANS } from '../graphql/queries/getCustomBillingPlans';

const StyledHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const StyledTableContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

const StyledStatusBadge = styled.span<{ active: boolean }>`
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  background-color: ${({ theme, active }) =>
    active ? theme.color.success : theme.color.gray20};
  color: ${({ theme, active }) =>
    active ? theme.color.successLight : theme.color.gray50};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;

const StyledActionsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const SettingsAdminCustomBillingPlans = () => {
  const currentUser = useRecoilValue(currentUserState);
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();

  const canAccessFullAdminPanel = currentUser?.canAccessFullAdminPanel;

  const { data, loading, error, refetch } = useQuery(GET_CUSTOM_BILLING_PLANS, {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
    skip: !canAccessFullAdminPanel,
    onError: (error) => {
      console.error('Error loading custom billing plans:', error);
      enqueueErrorSnackBar({
        apolloError: error,
      });
    },
  });

  const [deletePlan, { loading: deleteLoading }] = useMutation(
    DELETE_CUSTOM_BILLING_PLAN,
    {
      onCompleted: () => {
        enqueueSuccessSnackBar(t`Plano excluído com sucesso`);
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

  const formatPrice = (tiers: Array<{ upTo: number | null; unitAmount: number }>) => {
    if (tiers.length === 0) return '-';
    if (tiers.length === 1) {
      return `R$ ${tiers[0].unitAmount.toFixed(2)}`;
    }
    return `${tiers.length} tiers`;
  };

  return (
    <>
      <Section>
        <StyledHeaderContainer>
          <H2Title
            title={t`Custom Billing Plans`}
            description={t`Gerencie os planos de assinatura customizados para o modo LOCAL de billing`}
          />
          <Button title={t`Criar Novo Plano`} variant="primary" />
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
          <StyledTableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>{t`Nome`}</TableCell>
                  <TableCell>{t`Descrição`}</TableCell>
                  <TableCell>{t`Moeda`}</TableCell>
                  <TableCell>{t`Intervalo`}</TableCell>
                  <TableCell>{t`Preço`}</TableCell>
                  <TableCell>{t`Status`}</TableCell>
                  <TableCell>{t`Ações`}</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan: any) => (
                  <TableRow key={plan.id}>
                    <TableCell>{plan.name}</TableCell>
                    <TableCell>{plan.description || '-'}</TableCell>
                    <TableCell>{plan.currency}</TableCell>
                    <TableCell>{plan.interval}</TableCell>
                    <TableCell>{formatPrice(plan.priceTiers || [])}</TableCell>
                    <TableCell>
                      <StyledStatusBadge active={plan.active}>
                        {plan.active ? t`Ativo` : t`Inativo`}
                      </StyledStatusBadge>
                    </TableCell>
                    <TableCell>
                      <StyledActionsContainer>
                        <Button
                          title={t`Editar`}
                          variant="secondary"
                        />
                        <Button
                          title={t`Excluir`}
                          variant="secondary"
                          accent="red"
                          onClick={() => handleDelete(plan.id, plan.name)}
                          disabled={deleteLoading}
                        />
                      </StyledActionsContainer>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        )}
      </Section>
    </>
  );
};

