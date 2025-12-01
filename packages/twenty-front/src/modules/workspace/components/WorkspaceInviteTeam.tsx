import styled from '@emotion/styled';
import { useQuery } from '@apollo/client';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { sanitizeEmailList } from '@/workspace/utils/sanitizeEmailList';
import { useLingui } from '@lingui/react/macro';
import { isDefined } from 'twenty-shared/utils';
import { Button } from 'twenty-ui/input';
import { useCreateWorkspaceInvitation } from '../../workspace-invitation/hooks/useCreateWorkspaceInvitation';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { GET_CURRENT_WORKSPACE_CUSTOM_BILLING_PLAN } from '@/billing/graphql/queries/getCurrentWorkspaceCustomBillingPlan';
import { InviteConfirmationModal } from './InviteConfirmationModal';
import { InvitePaymentModal } from './InvitePaymentModal';
import { InviteEmailModal } from './InviteEmailModal';
import { workspaceInvitationsState } from '@/workspace-invitation/states/workspaceInvitationsStates';
import { useGetWorkspaceInvitationsQuery } from '~/generated-metadata/graphql';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: ${({ theme }) => theme.spacing(3)};
  justify-content: flex-end;
`;

const INVITE_CONFIRMATION_MODAL_ID = 'invite-confirmation-modal';
const INVITE_PAYMENT_MODAL_ID = 'invite-payment-modal';
const INVITE_EMAIL_MODAL_ID = 'invite-email-modal';

// Função para calcular o preço baseado no tier atual
const calculatePriceForNewUser = (
  priceTiers: Array<{ upTo: number | null; unitAmount: number }>,
  currentUserCount: number,
): number => {
  if (!priceTiers || priceTiers.length === 0) {
    return 0;
  }

  // Ordenar tiers por upTo (null = ilimitado vai no final)
  const sortedTiers = [...priceTiers].sort((a, b) => {
    if (a.upTo === null) return 1;
    if (b.upTo === null) return -1;
    return a.upTo - b.upTo;
  });

  // Encontrar o tier que se aplica ao próximo usuário (currentUserCount + 1)
  const nextUserCount = currentUserCount + 1;
  
  console.log('🔍 [calculatePriceForNewUser] currentUserCount:', currentUserCount);
  console.log('🔍 [calculatePriceForNewUser] nextUserCount:', nextUserCount);
  console.log('🔍 [calculatePriceForNewUser] sortedTiers:', sortedTiers);
  
  for (let i = 0; i < sortedTiers.length; i++) {
    const tier = sortedTiers[i];
    // Calcular o "from" baseado no tier anterior
    const from = i === 0 ? 1 : (sortedTiers[i - 1].upTo || 0) + 1;
    const to = tier.upTo;

    console.log(`🔍 [calculatePriceForNewUser] Tier ${i}: from=${from}, to=${to}, unitAmount=${tier.unitAmount}`);

    // Verificar se o próximo usuário está neste tier
    if (to === null) {
      // Tier ilimitado - sempre aplica se chegou até aqui
      console.log(`🔍 [calculatePriceForNewUser] Found unlimited tier, returning ${tier.unitAmount}`);
      return tier.unitAmount;
    }
    
    if (nextUserCount >= from && nextUserCount <= to) {
      console.log(`🔍 [calculatePriceForNewUser] Found matching tier, returning ${tier.unitAmount}`);
      return tier.unitAmount;
    }
  }

  // Se não encontrou, usar o último tier (ilimitado)
  const lastTier = sortedTiers[sortedTiers.length - 1];
  console.log(`🔍 [calculatePriceForNewUser] No tier found, using last tier: ${lastTier?.unitAmount || 0}`);
  return lastTier?.unitAmount || 0;
};

export const WorkspaceInviteTeam = () => {
  const { t } = useLingui();
  const { openModal, closeModal } = useModal();

  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();
  const { sendInvitation } = useCreateWorkspaceInvitation();
  const currentWorkspace = useRecoilValue(currentWorkspaceState);
  const workspaceInvitations = useRecoilValue(workspaceInvitationsState);
  const setWorkspaceInvitations = useSetRecoilState(workspaceInvitationsState);

  // Buscar invites pendentes para calcular o total correto
  useGetWorkspaceInvitationsQuery({
    onCompleted: (data) => {
      setWorkspaceInvitations(data?.findWorkspaceInvitations ?? []);
    },
  });

  const { data: billingPlanData, loading: loadingBillingPlan } = useQuery(
    GET_CURRENT_WORKSPACE_CUSTOM_BILLING_PLAN,
    {
      skip: !currentWorkspace?.customBillingPlanId,
    },
  );

  const sendInvitations = async (emailsList: string[]) => {
    const { data } = await sendInvitation({ emails: emailsList });
    if (isDefined(data) && data.sendInvitations.result.length > 0) {
      enqueueSuccessSnackBar({
        message: `${data.sendInvitations.result.length} invitations sent`,
        options: {
          duration: 2000,
        },
      });
      return;
    }
    if (isDefined(data) && !data.sendInvitations.success) {
      enqueueErrorSnackBar({
        options: {
          duration: 5000,
        },
      });
    }
  };

  const handleHireExtension = () => {
    const customBillingPlan = billingPlanData?.currentWorkspaceCustomBillingPlan;
    
    if (!customBillingPlan || !customBillingPlan.priceTiers?.length) {
      enqueueErrorSnackBar({
        message: t`Nenhum plano de cobrança configurado`,
        options: {
          duration: 3000,
        },
      });
      return;
    }

    // Contar usuários ativos + invites pendentes
    const activeUsersCount = currentWorkspace?.workspaceMembersCount || 0;
    const pendingInvitesCount = workspaceInvitations?.length || 0;
    const totalUserCount = activeUsersCount + pendingInvitesCount;
    
    console.log('🔍 [handleHireExtension] activeUsersCount:', activeUsersCount);
    console.log('🔍 [handleHireExtension] pendingInvitesCount:', pendingInvitesCount);
    console.log('🔍 [handleHireExtension] totalUserCount:', totalUserCount);
    
    const price = calculatePriceForNewUser(
      customBillingPlan.priceTiers,
      totalUserCount,
    );

    if (price <= 0) {
      enqueueErrorSnackBar({
        message: t`Não foi possível calcular o preço para novo usuário`,
        options: {
          duration: 3000,
        },
      });
      return;
    }

    // Abrir modal de confirmação
    openModal(INVITE_CONFIRMATION_MODAL_ID);
  };

  const handleConfirmCharge = () => {
    closeModal(INVITE_CONFIRMATION_MODAL_ID);
    
    const customBillingPlan = billingPlanData?.currentWorkspaceCustomBillingPlan;
    if (customBillingPlan) {
      openModal(INVITE_PAYMENT_MODAL_ID);
    }
  };

  const handlePaymentConfirmed = () => {
    closeModal(INVITE_PAYMENT_MODAL_ID);
    // Abrir modal de email após pagamento confirmado
    openModal(INVITE_EMAIL_MODAL_ID);
  };

  const handleEmailConfirmed = async (email: string) => {
    closeModal(INVITE_EMAIL_MODAL_ID);
    
    if (email && email.trim()) {
      const emailsList = sanitizeEmailList([email.trim()]);
      await sendInvitations(emailsList);
    } else {
      enqueueErrorSnackBar({
        message: t`Email não informado. Convite não foi enviado.`,
        options: {
          duration: 3000,
        },
      });
    }
  };

  const handleCancelEmail = () => {
    closeModal(INVITE_EMAIL_MODAL_ID);
  };

  const handleCancelPayment = () => {
    closeModal(INVITE_PAYMENT_MODAL_ID);
  };

  const handleCancelConfirmation = () => {
    closeModal(INVITE_CONFIRMATION_MODAL_ID);
  };

  const customBillingPlan = billingPlanData?.currentWorkspaceCustomBillingPlan;
  // Contar usuários ativos + invites pendentes para calcular o preço correto
  const activeUsersCount = currentWorkspace?.workspaceMembersCount || 0;
  const pendingInvitesCount = workspaceInvitations?.length || 0;
  const totalUserCount = activeUsersCount + pendingInvitesCount;
  const price = customBillingPlan
    ? calculatePriceForNewUser(
        customBillingPlan.priceTiers || [],
        totalUserCount,
      )
    : 0;

  return (
    <>
      <StyledContainer>
        <Button
          variant="primary"
          accent="blue"
          title={t`Contratar Ramal`}
          onClick={handleHireExtension}
          disabled={loadingBillingPlan}
        />
      </StyledContainer>
      {/* Sempre renderizar os modais, eles só aparecem quando abertos */}
      <InviteConfirmationModal
        modalId={INVITE_CONFIRMATION_MODAL_ID}
        amount={price || 0}
        currency={customBillingPlan?.currency || 'BRL'}
        onConfirm={handleConfirmCharge}
        onCancel={handleCancelConfirmation}
      />
      <InvitePaymentModal
        modalId={INVITE_PAYMENT_MODAL_ID}
        amount={price || 0}
        currency={customBillingPlan?.currency || 'BRL'}
        onPaymentConfirmed={handlePaymentConfirmed}
        onCancel={handleCancelPayment}
      />
      <InviteEmailModal
        modalId={INVITE_EMAIL_MODAL_ID}
        onConfirm={handleEmailConfirmed}
        onCancel={handleCancelEmail}
      />
    </>
  );
};
