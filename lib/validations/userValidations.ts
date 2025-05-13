export const isEmail = (value: string): boolean => {
   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
   return emailRegex.test(value);
};

export const isPassword = (value: string): boolean => value.length >= 8;

export const validateConfirmPassword = (
   password: string,
   confirmPassword: string
) => password === confirmPassword;
