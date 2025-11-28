export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateLogin = (formData: FormData): ValidationResult => {
  const errors: Record<string, string> = {};
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email) errors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Email is invalid";

  if (!password) errors.password = "Password is required";
  else if (password.length < 6)
    errors.password = "Password must be at least 6 characters";

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateSignup = (formData: FormData): ValidationResult => {
  const errors: Record<string, string> = {};
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const gender = formData.get("gender") as string;

  // First Name Validation
  if (!firstName) errors.firstName = "First name is required";
  else if (firstName.length < 2)
    errors.firstName = "First name must be at least 2 characters";
  else if (firstName.length > 20)
    errors.firstName = "First name must be less than 20 characters";

  // Last Name Validation
  if (!lastName) errors.lastName = "Last name is required";
  else if (lastName.length < 2)
    errors.lastName = "Last name must be at least 2 characters";
  else if (lastName.length > 20)
    errors.lastName = "Last name must be less than 20 characters";

  // Email Validation
  if (!email) errors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Email is invalid";

  // Gender Validation
  if (!gender) errors.gender = "Gender is required";
  else if (!["MALE", "FEMALE"].includes(gender))
    errors.gender = "Please select a valid gender";

  // Password Validation
  if (!password) errors.password = "Password is required";
  else if (password.length < 6)
    errors.password = "Password must be at least 6 characters";
  else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    errors.password =
      "Password must contain at least one uppercase letter, one lowercase letter, and one number";
  }

  // Confirm Password Validation
  if (!confirmPassword) errors.confirmPassword = "Please confirm your password";
  else if (password !== confirmPassword)
    errors.confirmPassword = "Passwords do not match";

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
