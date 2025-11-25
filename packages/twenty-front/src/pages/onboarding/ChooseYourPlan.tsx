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
