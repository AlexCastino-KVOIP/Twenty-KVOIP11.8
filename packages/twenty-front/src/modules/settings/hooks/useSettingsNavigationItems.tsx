import { SettingsPath } from 'twenty-shared/types';

import { useAuth } from '@/auth/hooks/useAuth';
import { currentUserState } from '@/auth/states/currentUserState';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { billingState } from '@/client-config/states/billingState';
import { usePermissionFlagMap } from '@/settings/roles/hooks/usePermissionFlagMap';
import { type NavigationDrawerItemIndentationLevel } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerItem';
import { useIsFeatureEnabled } from '@/workspace/hooks/useIsFeatureEnabled';
import { t } from '@lingui/core/macro';
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isDefined } from 'twenty-shared/utils';
import {
    IconApi,
    IconApps,
    IconAt,
    IconCalendarEvent,
    IconColorSwatch,
    type IconComponent,
    IconCurrencyDollar,
    IconDoorEnter,
    IconHierarchy2,
    IconKey,
    IconLock,
    IconMail,
    IconPuzzle2,
    IconRocket,
    IconServer,
    IconSettings,
    IconSparkles,
    IconUserCircle,
    IconUsers,
    IconWorld,
} from 'twenty-ui/display';
import { FeatureFlagKey, PermissionFlagType } from '~/generated/graphql';

export type SettingsNavigationSection = {
  label: string;
  items: SettingsNavigationItem[];
  isAdvanced?: boolean;
};

export type SettingsNavigationItem = {
  label: string;
  path?: SettingsPath;
  onClick?: () => void;
  Icon: IconComponent;
  indentationLevel?: NavigationDrawerItemIndentationLevel;
  matchSubPages?: boolean;
  isHidden?: boolean;
  subItems?: SettingsNavigationItem[];
  isAdvanced?: boolean;
  soon?: boolean;
  isNew?: boolean;
};

const useSettingsNavigationItems = (): SettingsNavigationSection[] => {
  const billing = useRecoilValue(billingState);
  const { signOut } = useAuth();
  const location = useLocation();

  const isBillingEnabled = billing?.isBillingEnabled ?? false;
  const currentUser = useRecoilValue(currentUserState);
  const currentWorkspace = useRecoilValue(currentWorkspaceState);
  const isAdminEnabled =
    (currentUser?.canImpersonate || currentUser?.canAccessFullAdminPanel) ??
    false;
  const isAIEnabled = useIsFeatureEnabled(FeatureFlagKey.IS_AI_ENABLED);
  const isApplicationEnabled = useIsFeatureEnabled(
    FeatureFlagKey.IS_APPLICATION_ENABLED,
  );

  // Verificar se está em modo LOCAL (workspace tem customBillingPlanId ou parâmetro ?local=true)
  const urlParams = new URLSearchParams(location.search);
  const forceLocal = urlParams.get('local') === 'true';

  const useLocalBilling = forceLocal || isDefined(
    currentWorkspace?.customBillingPlanId,
  );

  const permissionMap = usePermissionFlagMap();
  return [
    {
      label: t`User`,
      items: [
        {
          label: t`Profile`,
          path: SettingsPath.ProfilePage,
          Icon: IconUserCircle,
        },
        {
          label: t`Experience`,
          path: SettingsPath.Experience,
          Icon: IconColorSwatch,
        },
        {
          label: t`Accounts`,
          path: SettingsPath.Accounts,
          Icon: IconAt,
          subItems: [
            {
              label: t`Emails`,
              path: SettingsPath.AccountsEmails,
              Icon: IconMail,
              indentationLevel: 2,
            },
            {
              label: t`Calendars`,
              path: SettingsPath.AccountsCalendars,
              Icon: IconCalendarEvent,
              indentationLevel: 2,
            },
          ],
        },
      ],
    },
    {
      label: t`Workspace`,
      items: [
        {
          label: t`General`,
          path: SettingsPath.Workspace,
          Icon: IconSettings,
          isHidden: !permissionMap[PermissionFlagType.WORKSPACE],
        },
        {
          label: t`Data model`,
          path: SettingsPath.Objects,
          Icon: IconHierarchy2,
          isHidden: !permissionMap[PermissionFlagType.DATA_MODEL],
        },
        {
          label: t`Members`,
          path: SettingsPath.WorkspaceMembersPage,
          Icon: IconUsers,
          isHidden: !permissionMap[PermissionFlagType.WORKSPACE_MEMBERS],
        },
        {
          label: t`Roles`,
          path: SettingsPath.Roles,
          Icon: IconLock,
          isHidden: !permissionMap[PermissionFlagType.ROLES],
        },
        {
          label: t`Domains`,
          path: SettingsPath.Domains,
          Icon: IconWorld,
          isHidden: !permissionMap[PermissionFlagType.WORKSPACE],
        },
        {
          label: t`Billing`,
          path: SettingsPath.Billing,
          Icon: IconCurrencyDollar,
          // Ocultar item antigo quando em modo LOCAL
          isHidden:
            !isBillingEnabled ||
            !permissionMap[PermissionFlagType.WORKSPACE] ||
            useLocalBilling,
        },
        {
          label: t`Billing`,
          path: SettingsPath.Billing,
          Icon: IconCurrencyDollar,
          // Mostrar novo item apenas quando em modo LOCAL
          isHidden:
            !isBillingEnabled ||
            !permissionMap[PermissionFlagType.WORKSPACE] ||
            !useLocalBilling,
        },
        {
          label: t`APIs & Webhooks`,
          path: SettingsPath.ApiWebhooks,
          Icon: IconApi,
          isHidden: !permissionMap[PermissionFlagType.API_KEYS_AND_WEBHOOKS],
        },
        {
          label: t`Integrations`,
          path: SettingsPath.Integrations,
          Icon: IconApps,
          isHidden: !permissionMap[PermissionFlagType.API_KEYS_AND_WEBHOOKS],
        },
        {
          label: t`Applications`,
          path: SettingsPath.Applications,
          Icon: IconPuzzle2,
          isHidden:
            !isApplicationEnabled ||
            !permissionMap[PermissionFlagType.WORKSPACE],
          isNew: true,
        },
        {
          label: t`AI`,
          path: SettingsPath.AI,
          Icon: IconSparkles,
          isHidden:
            !isAIEnabled || !permissionMap[PermissionFlagType.WORKSPACE],
          isNew: true,
        },
        {
          label: t`Security`,
          path: SettingsPath.Security,
          Icon: IconKey,
          isAdvanced: true,
          isHidden: !permissionMap[PermissionFlagType.SECURITY],
        },
      ],
    },
    {
      label: t`Other`,
      items: [
        {
          label: t`Admin Panel`,
          path: SettingsPath.AdminPanel,
          Icon: IconServer,
          isHidden: !isAdminEnabled,
        },
        {
          label: t`Releases`,
          path: SettingsPath.Releases,
          Icon: IconRocket,
          isHidden: !permissionMap[PermissionFlagType.WORKSPACE],
        },
        {
          label: t`Logout`,
          onClick: signOut,
          Icon: IconDoorEnter,
          matchSubPages: false,
        },
      ],
    },
  ];
};

export { useSettingsNavigationItems };

