import styled from '@emotion/styled';
import { useState } from 'react';
import { useLingui } from '@lingui/react/macro';
import { Modal } from '@/ui/layout/modal/components/Modal';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { Button } from 'twenty-ui/input';
import { H1Title, H1TitleFontColor } from 'twenty-ui/display';
import { Section, SectionAlignment, SectionFontColor } from 'twenty-ui/layout';
import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';

const StyledModal = styled(Modal)`
  width: 500px;
`;

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(4)};
`;

const StyledButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing(2)};
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

type InviteEmailModalProps = {
  modalId: string;
  onConfirm: (email: string) => void;
  onCancel: () => void;
};

export const InviteEmailModal = ({
  modalId,
  onConfirm,
  onCancel,
}: InviteEmailModalProps) => {
  const { t } = useLingui();
  const { closeModal } = useModal();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleConfirm = () => {
    if (!email.trim()) {
      setEmailError(t`Email é obrigatório`);
      return;
    }

    if (!validateEmail(email.trim())) {
      setEmailError(t`Email inválido`);
      return;
    }

    closeModal(modalId);
    onConfirm(email.trim());
  };

  const handleCancel = () => {
    closeModal(modalId);
    onCancel();
  };

  return (
    <StyledModal
      modalId={modalId}
      onClose={handleCancel}
      isClosable={true}
      padding="large"
    >
      <StyledContent>
        <H1Title
          title={t`Enviar Convite`}
          fontColor={H1TitleFontColor.Primary}
        />
        <Section
          alignment={SectionAlignment.Left}
          fontColor={SectionFontColor.Primary}
        >
          <div style={{ marginBottom: '8px' }}>
            {t`Digite o email do novo usuário para enviar o convite:`}
          </div>
          <SettingsTextInput
            instanceId="invite-email-input"
            placeholder="usuario@exemplo.com"
            value={email}
            onChange={(value) => {
              setEmail(value);
              setEmailError(null);
            }}
            error={emailError || undefined}
            fullWidth
            type="email"
          />
        </Section>
        <StyledButtonContainer>
          <Button
            variant="secondary"
            title={t`Cancelar`}
            onClick={handleCancel}
            fullWidth
          />
          <Button
            variant="primary"
            accent="blue"
            title={t`Enviar Convite`}
            onClick={handleConfirm}
            disabled={!email.trim() || !!emailError}
            fullWidth
          />
        </StyledButtonContainer>
      </StyledContent>
    </StyledModal>
  );
};

