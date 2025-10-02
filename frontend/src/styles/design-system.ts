// Design System - Arco Solutions
// Sistema centralizado de cores, espaçamentos e tipografia

export const colors = {
  // Brand Colors - Identidade Visual Arco
  brand: {
    primary: 'hsl(45, 95%, 50%)',      // Amarelo/Âmbar - Cor principal
    primaryHover: 'hsl(45, 95%, 45%)',
    primaryLight: 'hsl(45, 95%, 85%)',
    secondary: 'hsl(220, 15%, 15%)',   // Azul marinho corporativo
    secondaryLight: 'hsl(220, 10%, 25%)',
  },

  // Status Colors
  status: {
    success: 'hsl(142, 76%, 36%)',
    successLight: 'hsl(142, 76%, 90%)',
    warning: 'hsl(38, 92%, 50%)',
    warningLight: 'hsl(38, 92%, 90%)',
    error: 'hsl(0, 84%, 60%)',
    errorLight: 'hsl(0, 84%, 95%)',
    info: 'hsl(217, 91%, 60%)',
    infoLight: 'hsl(217, 91%, 95%)',
  },

  // Role Colors - Padronizados
  roles: {
    superAdmin: {
      from: 'hsl(280, 70%, 55%)',    // Roxo
      to: 'hsl(320, 70%, 55%)',      // Rosa
    },
    admin: {
      from: 'hsl(210, 70%, 55%)',    // Azul
      to: 'hsl(190, 70%, 55%)',      // Ciano
    },
    user: {
      from: 'hsl(142, 70%, 45%)',    // Verde
      to: 'hsl(160, 70%, 45%)',      // Verde-água
    },
  },

  // Neutral Colors
  neutral: {
    background: 'hsl(0, 0%, 98%)',
    foreground: 'hsl(220, 15%, 15%)',
    muted: 'hsl(220, 8%, 96%)',
    mutedForeground: 'hsl(220, 8%, 45%)',
    border: 'hsl(220, 13%, 91%)',
  },
};

export const typography = {
  fonts: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
  },
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
  },
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
};

export const borderRadius = {
  sm: '0.375rem',  // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  full: '9999px',
};

// Utility functions
export const getRoleGradient = (role: string) => {
  const roleMap: { [key: string]: { from: string; to: string } } = {
    SUPER_ADMIN: colors.roles.superAdmin,
    ADMIN: colors.roles.admin,
    USER: colors.roles.user,
  };
  return roleMap[role] || colors.roles.user;
};

export const getStatusColor = (status: string) => {
  const statusMap: { [key: string]: string } = {
    ACTIVE: colors.status.success,
    INACTIVE: colors.neutral.mutedForeground,
    PENDING: colors.status.warning,
  };
  return statusMap[status] || colors.neutral.mutedForeground;
};