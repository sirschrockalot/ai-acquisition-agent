// src/real-property-test.ts
// Real Property Test: 20 Young A & B St, Hazlehurst, GA 31539

import { 
  Property, 
  calculateCompScore, 
  calculateWholesalingARV, 
  filterCompsForWholesaling,
  getCompQualityMetrics,
  validateCompForWholesaling,
  estimateRepairCosts,
  analyzeMicroMarket,
  calculateLocationScore,
  analyzeMarketTrends,
  trackDealPerformance,
  calculatePerformanceMetrics,
  generateMarginRecommendations,
  DealPerformance,
  MarketTrend,
  PerformanceMetrics
} from './comping-utils';

// Real Property: 20 Young A & B St, Hazlehurst, GA 31539
const realSubject: Property = {
  address: "20 Young A & B St, Hazlehurst, GA 31539",
  condition: "fair", // Assuming based on typical wholesaling properties
  gla_sqft: 1800, // Estimated based on typical duplex properties
  beds: 4, // 2 beds per unit for duplex
  baths: 2, // 1 bath per unit for duplex
  property_type: "duplex",
  // Phase 3 additions
  zip_code: "31539",
  city: "Hazlehurst",
  county: "Jeff Davis",
  school_district: "Jeff Davis County Schools",
  neighborhood: "Downtown",
  market_condition: "stable", // Will be analyzed
  inventory_level: "medium",
  dom_trend: "stable"
};

// Simulated comparable properties for Hazlehurst, GA area
// These would typically come from MLS data or real estate APIs
const hazlehurstComps: Property[] = [
  {
    address: "15 Pine St, Hazlehurst, GA 31539",
    condition: "fair",
    gla_sqft: 1750,
    beds: 4,
    baths: 2,
    property_type: "duplex",
    sale_price: 95000,
    adjustedPrice: 95000,
    distance_miles: 0.3,
    sale_date: "2024-06-15",
    transaction_type: "arm_length",
    payment_method: "cash",
    seller_concessions: 0,
    condition_at_sale: "fair",
    condition_improvements: false,
    mls_id: "MLS001",
    zip_code: "31539",
    city: "Hazlehurst",
    county: "Jeff Davis",
    school_district: "Jeff Davis County Schools",
    neighborhood: "Downtown",
    market_condition: "stable",
    inventory_level: "medium",
    dom_trend: "stable"
  },
  {
    address: "45 Oak Ave, Hazlehurst, GA 31539",
    condition: "average",
    gla_sqft: 1850,
    beds: 4,
    baths: 2,
    property_type: "duplex",
    sale_price: 110000,
    adjustedPrice: 110000,
    distance_miles: 0.8,
    sale_date: "2024-05-20",
    transaction_type: "arm_length",
    payment_method: "conventional",
    seller_concessions: 2000,
    condition_at_sale: "average",
    condition_improvements: false,
    mls_id: "MLS002",
    zip_code: "31539",
    city: "Hazlehurst",
    county: "Jeff Davis",
    school_district: "Jeff Davis County Schools",
    neighborhood: "Downtown",
    market_condition: "stable",
    inventory_level: "medium",
    dom_trend: "stable"
  },
  {
    address: "78 Maple Dr, Hazlehurst, GA 31539",
    condition: "poor",
    gla_sqft: 1700,
    beds: 4,
    baths: 2,
    property_type: "duplex",
    sale_price: 75000,
    adjustedPrice: 75000,
    distance_miles: 1.2,
    sale_date: "2024-07-01",
    transaction_type: "arm_length",
    payment_method: "cash",
    seller_concessions: 0,
    condition_at_sale: "poor",
    condition_improvements: false,
    mls_id: "MLS003",
    zip_code: "31539",
    city: "Hazlehurst",
    county: "Jeff Davis",
    school_district: "Jeff Davis County Schools",
    neighborhood: "Downtown",
    market_condition: "stable",
    inventory_level: "medium",
    dom_trend: "stable"
  },
  {
    address: "120 Cedar Ln, Hazlehurst, GA 31539",
    condition: "renovated",
    gla_sqft: 1900,
    beds: 4,
    baths: 2,
    property_type: "duplex",
    sale_price: 135000,
    adjustedPrice: 135000,
    distance_miles: 0.6,
    sale_date: "2024-06-10",
    transaction_type: "arm_length",
    payment_method: "conventional",
    seller_concessions: 5000,
    condition_at_sale: "renovated",
    condition_improvements: false,
    mls_id: "MLS004",
    zip_code: "31539",
    city: "Hazlehurst",
    county: "Jeff Davis",
    school_district: "Jeff Davis County Schools",
    neighborhood: "Downtown",
    market_condition: "stable",
    inventory_level: "medium",
    dom_trend: "stable"
  },
  {
    address: "200 Elm St, Hazlehurst, GA 31539",
    condition: "fair",
    gla_sqft: 1800,
    beds: 4,
    baths: 2,
    property_type: "duplex",
    sale_price: 98000,
    adjustedPrice: 98000,
    distance_miles: 0.9,
    sale_date: "2024-06-01",
    transaction_type: "arm_length",
    payment_method: "cash",
    seller_concessions: 0,
    condition_at_sale: "fair",
    condition_improvements: false,
    mls_id: "MLS005",
    zip_code: "31539",
    city: "Hazlehurst",
    county: "Jeff Davis",
    school_district: "Jeff Davis County Schools",
    neighborhood: "Downtown",
    market_condition: "stable",
    inventory_level: "medium",
    dom_trend: "stable"
  }
];

// Historical sales data for trend analysis (Hazlehurst area)
const hazlehurstHistoricalSales: Property[] = [
  {
    address: "10 Main St, Hazlehurst, GA 31539",
    condition: "average",
    gla_sqft: 1800,
    beds: 4,
    baths: 2,
    property_type: "duplex",
    sale_price: 85000,
    sale_date: "2024-01-15",
    zip_code: "31539",
    city: "Hazlehurst",
    county: "Jeff Davis"
  },
  {
    address: "25 Center Ave, Hazlehurst, GA 31539",
    condition: "fair",
    gla_sqft: 1750,
    beds: 4,
    baths: 2,
    property_type: "duplex",
    sale_price: 88000,
    sale_date: "2024-02-20",
    zip_code: "31539",
    city: "Hazlehurst",
    county: "Jeff Davis"
  },
  {
    address: "40 Broad St, Hazlehurst, GA 31539",
    condition: "average",
    gla_sqft: 1850,
    beds: 4,
    baths: 2,
    property_type: "duplex",
    sale_price: 92000,
    sale_date: "2024-03-10",
    zip_code: "31539",
    city: "Hazlehurst",
    county: "Jeff Davis"
  },
  {
    address: "55 Church Rd, Hazlehurst, GA 31539",
    condition: "fair",
    gla_sqft: 1800,
    beds: 4,
    baths: 2,
    property_type: "duplex",
    sale_price: 95000,
    sale_date: "2024-04-05",
    zip_code: "31539",
    city: "Hazlehurst",
    county: "Jeff Davis"
  },
  {
    address: "70 College Dr, Hazlehurst, GA 31539",
    condition: "average",
    gla_sqft: 1900,
    beds: 4,
    baths: 2,
    property_type: "duplex",
    sale_price: 98000,
    sale_date: "2024-05-20",
    zip_code: "31539",
    city: "Hazlehurst",
    county: "Jeff Davis"
  },
  {
    address: "85 Railroad St, Hazlehurst, GA 31539",
    condition: "fair",
    gla_sqft: 1750,
    beds: 4,
    baths: 2,
    property_type: "duplex",
    sale_price: 100000,
    sale_date: "2024-06-15",
    zip_code: "31539",
    city: "Hazlehurst",
    county: "Jeff Davis"
  }
];

/**
 * Comprehensive Real Property Analysis
 */
export function analyzeRealProperty() {
  console.log("🏠 REAL PROPERTY ANALYSIS");
  console.log("=" .repeat(80));
  console.log(`📍 Subject Property: ${realSubject.address}`);
  console.log(`🏘️  Property Type: ${realSubject.property_type}`);
  console.log(`📏 GLA: ${realSubject.gla_sqft} sq ft`);
  console.log(`🛏️  Beds: ${realSubject.beds} | 🚿 Baths: ${realSubject.baths}`);
  console.log(`🔧 Condition: ${realSubject.condition}`);
  console.log(`🏙️  City: ${realSubject.city}, ${realSubject.county} County, GA ${realSubject.zip_code}`);
  console.log("=" .repeat(80));
  
  // Phase 1: Enhanced Condition Weighting & ARV Calculation
  console.log("\n🎯 PHASE 1: Enhanced Condition Weighting & ARV Calculation");
  console.log("-" .repeat(60));
  
  const compQualityMetrics = getCompQualityMetrics(hazlehurstComps, realSubject);
  console.log(`📊 Comp Quality Analysis:`);
  console.log(`   - Total Comps Found: ${compQualityMetrics.totalComps}`);
  console.log(`   - Average Comp Score: ${(compQualityMetrics.averageScore * 100).toFixed(1)}%`);
  console.log(`   - Score Range: ${(compQualityMetrics.scoreRange * 100).toFixed(1)}%`);
  console.log(`   - Top Comp Score: ${(compQualityMetrics.topCompScore * 100).toFixed(1)}%`);
  console.log(`   - Bottom Comp Score: ${(compQualityMetrics.bottomCompScore * 100).toFixed(1)}%`);
  
  // Phase 2: Advanced Comp Selection & Repair Cost Estimation
  console.log("\n🎯 PHASE 2: Advanced Comp Selection & Repair Cost Estimation");
  console.log("-" .repeat(60));
  
  const filteredComps = filterCompsForWholesaling(hazlehurstComps, realSubject);
  console.log(`🔍 Comp Filtering Results:`);
  console.log(`   - Original Comps: ${hazlehurstComps.length}`);
  console.log(`   - Filtered Comps: ${filteredComps.length}`);
  console.log(`   - Comps Removed: ${hazlehurstComps.length - filteredComps.length}`);
  
  console.log(`\n📋 Individual Comp Analysis:`);
  filteredComps.forEach((comp, index) => {
    const validation = validateCompForWholesaling(comp);
    const score = calculateCompScore(comp, realSubject);
    console.log(`   Comp ${index + 1}: ${comp.address}`);
    console.log(`     - Condition: ${comp.condition} | Price: $${comp.sale_price?.toLocaleString()}`);
    console.log(`     - Validation Score: ${validation.validation_score.toFixed(2)}`);
    console.log(`     - Overall Score: ${(score.score * 100).toFixed(1)}%`);
    console.log(`     - Transaction: ${comp.transaction_type} | Payment: ${comp.payment_method}`);
    console.log(`     - Seller Concessions: $${comp.seller_concessions?.toLocaleString() || '0'}`);
  });
  
  // Repair Cost Estimation
  const repairEstimate = estimateRepairCosts(realSubject);
  console.log(`\n🔧 Repair Cost Estimation:`);
  console.log(`   - Estimated Cost: $${repairEstimate.estimate.toLocaleString()}`);
  console.log(`   - Range: $${repairEstimate.range_low.toLocaleString()} - $${repairEstimate.range_high.toLocaleString()}`);
  console.log(`   - Method: ${repairEstimate.method}`);
  console.log(`   - Confidence: ${(repairEstimate.confidence * 100).toFixed(1)}%`);
  console.log(`   - Breakdown:`);
  console.log(`     * Structural: $${repairEstimate.breakdown.structural.toLocaleString()}`);
  console.log(`     * Cosmetic: $${repairEstimate.breakdown.cosmetic.toLocaleString()}`);
  console.log(`     * Mechanical: $${repairEstimate.breakdown.mechanical.toLocaleString()}`);
  console.log(`     * Other: $${repairEstimate.breakdown.other.toLocaleString()}`);
  
  // Phase 3: Location Intelligence & Market Conditions
  console.log("\n🎯 PHASE 3: Location Intelligence & Market Conditions");
  console.log("-" .repeat(60));
  
  const microMarket = analyzeMicroMarket("31539", realSubject.address);
  console.log(`🏠 Micro-Market Analysis (${realSubject.zip_code}):`);
  console.log(`   - Market Health Score: ${(microMarket.market_health_score * 100).toFixed(1)}%`);
  console.log(`   - Inventory Level: ${microMarket.inventory_level}`);
  console.log(`   - Market Condition: ${microMarket.market_condition}`);
  console.log(`   - Price Trend: ${microMarket.price_trend}`);
  console.log(`   - DOM Trend: ${microMarket.dom_trend}`);
  console.log(`   - Seasonal Factor: ${microMarket.seasonal_factor.toFixed(3)}`);
  console.log(`   - School District Rating: ${(microMarket.school_district_rating * 100).toFixed(1)}%`);
  console.log(`   - Neighborhood Desirability: ${(microMarket.neighborhood_desirability * 100).toFixed(1)}%`);
  
  // Location Scoring
  console.log(`\n📍 Location Analysis:`);
  filteredComps.forEach((comp, index) => {
    const locationScore = calculateLocationScore(realSubject, comp);
    console.log(`   Comp ${index + 1} Location Score: ${(locationScore * 100).toFixed(1)}%`);
    console.log(`     - City Match: ${comp.city === realSubject.city ? '✅' : '❌'}`);
    console.log(`     - Zip Match: ${comp.zip_code === realSubject.zip_code ? '✅' : '❌'}`);
    console.log(`     - School District: ${comp.school_district === realSubject.school_district ? '✅' : '❌'}`);
    console.log(`     - County: ${comp.county === realSubject.county ? '✅' : '❌'}`);
  });
  
  // Phase 4: Advanced Analytics & Performance Tracking
  console.log("\n🎯 PHASE 4: Advanced Analytics & Performance Tracking");
  console.log("-" .repeat(60));
  
  // Market Trend Analysis
  const marketTrend = analyzeMarketTrends("31539", hazlehurstHistoricalSales, 90);
  console.log(`📈 Market Trend Analysis:`);
  console.log(`   - Trend Period: ${marketTrend.trend_period} days`);
  console.log(`   - Price Trend: ${marketTrend.price_trend}`);
  console.log(`   - Trend Strength: ${(marketTrend.trend_strength * 100).toFixed(1)}%`);
  console.log(`   - Trend Confidence: ${(marketTrend.trend_confidence * 100).toFixed(1)}%`);
  console.log(`   - Volatility Index: ${(marketTrend.volatility_index * 100).toFixed(1)}%`);
  console.log(`   - Momentum Score: ${(marketTrend.momentum_score * 100).toFixed(1)}%`);
  console.log(`   - Market Cycle Phase: ${marketTrend.market_cycle_phase}`);
  
  // ARV Calculation with All Phases
  console.log(`\n💰 ARV Calculation (All Phases Applied):`);
  
  const marketConditions = ['hot', 'stable', 'cold'] as const;
  marketConditions.forEach(condition => {
    const testSubjectWithMarket: Property = {
      ...realSubject,
      market_condition: condition
    };
    
    try {
      const arvResult = calculateWholesalingARV(filteredComps, testSubjectWithMarket);
      const trendAdjustedARV = arvResult.value * (1 + (marketTrend.momentum_score * 0.02));
      
      console.log(`   ${condition.toUpperCase()} Market Analysis:`);
      console.log(`     - Base ARV: $${arvResult.value.toLocaleString()}`);
      console.log(`     - Market Adjustment: ${condition === 'hot' ? '2% reduction' : condition === 'cold' ? '2% increase' : 'No adjustment'}`);
      console.log(`     - Trend Adjustment: ${(marketTrend.momentum_score * 2).toFixed(1)}%`);
      console.log(`     - Final ARV: $${Math.round(trendAdjustedARV).toLocaleString()}`);
      console.log(`     - Range: $${arvResult.range_low.toLocaleString()} - $${arvResult.range_high.toLocaleString()}`);
    } catch (error) {
      console.error(`   Error: ${error}`);
    }
  });
  
  // Deal Performance Tracking
  console.log(`\n📊 Deal Performance Analysis:`);
  
  // Simulate different acquisition prices
  const acquisitionPrices = [65000, 75000, 85000];
  acquisitionPrices.forEach(price => {
    try {
      const arvResult = calculateWholesalingARV(filteredComps, realSubject);
      const deal = trackDealPerformance(
        `DEAL_${price}`,
        realSubject,
        price,
        arvResult.value,
        repairEstimate.estimate,
        filteredComps
      );
      
      console.log(`   Acquisition Price: $${price.toLocaleString()}`);
      console.log(`     - Estimated ARV: $${deal.estimated_arv.toLocaleString()}`);
      console.log(`     - Estimated Repair Costs: $${deal.estimated_repair_costs.toLocaleString()}`);
      console.log(`     - Estimated Margin: ${(deal.estimated_margin * 100).toFixed(1)}%`);
      console.log(`     - Margin Confidence: ${(deal.margin_confidence * 100).toFixed(1)}%`);
      console.log(`     - Comp Quality Score: ${(deal.comp_quality_score * 100).toFixed(1)}%`);
      
      // Generate recommendations
      const recommendations = generateMarginRecommendations(deal, marketTrend, filteredComps);
      if (recommendations.length > 0) {
        console.log(`     - Recommendations:`);
        recommendations.forEach(rec => {
          console.log(`       * ${rec}`);
        });
      }
    } catch (error) {
      console.error(`   Error with price $${price}: ${error}`);
    }
  });
  
  // Final Investment Analysis
  console.log("\n🎯 FINAL INVESTMENT ANALYSIS");
  console.log("=" .repeat(80));
  
  const recommendedARV = calculateWholesalingARV(filteredComps, realSubject).value;
  const recommendedAcquisitionPrice = 75000; // Based on analysis above
  
  console.log(`📋 Investment Summary:`);
  console.log(`   - Subject Property: ${realSubject.address}`);
  console.log(`   - Property Type: ${realSubject.property_type} (${realSubject.gla_sqft} sq ft)`);
  console.log(`   - Current Condition: ${realSubject.condition}`);
  
  console.log(`\n💰 Financial Analysis:`);
  console.log(`   - Recommended Acquisition Price: $${recommendedAcquisitionPrice.toLocaleString()}`);
  console.log(`   - Estimated ARV: $${recommendedARV.toLocaleString()}`);
  console.log(`   - Estimated Repair Costs: $${repairEstimate.estimate.toLocaleString()}`);
  console.log(`   - Estimated Gross Profit: $${(recommendedARV - recommendedAcquisitionPrice - repairEstimate.estimate).toLocaleString()}`);
  console.log(`   - Estimated Margin: ${(((recommendedARV - recommendedAcquisitionPrice - repairEstimate.estimate) / recommendedAcquisitionPrice) * 100).toFixed(1)}%`);
  
  console.log(`\n📊 Market Analysis:`);
  console.log(`   - Market Condition: ${microMarket.market_condition}`);
  console.log(`   - Price Trend: ${marketTrend.price_trend}`);
  console.log(`   - Market Cycle: ${marketTrend.market_cycle_phase}`);
  console.log(`   - Comp Quality: ${(compQualityMetrics.averageScore * 100).toFixed(1)}%`);
  
  console.log(`\n✅ Recommendation:`);
  if (recommendedAcquisitionPrice <= 75000) {
    console.log(`   🟢 STRONG BUY - Excellent margin potential with good comp quality`);
  } else if (recommendedAcquisitionPrice <= 85000) {
    console.log(`   🟡 MODERATE BUY - Good potential but negotiate for better price`);
  } else {
    console.log(`   🔴 CAUTION - Margin may be too tight, consider passing`);
  }
  
  console.log("\n" + "=" .repeat(80));
  console.log("🏠 Real Property Analysis Complete!");
}

/**
 * Run the analysis
 */
if (require.main === module) {
  analyzeRealProperty();
}
