import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { useLingui } from '@lingui/react/macro';
import { Modal } from '@/ui/layout/modal/components/Modal';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { Button } from 'twenty-ui/input';
import { H1Title, H1TitleFontColor } from 'twenty-ui/display';
import { Section, SectionAlignment, SectionFontColor } from 'twenty-ui/layout';

const StyledModal = styled(Modal)`
  width: 500px;
`;

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(4)};
`;

const StyledQRCodeContainer = styled.div`
  width: 250px;
  height: 250px;
  background: ${({ theme }) => theme.background.primary};
  border: 2px solid ${({ theme }) => theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const StyledQRCodePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.font.color.tertiary};
  font-size: ${({ theme }) => theme.font.size.sm};
  text-align: center;
  padding: ${({ theme }) => theme.spacing(2)};
`;

const StyledTimer = styled.div`
  font-size: ${({ theme }) => theme.font.size.xl};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.font.color.primary};
  padding: ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.border.radius.md};
  background: ${({ theme }) => theme.background.transparent.lighter};
`;

const StyledButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

type InvitePaymentModalProps = {
  modalId: string;
  amount: number;
  currency: string;
  onPaymentConfirmed: () => void;
  onCancel: () => void;
};

export const InvitePaymentModal = ({
  modalId,
  amount,
  currency,
  onPaymentConfirmed,
  onCancel,
}: InvitePaymentModalProps) => {
  const { t } = useLingui();
  const { closeModal } = useModal();
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos em segundos

  useEffect(() => {
    if (timeLeft <= 0) {
      closeModal(modalId);
      onCancel();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, modalId, closeModal, onCancel]);

  const handleSimulatePayment = () => {
    closeModal(modalId);
    onPaymentConfirmed();
  };

  const handleCancel = () => {
    closeModal(modalId);
    onCancel();
  };

  const formattedAmount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency || 'BRL',
  }).format(amount);

  return (
    <StyledModal
      modalId={modalId}
      onClose={handleCancel}
      isClosable={true}
      padding="large"
    >
      <StyledContent>
        <H1Title
          title={t`Pagamento`}
          fontColor={H1TitleFontColor.Primary}
        />
        <Section
          alignment={SectionAlignment.Center}
          fontColor={SectionFontColor.Primary}
        >
          <div>
            {t`Valor a pagar: ${formattedAmount}`}
          </div>
        </Section>
        <StyledQRCodeContainer>
          <StyledQRCodePlaceholder>
            <div>QR Code</div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>
              {t`Escaneie o QR Code para realizar o pagamento`}
            </div>
          </StyledQRCodePlaceholder>
        </StyledQRCodeContainer>
        <StyledTimer>{formatTime(timeLeft)}</StyledTimer>
        <StyledButtonContainer>
          <Button
            variant="primary"
            accent="blue"
            title={t`Simular Pagamento`}
            onClick={handleSimulatePayment}
            fullWidth
          />
          <Button
            variant="secondary"
            title={t`Cancelar`}
            onClick={handleCancel}
            fullWidth
          />
        </StyledButtonContainer>
      </StyledContent>
    </StyledModal>
  );
};

