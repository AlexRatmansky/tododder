const isEmpty = string => string.trim() === '';

interface Errors {
  email?: string;
  password?: string;
}

export const validateLoginData = data => {
  const errors: Errors = {};

  if (isEmpty(data.email)) errors.email = 'Must not be empty';

  if (isEmpty(data.password)) errors.password = 'Must not be  empty';

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
};
