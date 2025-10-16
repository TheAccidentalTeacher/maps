// MYSTERY CHALLENGE LOCATION VALIDATION TEST
// Paste this into browser console at http://localhost:8000 to test the expansion

console.log("%c========================================", "color: cyan; font-weight: bold");
console.log("%c  MYSTERY CHALLENGE LOCATION TEST", "color: yellow; font-weight: bold");
console.log("%c========================================", "color: cyan; font-weight: bold");

// Test 1: Count total locations
console.log("\n%c📊 TEST 1: Total Location Count", "color: green; font-weight: bold");
console.log(`Total locations: ${mysteryLocations.length}`);
console.log(mysteryLocations.length >= 50 ? "✅ PASS: 50+ locations" : "❌ FAIL: Less than 50 locations");

// Test 2: Count by continent
console.log("\n%c🌍 TEST 2: Continental Distribution", "color: green; font-weight: bold");
const continents = {};
mysteryLocations.forEach(loc => {
    continents[loc.continent] = (continents[loc.continent] || 0) + 1;
});
console.table(continents);
console.log(Object.keys(continents).length >= 5 ? "✅ PASS: 5+ continents covered" : "❌ FAIL: Less than 5 continents");

// Test 3: Verify data structure
console.log("\n%c🔍 TEST 3: Data Structure Validation", "color: green; font-weight: bold");
let validCount = 0;
let errors = [];

mysteryLocations.forEach((loc, index) => {
    if (!loc.lat || !loc.lon || !loc.name || !loc.hint || !loc.continent || !loc.zoom) {
        errors.push(`Location ${index}: Missing required fields`);
    } else if (Math.abs(loc.lat) > 90) {
        errors.push(`Location ${index} (${loc.name}): Invalid latitude ${loc.lat}`);
    } else if (Math.abs(loc.lon) > 180) {
        errors.push(`Location ${index} (${loc.name}): Invalid longitude ${loc.lon}`);
    } else {
        validCount++;
    }
});

console.log(`Valid locations: ${validCount}/${mysteryLocations.length}`);
if (errors.length > 0) {
    console.log("❌ ERRORS FOUND:");
    errors.forEach(err => console.log(`  - ${err}`));
} else {
    console.log("✅ PASS: All locations have valid data");
}

// Test 4: Check for duplicates
console.log("\n%c🔄 TEST 4: Duplicate Detection", "color: green; font-weight: bold");
const seen = new Set();
let duplicates = [];
mysteryLocations.forEach(loc => {
    const key = `${loc.lat},${loc.lon}`;
    if (seen.has(key)) {
        duplicates.push(`Duplicate coordinates: ${loc.name} at ${key}`);
    }
    seen.add(key);
});

if (duplicates.length > 0) {
    console.log("❌ DUPLICATES FOUND:");
    duplicates.forEach(dup => console.log(`  - ${dup}`));
} else {
    console.log("✅ PASS: No duplicate locations");
}

// Test 5: Sample locations
console.log("\n%c🎲 TEST 5: Random Sample (5 locations)", "color: green; font-weight: bold");
const samples = [];
for (let i = 0; i < 5; i++) {
    const loc = mysteryLocations[Math.floor(Math.random() * mysteryLocations.length)];
    samples.push({
        name: loc.name,
        coordinates: `${loc.lat.toFixed(2)}°, ${loc.lon.toFixed(2)}°`,
        continent: loc.continent,
        hint: loc.hint.substring(0, 40) + "..."
    });
}
console.table(samples);

// Test 6: Geographic spread
console.log("\n%c🌐 TEST 6: Geographic Spread", "color: green; font-weight: bold");
const lats = mysteryLocations.map(loc => loc.lat);
const lons = mysteryLocations.map(loc => loc.lon);
const stats = {
    "Northernmost": `${Math.max(...lats).toFixed(2)}° (${mysteryLocations.find(l => l.lat === Math.max(...lats)).name})`,
    "Southernmost": `${Math.min(...lats).toFixed(2)}° (${mysteryLocations.find(l => l.lat === Math.min(...lats)).name})`,
    "Easternmost": `${Math.max(...lons).toFixed(2)}° (${mysteryLocations.find(l => l.lon === Math.max(...lons)).name})`,
    "Westernmost": `${Math.min(...lons).toFixed(2)}° (${mysteryLocations.find(l => l.lon === Math.min(...lons)).name})`,
    "Latitude Range": `${(Math.max(...lats) - Math.min(...lats)).toFixed(2)}°`,
    "Longitude Range": `${(Math.max(...lons) - Math.min(...lons)).toFixed(2)}°`
};
console.table(stats);

// Test 7: Hint quality check
console.log("\n%c💡 TEST 7: Hint Quality", "color: green; font-weight: bold");
const shortHints = mysteryLocations.filter(loc => loc.hint.length < 20);
const longHints = mysteryLocations.filter(loc => loc.hint.length > 100);
console.log(`Hints too short (<20 chars): ${shortHints.length}`);
console.log(`Hints too long (>100 chars): ${longHints.length}`);
console.log(`Average hint length: ${(mysteryLocations.reduce((sum, loc) => sum + loc.hint.length, 0) / mysteryLocations.length).toFixed(1)} characters`);
console.log((shortHints.length === 0 && longHints.length === 0) ? "✅ PASS: All hints are appropriate length" : "⚠️  WARNING: Some hints may be too short or long");

// Final Summary
console.log("\n%c========================================", "color: cyan; font-weight: bold");
console.log("%c  TEST SUMMARY", "color: yellow; font-weight: bold");
console.log("%c========================================", "color: cyan; font-weight: bold");

const allPassed = 
    mysteryLocations.length >= 50 &&
    Object.keys(continents).length >= 5 &&
    errors.length === 0 &&
    duplicates.length === 0;

if (allPassed) {
    console.log("%c✅ ALL TESTS PASSED!", "color: green; font-weight: bold; font-size: 16px");
    console.log("%cMystery Challenge expansion is ready for gameplay!", "color: white");
} else {
    console.log("%c⚠️  SOME TESTS FAILED", "color: orange; font-weight: bold; font-size: 16px");
    console.log("%cCheck the test results above for details.", "color: white");
}

console.log("\n%c🎮 READY TO PLAY!", "color: magenta; font-weight: bold");
console.log("%cClick 'Mystery Challenge' to test the new locations!", "color: yellow");
console.log("%c========================================\n", "color: cyan; font-weight: bold");
