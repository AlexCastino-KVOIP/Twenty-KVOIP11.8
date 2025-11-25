import { Modal } from '@/ui/layout/modal/components/Modal';
import { ChooseCustomPlanContent } from '~/pages/onboarding/internal/ChooseCustomPlanContent';

export const ChooseCustomPlan = () => {
  return (
    <Modal.Content isVerticalCentered>
      <ChooseCustomPlanContent />
    </Modal.Content>
  );
};

