/**
 * Thai Tax Calculator - Utility Functions
 */

/**
 * Format number as Thai currency
 * @param {number} value - The value to format
 * @param {boolean} includeSymbol - Whether to include the currency symbol
 * @returns {string} Formatted currency string
 */
function formatCurrency(value, includeSymbol = true) {
    if (typeof value !== 'number' || isNaN(value)) {
        return '0 บาท';
    }

    const absValue = Math.abs(value);
    const isNegative = value < 0;
    
    // Format with thousand separators
    const formatted = absValue.toLocaleString('th-TH', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    const result = includeSymbol ? `${formatted} บาท` : formatted;
    return isNegative ? `-${result}` : result;
}

/**
 * Format number with thousand separators
 * @param {number} value - The value to format
 * @returns {string} Formatted number string
 */
function formatNumber(value) {
    if (typeof value !== 'number' || isNaN(value)) {
        return '0';
    }

    return value.toLocaleString('th-TH', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
}

/**
 * Parse currency string to number
 * @param {string} value - The currency string to parse
 * @returns {number} Parsed number
 */
function parseCurrency(value) {
    if (typeof value !== 'string') {
        return 0;
    }

    // Remove currency symbol and spaces, then parse
    const cleaned = value.replace(/[^\d.-]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
}

/**
 * Clamp a value between min and max
 * @param {number} value - The value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/**
 * Format percentage
 * @param {number} value - The percentage value (0-1)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
function formatPercentage(value, decimals = 0) {
    if (typeof value !== 'number' || isNaN(value)) {
        return '0%';
    }

    const percentage = (value * 100).toFixed(decimals);
    return `${percentage}%`;
}

/**
 * Get Thai month name
 * @param {number} monthIndex - Month index (0-11)
 * @returns {string} Thai month name
 */
function getThaiMonthName(monthIndex) {
    const months = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
        'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
        'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    return months[clamp(monthIndex, 0, 11)];
}

/**
 * Get Thai day name
 * @param {number} dayIndex - Day index (0-6, where 0 is Sunday)
 * @returns {string} Thai day name
 */
function getThaiDayName(dayIndex) {
    const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    return days[clamp(dayIndex, 0, 6)];
}

/**
 * Format date to Thai format
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
function formatThaiDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    const day = date.getDate();
    const month = getThaiMonthName(date.getMonth());
    const year = date.getFullYear() + 543; // Buddhist calendar

    return `${day} ${month} ${year}`;
}

/**
 * Format time to Thai format
 * @param {Date} date - The date to format
 * @returns {string} Formatted time string
 */
function formatThaiTime(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

/**
 * Format datetime to Thai format
 * @param {Date} date - The date to format
 * @returns {string} Formatted datetime string
 */
function formatThaiDateTime(date) {
    return `${formatThaiDate(date)} ${formatThaiTime(date)}`;
}

/**
 * Debounce a function
 * @param {Function} func - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, delay = 300) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Throttle a function
 * @param {Function} func - The function to throttle
 * @param {number} delay - The delay in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, delay = 300) {
    let lastCall = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            func.apply(this, args);
        }
    };
}

/**
 * Deep clone an object
 * @param {Object} obj - The object to clone
 * @returns {Object} Cloned object
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }

    if (obj instanceof Array) {
        return obj.map(item => deepClone(item));
    }

    if (obj instanceof Object) {
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = deepClone(obj[key]);
            }
        }
        return cloned;
    }
}

/**
 * Merge two objects
 * @param {Object} target - The target object
 * @param {Object} source - The source object
 * @returns {Object} Merged object
 */
function mergeObjects(target, source) {
    const result = { ...target };
    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
                result[key] = mergeObjects(result[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
    }
    return result;
}

/**
 * Check if value is empty
 * @param {*} value - The value to check
 * @returns {boolean} True if value is empty
 */
function isEmpty(value) {
    if (value === null || value === undefined) {
        return true;
    }

    if (typeof value === 'string') {
        return value.trim().length === 0;
    }

    if (Array.isArray(value)) {
        return value.length === 0;
    }

    if (typeof value === 'object') {
        return Object.keys(value).length === 0;
    }

    return false;
}

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Convert object to query string
 * @param {Object} obj - The object to convert
 * @returns {string} Query string
 */
function objectToQueryString(obj) {
    const params = new URLSearchParams();
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            params.append(key, obj[key]);
        }
    }
    return params.toString();
}

/**
 * Parse query string to object
 * @param {string} queryString - The query string to parse
 * @returns {Object} Parsed object
 */
function queryStringToObject(queryString) {
    const params = new URLSearchParams(queryString);
    const obj = {};
    for (const [key, value] of params) {
        obj[key] = value;
    }
    return obj;
}

/**
 * Show notification
 * @param {string} message - The message to show
 * @param {string} type - The notification type (success, error, warning, info)
 * @param {number} duration - The duration in milliseconds
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background-color: ${getNotificationColor(type)};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    // Remove after duration
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

/**
 * Get notification color
 * @param {string} type - The notification type
 * @returns {string} Color code
 */
function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#6366f1',
    };
    return colors[type] || colors.info;
}

/**
 * Copy text to clipboard
 * @param {string} text - The text to copy
 * @returns {Promise<boolean>} True if successful
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
}

/**
 * Download file
 * @param {string} content - The file content
 * @param {string} filename - The filename
 * @param {string} mimeType - The MIME type
 */
function downloadFile(content, filename, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Add CSS animation styles to document
 */
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize animation styles when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addAnimationStyles);
} else {
    addAnimationStyles();
}
