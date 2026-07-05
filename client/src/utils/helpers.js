export const formatCurrency = (amount, currency = 'ETB') => {
  return new Intl.NumberFormat('en-ET', { style: 'currency', currency }).format(amount);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

export const calculateNights = (checkIn, checkOut) => {
  const diff = new Date(checkOut) - new Date(checkIn);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const truncateText = (text, maxLength = 100) => {
  return text.length <= maxLength ? text : `${text.slice(0, maxLength)}...`;
};

export const getStatusColor = (status) => {
  const colors = {
    confirmed: 'text-green-600 bg-green-100',
    pending: 'text-yellow-600 bg-yellow-100',
    cancelled: 'text-red-600 bg-red-100',
    completed: 'text-blue-600 bg-blue-100',
  };
  return colors[status?.toLowerCase()] || 'text-gray-600 bg-gray-100';
};

export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

