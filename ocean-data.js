// ========================================
// OCEAN DATA CONSTANTS & HELPER FUNCTIONS
// ========================================

const OCEAN_DATA = {
    basins: {
        'Pacific Ocean': { 
            area: '165.2 million km²', 
            avgDepth: '4,280 m',
            maxDepth: '10,911 m (Mariana Trench)',
            description: 'The largest and deepest ocean basin on Earth'
        },
        'Atlantic Ocean': { 
            area: '106.5 million km²', 
            avgDepth: '3,646 m',
            maxDepth: '8,486 m (Puerto Rico Trench)',
            description: 'Separates the Americas from Europe and Africa'
        },
        'Indian Ocean': { 
            area: '70.6 million km²', 
            avgDepth: '3,741 m',
            maxDepth: '7,258 m (Sunda Trench)',
            description: 'Warmest ocean, bordered by Africa, Asia, and Australia'
        },
        'Southern Ocean': { 
            area: '20.3 million km²', 
            avgDepth: '3,270 m',
            maxDepth: '7,236 m (South Sandwich Trench)',
            description: 'Encircles Antarctica with the strongest ocean currents'
        },
        'Arctic Ocean': { 
            area: '14.1 million km²', 
            avgDepth: '1,205 m',
            maxDepth: '5,550 m (Molloy Deep)',
            description: 'Smallest and shallowest ocean, mostly covered in ice'
        }
    },
    regions: {
        'Arctic (Polar)': { 
            temp: '-2°C to 10°C', 
            species: '~5,000 species',
            characteristics: 'Ice-covered waters, polar bears, walrus, arctic cod'
        },
        'Tropical': { 
            temp: '20°C to 30°C', 
            species: '~25,000 species',
            characteristics: 'Coral reefs, highest biodiversity, warm currents'
        },
        'Temperate': { 
            temp: '10°C to 20°C', 
            species: '~15,000 species',
            characteristics: 'Seasonal changes, kelp forests, diverse fish'
        },
        'Antarctic (Polar)': { 
            temp: '-2°C to 5°C', 
            species: '~8,000 species',
            characteristics: 'Krill, penguins, seals, extremely cold waters'
        }
    }
};

/**
 * Get ocean-specific data
 * @param {string} oceanBasin - Name of ocean basin
 * @returns {object} Ocean data
 */
function getOceanData(oceanBasin) {
    return OCEAN_DATA.basins[oceanBasin] || {
        area: 'Unknown',
        avgDepth: 'Unknown',
        maxDepth: 'Unknown',
        description: 'Open ocean waters'
    };
}

/**
 * Get ocean region characteristics
 * @param {string} region - Ocean region (Tropical, Temperate, etc.)
 * @returns {object} Region data
 */
function getOceanRegionData(region) {
    return OCEAN_DATA.regions[region] || {
        temp: 'Variable',
        species: '~10,000 species',
        characteristics: 'Marine environment'
    };
}

/**
 * Calculate timezone from longitude
 * @param {number} lng - Longitude
 * @returns {string} UTC timezone string
 */
function getOceanTimezone(lng) {
    const offset = Math.round(lng / 15);
    return `UTC${offset >= 0 ? '+' : ''}${offset}`;
}
