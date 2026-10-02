export const createUniqueEmail = (prefix = 'uiuser') =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}@example.com`;