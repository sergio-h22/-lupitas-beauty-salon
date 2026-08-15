export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4; // 0=weak, 4=strong
  message: string;
  isValid: boolean;
}

export function validatePassword(password: string): PasswordStrength {
  const checks = {
    length: password.length >= 12,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const passedChecks = Object.values(checks).filter(Boolean).length;

  let score: 0 | 1 | 2 | 3 | 4 = 0;
  let message = '';

  if (password.length < 8) {
    return {
      score: 0,
      message: 'Password must be at least 8 characters',
      isValid: false,
    };
  }

  if (passedChecks === 1) {
    score = 1;
    message = 'Password is weak';
  } else if (passedChecks === 2) {
    score = 2;
    message = 'Password is fair';
  } else if (passedChecks === 3) {
    score = 3;
    message = 'Password is good';
  } else if (passedChecks >= 4) {
    score = 4;
    message = 'Password is strong';
  }

  const isValid = passedChecks >= 3; // Require at least 3 checks

  return {
    score,
    message,
    isValid,
  };
}

export function getPasswordRequirements() {
  return [
    { text: 'At least 8 characters', icon: '✓' },
    { text: 'Lowercase letters (a-z)', icon: '✓' },
    { text: 'Uppercase letters (A-Z)', icon: '✓' },
    { text: 'Numbers (0-9)', icon: '✓' },
    { text: 'Special characters (!@#$%...)', icon: '◇' },
  ];
}
