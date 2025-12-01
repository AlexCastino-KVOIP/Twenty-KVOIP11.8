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

type ReplaceUserModalProps = {
  modalId: string;
  currentEmail: string;
  onReplace: (newEmail: string) => void;
  onCancel: () => void;
};

export const ReplaceUserModal = ({
  modalId,
  currentEmail,
  onReplace,
  onCancel,
}: ReplaceUserModalProps) => {
  const { t } = useLingui();
  const { closeModal } = useModal();
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleReplace = () => {
    if (!newEmail.trim()) {
      setError(t`Email é obrigatório`);
      return;
    }

    if (!validateEmail(newEmail.trim())) {
      setError(t`Email inválido`);
      return;
    }

    if (newEmail.trim().toLowerCase() === currentEmail.toLowerCase()) {
      setError(t`O novo email deve ser diferente do atual`);
      return;
    }

    closeModal(modalId);
    onReplace(newEmail.trim());
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
          title={t`Substituir Usuário`}
          fontColor={H1TitleFontColor.Primary}
        />
        <Section
          alignment={SectionAlignment.Left}
          fontColor={SectionFontColor.Primary}
        >
          <div style={{ marginBottom: '16px' }}>
            <strong>{t`Usuário atual:`}</strong> {currentEmail}
          </div>
          <div style={{ marginBottom: '8px' }}>
            {t`Digite o email do novo usuário para substituir:`}
          </div>
          <SettingsTextInput
            instanceId="replace-user-email"
            placeholder="novo@email.com"
            value={newEmail}
            onChange={(value) => {
              setNewEmail(value);
              setError(null);
            }}
            error={error || undefined}
            fullWidth
            type="email"
          />
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
            {t`Esta substituição não gerará cobrança adicional, pois você está apenas trocando o usuário, não adicionando um novo.`}
          </div>
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
            title={t`Substituir`}
            onClick={handleReplace}
            disabled={!newEmail.trim() || !!error}
            fullWidth
          />
        </StyledButtonContainer>
      </StyledContent>
    </StyledModal>
  );
};

