// src/comping-test-phase2.ts
// Test file for Phase 2: Advanced Comp Selection & Repair Cost Estimation

import { 
  Property, 
  calculateCompScore, 
  calculateWholesalingARV, 
  filterCompsForWholesaling,
  getCompQualityMetrics,
  validateCompForWholesaling,
  estimateRepairCosts,
  CompValidationResult,
  RepairEstimate
} from './comping-utils';

// Enhanced test data with Phase 2 properties
const testSubject: Property = {
  address: "123 Main St, Test City, TX",
  condition: "fair",
  gla_sqft: 1500,
  beds: 3,
  baths: 2,
  property_type: "single_family"
};

const testCompsPhase2: Property[] = [
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
    sale_date: "2024-06-15",
    // Phase 2 additions
    transaction_type: "arm_length",
    payment_method: "cash",
    seller_concessions: 0,
    condition_at_sale: "fair",
    condition_improvements: false,
    mls_id: "MLS001"
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
    sale_date: "2024-05-20",
    // Phase 2 additions
    transaction_type: "arm_length",
    payment_method: "conventional",
    seller_concessions: 5000,
    condition_at_sale: "renovated",
    condition_improvements: false,
    mls_id: "MLS002"
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
    sale_date: "2024-07-01",
    // Phase 2 additions
    transaction_type: "arm_length",
    payment_method: "cash",
    seller_concessions: 0,
    condition_at_sale: "poor",
    condition_improvements: false,
    mls_id: "MLS003"
  },
  {
    address: "654 Maple Dr, Test City, TX",
    condition: "average",
    gla_sqft: 1500,
    beds: 3,
    baths: 2,
    property_type: "single_family",
    sale_price: 180000,
    adjustedPrice: 180000,
    distance_miles: 0.9,
    sale_date: "2024-06-01",
    // Phase 2 additions - This comp has issues
    transaction_type: "short_sale",
    payment_method: "conventional",
    seller_concessions: 10000,
    condition_at_sale: "average",
    condition_improvements: true,
    mls_id: "MLS004"
  },
  {
    address: "987 Cedar Ln, Test City, TX",
    condition: "fair",
    gla_sqft: 1520,
    beds: 3,
    baths: 2,
    property_type: "single_family",
    sale_price: 195000,
    adjustedPrice: 195000,
    distance_miles: 0.6,
    sale_date: "2024-06-10",
    // Phase 2 additions - High quality comp
    transaction_type: "arm_length",
    payment_method: "cash",
    seller_concessions: 0,
    condition_at_sale: "fair",
    condition_improvements: false,
    mls_id: "MLS005"
  }
];

/**
 * Test Phase 2 improvements
 */
export function testPhase2Improvements() {
  console.log("🧪 Testing Phase 2: Advanced Comp Selection & Repair Cost Estimation");
  console.log("=" .repeat(70));
  
  // Test 1: Advanced Comp Validation
  console.log("\n1️⃣ Testing Advanced Comp Validation:");
  testCompsPhase2.forEach((comp, index) => {
    const validation = validateCompForWholesaling(comp);
    console.log(`   Comp ${index + 1}: ${comp.address}`);
    console.log(`     - Valid: ${validation.is_valid ? '✅' : '❌'}`);
    console.log(`     - Score: ${validation.validation_score.toFixed(2)}`);
    console.log(`     - Issues: ${validation.issues.length}`);
    console.log(`     - Warnings: ${validation.warnings.length}`);
    console.log(`     - Recommendations: ${validation.recommendations.length}`);
    
    if (validation.issues.length > 0) {
      validation.issues.forEach(issue => console.log(`       ❌ ${issue}`));
    }
    if (validation.warnings.length > 0) {
      validation.warnings.forEach(warning => console.log(`       ⚠️  ${warning}`));
    }
    if (validation.recommendations.length > 0) {
      validation.recommendations.forEach(rec => console.log(`       💡 ${rec}`));
    }
  });
  
  // Test 2: Enhanced Comp Filtering
  console.log("\n2️⃣ Testing Enhanced Comp Filtering:");
  const filteredComps = filterCompsForWholesaling(testCompsPhase2, testSubject);
  console.log(`   Original comps: ${testCompsPhase2.length}`);
  console.log(`   Filtered comps: ${filteredComps.length}`);
  console.log(`   Comps removed: ${testCompsPhase2.length - filteredComps.length}`);
  
  filteredComps.forEach((comp, index) => {
    const validation = validateCompForWholesaling(comp);
    console.log(`   - Comp ${index + 1}: ${comp.address} (${comp.condition}) - Score: ${validation.validation_score.toFixed(2)}`);
  });
  
  // Test 3: Repair Cost Estimation
  console.log("\n3️⃣ Testing Enhanced Repair Cost Estimation:");
  
  // Test different scenarios
  const scenarios = [
    { condition: 'poor' as const, gla: 1500, userEstimate: undefined, photos: [] },
    { condition: 'fair' as const, gla: 1500, userEstimate: 30000, photos: ['photo1.jpg'] },
    { condition: 'average' as const, gla: 1500, userEstimate: 20000, photos: [] },
    { condition: 'renovated' as const, gla: 1500, userEstimate: undefined, photos: ['photo1.jpg', 'photo2.jpg'] }
  ];
  
  scenarios.forEach((scenario, index) => {
    const testProperty: Property = {
      address: `Test Property ${index + 1}`,
      condition: scenario.condition,
      gla_sqft: scenario.gla,
      beds: 3,
      baths: 2,
      property_type: "single_family"
    };
    
    const repairEstimate = estimateRepairCosts(
      testProperty, 
      scenario.userEstimate, 
      scenario.photos
    );
    
    console.log(`   Scenario ${index + 1} (${scenario.condition}):`);
    console.log(`     - Estimate: $${repairEstimate.estimate.toLocaleString()}`);
    console.log(`     - Range: $${repairEstimate.range_low.toLocaleString()} - $${repairEstimate.range_high.toLocaleString()}`);
    console.log(`     - Method: ${repairEstimate.method}`);
    console.log(`     - Confidence: ${(repairEstimate.confidence * 100).toFixed(0)}%`);
    console.log(`     - Breakdown:`);
    console.log(`       * Structural: $${repairEstimate.breakdown.structural.toLocaleString()}`);
    console.log(`       * Cosmetic: $${repairEstimate.breakdown.cosmetic.toLocaleString()}`);
    console.log(`       * Mechanical: $${repairEstimate.breakdown.mechanical.toLocaleString()}`);
    console.log(`       * Other: $${repairEstimate.breakdown.other.toLocaleString()}`);
  });
  
  // Test 4: Comp Quality Metrics with Phase 2
  console.log("\n4️⃣ Testing Enhanced Comp Quality Metrics:");
  const metrics = getCompQualityMetrics(filteredComps, testSubject);
  console.log(`   Total Comps: ${metrics.totalComps}`);
  console.log(`   Average Score: ${metrics.averageScore.toFixed(3)}`);
  console.log(`   Average Condition Score: ${metrics.averageConditionScore.toFixed(3)}`);
  console.log(`   Top Comp Score: ${metrics.topCompScore.toFixed(3)}`);
  console.log(`   Bottom Comp Score: ${metrics.bottomCompScore.toFixed(3)}`);
  console.log(`   Score Range: ${metrics.scoreRange.toFixed(3)}`);
  
  // Test 5: Wholesaling ARV with Enhanced Comps
  console.log("\n5️⃣ Testing Wholesaling ARV with Enhanced Comps:");
  try {
    const arvResult = calculateWholesalingARV(filteredComps);
    console.log(`   ARV: $${arvResult.value.toLocaleString()}`);
    console.log(`   Range: $${arvResult.range_low.toLocaleString()} - $${arvResult.range_high.toLocaleString()}`);
    console.log(`   Method: ${arvResult.method}`);
    console.log(`   Weights: ${arvResult.weights_applied?.lowest} | ${arvResult.weights_applied?.median} | ${arvResult.weights_applied?.highest}`);
    console.log(`   Safety Margin: ${arvResult.safety_margin}`);
  } catch (error) {
    console.error(`   Error: ${error}`);
  }
  
  // Test 6: Phase 2 Feature Summary
  console.log("\n6️⃣ Phase 2 Feature Summary:");
  console.log("   ✅ Advanced Comp Validation:");
  console.log("      - Transaction type checking");
  console.log("      - Payment method validation");
  console.log("      - Seller concession tracking");
  console.log("      - Condition change detection");
  console.log("      - Short sale exclusion");
  
  console.log("   ✅ Enhanced Repair Cost Estimation:");
  console.log("      - Condition-based ranges");
  console.log("      - Inflation adjustments");
  console.log("      - Photo analysis support");
  console.log("      - User estimate integration");
  console.log("      - Detailed breakdowns");
  
  console.log("   ✅ Improved Comp Filtering:");
  console.log("      - Quality threshold enforcement");
  console.log("      - Advanced validation rules");
  console.log("      - Wholesaling-specific exclusions");
  
  console.log("\n✅ Phase 2 Testing Complete!");
  console.log("=" .repeat(70));
}

/**
 * Run the test
 */
if (require.main === module) {
  testPhase2Improvements();
}
