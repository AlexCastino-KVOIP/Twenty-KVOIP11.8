import { useApolloCoreClient } from '@/object-metadata/hooks/useApolloCoreClient';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';
import { useMutation } from '@apollo/client';
import styled from '@emotion/styled';
import { t } from '@lingui/core/macro';
import { useEffect, useState } from 'react';
import { H2Title } from 'twenty-ui/display';
import { Button } from 'twenty-ui/input';
import { Section } from 'twenty-ui/layout';

import { CREATE_CUSTOM_BILLING_PLAN_PRICE_TIER } from '../graphql/mutations/createCustomBillingPlanPriceTier';
import { DELETE_CUSTOM_BILLING_PLAN_PRICE_TIER } from '../graphql/mutations/deleteCustomBillingPlanPriceTier';
import { UPDATE_CUSTOM_BILLING_PLAN_PRICE_TIER } from '../graphql/mutations/updateCustomBillingPlanPriceTier';

const StyledTiersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

const StyledTiersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const StyledTierCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(3)};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  background-color: ${({ theme }) => theme.background.secondary};
  transition: all 0.2s ease;
  max-width: 100%;
  overflow: hidden;

  &:hover {
    border-color: ${({ theme }) => theme.border.color.strong};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const StyledTierHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: ${({ theme }) => theme.spacing(3)};
  border-bottom: 1px solid ${({ theme }) => theme.border.color.medium};
`;

const StyledTierNumber = styled.div`
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.font.color.primary};
`;

const StyledTierRange = styled.div`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.font.color.secondary};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
  background-color: ${({ theme }) => theme.background.tertiary};
  border-radius: ${({ theme }) => theme.border.radius.sm};
`;

const StyledTierFields = styled.div`
  display: grid;
  grid-template-columns: 120px 120px 1fr;
  gap: ${({ theme }) => theme.spacing(2)};
  align-items: flex-start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StyledPriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledPriceInputs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  align-items: center;
`;

const StyledPriceInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  flex: 1;
`;

const StyledPriceReaisInput = styled(SettingsTextInput)`
  width: 80px !important;
  min-width: 80px;
`;

const StyledPriceCentavosInput = styled(SettingsTextInput)`
  width: 60px !important;
  min-width: 60px;
`;

const StyledUpToInput = styled(SettingsTextInput)`
  width: 100%;
`;

const StyledPriceDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => theme.spacing(2)};
  background-color: ${({ theme }) => theme.background.tertiary};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.color.green11 || '#10b981'};
  min-height: 40px;
`;

const StyledPriceLabel = styled.span`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.font.color.tertiary};
  white-space: nowrap;
`;

const StyledTierField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const StyledTierLabel = styled.label`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.font.color.tertiary};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledTierActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  justify-content: flex-end;
  padding-top: ${({ theme }) => theme.spacing(3)};
  border-top: 1px solid ${({ theme }) => theme.border.color.medium};
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

const StyledEmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing(6)};
  text-align: center;
  color: ${({ theme }) => theme.font.color.tertiary};
  border: 1px dashed ${({ theme }) => theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  background-color: ${({ theme }) => theme.background.tertiary};
`;

type PriceTier = {
  id?: string;
  upTo: number | null;
  unitAmount: number;
};

type PriceTiersManagerProps = {
  planId: string | null;
  initialTiers?: PriceTier[];
  onTiersChange?: (tiers: PriceTier[]) => void;
};

const formatCurrency = (value: number): string => {
  // Backend stores in actual currency value (not cents), so format directly
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const parseCurrency = (value: string): number => {
  // Remove R$, espaços e pontos (milhares), convert comma to dot
  const cleaned = value
    .replace(/R\$\s?/g, '')
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

// Validate and convert input to number (allows free typing with comma as decimal)
const validateAndParseCurrency = (value: string): number | null => {
  if (!value || value.trim() === '') return null;

  // Remove R$ and spaces
  let cleaned = value.replace(/R\$\s?/g, '').replace(/\s/g, '').trim();

  if (cleaned === '') return null;

  // Handle comma as decimal separator
  if (cleaned.includes(',')) {
    const parts = cleaned.split(',');
    if (parts.length === 2) {
      // Format: 123,45 or 50,00
      const integerPart = parts[0].replace(/\./g, '');
      const decimalPart = parts[1].substring(0, 2); // Max 2 decimal places
      cleaned = integerPart + '.' + decimalPart;
    } else if (parts.length === 1 && parts[0] !== '') {
      // Just comma, treat as integer
      cleaned = parts[0].replace(/\./g, '');
    } else {
      // Invalid format
      return null;
    }
  } else {
    // No comma, treat as integer (remove dots if any)
    cleaned = cleaned.replace(/\./g, '');
  }

  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
};

export const PriceTiersManager = ({
  planId,
  initialTiers = [],
  onTiersChange,
}: PriceTiersManagerProps) => {
  const [tiers, setTiers] = useState<PriceTier[]>(initialTiers);
  const [priceReais, setPriceReais] = useState<Record<number, string>>({});
  const [priceCentavos, setPriceCentavos] = useState<Record<number, string>>({});
  const [upToInputValues, setUpToInputValues] = useState<Record<number, string>>({});
  const apolloCoreClient = useApolloCoreClient();
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();

  // Sync tiers when initialTiers changes
  useEffect(() => {
    // Backend returns unitAmount in reais (numeric), but GraphQL sends/receives in cents
    // We need to handle both cases
    const normalizedTiers = initialTiers.map((tier) => {
      // If unitAmount is > 1000, it's likely in cents, convert to reais
      // Otherwise assume it's already in reais
      let unitAmount = tier.unitAmount;
      if (unitAmount > 1000) {
        unitAmount = unitAmount / 100;
      }
      return { ...tier, unitAmount };
    });

    setTiers(normalizedTiers);
    // Initialize price input values (reais and centavos)
    const initialReais: Record<number, string> = {};
    const initialCentavos: Record<number, string> = {};
    const initialUpTo: Record<number, string> = {};

    normalizedTiers.forEach((tier, index) => {
      if (tier.unitAmount > 0) {
        const reais = Math.floor(tier.unitAmount);
        const centavos = Math.round((tier.unitAmount % 1) * 100);
        initialReais[index] = reais.toString();
        initialCentavos[index] = centavos.toString().padStart(2, '0');
      }
      if (tier.upTo !== null && tier.upTo !== undefined) {
        initialUpTo[index] = tier.upTo.toString();
      }
    });
    setPriceReais(initialReais);
    setPriceCentavos(initialCentavos);
    setUpToInputValues(initialUpTo);
  }, [initialTiers]);

  const [createTier, { loading: createLoading }] = useMutation(
    CREATE_CUSTOM_BILLING_PLAN_PRICE_TIER,
    {
      client: apolloCoreClient,
      onCompleted: () => {
        enqueueSuccessSnackBar({ message: t`Faixa de preço criada com sucesso` });
      },
      onError: (error) => {
        enqueueErrorSnackBar({ apolloError: error });
      },
    },
  );

  const [updateTier, { loading: updateLoading }] = useMutation(
    UPDATE_CUSTOM_BILLING_PLAN_PRICE_TIER,
    {
      client: apolloCoreClient,
      onCompleted: () => {
        enqueueSuccessSnackBar({ message: t`Faixa de preço atualizada com sucesso` });
      },
      onError: (error) => {
        enqueueErrorSnackBar({ apolloError: error });
      },
    },
  );

  const [deleteTier, { loading: deleteLoading }] = useMutation(
    DELETE_CUSTOM_BILLING_PLAN_PRICE_TIER,
    {
      client: apolloCoreClient,
      onCompleted: () => {
        enqueueSuccessSnackBar({ message: t`Faixa de preço excluída com sucesso` });
      },
      onError: (error) => {
        enqueueErrorSnackBar({ apolloError: error });
      },
    },
  );

  const getTierRange = (tier: PriceTier, index: number): { from: number; to: number | null } => {
    if (index === 0) {
      return { from: 1, to: tier.upTo };
    }
    const previousTier = tiers[index - 1];
    // "from" is always previous tier's upTo + 1
    const from = previousTier.upTo ? previousTier.upTo + 1 : 1;
    return { from, to: tier.upTo };
  };

  const handleAddTier = async () => {
    // Calculate the starting value for the new tier
    let newUpTo: number | null = null;
    const updatedTiers = [...tiers];

    if (tiers.length === 0) {
      // First tier: default to 1-10
      newUpTo = 10;
    } else {
      const lastTier = tiers[tiers.length - 1];
      // If last tier is unlimited (null), we need to make it limited first
      if (lastTier.upTo === null) {
        // Find the highest upTo value to calculate next range
        const maxUpTo = tiers
          .filter((t) => t.upTo !== null)
          .reduce((max, t) => Math.max(max, t.upTo || 0), 0);
        // Set last tier to have a limit (default range of 10 users)
        const lastTierNewUpTo = maxUpTo + 10;
        // Update last tier to be limited
        updatedTiers[tiers.length - 1] = {
          ...lastTier,
          upTo: lastTierNewUpTo,
        };

        // Save the updated last tier if it has an ID
        if (lastTier.id && planId) {
          await updateTier({
            variables: {
              tierId: lastTier.id,
              upTo: lastTierNewUpTo,
              unitAmount: lastTier.unitAmount,
            },
          });
        }

        // New tier will be unlimited
        newUpTo = null;
      } else {
        // Last tier has a limit, new tier starts after it and is unlimited
        newUpTo = null;
      }
    }

    const newTier: PriceTier = { upTo: newUpTo, unitAmount: 0 };
    updatedTiers.push(newTier);
    setTiers(updatedTiers);
    onTiersChange?.(updatedTiers);
  };

  const updatePriceFromInputs = (index: number, reais: string, centavos: string) => {
    const reaisNum = parseInt(reais || '0', 10) || 0;
    const centavosNum = parseInt(centavos || '00', 10) || 0;
    // Convert to cents (backend expects Int in cents)
    const totalCents = reaisNum * 100 + centavosNum;
    // Store as reais for display, but we'll convert to cents when saving
    const totalValue = reaisNum + centavosNum / 100;
    handleUpdateTier(index, 'unitAmount', totalValue, totalCents);
  };

  const handleUpdateTier = (
    index: number,
    field: 'upTo' | 'unitAmount',
    value: number | null,
    centsValue?: number,
  ) => {
    const updatedTiers = [...tiers];
    const currentTier = updatedTiers[index];

    // Calculate the "from" value for this tier
    let fromValue = 1;
    if (index > 0) {
      const previousTier = updatedTiers[index - 1];
      fromValue = previousTier.upTo ? previousTier.upTo + 1 : 1;
    }

    // If updating "upTo", ensure it's valid (>= from value or null for unlimited)
    if (field === 'upTo') {
      if (value !== null && value < fromValue) {
        // Invalid, don't update
        return;
      }
      updatedTiers[index] = { ...currentTier, upTo: value };
    } else {
      if (value === null) {
        return;
      }
      updatedTiers[index] = { ...currentTier, unitAmount: value };
    }

    setTiers(updatedTiers);
    onTiersChange?.(updatedTiers);

    // If tier has an ID, save it immediately
    if (updatedTiers[index].id && planId) {
      const tier = updatedTiers[index];
      // Convert unitAmount to cents (Int) for GraphQL
      const unitAmountInCents = field === 'unitAmount' && centsValue !== undefined
        ? centsValue
        : Math.round(tier.unitAmount * 100);

      updateTier({
        variables: {
          tierId: tier.id,
          upTo: tier.upTo,
          unitAmount: unitAmountInCents,
        },
      });
    }
  };

  const handleUpdateFrom = (index: number, fromValue: number) => {
    // When updating "from", we need to update the previous tier's "upTo"
    if (index > 0 && fromValue > 1) {
      const updatedTiers = [...tiers];
      const newUpTo = fromValue - 1;
      updatedTiers[index - 1] = {
        ...updatedTiers[index - 1],
        upTo: newUpTo >= 1 ? newUpTo : 1,
      };
      setTiers(updatedTiers);
      onTiersChange?.(updatedTiers);

      // Save previous tier if it has an ID
      if (updatedTiers[index - 1].id && planId) {
        const prevTier = updatedTiers[index - 1];
        updateTier({
          variables: {
            tierId: prevTier.id,
            upTo: prevTier.upTo,
            unitAmount: prevTier.unitAmount,
          },
        });
      }
    }
  };

  const handleRemoveTier = async (index: number) => {
    const tier = tiers[index];
    if (tier.id && planId) {
      await deleteTier({ variables: { tierId: tier.id } });
    }
    const updatedTiers = tiers.filter((_, i) => i !== index);
    setTiers(updatedTiers);
    onTiersChange?.(updatedTiers);
  };

  const handleSaveNewTier = async (index: number) => {
    if (!planId) return;
    const tier = tiers[index];
    if (!tier.id && tier.unitAmount > 0) {
      // Convert unitAmount to cents (Int) for GraphQL
      const unitAmountInCents = Math.round(tier.unitAmount * 100);

      const result = await createTier({
        variables: {
          planId,
          upTo: tier.upTo,
          unitAmount: unitAmountInCents,
        },
      });
      if (result.data) {
        const updatedTiers = [...tiers];
        // Backend returns unitAmount in reais (numeric), not cents
        // GraphQL might return in cents, so check and convert if needed
        let unitAmountInReais = result.data.createCustomBillingPlanPriceTier.unitAmount;
        if (unitAmountInReais > 1000) {
          // Likely in cents, convert to reais
          unitAmountInReais = unitAmountInReais / 100;
        }
        updatedTiers[index] = {
          ...tier,
          id: result.data.createCustomBillingPlanPriceTier.id,
          unitAmount: unitAmountInReais,
        };
        setTiers(updatedTiers);
        onTiersChange?.(updatedTiers);

        // Update price inputs
        const reais = Math.floor(unitAmountInReais);
        const centavos = Math.round((unitAmountInReais % 1) * 100);
        setPriceReais((prev) => ({
          ...prev,
          [index]: reais.toString(),
        }));
        setPriceCentavos((prev) => ({
          ...prev,
          [index]: centavos.toString().padStart(2, '0'),
        }));
      }
    }
  };

  const loading = createLoading || updateLoading || deleteLoading;

  return (
    <Section>
      <H2Title
        title={t`Faixas de Preço por Usuário`}
        description={t`Configure as faixas de preço baseadas no número de usuários. A última faixa pode ser ilimitada.`}
      />
      <StyledTiersContainer>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            title={t`+ Adicionar Faixa de Preço`}
            variant="secondary"
            onClick={handleAddTier}
            disabled={loading || !planId}
          />
        </div>
        <StyledTiersList>
          {tiers.map((tier, index) => {
            const range = getTierRange(tier, index);
            const isLast = index === tiers.length - 1;
            const isFirst = index === 0;

            return (
              <StyledTierCard key={tier.id || index}>
                <StyledTierHeader>
                  <StyledTierNumber>{t`Faixa ${index + 1}`}</StyledTierNumber>
                  <StyledTierRange>
                    {range.to === null
                      ? t`${range.from}+ usuários`
                      : range.from === range.to
                        ? t`${range.from} usuário`
                        : t`${range.from} - ${range.to} usuários`}
                  </StyledTierRange>
                </StyledTierHeader>
                <StyledTierFields>
                  <StyledTierField>
                    <StyledTierLabel>{t`De (usuários)`}</StyledTierLabel>
                    <SettingsTextInput
                      instanceId={`tier-${index}-from`}
                      placeholder={t`Ex: 1`}
                      value={range.from.toString()}
                      onChange={(value) => {
                        const numValue = parseInt(value, 10) || 1;
                        if (numValue >= 1) {
                          handleUpdateFrom(index, numValue);
                        }
                      }}
                      type="number"
                      min="1"
                      disabled={isFirst}
                    />
                    {isFirst && (
                      <div
                        style={{
                          fontSize: '11px',
                          color: '#888',
                          marginTop: '4px',
                        }}
                      >
                        {t`Sempre começa em 1`}
                      </div>
                    )}
                  </StyledTierField>
                  <StyledTierField>
                    <StyledTierLabel>
                      {isLast ? t`Até (usuários)` : t`Até (usuários)`}
                    </StyledTierLabel>
                    <StyledUpToInput
                      instanceId={`tier-${index}-upTo`}
                      placeholder={isLast ? t`Ilimitado (deixe vazio)` : t`Ex: 10`}
                      value={upToInputValues[index] !== undefined ? upToInputValues[index] : tier.upTo?.toString() || ''}
                      onChange={(value) => {
                        // Store raw input value
                        setUpToInputValues((prev) => ({
                          ...prev,
                          [index]: value,
                        }));

                        // Allow empty value or numeric value
                        if (value === '' || value === null) {
                          handleUpdateTier(index, 'upTo', null);
                          return;
                        }
                        // Remove non-numeric characters
                        const numericValue = value.replace(/[^\d]/g, '');
                        if (numericValue === '') {
                          handleUpdateTier(index, 'upTo', null);
                          return;
                        }
                        const numValue = parseInt(numericValue, 10);
                        if (!isNaN(numValue) && numValue >= range.from) {
                          handleUpdateTier(index, 'upTo', numValue);
                        }
                      }}
                      onBlur={() => {
                        // Format on blur
                        const currentValue = upToInputValues[index];
                        if (currentValue !== undefined && currentValue.trim() !== '') {
                          const numValue = parseInt(currentValue.replace(/[^\d]/g, ''), 10);
                          if (!isNaN(numValue) && numValue >= range.from) {
                            setUpToInputValues((prev) => ({
                              ...prev,
                              [index]: numValue.toString(),
                            }));
                          }
                        }
                      }}
                      type="text"
                      fullWidth
                    />
                    {isLast && (
                      <div
                        style={{
                          fontSize: '11px',
                          color: '#888',
                          marginTop: '4px',
                        }}
                      >
                        {t`Deixe vazio para ilimitado`}
                      </div>
                    )}
                  </StyledTierField>
                  <StyledTierField>
                    <StyledTierLabel>{t`Preço por usuário`}</StyledTierLabel>
                    <StyledPriceContainer>
                      <StyledPriceInputs>
                        <StyledPriceInputGroup>
                          <StyledPriceReaisInput
                            instanceId={`tier-${index}-reais`}
                            placeholder={t`Reais`}
                            value={priceReais[index] !== undefined ? priceReais[index] : tier.unitAmount > 0 ? Math.floor(tier.unitAmount).toString() : ''}
                            onChange={(value) => {
                              const numericValue = value.replace(/[^\d]/g, '');
                              setPriceReais((prev) => ({
                                ...prev,
                                [index]: numericValue,
                              }));
                              updatePriceFromInputs(index, numericValue, priceCentavos[index] || '00');
                            }}
                            type="text"
                          />
                          <span style={{ fontSize: '14px', color: '#666', padding: '0 4px' }}>,</span>
                          <StyledPriceCentavosInput
                            instanceId={`tier-${index}-centavos`}
                            placeholder={t`Centavos`}
                            value={priceCentavos[index] !== undefined ? priceCentavos[index] : tier.unitAmount > 0 ? Math.round((tier.unitAmount % 1) * 100).toString().padStart(2, '0') : '00'}
                            onChange={(value) => {
                              let numericValue = value.replace(/[^\d]/g, '');
                              // Limit to 2 digits
                              if (numericValue.length > 2) {
                                numericValue = numericValue.substring(0, 2);
                              }
                              // Pad with zeros if needed
                              if (numericValue.length === 1) {
                                numericValue = numericValue.padStart(2, '0');
                              }
                              setPriceCentavos((prev) => ({
                                ...prev,
                                [index]: numericValue,
                              }));
                              updatePriceFromInputs(index, priceReais[index] || '0', numericValue);
                            }}
                            type="text"
                          />
                        </StyledPriceInputGroup>
                      </StyledPriceInputs>
                      {(() => {
                        const reais = priceReais[index] !== undefined ? priceReais[index] : (tier.unitAmount > 0 ? Math.floor(tier.unitAmount).toString() : '0');
                        const centavos = priceCentavos[index] !== undefined ? priceCentavos[index] : (tier.unitAmount > 0 ? Math.round((tier.unitAmount % 1) * 100).toString().padStart(2, '0') : '00');
                        const totalValue = parseFloat(`${reais}.${centavos}`) || 0;
                        return (
                          <StyledPriceDisplay>
                            <span style={{ color: 'inherit', fontWeight: 600 }}>R$</span>
                            <span style={{ color: 'inherit', fontWeight: 600 }}>
                              {totalValue.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </StyledPriceDisplay>
                        );
                      })()}
                    </StyledPriceContainer>
                  </StyledTierField>
                </StyledTierFields>
                <StyledTierActions>
                  {!tier.id && (
                    <Button
                      title={t`Salvar`}
                      variant="secondary"
                      onClick={() => handleSaveNewTier(index)}
                      disabled={loading || !planId || tier.unitAmount <= 0}
                    />
                  )}
                  <Button
                    title={t`Remover`}
                    variant="secondary"
                    accent="danger"
                    onClick={() => handleRemoveTier(index)}
                    disabled={loading}
                  />
                </StyledTierActions>
              </StyledTierCard>
            );
          })}
        </StyledTiersList>
        {tiers.length === 0 && (
          <StyledEmptyState>
            <div style={{ fontSize: '14px', marginBottom: '8px' }}>
              {t`Nenhuma faixa de preço configurada`}
            </div>
            <div style={{ fontSize: '12px' }}>
              {t`Clique em "Adicionar Faixa de Preço" para começar a configurar as faixas de preço por número de usuários.`}
            </div>
          </StyledEmptyState>
        )}
      </StyledTiersContainer>
    </Section>
  );
};
