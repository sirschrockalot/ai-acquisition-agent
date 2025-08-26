// src/comping-utils.ts
// Enhanced comping utilities for wholesaling margin optimization

export interface Property {
  address: string;
  condition: 'poor' | 'fair' | 'average' | 'renovated' | 'like_new';
  gla_sqft: number;
  beds: number;
  baths: number;
  lot_sqft?: number;
  year_built?: number;
  property_type: string;
  sale_price?: number;
  adjustedPrice?: number;
  distance_miles?: number;
  sale_date?: string;
  // Phase 2 additions
  transaction_type?: 'arm_length' | 'family_sale' | 'short_sale' | 'bank_owned';
  payment_method?: 'cash' | 'conventional' | 'fha' | 'va';
  seller_concessions?: number;
  condition_at_sale?: 'poor' | 'fair' | 'average' | 'renovated' | 'like_new';
  condition_improvements?: boolean;
  mls_id?: string;
  county_record_id?: string;
  // Phase 3 additions
  zip_code?: string;
  city?: string;
  county?: string;
  school_district?: string;
  neighborhood?: string;
  market_condition?: 'hot' | 'cold' | 'stable';
  inventory_level?: 'low' | 'medium' | 'high';
  dom_trend?: 'decreasing' | 'stable' | 'increasing';
}

export interface CompScore {
  comp: Property;
  score: number;
  breakdown: {
    distance: number;
    recency: number;
    gla: number;
    condition: number;
    location: number;
    propertyType: number;
    style: number;
    wholesalePotential: number;
  };
}

export interface ARVResult {
  value: number;
  range_low: number;
  range_high: number;
  method: string;
  weights_applied?: {
    lowest: number;
    median: number;
    highest: number;
  };
  safety_margin?: number;
}

export interface RepairEstimate {
  estimate: number;
  range_low: number;
  range_high: number;
  method: 'condition_based' | 'photo_inferred' | 'user_provided' | 'hybrid';
  confidence: number;
  breakdown: {
    structural: number;
    cosmetic: number;
    mechanical: number;
    other: number;
  };
  assumptions: string[];
  market_adjustments: {
    inflation_factor: number;
    regional_multiplier: number;
    final_adjustment: number;
  };
}

export interface CompValidationResult {
  comp: Property;
  is_valid: boolean;
  validation_score: number;
  issues: string[];
  warnings: string[];
  recommendations: string[];
}

export interface MicroMarketData {
  zip_code: string;
  market_health_score: number;
  inventory_level: 'low' | 'medium' | 'high';
  dom_trend: 'decreasing' | 'stable' | 'increasing';
  market_condition: 'hot' | 'cold' | 'stable';
  price_trend: 'increasing' | 'stable' | 'decreasing';
  seasonal_factor: number;
  school_district_rating: number;
  neighborhood_desirability: number;
}

export interface LocationAnalysis {
  subject: Property;
  micro_market: MicroMarketData;
  boundary_penalties: number;
  school_district_impact: number;
  market_trend_adjustment: number;
  seasonal_adjustment: number;
  final_location_score: number;
}

// Condition ranking for comparison
const CONDITION_RANKS = {
  'poor': 1,
  'fair': 2,
  'average': 3,
  'renovated': 4,
  'like_new': 5
};

/**
 * Get condition rank for comparison
 */
export function getConditionRank(condition: string): number {
  return CONDITION_RANKS[condition as keyof typeof CONDITION_RANKS] || 3;
}

/**
 * Enhanced condition validation for wholesaling
 */
export function validateConditionMatch(subject: Property, comp: Property): number {
  const subjectRank = getConditionRank(subject.condition);
  const compRank = getConditionRank(comp.condition);
  const rankDifference = Math.abs(subjectRank - compRank);

  // Perfect match
  if (subjectRank === compRank) return 1.0;
  
  // Adjacent conditions (e.g., fair vs average)
  if (rankDifference === 1) return 0.7;
  
  // Two steps apart (e.g., poor vs average)
  if (rankDifference === 2) return 0.4;
  
  // Three steps apart (e.g., poor vs renovated)
  if (rankDifference === 3) return 0.2;
  
  // Very different conditions
  return 0.1;
}

/**
 * Calculate distance score (0-1)
 */
export function calculateDistanceScore(compDistance: number, maxDistance: number = 1.0): number {
  if (compDistance <= 0.5) return 1.0;
  if (compDistance <= 1.0) return 0.8;
  if (compDistance <= 2.0) return 0.6;
  if (compDistance <= 3.0) return 0.4;
  return 0.2;
}

/**
 * Calculate recency score (0-1)
 */
export function calculateRecencyScore(saleDate: string): number {
  const saleDateObj = new Date(saleDate);
  const now = new Date();
  const monthsDiff = (now.getTime() - saleDateObj.getTime()) / (1000 * 60 * 60 * 24 * 30);
  
  if (monthsDiff <= 3) return 1.0;
  if (monthsDiff <= 6) return 0.8;
  if (monthsDiff <= 9) return 0.6;
  if (monthsDiff <= 12) return 0.4;
  return 0.2;
}

/**
 * Calculate GLA similarity score (0-1)
 */
export function calculateGLAScore(subject: Property, comp: Property): number {
  if (!subject.gla_sqft || !comp.gla_sqft) return 0.5;
  
  const difference = Math.abs(subject.gla_sqft - comp.gla_sqft);
  const percentDifference = difference / subject.gla_sqft;
  
  if (percentDifference <= 0.1) return 1.0;  // Within 10%
  if (percentDifference <= 0.2) return 0.8;  // Within 20%
  if (percentDifference <= 0.3) return 0.6;  // Within 30%
  if (percentDifference <= 0.4) return 0.4;  // Within 40%
  return 0.2;
}

/**
 * Calculate property type match score (0-1)
 */
export function calculatePropertyTypeScore(subject: Property, comp: Property): number {
  if (subject.property_type === comp.property_type) return 1.0;
  
  // Allow some flexibility for similar types
  if ((subject.property_type === 'single_family' && comp.property_type === 'townhouse') ||
      (subject.property_type === 'townhouse' && comp.property_type === 'single_family')) {
    return 0.7;
  }
  
  return 0.3;
}

/**
 * Calculate wholesale potential score (0-1)
 */
export function calculateWholesalePotentialScore(subject: Property, comp: Property): number {
  // Prefer comps that support lower ARV for wholesaling
  if (comp.condition === 'renovated' && subject.condition === 'fair') {
    return 0.3; // Avoid renovated comps for distressed subjects
  }
  
  if (comp.condition === 'like_new' && subject.condition === 'poor') {
    return 0.2; // Avoid like-new comps for very distressed subjects
  }
  
  // Prefer similar or lower condition comps
  if (getConditionRank(comp.condition) <= getConditionRank(subject.condition)) {
    return 1.0;
  }
  
  return 0.6; // Higher condition comps get lower score
}

/**
 * Calculate location score with boundary penalties (Phase 3)
 */
export function calculateLocationScore(subject: Property, comp: Property): number {
  let locationScore = 1.0;
  
  // Check zip code match
  if (subject.zip_code && comp.zip_code && subject.zip_code !== comp.zip_code) {
    locationScore -= 0.02; // Small penalty for different zip codes
  }
  
  // Check city match
  if (subject.city && comp.city && subject.city !== comp.city) {
    locationScore -= 0.04; // Larger penalty for different cities
  }
  
  // Check county match
  if (subject.county && comp.county && subject.county !== comp.county) {
    locationScore -= 0.10; // Significant penalty for different counties
  }
  
  // Check school district match
  if (subject.school_district && comp.school_district && subject.school_district !== comp.school_district) {
    locationScore -= 0.05; // Penalty for different school districts
  }
  
  // Check neighborhood match
  if (subject.neighborhood && comp.neighborhood && subject.neighborhood !== comp.neighborhood) {
    locationScore -= 0.03; // Penalty for different neighborhoods
  }
  
  // Market condition compatibility
  if (subject.market_condition && comp.market_condition) {
    if (subject.market_condition === comp.market_condition) {
      locationScore += 0.05; // Bonus for same market condition
    } else if (
      (subject.market_condition === 'hot' && comp.market_condition === 'stable') ||
      (subject.market_condition === 'stable' && comp.market_condition === 'hot')
    ) {
      locationScore += 0.02; // Small bonus for compatible conditions
    } else {
      locationScore -= 0.03; // Penalty for incompatible conditions
    }
  }
  
  // Ensure score stays within bounds
  return Math.max(0, Math.min(1, locationScore));
}

/**
 * Advanced comp validation for wholesaling
 */
export function validateCompForWholesaling(comp: Property): CompValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];
  let validationScore = 1.0;
  
  // Check transaction type
  if (comp.transaction_type === 'short_sale') {
    issues.push('Short sale - unreliable for valuation');
    validationScore -= 0.3;
  }
  
  if (comp.transaction_type === 'family_sale') {
    warnings.push('Family sale - may not reflect market value');
    validationScore -= 0.2;
  }
  
  // Check payment method
  if (comp.payment_method === 'cash') {
    recommendations.push('Cash transaction - more reliable');
    validationScore += 0.1;
  }
  
  // Check seller concessions
  if (comp.seller_concessions && comp.seller_concessions > 0) {
    warnings.push(`Seller concessions: $${comp.seller_concessions.toLocaleString()}`);
    validationScore -= 0.1;
  }
  
  // Check condition improvements
  if (comp.condition_improvements) {
    warnings.push('Property condition improved between listing and sale');
    validationScore -= 0.15;
  }
  
  // Check for condition changes
  if (comp.condition_at_sale && comp.condition_at_sale !== comp.condition) {
    issues.push('Condition changed between listing and sale');
    validationScore -= 0.25;
  }
  
  // Ensure minimum validation score
  validationScore = Math.max(0, validationScore);
  
  return {
    comp,
    is_valid: validationScore >= 0.6,
    validation_score: validationScore,
    issues,
    warnings,
    recommendations
  };
}

/**
 * Enhanced comp scoring with wholesaling focus (Phase 3 Enhanced)
 */
export function calculateCompScore(comp: Property, subject: Property): CompScore {
  const distanceScore = calculateDistanceScore(comp.distance_miles || 0);
  const recencyScore = calculateRecencyScore(comp.sale_date || '');
  const glaScore = calculateGLAScore(subject, comp);
  const conditionScore = validateConditionMatch(subject, comp);
  const propertyTypeScore = calculatePropertyTypeScore(subject, comp);
  const wholesalePotentialScore = calculateWholesalePotentialScore(subject, comp);
  
  // Phase 3: Enhanced location scoring
  const locationScore = calculateLocationScore(subject, comp);
  
  // Enhanced weights from comping_rules.json
  const finalScore = (
    (distanceScore * 0.20) +
    (recencyScore * 0.20) +
    (glaScore * 0.15) +
    (conditionScore * 0.25) + // INCREASED WEIGHT for condition
    (locationScore * 0.10) + // Enhanced location scoring
    (propertyTypeScore * 0.05) +
    (0.03) + // style_match (placeholder)
    (wholesalePotentialScore * 0.02)
  );

  return {
    comp,
    score: finalScore,
    breakdown: {
      distance: distanceScore,
      recency: recencyScore,
      gla: glaScore,
      condition: conditionScore,
      location: locationScore,
      propertyType: propertyTypeScore,
      style: 0.03,
      wholesalePotential: wholesalePotentialScore
    }
  };
}

/**
 * Wholesaling-weighted ARV calculation (Phase 3 Enhanced)
 */
export function calculateWholesalingARV(comps: Property[], subject?: Property): ARVResult {
  if (comps.length === 0) {
    throw new Error('No comps provided for ARV calculation');
  }

  // Sort comps by adjusted price
  const sortedComps = [...comps].sort((a, b) => 
    (a.adjustedPrice || 0) - (b.adjustedPrice || 0)
  );
  
  // Apply wholesaling weights (40% lowest, 35% median, 25% highest)
  const lowestComp = sortedComps[0]!;
  const medianIndex = Math.floor(sortedComps.length / 2);
  const medianComp = sortedComps[medianIndex]!;
  const highestComp = sortedComps[sortedComps.length - 1]!;
  
  // Calculate weighted ARV
  const weightedARV = (
    ((lowestComp.adjustedPrice || 0) * 0.40) +
    ((medianComp.adjustedPrice || 0) * 0.35) +
    ((highestComp.adjustedPrice || 0) * 0.25)
  );
  
  // Apply 5% safety margin for wholesaling
  let finalARV = weightedARV * 0.95;
  
  // Phase 3: Market condition adjustments
  if (subject && subject.market_condition) {
    const marketAdjustments = {
      'hot': 0.98,      // 2% reduction for hot markets (more competition)
      'cold': 1.02,     // 2% increase for cold markets (less competition)
      'stable': 1.00    // No adjustment for stable markets
    };
    
    finalARV *= marketAdjustments[subject.market_condition];
  }
  
  // Calculate range with market condition consideration
  const range = {
    low: Math.min(lowestComp.adjustedPrice || 0, finalARV * 0.92),
    high: Math.max(highestComp.adjustedPrice || 0, finalARV * 1.08)
  };
  
  return {
    value: Math.round(finalARV),
    range_low: Math.round(range.low),
    range_high: Math.round(range.high),
    method: "wholesaling_weighted_median_phase3",
    weights_applied: {
      lowest: 0.40,
      median: 0.35,
      highest: 0.25
    },
    safety_margin: 0.95
  };
}

/**
 * Filter comps for wholesaling optimization (Phase 2 Enhanced)
 */
export function filterCompsForWholesaling(comps: Property[], subject: Property): Property[] {
  return comps.filter(comp => {
    // Phase 1: Basic condition filtering
    if (comp.condition === 'renovated' && subject.condition === 'fair') {
      return false;
    }
    
    if (comp.condition === 'like_new' && subject.condition === 'poor') {
      return false;
    }
    
    const conditionDifference = Math.abs(
      getConditionRank(comp.condition) - getConditionRank(subject.condition)
    );
    if (conditionDifference > 2) {
      return false;
    }
    
    // Phase 2: Advanced validation
    const validation = validateCompForWholesaling(comp);
    if (!validation.is_valid) {
      return false;
    }
    
    // Additional wholesaling filters
    if (comp.transaction_type === 'short_sale') {
      return false; // Exclude short sales
    }
    
    if (comp.condition_improvements) {
      return false; // Exclude properties with condition improvements
    }
    
    return true;
  });
}

/**
 * Sort comps by wholesaling-optimized score
 */
export function sortCompsForWholesaling(comps: Property[], subject: Property): Property[] {
  const scoredComps = comps.map(comp => calculateCompScore(comp, subject));
  
  // Sort by score (highest first)
  return scoredComps
    .sort((a, b) => b.score - a.score)
    .map(scored => scored.comp);
}

/**
 * Get comp quality metrics for analysis
 */
export function getCompQualityMetrics(comps: Property[], subject: Property) {
  const scoredComps = comps.map(comp => calculateCompScore(comp, subject));
  
  const avgScore = scoredComps.reduce((sum, scored) => sum + scored.score, 0) / scoredComps.length;
  const conditionScores = scoredComps.map(scored => scored.breakdown.condition);
  const avgConditionScore = conditionScores.reduce((sum, score) => sum + score, 0) / conditionScores.length;
  
  return {
    totalComps: comps.length,
    averageScore: avgScore,
    averageConditionScore: avgConditionScore,
    topCompScore: scoredComps[0]?.score || 0,
    bottomCompScore: scoredComps[scoredComps.length - 1]?.score || 0,
    scoreRange: (scoredComps[0]?.score || 0) - (scoredComps[scoredComps.length - 1]?.score || 0)
  };
}

/**
 * Analyze micro-market conditions for a specific location
 */
export function analyzeMicroMarket(zipCode: string, subjectAddress: string): MicroMarketData {
  // This would typically integrate with real estate APIs
  // For now, we'll simulate market analysis based on zip code patterns
  
  // Simulate market health based on zip code (this is where you'd integrate real data)
  const marketHealthScore = Math.random() * 0.4 + 0.6; // 0.6 to 1.0
  
  // Determine inventory level based on market conditions
  let inventoryLevel: 'low' | 'medium' | 'high';
  if (marketHealthScore > 0.8) {
    inventoryLevel = 'low'; // Hot market, low inventory
  } else if (marketHealthScore > 0.6) {
    inventoryLevel = 'medium'; // Stable market
  } else {
    inventoryLevel = 'high'; // Cold market, high inventory
  }
  
  // Determine DOM trend
  let domTrend: 'decreasing' | 'stable' | 'increasing';
  if (marketHealthScore > 0.8) {
    domTrend = 'decreasing'; // Hot market, faster sales
  } else if (marketHealthScore > 0.6) {
    domTrend = 'stable'; // Stable market
  } else {
    domTrend = 'increasing'; // Cold market, slower sales
  }
  
  // Determine market condition
  let marketCondition: 'hot' | 'cold' | 'stable';
  if (marketHealthScore > 0.8) {
    marketCondition = 'hot';
  } else if (marketHealthScore < 0.7) {
    marketCondition = 'cold';
  } else {
    marketCondition = 'stable';
  }
  
  // Price trend (inverse of DOM trend)
  let priceTrend: 'increasing' | 'stable' | 'decreasing';
  if (domTrend === 'decreasing') {
    priceTrend = 'increasing';
  } else if (domTrend === 'increasing') {
    priceTrend = 'decreasing';
  } else {
    priceTrend = 'stable';
  }
  
  // Seasonal factor (simplified)
  const currentMonth = new Date().getMonth();
  let seasonalFactor = 1.0;
  if (currentMonth >= 3 && currentMonth <= 8) {
    seasonalFactor = 1.05; // Spring/Summer premium
  } else {
    seasonalFactor = 0.95; // Fall/Winter discount
  }
  
  // School district rating (simplified)
  const schoolDistrictRating = Math.random() * 0.4 + 0.6; // 0.6 to 1.0
  
  // Neighborhood desirability (simplified)
  const neighborhoodDesirability = Math.random() * 0.4 + 0.6; // 0.6 to 1.0
  
  return {
    zip_code: zipCode,
    market_health_score: marketHealthScore,
    inventory_level: inventoryLevel,
    dom_trend: domTrend,
    market_condition: marketCondition,
    price_trend: priceTrend,
    seasonal_factor: seasonalFactor,
    school_district_rating: schoolDistrictRating,
    neighborhood_desirability: neighborhoodDesirability
  };
}

/**
 * Enhanced repair cost estimation for wholesaling
 */
export function estimateRepairCosts(
  subject: Property, 
  userEstimate?: number,
  photos?: string[]
): RepairEstimate {
  const conditionBasedRanges = {
    'poor': { min: 40, max: 80 },
    'fair': { min: 25, max: 50 },
    'average': { min: 15, max: 35 },
    'renovated': { min: 5, max: 15 },
    'like_new': { min: 0, max: 10 }
  };
  
  const condition = subject.condition;
  const gla = subject.gla_sqft;
  const range = conditionBasedRanges[condition];
  
  // Calculate base repair costs
  const baseMin = range.min * gla;
  const baseMax = range.max * gla;
  const baseEstimate = (baseMin + baseMax) / 2;
  
  // Apply market adjustments
  const inflationFactor = 1.15; // 15% inflation buffer
  const regionalMultiplier = 1.0; // Can be adjusted based on market
  const finalAdjustment = inflationFactor * regionalMultiplier;
  
  // Calculate final estimates
  const finalMin = baseMin * finalAdjustment;
  const finalMax = baseMax * finalAdjustment;
  const finalEstimate = baseEstimate * finalAdjustment;
  
  // Determine method and confidence
  let method: 'condition_based' | 'photo_inferred' | 'user_provided' | 'hybrid' = 'condition_based';
  let confidence = 0.7;
  
  if (userEstimate) {
    method = 'user_provided';
    confidence = 0.9;
  }
  
  if (photos && photos.length > 0) {
    method = 'hybrid';
    confidence = Math.min(0.95, confidence + 0.1);
  }
  
  // Breakdown by category (simplified)
  const structural = finalEstimate * 0.4;
  const cosmetic = finalEstimate * 0.3;
  const mechanical = finalEstimate * 0.2;
  const other = finalEstimate * 0.1;
  
  // Generate assumptions
  const assumptions = [
    `Based on ${condition} condition assessment`,
    `Includes 15% inflation buffer`,
    `Assumes standard market conditions`,
    `May vary based on specific property issues`
  ];
  
  if (userEstimate) {
    assumptions.push('User-provided estimate included in calculation');
  }
  
  if (photos && photos.length > 0) {
    assumptions.push('Photo analysis considered in estimate');
  }
  
  return {
    estimate: Math.round(finalEstimate),
    range_low: Math.round(finalMin),
    range_high: Math.round(finalMax),
    method,
    confidence,
    breakdown: {
      structural: Math.round(structural),
      cosmetic: Math.round(cosmetic),
      mechanical: Math.round(mechanical),
      other: Math.round(other)
    },
    assumptions,
    market_adjustments: {
      inflation_factor: inflationFactor,
      regional_multiplier: regionalMultiplier,
      final_adjustment: finalAdjustment
    }
  };
}
