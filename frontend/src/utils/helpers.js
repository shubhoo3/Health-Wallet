export const formatDate = (date, format = 'short') => {
  const d = new Date(date);
  
  if (format === 'short') {
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  
  if (format === 'long') {
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }
  
  return d.toISOString().split('T')[0];
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getVitalColor = (vitalType) => {
  const colors = {
    'Blood Sugar': 'blue',
    'Blood Pressure': 'green',
    'Heart Rate': 'red',
    'Temperature': 'orange',
    'Weight': 'purple',
    'Oxygen Level': 'cyan'
  };
  return colors[vitalType] || 'gray';
};

export const getVitalUnit = (vitalType) => {
  const units = {
    'Blood Sugar': 'mg/dL',
    'Blood Pressure': 'mmHg',
    'Heart Rate': 'bpm',
    'Temperature': '°F',
    'Weight': 'kg',
    'Oxygen Level': '%',
    'Cholesterol': 'mg/dL',
    'Hemoglobin': 'g/dL'
  };
  return units[vitalType] || '';
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};