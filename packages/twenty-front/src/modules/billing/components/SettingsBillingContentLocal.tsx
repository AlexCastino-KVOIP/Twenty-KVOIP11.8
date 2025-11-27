import { useLingui } from '@lingui/react/macro';
import { useRecoilValue } from 'recoil';

import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { useApolloCoreClient } from '@/object-metadata/hooks/useApolloCoreClient';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { H2Title } from 'twenty-ui/display';
import { Loader } from 'twenty-ui/feedback';
import { Section } from 'twenty-ui/layout';
import { GET_CURRENT_WORKSPACE_CUSTOM_BILLING_PLAN } from '../graphql/queries/getCurrentWorkspaceCustomBillingPlan';

const StyledPlanCard = styled.div`
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  padding: ${({ theme }) => theme.spacing(4)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  position: relative;
  overflow: hidden;
`;

const StyledProgressContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 8px;
  background: ${({ theme }) => theme.background.tertiary};
  overflow: hidden;
  border-radius: 0 0 ${({ theme }) => theme.border.radius.md}
    ${({ theme }) => theme.border.radius.md};
`;

const StyledProgressWave = styled.div<{ percentage: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: ${({ percentage }) => percentage}%;
  height: 100%;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.color.blue10} 0%,
    ${({ theme }) => theme.color.blue11} 50%,
    ${({ theme }) => theme.color.blue10} 100%
  );
  background-size: 200% 100%;
  animation: wave 3s ease-in-out infinite, fill 1s ease-out;
  border-radius: 0 0 ${({ theme }) => theme.border.radius.md}
    ${({ theme }) => theme.border.radius.md};

  @keyframes wave {
    0%,
    100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  @keyframes fill {
    from {
      width: 0%;
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: 0;
    width: 100%;
    height: 200%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.2) 50%,
      transparent 100%
    );
    animation: shine 2s ease-in-out infinite;
  }

  @keyframes shine {
    0%,
    100% {
      transform: translateX(-100%);
    }
    50% {
      transform: translateX(100%);
    }
  }
`;

const StyledUpgradeMessageCard = styled.div`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.color.blue10}15 0%,
    ${({ theme }) => theme.color.blue11}20 100%
  );
  border: 2px solid ${({ theme }) => theme.color.blue10};
  border-radius: ${({ theme }) => theme.border.radius.md};
  padding: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-color: ${({ theme }) => theme.color.blue10};
    }
    50% {
      box-shadow: 0 4px 20px ${({ theme }) => theme.color.blue10}60;
      border-color: ${({ theme }) => theme.color.blue11};
    }
  }
`;

const StyledUpgradeMessageContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledUpgradeMessageIcon = styled.div`
  font-size: ${({ theme }) => theme.font.size.xl};
  color: ${({ theme }) => theme.color.blue10};
  flex-shrink: 0;
`;

const StyledUpgradeMessageText = styled.div`
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.font.color.primary};
  line-height: 1.5;
`;

const StyledPlanHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  padding-bottom: ${({ theme }) => theme.spacing(4)};
  border-bottom: 1px solid ${({ theme }) => theme.border.color.medium};
`;

const StyledPlanName = styled.h3`
  font-size: ${({ theme }) => theme.font.size.xl};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.font.color.primary};
  margin: 0;
`;

const StyledPlanDescription = styled.p`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.font.color.secondary};
  margin: ${({ theme }) => theme.spacing(2)} 0 0 0;
`;

const StyledInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(2)} 0;
  border-bottom: 1px solid ${({ theme }) => theme.border.color.light};

  &:last-child {
    border-bottom: none;
  }
`;

const StyledInfoLabel = styled.span`
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.font.color.secondary};
`;

const StyledInfoValue = styled.span`
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.font.color.primary};
`;

const StyledTierCard = styled.div<{ isActive: boolean; percentage: number }>`
  position: relative;
  background: ${({ theme, isActive }) =>
    isActive ? theme.background.primary : theme.background.primary};
  border: 2px solid
    ${({ theme, isActive }) =>
      isActive ? theme.color.blue10 : theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  padding: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  border-left: ${({ theme, isActive }) =>
    isActive ? `4px solid ${theme.color.blue10}` : 'none'};
  overflow: hidden;
  box-sizing: border-box;

  ${({ isActive, percentage, theme }) =>
    isActive &&
    `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: ${percentage}%;
      height: 100%;
      background:
        linear-gradient(
          90deg,
          ${theme.color.blue10}30 0%,
          ${theme.color.blue11}40 50%,
          ${theme.color.blue10}35 100%
        );
      background-size: 200% 100%;
      animation: waveHorizontal 4s linear infinite, fillHorizontal 1.5s ease-out;
      z-index: 0;
      border-radius: ${theme.border.radius.md} 0 0 ${theme.border.radius.md};
      box-sizing: border-box;
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: ${percentage}%;
      height: 100%;
      background:
        linear-gradient(
          90deg,
          transparent 0%,
          ${theme.background.transparent.strong} 40%,
          ${theme.background.transparent.medium} 60%,
          transparent 100%
        );
      animation: waterWave 3s linear infinite;
      z-index: 1;
      pointer-events: none;
      border-radius: ${theme.border.radius.md} 0 0 ${theme.border.radius.md};
      mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 200' preserveAspectRatio='none'%3E%3Cpath d='M0,100 Q150,50 300,100 T600,100 L600,200 L0,200 Z' fill='black'/%3E%3C/svg%3E");
      mask-size: 300% 100%;
      mask-repeat: repeat-x;
      mask-position: 0% 0;
      box-sizing: border-box;
      overflow: hidden;
    }

    @keyframes waveHorizontal {
      0% {
        background-position: 0% 0%;
      }
      100% {
        background-position: 200% 0%;
      }
    }

    @keyframes fillHorizontal {
      from {
        width: 0%;
      }
    }

    @keyframes waterWave {
      0% {
        mask-position: 0% 0;
      }
      100% {
        mask-position: 300% 0;
      }
    }

    @keyframes waterEdge {
      0% {
        clip-path: polygon(
          0% 0%,
          ${percentage}% 0%,
          ${percentage + 6}% 3%,
          ${percentage + 4}% 8%,
          ${percentage + 7}% 13%,
          ${percentage + 3}% 18%,
          ${percentage + 6}% 23%,
          ${percentage + 2}% 28%,
          ${percentage + 7}% 33%,
          ${percentage + 1}% 38%,
          ${percentage + 6}% 43%,
          ${percentage}% 48%,
          ${percentage + 7}% 53%,
          ${percentage + 1}% 58%,
          ${percentage + 6}% 63%,
          ${percentage + 2}% 68%,
          ${percentage + 7}% 73%,
          ${percentage + 3}% 78%,
          ${percentage + 6}% 83%,
          ${percentage + 4}% 88%,
          ${percentage + 7}% 93%,
          ${percentage + 5}% 97%,
          ${percentage + 6}% 100%,
          0% 100%
        );
      }
      12.5% {
        clip-path: polygon(
          0% 0%,
          ${percentage}% 0%,
          ${percentage + 5}% 4%,
          ${percentage + 7}% 9%,
          ${percentage + 4}% 14%,
          ${percentage + 6}% 19%,
          ${percentage + 3}% 24%,
          ${percentage + 7}% 29%,
          ${percentage + 2}% 34%,
          ${percentage + 6}% 39%,
          ${percentage + 1}% 44%,
          ${percentage + 7}% 49%,
          ${percentage}% 54%,
          ${percentage + 6}% 59%,
          ${percentage + 1}% 64%,
          ${percentage + 7}% 69%,
          ${percentage + 2}% 74%,
          ${percentage + 6}% 79%,
          ${percentage + 3}% 84%,
          ${percentage + 7}% 89%,
          ${percentage + 4}% 94%,
          ${percentage + 5}% 98%,
          ${percentage + 6}% 100%,
          0% 100%
        );
      }
      25% {
        clip-path: polygon(
          0% 0%,
          ${percentage}% 0%,
          ${percentage + 3}% 5%,
          ${percentage + 6}% 10%,
          ${percentage + 2}% 15%,
          ${percentage + 5}% 20%,
          ${percentage + 1}% 25%,
          ${percentage + 6}% 30%,
          ${percentage}% 35%,
          ${percentage + 5}% 40%,
          ${percentage + 1}% 45%,
          ${percentage + 6}% 50%,
          ${percentage + 2}% 55%,
          ${percentage + 5}% 60%,
          ${percentage + 3}% 65%,
          ${percentage + 6}% 70%,
          ${percentage + 4}% 75%,
          ${percentage + 5}% 80%,
          ${percentage + 6}% 85%,
          ${percentage + 4}% 90%,
          ${percentage + 5}% 95%,
          ${percentage + 3}% 100%,
          0% 100%
        );
      }
      37.5% {
        clip-path: polygon(
          0% 0%,
          ${percentage}% 0%,
          ${percentage + 1}% 6%,
          ${percentage + 4}% 11%,
          ${percentage}% 16%,
          ${percentage + 3}% 21%,
          ${percentage - 1}% 26%,
          ${percentage + 4}% 31%,
          ${percentage}% 36%,
          ${percentage + 3}% 41%,
          ${percentage - 1}% 46%,
          ${percentage + 4}% 51%,
          ${percentage}% 56%,
          ${percentage + 3}% 61%,
          ${percentage - 1}% 66%,
          ${percentage + 4}% 71%,
          ${percentage}% 76%,
          ${percentage + 3}% 81%,
          ${percentage - 1}% 86%,
          ${percentage + 4}% 91%,
          ${percentage + 1}% 96%,
          ${percentage}% 100%,
          0% 100%
        );
      }
      50% {
        clip-path: polygon(
          0% 0%,
          ${percentage}% 0%,
          ${percentage - 1}% 5%,
          ${percentage + 2}% 10%,
          ${percentage - 2}% 15%,
          ${percentage + 1}% 20%,
          ${percentage - 3}% 25%,
          ${percentage + 2}% 30%,
          ${percentage - 2}% 35%,
          ${percentage + 1}% 40%,
          ${percentage - 3}% 45%,
          ${percentage + 2}% 50%,
          ${percentage - 2}% 55%,
          ${percentage + 1}% 60%,
          ${percentage - 3}% 65%,
          ${percentage + 2}% 70%,
          ${percentage - 2}% 75%,
          ${percentage + 1}% 80%,
          ${percentage - 3}% 85%,
          ${percentage + 2}% 90%,
          ${percentage - 1}% 95%,
          ${percentage}% 100%,
          0% 100%
        );
      }
      62.5% {
        clip-path: polygon(
          0% 0%,
          ${percentage}% 0%,
          ${percentage - 3}% 4%,
          ${percentage}% 9%,
          ${percentage - 4}% 14%,
          ${percentage - 1}% 19%,
          ${percentage - 3}% 24%,
          ${percentage}% 29%,
          ${percentage - 4}% 34%,
          ${percentage - 1}% 39%,
          ${percentage - 3}% 44%,
          ${percentage}% 49%,
          ${percentage - 4}% 54%,
          ${percentage - 1}% 59%,
          ${percentage - 3}% 64%,
          ${percentage}% 69%,
          ${percentage - 4}% 74%,
          ${percentage - 1}% 79%,
          ${percentage - 3}% 84%,
          ${percentage}% 89%,
          ${percentage - 2}% 94%,
          ${percentage - 1}% 98%,
          ${percentage}% 100%,
          0% 100%
        );
      }
      75% {
        clip-path: polygon(
          0% 0%,
          ${percentage}% 0%,
          ${percentage - 2}% 6%,
          ${percentage - 4}% 11%,
          ${percentage - 1}% 16%,
          ${percentage - 3}% 21%,
          ${percentage - 2}% 26%,
          ${percentage - 4}% 31%,
          ${percentage - 1}% 36%,
          ${percentage - 3}% 41%,
          ${percentage - 2}% 46%,
          ${percentage - 4}% 51%,
          ${percentage - 1}% 56%,
          ${percentage - 3}% 61%,
          ${percentage - 2}% 66%,
          ${percentage - 4}% 71%,
          ${percentage - 1}% 76%,
          ${percentage - 3}% 81%,
          ${percentage - 2}% 86%,
          ${percentage - 4}% 91%,
          ${percentage - 2}% 96%,
          ${percentage - 1}% 100%,
          0% 100%
        );
      }
      87.5% {
        clip-path: polygon(
          0% 0%,
          ${percentage}% 0%,
          ${percentage}% 5%,
          ${percentage - 2}% 10%,
          ${percentage + 2}% 15%,
          ${percentage}% 20%,
          ${percentage + 1}% 25%,
          ${percentage - 1}% 30%,
          ${percentage + 3}% 35%,
          ${percentage + 1}% 40%,
          ${percentage + 2}% 45%,
          ${percentage}% 50%,
          ${percentage + 3}% 55%,
          ${percentage + 1}% 60%,
          ${percentage + 2}% 65%,
          ${percentage}% 70%,
          ${percentage + 3}% 75%,
          ${percentage + 1}% 80%,
          ${percentage + 2}% 85%,
          ${percentage}% 90%,
          ${percentage + 2}% 95%,
          ${percentage + 1}% 100%,
          0% 100%
        );
      }
      100% {
        clip-path: polygon(
          0% 0%,
          ${percentage}% 0%,
          ${percentage + 6}% 3%,
          ${percentage + 4}% 8%,
          ${percentage + 7}% 13%,
          ${percentage + 3}% 18%,
          ${percentage + 6}% 23%,
          ${percentage + 2}% 28%,
          ${percentage + 7}% 33%,
          ${percentage + 1}% 38%,
          ${percentage + 6}% 43%,
          ${percentage}% 48%,
          ${percentage + 7}% 53%,
          ${percentage + 1}% 58%,
          ${percentage + 6}% 63%,
          ${percentage + 2}% 68%,
          ${percentage + 7}% 73%,
          ${percentage + 3}% 78%,
          ${percentage + 6}% 83%,
          ${percentage + 4}% 88%,
          ${percentage + 7}% 93%,
          ${percentage + 5}% 97%,
          ${percentage + 6}% 100%,
          0% 100%
        );
      }
    }
  `}
`;

const StyledTierHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const StyledTierRange = styled.div`
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.font.color.primary};
`;

const StyledTierPrice = styled.div`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.color.blue11};
`;

const StyledCurrentTierBadge = styled.div`
  display: inline-block;
  background: ${({ theme }) => theme.tag.background.blue};
  color: ${({ theme }) => theme.tag.text.blue};
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  text-transform: uppercase;
  margin-left: ${({ theme }) => theme.spacing(2)};
`;

const formatPriceTiers = (
  tiers: Array<{ upTo: number | null; unitAmount: number }>,
  currency: string,
  currentUserCount: number,
) => {
  if (tiers.length === 0) return [];

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
    // unitAmount já vem em reais do backend (não em centavos)
    const price = tier.unitAmount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const isActive =
      currentUserCount >= from && (to === null || currentUserCount <= to);

    // Calcular porcentagem de preenchimento do tier atual
    let percentage = 0;
    if (isActive) {
      if (to === null) {
        // Tier ilimitado - sempre 100%
        percentage = 100;
      } else {
        // Calcular baseado na posição atual dentro do range do tier
        // Exemplo: tier 1-3, usuário 2: (2-1+1)/(3-1+1) = 2/3 = 66.67%
        const tierRange = to - from + 1;
        const currentPosition = currentUserCount - from + 1;
        percentage = Math.min(100, Math.max(0, (currentPosition / tierRange) * 100));

        // Garantir que percentage é um número
        percentage = Number(percentage.toFixed(2));

        // Debug log
        console.log(`🔍 [formatPriceTiers] Tier ${from}-${to}, users: ${currentUserCount}, position: ${currentPosition}, range: ${tierRange}, percentage: ${percentage}%`);
      }
    }

    // Encontrar próximo tier para calcular desconto
    const nextTierData = sortedTiers[index + 1];
    let discountPercentage = 0;
    let usersNeeded = 0;
    let hasNextTier = false;

    if (nextTierData && nextTierData.unitAmount < tier.unitAmount) {
      hasNextTier = true;
      discountPercentage = Math.round(
        ((tier.unitAmount - nextTierData.unitAmount) / tier.unitAmount) * 100,
      );
      // Calcular quantos usuários faltam para chegar ao próximo tier
      // O próximo tier começa em (to + 1), então precisamos calcular a diferença
      const nextTierFrom = to !== null ? to + 1 : 1;
      usersNeeded = Math.max(0, nextTierFrom - currentUserCount);
    }

    return {
      range,
      price,
      tier,
      isActive,
      from,
      to,
      percentage,
      discountPercentage,
      usersNeeded,
      hasNextTier,
    };
  });
};

const getCurrentUserCount = (workspace: any): number => {
  // Tentar obter a quantidade de usuários do workspace
  // Prioridade: workspaceMembersCount (do resolver) > workspaceUsers > workspaceMembers
  if (workspace?.workspaceMembersCount !== undefined) {
    return workspace.workspaceMembersCount;
  }
  if (workspace?.workspaceUsers?.length) {
    return workspace.workspaceUsers.length;
  }
  if (workspace?.workspaceMembers?.length) {
    return workspace.workspaceMembers.length;
  }
  // Por padrão, retornar 1 (pelo menos o usuário atual)
  return 1;
};

export const SettingsBillingContentLocal = () => {
  const { t } = useLingui();
  const currentWorkspace = useRecoilValue(currentWorkspaceState);
  const apolloCoreClient = useApolloCoreClient();

  // Debug: verificar se o workspace tem customBillingPlanId
  console.log('🔍 [BillingLocal] currentWorkspace:', currentWorkspace);
  console.log('🔍 [BillingLocal] customBillingPlanId:', currentWorkspace?.customBillingPlanId);

  const { data, loading, error } = useQuery(
    GET_CURRENT_WORKSPACE_CUSTOM_BILLING_PLAN,
    {
      client: apolloCoreClient,
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
      onError: (error) => {
        console.error('🔍 [BillingLocal] Query error:', error);
        console.error('🔍 [BillingLocal] GraphQL errors:', error.graphQLErrors);
        console.error('🔍 [BillingLocal] Network error:', error.networkError);
      },
      onCompleted: (data) => {
        console.log('🔍 [BillingLocal] Query completed:', data);
      },
    },
  );

  if (loading) {
    return (
      <SettingsPageContainer>
        <Section>
          <Loader />
        </Section>
      </SettingsPageContainer>
    );
  }

  const plan = data?.currentWorkspaceCustomBillingPlan;

  // Se houver erro de rede ou GraphQL, mostrar mensagem de erro
  if (error && !plan) {
    console.error('Error loading custom billing plan:', error);
    console.error('Error details:', {
      graphQLErrors: error.graphQLErrors,
      networkError: error.networkError,
      message: error.message,
    });

    // Se for erro de rede, pode ser que o endpoint não esteja disponível
    if (error.networkError) {
      return (
        <SettingsPageContainer>
          <Section>
            <H2Title
              title={t`Erro de conexão`}
              description={t`Não foi possível conectar ao servidor para carregar as informações do plano.`}
            />
            <div style={{ marginTop: '16px', color: '#888', fontSize: '14px' }}>
              {error.networkError.message || 'Erro de rede'}
            </div>
          </Section>
        </SettingsPageContainer>
      );
    }

    return (
      <SettingsPageContainer>
        <Section>
          <H2Title
            title={t`Erro ao carregar informações do plano`}
            description={t`Não foi possível carregar as informações do seu plano.`}
          />
          {error.graphQLErrors && error.graphQLErrors.length > 0 && (
            <div style={{ marginTop: '16px', color: '#888', fontSize: '14px' }}>
              {error.graphQLErrors[0].message}
            </div>
          )}
          {error.message && (
            <div style={{ marginTop: '16px', color: '#888', fontSize: '14px' }}>
              {error.message}
            </div>
          )}
        </Section>
      </SettingsPageContainer>
    );
  }
  // Obter quantidade de usuários do workspace (workspaceMembersCount já está disponível no GraphQL)
  const currentUserCount =
    (currentWorkspace as any)?.workspaceMembersCount ??
    getCurrentUserCount(currentWorkspace);
  const priceTiers = plan
    ? formatPriceTiers(
        plan.priceTiers || [],
        plan.currency || 'BRL',
        currentUserCount,
      )
    : [];
  const intervalText =
    plan?.interval === 'Month' || plan?.interval === 'month' ? 'mês' : 'ano';

  // Encontrar tier ativo e calcular informações para a mensagem
  const activeTier = priceTiers.find((tier) => tier.isActive);

  // Debug: log para verificar cálculo
  if (activeTier) {
    console.log('🔍 [BillingLocal] Active tier:', {
      range: activeTier.range,
      from: activeTier.from,
      to: activeTier.to,
      currentUserCount,
      percentage: activeTier.percentage,
      hasNextTier: activeTier.hasNextTier,
      discountPercentage: activeTier.discountPercentage,
    });
  }

  // Mostrar mensagem quando atingir 2/3 (66.67%) do tier atual
  const showUpgradeMessage =
    activeTier &&
    activeTier.percentage >= 66.67 &&
    activeTier.hasNextTier &&
    activeTier.discountPercentage > 0;

  if (!plan) {
    return (
      <SettingsPageContainer>
        <Section>
          <H2Title
            title={t`Nenhum plano contratado`}
            description={t`Você ainda não possui um plano customizado contratado`}
          />
        </Section>
      </SettingsPageContainer>
    );
  }

  return (
    <SettingsPageContainer>
      <Section>
        <H2Title
          title={t`Seu Plano`}
          description={t`Informações sobre seu plano customizado e tier atual`}
        />

        <StyledPlanCard>
          <StyledPlanHeader>
            <div>
              <StyledPlanName>{plan.name}</StyledPlanName>
              {plan.description && (
                <StyledPlanDescription>{plan.description}</StyledPlanDescription>
              )}
            </div>
          </StyledPlanHeader>
          {activeTier && (
            <StyledProgressContainer>
              <StyledProgressWave percentage={activeTier.percentage} />
            </StyledProgressContainer>
          )}

          <StyledInfoRow>
            <StyledInfoLabel>{t`Usuários atuais`}</StyledInfoLabel>
            <StyledInfoValue>{currentUserCount} usuários</StyledInfoValue>
          </StyledInfoRow>

          <StyledInfoRow>
            <StyledInfoLabel>{t`Moeda`}</StyledInfoLabel>
            <StyledInfoValue>{plan.currency}</StyledInfoValue>
          </StyledInfoRow>

          <StyledInfoRow>
            <StyledInfoLabel>{t`Período`}</StyledInfoLabel>
            <StyledInfoValue>
              {plan.interval === 'Month' || plan.interval === 'month'
                ? t`Mensal`
                : t`Anual`}
            </StyledInfoValue>
          </StyledInfoRow>
        </StyledPlanCard>

        {priceTiers.length > 0 && (
          <>
            <H2Title
              title={t`Tiers de Preço`}
              description={t`Seu tier atual está destacado`}
            />

            {priceTiers.map((tierData, index) => {
              // SEMPRE usar activeTier.percentage quando o tier está ativo para garantir consistência
              // com a barra de progresso que está funcionando corretamente
              const cardPercentage = tierData.isActive && activeTier
                ? activeTier.percentage
                : 0;

              // Verificar se deve mostrar mensagem de upgrade para este tier
              const shouldShowMessage = tierData.isActive &&
                tierData.percentage >= 66.67 &&
                tierData.hasNextTier &&
                tierData.discountPercentage > 0;

              // Debug: log para verificar percentage sendo passado
              if (tierData.isActive) {
                console.log(`🔍 [BillingLocal] Rendering tier card:`, {
                  range: tierData.range,
                  isActive: tierData.isActive,
                  tierDataPercentage: tierData.percentage,
                  activeTierPercentage: activeTier?.percentage,
                  cardPercentage,
                  type: typeof cardPercentage,
                  'activeTier exists': !!activeTier,
                  shouldShowMessage,
                  usersNeeded: tierData.usersNeeded,
                  discountPercentage: tierData.discountPercentage,
                });
              }
              return (
                <>
                  <StyledTierCard
                    key={index}
                    isActive={tierData.isActive}
                    percentage={cardPercentage}
                  >
                  <div style={{ position: 'relative', zIndex: 2 }}>
                  <StyledTierHeader>
                  <StyledTierRange>
                    {tierData.range}
                    {tierData.isActive && (
                      <StyledCurrentTierBadge>{t`Tier Atual`}</StyledCurrentTierBadge>
                    )}
                  </StyledTierRange>
                  <StyledTierPrice>
                    {tierData.price}/{intervalText}
                  </StyledTierPrice>
                </StyledTierHeader>
                  <StyledInfoRow>
                    <StyledInfoLabel>{t`Preço por usuário`}</StyledInfoLabel>
                    <StyledInfoValue>
                      {tierData.price}/{intervalText}
                    </StyledInfoValue>
                  </StyledInfoRow>
                </div>
              </StyledTierCard>
              {shouldShowMessage && (
                <StyledUpgradeMessageCard>
                  <StyledUpgradeMessageContent>
                    <StyledUpgradeMessageIcon>🎯</StyledUpgradeMessageIcon>
                    <StyledUpgradeMessageText>
                      {tierData.usersNeeded > 0
                        ? `Adicione +${tierData.usersNeeded} usuário${
                            tierData.usersNeeded > 1 ? 's' : ''
                          } para subir o Tier e conseguir um desconto de ${tierData.discountPercentage}% por usuário criado! Aproveite`
                        : `Suba para o próximo Tier e ganhe ${tierData.discountPercentage}% de desconto por usuário!`}
                    </StyledUpgradeMessageText>

                  </StyledUpgradeMessageContent>

                </StyledUpgradeMessageCard>

              )}
              </>
              );
            })}
          </>
        )}

        {plan.features && plan.features.length > 0 && (
          <>
            <H2Title
              title={t`Recursos Inclusos`}
              description={t`Recursos disponíveis no seu plano`}
            />
            <StyledPlanCard>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {plan.features.map((feature: string, idx: number) => (
                  <li
                    key={idx}
                    style={{
                      padding: '8px 0',
                      borderBottom: '1px solid rgba(0,0,0,0.1)',
                    }}
                  >
                    ✓ {feature}
                  </li>
                ))}
              </ul>
            </StyledPlanCard>
          </>
        )}
      </Section>
    </SettingsPageContainer>
  );
};

