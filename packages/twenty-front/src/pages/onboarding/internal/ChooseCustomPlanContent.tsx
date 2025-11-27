import { SubTitle } from '@/auth/components/SubTitle';
import { Title } from '@/auth/components/Title';
import { useAuth } from '@/auth/hooks/useAuth';
import { currentUserState } from '@/auth/states/currentUserState';
import { gql, useMutation, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { Trans, useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { AppPath } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { Loader } from 'twenty-ui/feedback';
import { MainButton } from 'twenty-ui/input';
import { ClickToActionLink } from 'twenty-ui/navigation';
import { useGetCurrentUserLazyQuery } from '~/generated-metadata/graphql';
import { GET_ACTIVE_CUSTOM_BILLING_PLANS } from './graphql/queries/getActiveCustomBillingPlans';

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
  max-width: 100%;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing(4)};
  min-height: auto;
  overflow-x: hidden;
  overflow-y: visible;
  box-sizing: border-box;
`;

const StyledPlansContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.spacing(6)};
  width: 100%;
  max-width: 1400px;
  margin: ${({ theme }) => theme.spacing(6)} auto;
  padding: ${({ theme }) => theme.spacing(2)};
  align-items: stretch;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing(4)};
    max-width: 100%;
  }
`;

const StyledPlanBlock = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.background.secondary};
  border: 2px solid ${({ theme }) => theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
`;

const StyledPlanBlockHeader = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing(5)} ${({ theme }) => theme.spacing(4)};
  background: linear-gradient(135deg, ${({ theme }) => theme.color.blue10} 0%, ${({ theme }) => theme.color.blue11} 100%);
  color: ${({ theme }) => theme.color.blue11};
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
`;

const StyledPlanBlockTitle = styled.h2`
  font-size: ${({ theme }) => theme.font.size.xxl};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.color.blue11};
  margin: 0 0 ${({ theme }) => theme.spacing(2)} 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: -0.5px;
`;

const StyledPlanBlockDescription = styled.p`
  font-size: ${({ theme }) => theme.font.size.md};
  color: ${({ theme }) => theme.color.blue11};
  margin: 0;
  opacity: 0.95;
  font-weight: ${({ theme }) => theme.font.weight.medium};
  line-height: 1.5;
`;

const StyledFeaturesSection = styled.div`
  padding: ${({ theme }) => theme.spacing(4)};
  background: ${({ theme }) => theme.background.tertiary};
  border-bottom: 1px solid ${({ theme }) => theme.border.color.medium};
  box-sizing: border-box;
  overflow: hidden;
  width: 100%;
  flex-shrink: 0;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const StyledFeaturesTitle = styled.h3`
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.font.color.primary};
  margin: 0 0 ${({ theme }) => theme.spacing(3)} 0;
  text-align: center;
`;

const StyledTiersContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: ${({ theme }) => theme.spacing(4)};
  gap: ${({ theme }) => theme.spacing(2)};
  box-sizing: border-box;
  overflow: hidden;
  flex: 1;
  min-height: 0;
`;

const StyledTierRow = styled.div<{ isFirst: boolean }>`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(3)};
  background: ${({ theme, isFirst }) =>
    isFirst
      ? `linear-gradient(135deg, ${theme.color.blue10}10 0%, ${theme.color.blue11}5 100%)`
      : theme.background.primary};
  border: 1px solid ${({ theme, isFirst }) =>
    isFirst ? theme.color.blue10 : theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  min-width: 0;
  overflow: hidden;

  ${({ isFirst, theme }) =>
    isFirst &&
    `
    border-left: 4px solid ${theme.color.blue10};
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
  `}

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing(2)};
    text-align: center;
    padding: ${({ theme }) => theme.spacing(3)};
  }
`;

const StyledTierRange = styled.div<{ isFirst: boolean }>`
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme, isFirst }) =>
    isFirst ? theme.color.blue11 : theme.font.color.primary};
  display: flex;
  align-items: center;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledTierArrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.color.blue11};
  font-size: 20px;
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  flex-shrink: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledTierPriceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  min-width: 0;
  overflow: hidden;

  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
  }
`;

const StyledTierPriceValue = styled.div<{ isFirst: boolean }>`
  font-size: ${({ theme }) => theme.font.size.xl};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme, isFirst }) =>
    isFirst ? theme.color.blue11 : theme.font.color.primary};
  line-height: 1.2;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledTierPriceLabel = styled.div<{ isFirst: boolean }>`
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme, isFirst }) =>
    isFirst ? theme.color.blue11 : theme.font.color.tertiary};
  margin-top: ${({ theme }) => theme.spacing(0.5)};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StyledTierPricePeriod = styled.span<{ isFirst: boolean }>`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme, isFirst }) =>
    isFirst ? theme.color.blue11 : theme.font.color.secondary};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  margin-left: ${({ theme }) => theme.spacing(1)};
`;

const StyledFeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing(2)};
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StyledFeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.font.color.secondary};

  &::before {
    content: '✓';
    color: ${({ theme }) => theme.color.green11};
    font-weight: ${({ theme }) => theme.font.weight.semiBold};
    margin-right: ${({ theme }) => theme.spacing(2)};
    flex-shrink: 0;
  }
`;

const StyledButtonContainer = styled.div`
  padding: ${({ theme }) => theme.spacing(4)};
  border-top: 1px solid ${({ theme }) => theme.border.color.medium};
  background: ${({ theme }) => theme.background.tertiary};
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  flex-shrink: 0;
  margin-top: auto;
`;

const StyledSelectButton = styled(MainButton)`
  min-width: 200px;
  background: linear-gradient(135deg, ${({ theme }) => theme.color.blue10} 0%, ${({ theme }) => theme.color.blue11} 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
`;

const StyledHeaderWrapper = styled.div`
  width: 100%;
  text-align: center;
  user-select: none;
`;

const StyledLinkGroup = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing(1)};
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

const formatPriceTiers = (
  tiers: Array<{ upTo: number | null; unitAmount: number }>,
  currency: string,
) => {
  if (tiers.length === 0) return null;

  const sortedTiers = [...tiers].sort((a, b) => {
    if (a.upTo === null) return 1;
    if (b.upTo === null) return -1;
    return a.upTo - b.upTo;
  });

  return sortedTiers.map((tier, index) => {
    const from = index === 0 ? 1 : (sortedTiers[index - 1].upTo || 0) + 1;
    const to = tier.upTo;
    const range =
      to === null
        ? `${from}+ usuários`
        : from === to
          ? `${from} usuário`
          : `${from} - ${to} usuários`;
    const price = tier.unitAmount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return { range, price, tier };
  });
};

export const ChooseCustomPlanContent = () => {
  const { t } = useLingui();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [getCurrentUser] = useGetCurrentUserLazyQuery();
  const setCurrentUser = useSetRecoilState(currentUserState);

  const { data, loading: plansLoading } = useQuery(GET_ACTIVE_CUSTOM_BILLING_PLANS, {
    fetchPolicy: 'network-only',
  });

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectCustomBillingPlan, { loading }] = useMutation(
    SELECT_CUSTOM_BILLING_PLAN,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const plans = data?.activeCustomBillingPlans || [];

  const handlePlanSelect = async (planId: string) => {
    if (loading || isRefreshing) return;

    setSelectedPlanId(planId);

    try {
      await selectCustomBillingPlan({
        variables: {
          planId,
        },
      });

      setIsRefreshing(true);
      const result = await getCurrentUser({ fetchPolicy: 'network-only' });
      const currentUser = result.data?.currentUser;

      if (isDefined(currentUser)) {
        setCurrentUser(currentUser);

        setTimeout(() => {
          navigate(AppPath.CreateWorkspace);
        }, 100);
      } else {
        throw new Error('Failed to refresh user data');
      }
    } catch (error: any) {
      console.error('Error selecting plan:', error);
      setIsRefreshing(false);
      setSelectedPlanId(null);

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
      <StyledHeaderWrapper>
        <Title noMarginTop>{t`Escolha seu Plano`}</Title>
        <SubTitle>{t`Selecione o plano ideal para sua equipe`}</SubTitle>
      </StyledHeaderWrapper>

      {plansLoading ? (
        <StyledPlansContainer>
          <div style={{ textAlign: 'center', width: '100%' }}>
            <Loader />
            <div style={{ marginTop: '16px' }}>{t`Carregando planos...`}</div>
          </div>
        </StyledPlansContainer>
      ) : plans.length === 0 ? (
        <StyledPlansContainer>
          <div style={{ textAlign: 'center', width: '100%', padding: '48px' }}>
            <div style={{ color: '#888', fontSize: '14px' }}>
              {t`Nenhum plano disponível. Por favor, crie planos no Admin Panel primeiro.`}
            </div>
          </div>
        </StyledPlansContainer>
      ) : (
        <StyledPlansContainer>
          {plans.map((plan: any, planIndex: number) => {
            const priceTiers = formatPriceTiers(
              plan.priceTiers || [],
              plan.currency || 'BRL',
            );
            const intervalText = plan.interval === 'Month' || plan.interval === 'month' ? 'mês' : 'ano';
            const features = Array.isArray(plan.features) ? plan.features.filter((f: any) => f && typeof f === 'string' && f.trim() !== '') : [];

            if (!priceTiers || priceTiers.length === 0) {
              return null;
            }

            return (
              <StyledPlanBlock key={plan.id}>
                <StyledPlanBlockHeader>
                  <StyledPlanBlockTitle>{plan.name}</StyledPlanBlockTitle>
                  {plan.description && (
                    <StyledPlanBlockDescription>{plan.description}</StyledPlanBlockDescription>
                  )}
                </StyledPlanBlockHeader>

                <StyledFeaturesSection>
                  {features && features.length > 0 ? (
                    <>
                      <StyledFeaturesTitle>{t`Recursos Inclusos`}</StyledFeaturesTitle>
                      <StyledFeaturesList>
                        {features
                          .filter((feature: string) => feature && feature.trim() !== '')
                          .map((feature: string, idx: number) => (
                            <StyledFeatureItem key={idx}>{feature}</StyledFeatureItem>
                          ))}
                      </StyledFeaturesList>
                    </>
                  ) : (
                    <div style={{ flex: 1 }} />
                  )}
                </StyledFeaturesSection>

                <StyledTiersContainer>
                  {priceTiers.map((tierData: any, tierIndex: number) => {
                    const isFirst = tierIndex === 0;
                    const isLast = tierIndex === priceTiers.length - 1;

                    return (
                      <StyledTierRow key={tierIndex} isFirst={isFirst}>
                        <StyledTierRange isFirst={isFirst}>
                          {tierData.range}
                        </StyledTierRange>
                        {!isLast ? (
                          <StyledTierArrow>→</StyledTierArrow>
                        ) : (
                          <div style={{ width: '20px' }} />
                        )}
                        <StyledTierPriceWrapper>
                          <StyledTierPriceValue isFirst={isFirst}>
                            {tierData.price}
                            <StyledTierPricePeriod isFirst={isFirst}>/{intervalText}</StyledTierPricePeriod>
                          </StyledTierPriceValue>
                          <StyledTierPriceLabel isFirst={isFirst}>
                            {t`Preço por usuário`}
                          </StyledTierPriceLabel>
                        </StyledTierPriceWrapper>
                      </StyledTierRow>
                    );
                  })}
                </StyledTiersContainer>

                <StyledButtonContainer>
                  <StyledSelectButton
                    title={t`Escolher este plano`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlanSelect(plan.id);
                    }}
                    disabled={loading || isRefreshing || plansLoading}
                    Icon={() =>
                      (loading || isRefreshing || plansLoading) &&
                      selectedPlanId === plan.id && <Loader />
                    }
                  />
                </StyledButtonContainer>
              </StyledPlanBlock>
            );
          })}
        </StyledPlansContainer>
      )}

      <StyledLinkGroup>
        <ClickToActionLink onClick={signOut}>
          <Trans>Sair</Trans>
        </ClickToActionLink>
      </StyledLinkGroup>
    </StyledContainer>
  );
};
