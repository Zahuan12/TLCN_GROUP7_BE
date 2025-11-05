import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Format date to Vietnamese format
 * @param {string|Date} date - Date to format
 * @param {string} formatStr - Format string (default: 'dd/MM/yyyy')
 * @returns {string} Formatted date
 */
export function formatDate(date, formatStr = 'dd/MM/yyyy') {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: vi });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

/**
 * Format datetime to Vietnamese format
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted datetime
 */
export function formatDateTime(date) {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
}

/**
 * Format time only
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted time
 */
export function formatTime(date) {
  return formatDate(date, 'HH:mm');
}

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time
 */
export function formatRelativeTime(date) {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: vi });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return '';
  }
}

/**
 * Format date for API (ISO format)
 * @param {Date} date - Date to format
 * @returns {string} ISO formatted date
 */
export function formatDateForAPI(date) {
  if (!date) return '';
  return date.toISOString();
}

