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

