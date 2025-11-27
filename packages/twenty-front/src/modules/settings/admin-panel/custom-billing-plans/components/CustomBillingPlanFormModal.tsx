import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { useApolloCoreClient } from '@/object-metadata/hooks/useApolloCoreClient';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';
import { TextArea } from '@/ui/input/components/TextArea';
import { Modal } from '@/ui/layout/modal/components/Modal';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { useMutation } from '@apollo/client';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { t } from '@lingui/core/macro';
import { isDefined } from 'twenty-shared/utils';
import { H2Title, IconPlus, IconTrash } from 'twenty-ui/display';
import { Button } from 'twenty-ui/input';
import { Section } from 'twenty-ui/layout';
import { CREATE_CUSTOM_BILLING_PLAN } from '../graphql/mutations/createCustomBillingPlan';
import { UPDATE_CUSTOM_BILLING_PLAN } from '../graphql/mutations/updateCustomBillingPlan';
import { PriceTiersManager } from './PriceTiersManager';

const CREATE_PLAN_MODAL_ID = 'create-custom-billing-plan-modal';
const EDIT_PLAN_MODAL_ID = 'edit-custom-billing-plan-modal';

const StyledTabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  height: 100%;
  min-height: 0;
`;

const StyledTabsHeader = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  border-bottom: 2px solid ${({ theme }) => theme.border.color.medium};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
`;

const StyledTab = styled.button<{ active: boolean; disabled?: boolean }>`
  padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(4)};
  border: none;
  background: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme, active }) =>
    active ? theme.font.weight.semiBold : theme.font.weight.regular};
  color: ${({ theme, active, disabled }) =>
    disabled
      ? theme.font.color.tertiary
      : active
        ? theme.font.color.primary
        : theme.font.color.secondary};
  border-bottom: 2px solid
    ${({ theme, active }) => (active ? theme.color.blue10 : 'transparent')};
  margin-bottom: -2px;
  transition: all 0.2s ease;
  position: relative;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  &:hover {
    color: ${({ theme, disabled }) =>
      disabled ? theme.font.color.tertiary : theme.font.color.primary};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${({ theme, active }) => (active ? theme.color.blue10 : 'transparent')};
  }
`;

const StyledTabContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  max-height: calc(80vh - 250px);
  min-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(1)};
  padding-right: ${({ theme }) => theme.spacing(2)};

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.background.tertiary};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.border.color.strong};
    border-radius: 4px;

    &:hover {
      background: ${({ theme }) => theme.font.color.tertiary};
    }
  }
`;

const StyledTwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing(4)};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StyledFormSection = styled(Section)`
  padding: ${({ theme }) => theme.spacing(4)};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  background-color: ${({ theme }) => theme.background.secondary};
`;

const StyledStepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

const StyledStepNumber = styled.div<{ active: boolean; completed: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  font-size: ${({ theme }) => theme.font.size.sm};
  background-color: ${({ theme, active, completed }) =>
    completed
      ? theme.color.green10
      : active
        ? theme.color.blue10
        : theme.background.tertiary};
  color: ${({ theme, active, completed }) =>
    completed
      ? theme.color.green11
      : active
        ? theme.color.blue11
        : theme.font.color.tertiary};
  border: 2px solid
    ${({ theme, active, completed }) =>
      completed
        ? theme.color.green10
        : active
          ? theme.color.blue10
          : theme.border.color.medium};
`;

const StyledStepTitle = styled.div<{ active: boolean }>`
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme, active }) =>
    active ? theme.font.color.primary : theme.font.color.secondary};
`;

const StyledButtonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  justify-content: space-between;
  padding-top: ${({ theme }) => theme.spacing(4)};
  border-top: 1px solid ${({ theme }) => theme.border.color.medium};
`;

const StyledFeaturesTextArea = styled.textarea`
  background-color: ${({ theme }) => theme.background.transparent.lighter};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  box-sizing: border-box;
  color: ${({ theme }) => theme.font.color.primary};
  font-family: inherit;
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.regular};
  line-height: 1.5;
  overflow: auto;
  padding: ${({ theme }) => theme.spacing(2)};
  resize: vertical;
  width: 100%;
  min-height: 120px;

  &:focus {
    outline: none;
    box-shadow: 0px 0px 0px 3px ${({ theme }) => theme.color.transparent.blue2};
    border-color: ${({ theme }) => theme.color.blue};
  }

  &::placeholder {
    color: ${({ theme }) => theme.font.color.light};
    font-weight: ${({ theme }) => theme.font.weight.regular};
  }
`;

const StyledNavButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
`;

type CustomBillingPlanFormData = {
  name: string;
  description: string | null;
  currency: string;
  interval: 'month' | 'year';
  trialPeriodDays: number | null;
  paymentGateway: string | null;
  active: boolean;
  features: string[];
};

type CustomBillingPlanFormModalProps = {
  modalId: string;
  plan?: {
    id: string;
    name: string;
    description: string | null;
    currency: string;
    interval: 'month' | 'year';
    trialPeriodDays: number | null;
    paymentGateway: string | null;
    active: boolean;
    features?: string[] | null;
    priceTiers?: Array<{ id: string; upTo: number | null; unitAmount: number }>;
  } | null;
  onSuccess?: () => void;
};

type TabType = 'basic' | 'advanced' | 'pricing';

const TABS: Array<{ id: TabType; label: string; step: number; title: string }> = [
  { id: 'basic', label: t`Passo 1`, step: 1, title: t`Informações Básicas` },
  { id: 'advanced', label: t`Passo 2`, step: 2, title: t`Configurações Avançadas` },
  { id: 'pricing', label: t`Passo 3`, step: 3, title: t`Faixas de Preço` },
];

// Styled components for features list
const StyledFeaturesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledFeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledFeatureInput = styled.div`
  flex: 1;
`;

const StyledAddButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

// Component to handle features as multiple inputs
const FeaturesInputList = ({
  value,
  onChange,
  modalId,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  modalId: string;
}) => {
  const theme = useTheme();
  const featuresArray = Array.isArray(value) ? value : [];
  // Ensure at least one empty input if array is empty
  const displayFeatures = featuresArray.length === 0 ? [''] : featuresArray;

  const handleFeatureChange = (index: number, newValue: string) => {
    const newFeatures = [...displayFeatures];
    newFeatures[index] = newValue;
    // Filter out empty strings when updating
    const filteredFeatures = newFeatures.filter((f) => f.trim() !== '');
    onChange(filteredFeatures.length > 0 ? filteredFeatures : ['']);
  };

  const handleAddFeature = () => {
    onChange([...displayFeatures, '']);
  };

  const handleRemoveFeature = (index: number) => {
    if (displayFeatures.length <= 1) {
      // Keep at least one empty input
      onChange(['']);
      return;
    }
    const newFeatures = displayFeatures.filter((_, i) => i !== index);
    onChange(newFeatures);
  };

  return (
    <StyledFeaturesContainer>
      {displayFeatures.map((feature, index) => (
        <StyledFeatureItem key={index}>
          <StyledFeatureInput>
            <SettingsTextInput
              instanceId={`${modalId}-feature-${index}`}
              placeholder={t`Digite um recurso do plano`}
              value={feature}
              onChange={(newValue) => handleFeatureChange(index, newValue)}
              fullWidth
            />
          </StyledFeatureInput>
          {displayFeatures.length > 1 && (
            <Button
              title={t`Remover`}
              variant="secondary"
              accent="danger"
              onClick={() => handleRemoveFeature(index)}
              Icon={() => <IconTrash size={theme.icon.size.md} />}
            />
          )}
        </StyledFeatureItem>
      ))}
      <StyledAddButtonContainer>
        <Button
          title={t`Adicionar Recurso`}
          variant="secondary"
          onClick={handleAddFeature}
          Icon={() => <IconPlus size={theme.icon.size.md} />}
        />
      </StyledAddButtonContainer>
    </StyledFeaturesContainer>
  );
};

export const CustomBillingPlanFormModal = ({
  modalId,
  plan,
  onSuccess,
}: CustomBillingPlanFormModalProps) => {
  const { closeModal } = useModal();
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();
  const apolloCoreClient = useApolloCoreClient();
  const isEditMode = isDefined(plan);
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [createdPlanId, setCreatedPlanId] = useState<string | null>(null);

  const formConfig = useForm<CustomBillingPlanFormData>({
    defaultValues: {
      name: '',
      description: null,
      currency: 'BRL',
      interval: 'month',
      trialPeriodDays: null,
      paymentGateway: null,
      active: true,
      features: [],
    },
  });

  const [planTiers, setPlanTiers] = useState<
    Array<{ id?: string; upTo: number | null; unitAmount: number }>
  >([]);

  // Reset form when plan changes
  useEffect(() => {
    if (plan) {
      const planInterval = plan.interval as string;
      const intervalStr = (planInterval || 'month').toLowerCase();
      const intervalValue = intervalStr === 'month' ? 'month' : 'year';
      formConfig.reset({
        name: plan.name || '',
        description: plan.description || null,
        currency: plan.currency || 'BRL',
        interval: intervalValue,
        trialPeriodDays: plan.trialPeriodDays || null,
        paymentGateway: plan.paymentGateway || null,
        active: plan.active ?? true,
        features: plan.features || [],
      });
      setPlanTiers(
        plan.priceTiers?.map((tier) => ({
          id: tier.id,
          upTo: tier.upTo,
          unitAmount: tier.unitAmount,
        })) || [],
      );
    } else {
      formConfig.reset({
        name: '',
        description: null,
        currency: 'BRL',
        interval: 'month',
        trialPeriodDays: null,
        paymentGateway: null,
        active: true,
        features: [],
      });
      setPlanTiers([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan?.id]);

  const [createPlan, { loading: createLoading }] = useMutation(
    CREATE_CUSTOM_BILLING_PLAN,
    {
      client: apolloCoreClient,
      onCompleted: (data) => {
        const newPlanId = data.createCustomBillingPlan.id;
        setCreatedPlanId(newPlanId);
        enqueueSuccessSnackBar({
          message: t`Plano criado com sucesso. Agora você pode configurar as faixas de preço.`,
        });
        setActiveTab('pricing');
      },
      onError: (error) => {
        console.error('Error creating custom billing plan:', error);
        if (error.networkError && 'result' in error.networkError) {
          const result = error.networkError.result as {
            errors?: Array<{ message: string }>;
          };
          if (result.errors && result.errors.length > 0) {
            enqueueErrorSnackBar({ message: result.errors[0].message });
            return;
          }
        }
        if (error.graphQLErrors && error.graphQLErrors.length > 0) {
          enqueueErrorSnackBar({ message: error.graphQLErrors[0].message });
          return;
        }
        enqueueErrorSnackBar({ apolloError: error });
      },
    },
  );

  const [updatePlan, { loading: updateLoading }] = useMutation(
    UPDATE_CUSTOM_BILLING_PLAN,
    {
      client: apolloCoreClient,
      onCompleted: () => {
        enqueueSuccessSnackBar({ message: t`Plano atualizado com sucesso` });
        closeModal(modalId);
        onSuccess?.();
      },
      onError: (error) => {
        console.error('Error updating custom billing plan:', error);
        enqueueErrorSnackBar({ apolloError: error });
      },
    },
  );

  const loading = createLoading || updateLoading;

  const handleSubmit = formConfig.handleSubmit(async (data) => {
    try {
      if (isEditMode && plan) {
        await updatePlan({
          variables: {
            id: plan.id,
            name: data.name,
            description: data.description || null,
            currency: data.currency,
            interval: data.interval === 'month' ? 'Month' : 'Year',
            trialPeriodDays: data.trialPeriodDays || null,
            paymentGateway: data.paymentGateway || null,
            active: data.active,
            features: (data.features || []).filter((f: string) => f && f.trim() !== ''),
          },
        });
      } else {
        await createPlan({
          variables: {
            name: data.name,
            description: data.description || null,
            currency: data.currency,
            interval: data.interval === 'month' ? 'Month' : 'Year',
            trialPeriodDays: data.trialPeriodDays || null,
            paymentGateway: data.paymentGateway || null,
            active: data.active,
            features: (data.features || []).filter((f: string) => f && f.trim() !== ''),
          },
        });
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  });

  const getCurrentStep = () => {
    return TABS.findIndex((tab) => tab.id === activeTab) + 1;
  };

  const canGoNext = () => {
    if (activeTab === 'basic') {
      return formConfig.formState.isValid && formConfig.watch('name') && formConfig.watch('currency');
    }
    return true;
  };

  // Ensure features is always an array
  useEffect(() => {
    const currentFeatures = formConfig.watch('features');
    if (!Array.isArray(currentFeatures)) {
      formConfig.setValue('features', []);
    }
  }, [formConfig, activeTab]);

  const handleNext = () => {
    if (activeTab === 'basic') {
      setActiveTab('advanced');
    } else if (activeTab === 'advanced') {
      if (isEditMode || createdPlanId) {
        setActiveTab('pricing');
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (activeTab === 'advanced') {
      setActiveTab('basic');
    } else if (activeTab === 'pricing') {
      setActiveTab('advanced');
    }
  };

  const nameInputId = `${modalId}-name`;
  const descriptionInputId = `${modalId}-description`;
  const currencyInputId = `${modalId}-currency`;
  const intervalInputId = `${modalId}-interval`;
  const trialPeriodDaysInputId = `${modalId}-trial-period-days`;
  const paymentGatewayInputId = `${modalId}-payment-gateway`;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <StyledTabContent>
            <StyledFormSection>
              <StyledStepIndicator>
                <StyledStepNumber active={true} completed={false}>
                  1
                </StyledStepNumber>
                <StyledStepTitle active={true}>{t`Informações Básicas do Plano`}</StyledStepTitle>
              </StyledStepIndicator>
              <StyledTwoColumnGrid>
                <div>
                  <H2Title
                    title={t`Nome do Plano`}
                    description={t`Nome identificador do plano de assinatura`}
                  />
                  <Controller
                    name="name"
                    control={formConfig.control}
                    rules={{ required: t`Nome é obrigatório` }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <SettingsTextInput
                        instanceId={nameInputId}
                        placeholder={t`Ex: Plano Básico`}
                        value={value}
                        onChange={onChange}
                        error={error?.message}
                        fullWidth
                        autoFocus
                      />
                    )}
                  />
                </div>
                <div>
                  <H2Title
                    title={t`Moeda`}
                    description={t`Código da moeda (ex: BRL, USD, EUR)`}
                  />
                  <Controller
                    name="currency"
                    control={formConfig.control}
                    rules={{ required: t`Moeda é obrigatória` }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <SettingsTextInput
                        instanceId={currencyInputId}
                        placeholder={t`BRL`}
                        value={value}
                        onChange={onChange}
                        error={error?.message}
                        fullWidth
                      />
                    )}
                  />
                </div>
              </StyledTwoColumnGrid>
              <div style={{ marginTop: '24px' }}>
                <H2Title
                  title={t`Descrição`}
                  description={t`Descrição detalhada do plano (opcional)`}
                />
                <Controller
                  name="description"
                  control={formConfig.control}
                  render={({ field: { onChange, value } }) => (
                    <TextArea
                      textAreaId={descriptionInputId}
                      placeholder={t`Descreva os recursos e benefícios deste plano`}
                      minRows={3}
                      value={value || ''}
                      onChange={(newValue) => onChange(newValue || null)}
                    />
                  )}
                />
              </div>
              <div style={{ marginTop: '24px' }}>
                <H2Title
                  title={t`Intervalo de Cobrança`}
                  description={t`Frequência de cobrança do plano`}
                />
                <Controller
                  name="interval"
                  control={formConfig.control}
                  render={({ field: { onChange, value } }) => (
                    <select
                      id={intervalInputId}
                      value={value}
                      onChange={(e) => onChange(e.target.value as 'month' | 'year')}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        fontSize: '14px',
                        backgroundColor: 'white',
                      }}
                    >
                      <option value="month">{t`Mensal`}</option>
                      <option value="year">{t`Anual`}</option>
                    </select>
                  )}
                />
              </div>
            </StyledFormSection>
          </StyledTabContent>
        );

      case 'advanced':
        return (
          <StyledTabContent>
            <StyledFormSection>
              <StyledStepIndicator>
                <StyledStepNumber active={true} completed={false}>
                  2
                </StyledStepNumber>
                <StyledStepTitle active={true}>{t`Configurações Adicionais`}</StyledStepTitle>
              </StyledStepIndicator>
              <StyledTwoColumnGrid>
                <div>
                  <H2Title
                    title={t`Período de Teste (dias)`}
                    description={t`Número de dias de teste gratuito (opcional)`}
                  />
                  <Controller
                    name="trialPeriodDays"
                    control={formConfig.control}
                    render={({ field: { onChange, value } }) => (
                      <SettingsTextInput
                        instanceId={trialPeriodDaysInputId}
                        placeholder={t`Ex: 14, 30`}
                        value={value?.toString() || ''}
                        onChange={(newValue) => {
                          const numValue = parseInt(newValue, 10);
                          onChange(isNaN(numValue) ? null : numValue);
                        }}
                        type="number"
                        min="0"
                        fullWidth
                      />
                    )}
                  />
                </div>
                <div>
                  <H2Title
                    title={t`Gateway de Pagamento`}
                    description={t`Nome do gateway de pagamento (opcional)`}
                  />
                  <Controller
                    name="paymentGateway"
                    control={formConfig.control}
                    render={({ field: { onChange, value } }) => (
                      <SettingsTextInput
                        instanceId={paymentGatewayInputId}
                        placeholder={t`Ex: Stripe, PayPal`}
                        value={value || ''}
                        onChange={(newValue) => onChange(newValue || null)}
                        fullWidth
                      />
                    )}
                  />
                </div>
              </StyledTwoColumnGrid>
              <div style={{ marginTop: '24px' }}>
                <H2Title
                  title={t`Status do Plano`}
                  description={t`Ative ou desative o plano`}
                />
                <Controller
                  name="active"
                  control={formConfig.control}
                  render={({ field: { onChange, value } }) => (
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: value ? '#f0f9ff' : 'white',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '14px', fontWeight: 500 }}>
                        {t`Plano ativo`}
                      </span>
                    </label>
                  )}
                />
              </div>
              <div style={{ marginTop: '24px' }}>
                <H2Title
                  title={t`Recursos/Features`}
                  description={t`Lista de recursos do plano (um por linha). Exibidos na página de seleção de planos.`}
                />
                <Controller
                  name="features"
                  control={formConfig.control}
                  defaultValue={[]}
                  render={({ field: { onChange, value } }) => {
                    const featuresArray = Array.isArray(value) ? value : [];
                    return (
                      <FeaturesInputList
                        value={featuresArray}
                        onChange={onChange}
                        modalId={modalId}
                      />
                    );
                  }}
                />
              </div>
            </StyledFormSection>
          </StyledTabContent>
        );

      case 'pricing':
        return (
          <StyledTabContent>
            <StyledFormSection>
              <StyledStepIndicator>
                <StyledStepNumber active={true} completed={false}>
                  3
                </StyledStepNumber>
                <StyledStepTitle active={true}>{t`Configurar Faixas de Preço`}</StyledStepTitle>
              </StyledStepIndicator>
              {(isEditMode && plan) || createdPlanId ? (
                <PriceTiersManager
                  planId={plan?.id || createdPlanId || null}
                  initialTiers={planTiers}
                  onTiersChange={setPlanTiers}
                />
              ) : (
                <div
                  style={{
                    padding: '48px',
                    textAlign: 'center',
                    color: '#888',
                    fontSize: '14px',
                  }}
                >
                  {t`Primeiro, crie o plano nas etapas anteriores para configurar as faixas de preço.`}
                </div>
              )}
            </StyledFormSection>
          </StyledTabContent>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      modalId={modalId}
      size="large"
      padding="large"
      isClosable
      onClose={() => {
        setCreatedPlanId(null);
        setActiveTab('basic');
        closeModal(modalId);
      }}
    >
      <Modal.Header>
        <H2Title
          title={isEditMode ? t`Editar Plano` : t`Criar Novo Plano`}
          description={
            isEditMode
              ? t`Atualize as informações do plano`
              : t`Siga os passos para criar um novo plano de assinatura`
          }
        />
      </Modal.Header>
      <Modal.Content>
        <FormProvider {...formConfig}>
          <StyledTabsContainer>
            <StyledTabsHeader>
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                const isCompleted =
                  tab.step < getCurrentStep() ||
                  (tab.id === 'pricing' && (isEditMode || createdPlanId));
                const isDisabled =
                  tab.id === 'pricing' && !isEditMode && !createdPlanId && tab.step > getCurrentStep();

                return (
                  <StyledTab
                    key={tab.id}
                    active={isActive}
                    disabled={isDisabled}
                    onClick={() => {
                      if (!isDisabled) {
                        setActiveTab(tab.id);
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{tab.step}</span>
                      <span>{tab.title}</span>
                    </div>
                  </StyledTab>
                );
              })}
            </StyledTabsHeader>
            {renderTabContent()}
          </StyledTabsContainer>
        </FormProvider>
      </Modal.Content>
      <Modal.Footer>
        <StyledButtonContainer>
          <StyledNavButtons>
            {activeTab !== 'basic' && (
              <Button
                title={t`← Anterior`}
                variant="secondary"
                onClick={handlePrevious}
                disabled={loading}
              />
            )}
            {activeTab === 'pricing' && (isEditMode || createdPlanId) ? (
              <Button
                title={t`Finalizar`}
                variant="primary"
                onClick={() => {
                  setCreatedPlanId(null);
                  setActiveTab('basic');
                  formConfig.reset();
                  closeModal(modalId);
                  onSuccess?.();
                }}
              />
            ) : activeTab === 'advanced' && !isEditMode && !createdPlanId ? (
              <Button
                title={t`Criar Plano`}
                variant="primary"
                onClick={handleSubmit}
                disabled={loading || !formConfig.formState.isValid}
              />
            ) : (
              <Button
                title={t`Próximo →`}
                variant="primary"
                onClick={handleNext}
                disabled={loading || !canGoNext()}
              />
            )}
          </StyledNavButtons>
          <Button
            title={t`Cancelar`}
            variant="secondary"
            onClick={() => {
              setCreatedPlanId(null);
              setActiveTab('basic');
              closeModal(modalId);
            }}
            disabled={loading}
          />
        </StyledButtonContainer>
      </Modal.Footer>
    </Modal>
  );
};

export { CREATE_PLAN_MODAL_ID, EDIT_PLAN_MODAL_ID };

