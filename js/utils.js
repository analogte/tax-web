/**
 * Thai Tax Calculator - Utility Functions
 */
'use strict';

const Utils = {
    /**
     * Format number with commas for display
     * @param {number} value - The value to format
     * @param {boolean} includeSymbol - Whether to include the currency symbol
     * @returns {string} Formatted currency string
     */
    formatCurrency(value, includeSymbol = true) {
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
    },

    /**
     * Format number with thousand separators (alias for formatCurrency without symbol)
     * @param {number} value - The value to format
     * @returns {string} Formatted number string
     */
    formatNumber(value) {
        if (typeof value !== 'number' || isNaN(value)) {
            return '0';
        }
        return value.toLocaleString('th-TH', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    },

    /**
     * Format input value with commas as user types
     * @param {string} value - Raw input value
     * @returns {string} Formatted string with commas
     */
    formatInputNumber(value) {
        // Remove existing commas and non-numeric chars (keep decimals)
        const cleanValue = value.replace(/,/g, '').replace(/[^\d.]/g, '');
        if (!cleanValue) return '';

        // Format with commas
        const parts = cleanValue.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        return parts.join('.');
    },

    /**
     * Parse formatted number string back to number
     * @param {string} value - Formatted string
     * @returns {number} Numeric value
     */
    parseInputNumber(value) {
        if (!value) return 0;
        return parseFloat(value.replace(/,/g, '')) || 0;
    },

    /**
     * Parse currency string to number
     * @param {string} value - The currency string to parse
     * @returns {number} Parsed number
     */
    parseCurrency(value) {
        if (typeof value !== 'string') {
            return 0;
        }
        const cleaned = value.replace(/[^\d.-]/g, '');
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? 0 : parsed;
    },

    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },

    formatPercentage(value, decimals = 0) {
        if (typeof value !== 'number' || isNaN(value)) {
            return '0%';
        }
        const percentage = (value * 100).toFixed(decimals);
        return `${percentage}%`;
    },

    getThaiMonthName(monthIndex) {
        const months = [
            'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
            'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
            'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
        ];
        return months[Utils.clamp(monthIndex, 0, 11)];
    },

    getThaiDayName(dayIndex) {
        const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
        return days[Utils.clamp(dayIndex, 0, 6)];
    },

    formatThaiDate(date) {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        const day = date.getDate();
        const month = Utils.getThaiMonthName(date.getMonth());
        const year = date.getFullYear() + 543;
        return `${day} ${month} ${year}`;
    },

    formatThaiTime(date) {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    },

    formatThaiDateTime(date) {
        return `${Utils.formatThaiDate(date)} ${Utils.formatThaiTime(date)}`;
    },

    debounce(func, delay = 300) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    throttle(func, delay = 300) {
        let lastCall = 0;
        return function (...args) {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                func.apply(this, args);
            }
        };
    },

    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => Utils.deepClone(item));
        if (obj instanceof Object) {
            const cloned = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    cloned[key] = Utils.deepClone(obj[key]);
                }
            }
            return cloned;
        }
    },

    mergeObjects(target, source) {
        const result = { ...target };
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
                    result[key] = Utils.mergeObjects(result[key] || {}, source[key]);
                } else {
                    result[key] = source[key];
                }
            }
        }
        return result;
    },

    isEmpty(value) {
        if (value === null || value === undefined) return true;
        if (typeof value === 'string') return value.trim().length === 0;
        if (Array.isArray(value)) return value.length === 0;
        if (typeof value === 'object') return Object.keys(value).length === 0;
        return false;
    },

    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },

    objectToQueryString(obj) {
        const params = new URLSearchParams();
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                params.append(key, obj[key]);
            }
        }
        return params.toString();
    },

    queryStringToObject(queryString) {
        const params = new URLSearchParams(queryString);
        const obj = {};
        for (const [key, value] of params) {
            obj[key] = value;
        }
        return obj;
    },

    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background-color: ${Utils.getNotificationColor(type)};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            animation: slideIn 0.3s ease-out;
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    },

    getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#6366f1',
        };
        return colors[type] || colors.info;
    },

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy:', err);
            return false;
        }
    },

    downloadFile(content, filename, mimeType = 'text/plain') {
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
};

// Initialize animation styles
(function () {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
    `;
    document.head.appendChild(style);
})();
