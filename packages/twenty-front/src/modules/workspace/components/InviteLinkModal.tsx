import styled from '@emotion/styled';
import { useLingui } from '@lingui/react/macro';
import { Modal } from '@/ui/layout/modal/components/Modal';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { Button } from 'twenty-ui/input';
import { H1Title, H1TitleFontColor, IconLink } from 'twenty-ui/display';
import { Section, SectionAlignment, SectionFontColor } from 'twenty-ui/layout';
import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';
import { useCopyToClipboard } from '~/hooks/useCopyToClipboard';

const StyledModal = styled(Modal)`
  width: 500px;
`;

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(4)};
`;

const StyledLinkContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing(2)};
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

const StyledInputContainer = styled.div`
  flex: 1;
`;

type InviteLinkModalProps = {
  modalId: string;
  inviteLink: string;
  email: string;
  onClose: () => void;
};

export const InviteLinkModal = ({
  modalId,
  inviteLink,
  email,
  onClose,
}: InviteLinkModalProps) => {
  const { t } = useLingui();
  const { closeModal } = useModal();
  const { copyToClipboard } = useCopyToClipboard();

  const handleClose = () => {
    closeModal(modalId);
    onClose();
  };

  const handleCopyLink = () => {
    copyToClipboard(inviteLink, t`Link copiado para a área de transferência`);
  };

  return (
    <StyledModal
      modalId={modalId}
      onClose={handleClose}
      isClosable={true}
      padding="large"
    >
      <StyledContent>
        <H1Title
          title={t`Link de Convite`}
          fontColor={H1TitleFontColor.Primary}
        />
        <Section
          alignment={SectionAlignment.Left}
          fontColor={SectionFontColor.Primary}
        >
          <div style={{ marginBottom: '8px' }}>
            {t`Link único para ${email}:`}
          </div>
          <StyledLinkContainer>
            <StyledInputContainer>
              <SettingsTextInput
                instanceId="invite-link-display"
                value={inviteLink}
                disabled
                fullWidth
              />
            </StyledInputContainer>
            <Button
              Icon={IconLink}
              variant="primary"
              accent="blue"
              title={t`Copiar Link`}
              onClick={handleCopyLink}
            />
          </StyledLinkContainer>
        </Section>
        <Button
          variant="secondary"
          title={t`Fechar`}
          onClick={handleClose}
          fullWidth
        />
      </StyledContent>
    </StyledModal>
  );
};

