// src/comping-test.ts
// Test file for Phase 1 comping improvements

import { 
  Property, 
  calculateCompScore, 
  calculateWholesalingARV, 
  filterCompsForWholesaling,
  getCompQualityMetrics,
  validateConditionMatch
} from './comping-utils';

// Test data
const testSubject: Property = {
  address: "123 Main St, Test City, TX",
  condition: "fair",
  gla_sqft: 1500,
  beds: 3,
  baths: 2,
  property_type: "single_family"
};

const testComps: Property[] = [
  {
    address: "456 Oak Ave, Test City, TX",
    condition: "fair",
    gla_sqft: 1550,
    beds: 3,
    baths: 2,
    property_type: "single_family",
    sale_price: 200000,
    adjustedPrice: 200000,
    distance_miles: 0.5,
    sale_date: "2024-06-15"
  },
  {
    address: "789 Pine Rd, Test City, TX",
    condition: "renovated",
    gla_sqft: 1600,
    beds: 3,
    baths: 2,
    property_type: "single_family",
    sale_price: 250000,
    adjustedPrice: 250000,
    distance_miles: 0.8,
    sale_date: "2024-05-20"
  },
  {
    address: "321 Elm St, Test City, TX",
    condition: "poor",
    gla_sqft: 1400,
    beds: 3,
    baths: 2,
    property_type: "single_family",
    sale_price: 150000,
    adjustedPrice: 150000,
    distance_miles: 1.2,
    sale_date: "2024-07-01"
  }
];

/**
 * Test Phase 1 improvements
 */
export function testPhase1Improvements() {
  console.log("🧪 Testing Phase 1: Enhanced Condition Weighting");
  console.log("=" .repeat(50));
  
  // Test 1: Condition validation
  console.log("\n1️⃣ Testing Condition Validation:");
  testComps.forEach((comp, index) => {
    const conditionScore = validateConditionMatch(testSubject, comp);
    console.log(`   Comp ${index + 1} (${comp.condition}): Score ${conditionScore.toFixed(2)}`);
  });
  
  // Test 2: Enhanced comp scoring
  console.log("\n2️⃣ Testing Enhanced Comp Scoring:");
  const scoredComps = testComps.map(comp => calculateCompScore(comp, testSubject));
  scoredComps.forEach((scored, index) => {
    console.log(`   Comp ${index + 1}: Total Score ${scored.score.toFixed(3)}`);
    console.log(`     - Distance: ${scored.breakdown.distance.toFixed(3)}`);
    console.log(`     - Recency: ${scored.breakdown.recency.toFixed(3)}`);
    console.log(`     - GLA: ${scored.breakdown.gla.toFixed(3)}`);
    console.log(`     - Condition: ${scored.breakdown.condition.toFixed(3)} ⭐`);
    console.log(`     - Property Type: ${scored.breakdown.propertyType.toFixed(3)}`);
    console.log(`     - Wholesale Potential: ${scored.breakdown.wholesalePotential.toFixed(3)}`);
  });
  
  // Test 3: Wholesaling filtering
  console.log("\n3️⃣ Testing Wholesaling Filtering:");
  const filteredComps = filterCompsForWholesaling(testComps, testSubject);
  console.log(`   Original comps: ${testComps.length}`);
  console.log(`   Filtered comps: ${filteredComps.length}`);
  filteredComps.forEach((comp, index) => {
    console.log(`   - Comp ${index + 1}: ${comp.address} (${comp.condition})`);
  });
  
  // Test 4: Wholesaling ARV calculation
  console.log("\n4️⃣ Testing Wholesaling ARV Calculation:");
  try {
    const arvResult = calculateWholesalingARV(testComps);
    console.log(`   ARV: $${arvResult.value.toLocaleString()}`);
    console.log(`   Range: $${arvResult.range_low.toLocaleString()} - $${arvResult.range_high.toLocaleString()}`);
    console.log(`   Method: ${arvResult.method}`);
    console.log(`   Weights: ${arvResult.weights_applied?.lowest} | ${arvResult.weights_applied?.median} | ${arvResult.weights_applied?.highest}`);
    console.log(`   Safety Margin: ${arvResult.safety_margin}`);
  } catch (error) {
    console.error(`   Error: ${error}`);
  }
  
  // Test 5: Comp quality metrics
  console.log("\n5️⃣ Testing Comp Quality Metrics:");
  const metrics = getCompQualityMetrics(testComps, testSubject);
  console.log(`   Total Comps: ${metrics.totalComps}`);
  console.log(`   Average Score: ${metrics.averageScore.toFixed(3)}`);
  console.log(`   Average Condition Score: ${metrics.averageConditionScore.toFixed(3)}`);
  console.log(`   Top Comp Score: ${metrics.topCompScore.toFixed(3)}`);
  console.log(`   Bottom Comp Score: ${metrics.bottomCompScore.toFixed(3)}`);
  console.log(`   Score Range: ${metrics.scoreRange.toFixed(3)}`);
  
  // Test 6: Weight analysis
  console.log("\n6️⃣ Weight Analysis:");
  console.log("   Enhanced weights applied:");
  console.log("   - Distance: 0.20 (reduced from 0.25)");
  console.log("   - Recency: 0.20 (reduced from 0.25)");
  console.log("   - GLA: 0.15 (reduced from 0.20)");
  console.log("   - Condition: 0.25 ⭐ (INCREASED from 0.15)");
  console.log("   - Location: 0.10 (same)");
  console.log("   - Property Type: 0.05 (increased from 0.03)");
  console.log("   - Style: 0.03 (increased from 0.02)");
  console.log("   - Wholesale Potential: 0.02 (NEW)");
  
  console.log("\n✅ Phase 1 Testing Complete!");
  console.log("=" .repeat(50));
}

/**
 * Run the test
 */
if (require.main === module) {
  testPhase1Improvements();
}
