export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    isValid: regex.test(email),
    error: regex.test(email) ? null : 'Invalid email address'
  };
};

export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters' };
  }
  return { isValid: true, error: null };
};

export const validateRequired = (value, fieldName) => {
  const isValid = value && value.toString().trim().length > 0;
  return {
    isValid,
    error: isValid ? null : `${fieldName} is required`
  };
};

export const validateFileSize = (file, maxSizeInMB = 10) => {
  const maxSize = maxSizeInMB * 1024 * 1024;
  const isValid = file.size <= maxSize;
  return {
    isValid,
    error: isValid ? null : `File size must be less than ${maxSizeInMB}MB`
  };
};

export const validateFileType = (file, allowedTypes = []) => {
  if (allowedTypes.length === 0) {
    return { isValid: true, error: null };
  }
  const fileType = file.type;
  const isValid = allowedTypes.includes(fileType);
  return {
    isValid,
    error: isValid ? null : 'Invalid file type'
  };
};