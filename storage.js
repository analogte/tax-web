/**
 * Thai Tax Calculator - Storage Management
 * Handles LocalStorage and IndexedDB operations
 */

class StorageManager {
    /**
     * Save calculation to history
     * @param {Object} calculation - The calculation object
     * @returns {boolean} True if successful
     */
    static saveCalculation(calculation) {
        try {
            const history = this.getCalculationHistory();
            
            // Add ID and timestamp if not present
            if (!calculation.id) {
                calculation.id = generateId();
            }
            if (!calculation.timestamp) {
                calculation.timestamp = new Date().toISOString();
            }

            // Add to beginning of history
            history.unshift(calculation);

            // Keep only the latest items
            const limited = history.slice(0, APP_CONFIG.maxHistoryItems);

            localStorage.setItem(STORAGE_KEYS.calculationHistory, JSON.stringify(limited));
            localStorage.setItem(STORAGE_KEYS.lastCalculation, JSON.stringify(calculation));

            return true;
        } catch (error) {
            console.error('Error saving calculation:', error);
            return false;
        }
    }

    /**
     * Get calculation history
     * @returns {Array} Array of calculations
     */
    static getCalculationHistory() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.calculationHistory);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error getting calculation history:', error);
            return [];
        }
    }

    /**
     * Get last calculation
     * @returns {Object|null} Last calculation or null
     */
    static getLastCalculation() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.lastCalculation);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting last calculation:', error);
            return null;
        }
    }

    /**
     * Get calculation by ID
     * @param {string} id - The calculation ID
     * @returns {Object|null} Calculation or null
     */
    static getCalculationById(id) {
        try {
            const history = this.getCalculationHistory();
            return history.find(calc => calc.id === id) || null;
        } catch (error) {
            console.error('Error getting calculation by ID:', error);
            return null;
        }
    }

    /**
     * Delete calculation from history
     * @param {string} id - The calculation ID
     * @returns {boolean} True if successful
     */
    static deleteCalculation(id) {
        try {
            const history = this.getCalculationHistory();
            const filtered = history.filter(calc => calc.id !== id);
            localStorage.setItem(STORAGE_KEYS.calculationHistory, JSON.stringify(filtered));
            return true;
        } catch (error) {
            console.error('Error deleting calculation:', error);
            return false;
        }
    }

    /**
     * Clear all calculation history
     * @returns {boolean} True if successful
     */
    static clearHistory() {
        try {
            localStorage.removeItem(STORAGE_KEYS.calculationHistory);
            localStorage.removeItem(STORAGE_KEYS.lastCalculation);
            return true;
        } catch (error) {
            console.error('Error clearing history:', error);
            return false;
        }
    }

    /**
     * Save user preferences
     * @param {Object} preferences - The preferences object
     * @returns {boolean} True if successful
     */
    static savePreferences(preferences) {
        try {
            const current = this.getPreferences();
            const merged = mergeObjects(current, preferences);
            localStorage.setItem(STORAGE_KEYS.userPreferences, JSON.stringify(merged));
            return true;
        } catch (error) {
            console.error('Error saving preferences:', error);
            return false;
        }
    }

    /**
     * Get user preferences
     * @returns {Object} Preferences object
     */
    static getPreferences() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.userPreferences);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('Error getting preferences:', error);
            return {};
        }
    }

    /**
     * Save named calculation
     * @param {string} name - The name for the calculation
     * @param {Object} calculation - The calculation object
     * @returns {boolean} True if successful
     */
    static saveNamedCalculation(name, calculation) {
        try {
            const saved = this.getSavedCalculations();
            
            const namedCalc = {
                id: generateId(),
                name: name,
                calculation: calculation,
                timestamp: new Date().toISOString(),
            };

            saved.push(namedCalc);
            localStorage.setItem(STORAGE_KEYS.savedCalculations, JSON.stringify(saved));

            return true;
        } catch (error) {
            console.error('Error saving named calculation:', error);
            return false;
        }
    }

    /**
     * Get saved calculations
     * @returns {Array} Array of saved calculations
     */
    static getSavedCalculations() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.savedCalculations);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error getting saved calculations:', error);
            return [];
        }
    }

    /**
     * Delete saved calculation
     * @param {string} id - The saved calculation ID
     * @returns {boolean} True if successful
     */
    static deleteSavedCalculation(id) {
        try {
            const saved = this.getSavedCalculations();
            const filtered = saved.filter(calc => calc.id !== id);
            localStorage.setItem(STORAGE_KEYS.savedCalculations, JSON.stringify(filtered));
            return true;
        } catch (error) {
            console.error('Error deleting saved calculation:', error);
            return false;
        }
    }

    /**
     * Export data as JSON
     * @returns {Object} Exported data
     */
    static exportData() {
        return {
            version: APP_CONFIG.version,
            exportDate: new Date().toISOString(),
            calculationHistory: this.getCalculationHistory(),
            savedCalculations: this.getSavedCalculations(),
            preferences: this.getPreferences(),
        };
    }

    /**
     * Import data from JSON
     * @param {Object} data - The data to import
     * @returns {boolean} True if successful
     */
    static importData(data) {
        try {
            if (data.calculationHistory) {
                localStorage.setItem(STORAGE_KEYS.calculationHistory, JSON.stringify(data.calculationHistory));
            }
            if (data.savedCalculations) {
                localStorage.setItem(STORAGE_KEYS.savedCalculations, JSON.stringify(data.savedCalculations));
            }
            if (data.preferences) {
                localStorage.setItem(STORAGE_KEYS.userPreferences, JSON.stringify(data.preferences));
            }
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    /**
     * Check storage availability
     * @returns {boolean} True if storage is available
     */
    static isStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Get storage size info
     * @returns {Object} Storage size information
     */
    static getStorageInfo() {
        try {
            let totalSize = 0;
            for (const key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    totalSize += localStorage[key].length + key.length;
                }
            }

            return {
                usedBytes: totalSize,
                usedKB: (totalSize / 1024).toFixed(2),
                usedMB: (totalSize / 1024 / 1024).toFixed(2),
            };
        } catch (error) {
            console.error('Error getting storage info:', error);
            return { usedBytes: 0, usedKB: 0, usedMB: 0 };
        }
    }

    /**
     * Clear all storage
     * @returns {boolean} True if successful
     */
    static clearAllStorage() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
}
