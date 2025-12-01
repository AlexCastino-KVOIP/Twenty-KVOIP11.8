import styled from '@emotion/styled';
import { useLingui } from '@lingui/react/macro';
import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';

type InviteConfirmationModalProps = {
  modalId: string;
  amount: number;
  currency: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const InviteConfirmationModal = ({
  modalId,
  amount,
  currency,
  onConfirm,
  onCancel,
}: InviteConfirmationModalProps) => {
  const { t } = useLingui();

  const formattedAmount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency || 'BRL',
  }).format(amount);

  return (
    <ConfirmationModal
      modalId={modalId}
      title={t`Confirmar Convite`}
      subtitle={
        <>
          {t`Para adicionar um novo usuário será cobrado ${formattedAmount} (consultar plano de TIER Atual do plano contratado)`}
        </>
      }
      onConfirmClick={onConfirm}
      onClose={onCancel}
      confirmButtonText={t`Gerar Cobrança`}
      confirmButtonAccent="blue"
    />
  );
};

