import { useState } from 'react';

export default function usePasswordFieldVisibility() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return {
    showPassword,
    togglePasswordVisibility: () => setShowPassword((prev) => !prev),
    showConfirmPassword,
    toggleConfirmPasswordVisibility: () => setShowConfirmPassword((prev) => !prev)
  };
}
