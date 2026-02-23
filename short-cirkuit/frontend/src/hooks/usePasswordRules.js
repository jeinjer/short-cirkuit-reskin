import { useMemo } from 'react';

export default function usePasswordRules(password = '', confirmPassword = '') {
  const validations = useMemo(() => ([
    { label: 'Minimo 6 caracteres', valid: password.length >= 6 },
    { label: 'Maximo 16 caracteres', valid: password.length <= 16 && password.length > 0 },
    { label: 'Al menos 1 mayuscula', valid: /[A-Z]/.test(password) },
    { label: 'Al menos 1 número', valid: /[0-9]/.test(password) },
    { label: 'Al menos 1 simbolo', valid: /[^A-Za-z0-9]/.test(password) }
  ]), [password]);

  const lengthValidations = validations.slice(0, 2);
  const typeValidations = validations.slice(2);
  const allRequirementsMet = validations.every((item) => item.valid);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  return {
    validations,
    lengthValidations,
    typeValidations,
    allRequirementsMet,
    passwordsMatch
  };
}
