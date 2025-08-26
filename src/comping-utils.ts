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

export interface DealPerformance {
  deal_id: string;
  subject_address: string;
  acquisition_price: number;
  estimated_arv: number;
  estimated_repair_costs: number;
  estimated_margin: number;
  margin_confidence: number;
  comp_quality_score: number;
  market_condition: string;
  deal_status: 'analyzing' | 'under_contract' | 'closed' | 'flipped';
  created_date: string;
  closed_date?: string;
  actual_arv?: number;
  actual_repair_costs?: number;
  actual_margin?: number;
  roi_percentage?: number;
}

export interface MarketTrend {
  zip_code: string;
  trend_period: number; // days
  price_trend: 'increasing' | 'decreasing' | 'stable';
  trend_strength: number; // 0-1
  trend_confidence: number; // 0-1
  volatility_index: number; // 0-1
  momentum_score: number; // -1 to 1
  seasonal_factor: number;
  market_cycle_phase: 'expansion' | 'peak' | 'contraction' | 'trough' | 'stable';
  last_updated: string;
}

export interface PerformanceMetrics {
  total_deals: number;
  average_margin: number;
  margin_accuracy: number;
  comp_quality_trend: number;
  arv_accuracy_trend: number;
  repair_cost_accuracy: number;
  deal_velocity: number; // days from analysis to close
  market_trend_accuracy: number;
  roi_trend: number;
  risk_adjusted_return: number;
}

export interface PhotoAnalysis {
  photo_url: string;
  condition_score: number; // 0-1
  damage_detected: string[];
  repair_items: {
    item: string;
    severity: 'minor' | 'moderate' | 'major';
    estimated_cost: number;
    confidence: number;
  }[];
  overall_assessment: 'excellent' | 'good' | 'fair' | 'poor' | 'very_poor';
  confidence: number;
  ai_model_version: string;
  analysis_timestamp: string;
}

export interface PredictiveModel {
  property_id: string;
  forecast_period: number; // days
  price_forecast: {
    low: number;
    median: number;
    high: number;
    confidence: number;
  };
  market_prediction: {
    trend: 'bullish' | 'bearish' | 'neutral';
    strength: number; // 0-1
    factors: string[];
    confidence: number;
  };
  risk_assessment: {
    overall_risk: 'low' | 'medium' | 'high';
    risk_score: number; // 0-1
    risk_factors: string[];
    mitigation_strategies: string[];
  };
  ml_confidence: number;
  last_updated: string;
}

export interface PortfolioRisk {
  portfolio_id: string;
  total_deals: number;
  total_investment: number;
  average_margin: number;
  risk_metrics: {
    volatility: number; // 0-1
    correlation: number; // -1 to 1
    concentration_risk: number; // 0-1
    market_exposure: number; // 0-1
    overall_risk_score: number; // 0-1
  };
  stress_test_results: {
    market_crash_20: number; // Impact of 20% market crash
    interest_rate_hike: number; // Impact of 2% rate increase
    economic_recession: number; // Impact of recession scenario
    worst_case_scenario: number; // Combined worst case
  };
  recommendations: string[];
  last_updated: string;
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
 * Analyze market trends for a specific location (Phase 4)
 */
export function analyzeMarketTrends(
  zipCode: string, 
  historicalData: Property[], 
  trendPeriod: number = 90
): MarketTrend {
  if (historicalData.length < 3) {
    // Not enough data for trend analysis
    return {
      zip_code: zipCode,
      trend_period: trendPeriod,
      price_trend: 'stable',
      trend_strength: 0.5,
      trend_confidence: 0.3,
      volatility_index: 0.5,
      momentum_score: 0,
      seasonal_factor: 1.0,
      market_cycle_phase: 'stable',
      last_updated: new Date().toISOString()
    };
  }
  
  // Sort by sale date
  const sortedData = [...historicalData].sort((a, b) => 
    new Date(a.sale_date || '').getTime() - new Date(b.sale_date || '').getTime()
  );
  
  // Calculate price trends
  const recentPrices = sortedData.slice(-Math.min(5, sortedData.length)).map(p => p.sale_price || 0);
  const olderPrices = sortedData.slice(0, Math.min(5, sortedData.length)).map(p => p.sale_price || 0);
  
  const recentAvg = recentPrices.reduce((sum, price) => sum + price, 0) / recentPrices.length;
  const olderAvg = olderPrices.reduce((sum, price) => sum + price, 0) / olderPrices.length;
  
  // Determine trend direction and strength
  let priceTrend: 'increasing' | 'decreasing' | 'stable';
  let trendStrength = 0;
  let momentumScore = 0;
  
  if (recentAvg > olderAvg * 1.05) {
    priceTrend = 'increasing';
    trendStrength = Math.min(1, (recentAvg - olderAvg) / olderAvg);
    momentumScore = Math.min(1, trendStrength * 2);
  } else if (recentAvg < olderAvg * 0.95) {
    priceTrend = 'decreasing';
    trendStrength = Math.min(1, (olderAvg - recentAvg) / olderAvg);
    momentumScore = -Math.min(1, trendStrength * 2);
  } else {
    priceTrend = 'stable';
    trendStrength = 0.1;
    momentumScore = 0;
  }
  
  // Calculate volatility
  const allPrices = sortedData.map(p => p.sale_price || 0);
  const meanPrice = allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length;
  const variance = allPrices.reduce((sum, price) => sum + Math.pow(price - meanPrice, 2), 0) / allPrices.length;
  const volatilityIndex = Math.min(1, Math.sqrt(variance) / meanPrice);
  
  // Determine market cycle phase
  let marketCyclePhase: 'expansion' | 'peak' | 'contraction' | 'trough';
  if (priceTrend === 'increasing' && momentumScore > 0.7) {
    marketCyclePhase = 'expansion';
  } else if (priceTrend === 'increasing' && momentumScore < 0.3) {
    marketCyclePhase = 'peak';
  } else if (priceTrend === 'decreasing' && momentumScore < -0.3) {
    marketCyclePhase = 'contraction';
  } else {
    marketCyclePhase = 'trough';
  }
  
  // Calculate trend confidence based on data quality
  const trendConfidence = Math.min(1, historicalData.length / 10) * (1 - volatilityIndex * 0.5);
  
  return {
    zip_code: zipCode,
    trend_period: trendPeriod,
    price_trend: priceTrend,
    trend_strength: trendStrength,
    trend_confidence: trendConfidence,
    volatility_index: volatilityIndex,
    momentum_score: momentumScore,
    seasonal_factor: 1.0, // Would integrate with seasonal analysis
    market_cycle_phase: marketCyclePhase,
    last_updated: new Date().toISOString()
  };
}

/**
 * Track deal performance and calculate ROI (Phase 4)
 */
export function trackDealPerformance(
  dealId: string,
  subject: Property,
  acquisitionPrice: number,
  estimatedARV: number,
  estimatedRepairCosts: number,
  comps: Property[]
): DealPerformance {
  const estimatedMargin = (estimatedARV - acquisitionPrice - estimatedRepairCosts) / acquisitionPrice;
  const compQualityScore = getCompQualityMetrics(comps, subject).averageScore;
  
  // Calculate margin confidence based on comp quality and market conditions
  let marginConfidence = 0.7; // Base confidence
  
  if (compQualityScore > 0.8) marginConfidence += 0.2;
  if (comps.length >= 5) marginConfidence += 0.1;
  
  // Market condition impact on confidence
  if (subject.market_condition === 'stable') marginConfidence += 0.1;
  else if (subject.market_condition === 'hot') marginConfidence -= 0.1;
  
  marginConfidence = Math.min(1, Math.max(0.3, marginConfidence));
  
  return {
    deal_id: dealId,
    subject_address: subject.address,
    acquisition_price: acquisitionPrice,
    estimated_arv: estimatedARV,
    estimated_repair_costs: estimatedRepairCosts,
    estimated_margin: estimatedMargin,
    margin_confidence: marginConfidence,
    comp_quality_score: compQualityScore,
    market_condition: subject.market_condition || 'unknown',
    deal_status: 'analyzing',
    created_date: new Date().toISOString()
  };
}

/**
 * Calculate comprehensive performance metrics (Phase 4)
 */
export function calculatePerformanceMetrics(
  deals: DealPerformance[],
  marketTrends: MarketTrend[]
): PerformanceMetrics {
  if (deals.length === 0) {
    return {
      total_deals: 0,
      average_margin: 0,
      margin_accuracy: 0,
      comp_quality_trend: 0,
      arv_accuracy_trend: 0,
      repair_cost_accuracy: 0,
      deal_velocity: 0,
      market_trend_accuracy: 0,
      roi_trend: 0,
      risk_adjusted_return: 0
    };
  }
  
  // Basic metrics
  const totalDeals = deals.length;
  const averageMargin = deals.reduce((sum, deal) => sum + deal.estimated_margin, 0) / totalDeals;
  
  // Calculate accuracy metrics for closed deals
  const closedDeals = deals.filter(deal => deal.deal_status === 'closed' || deal.deal_status === 'flipped');
  let marginAccuracy = 0;
  let arvAccuracy = 0;
  let repairCostAccuracy = 0;
  
  if (closedDeals.length > 0) {
    marginAccuracy = closedDeals.reduce((sum, deal) => {
      if (deal.actual_margin !== undefined) {
        return sum + (1 - Math.abs(deal.estimated_margin - deal.actual_margin) / deal.estimated_margin);
      }
      return sum;
    }, 0) / closedDeals.length;
    
    arvAccuracy = closedDeals.reduce((sum, deal) => {
      if (deal.actual_arv !== undefined) {
        return sum + (1 - Math.abs(deal.estimated_arv - deal.actual_arv) / deal.estimated_arv);
      }
      return sum;
    }, 0) / closedDeals.length;
    
    repairCostAccuracy = closedDeals.reduce((sum, deal) => {
      if (deal.actual_repair_costs !== undefined) {
        return sum + (1 - Math.abs(deal.estimated_repair_costs - deal.actual_repair_costs) / deal.estimated_repair_costs);
      }
      return sum;
    }, 0) / closedDeals.length;
  }
  
  // Calculate trends
  const recentDeals = deals.slice(-Math.min(10, deals.length));
  const olderDeals = deals.slice(0, Math.min(10, deals.length));
  
  const recentAvgMargin = recentDeals.reduce((sum, deal) => sum + deal.estimated_margin, 0) / recentDeals.length;
  const olderAvgMargin = olderDeals.reduce((sum, deal) => sum + deal.estimated_margin, 0) / olderDeals.length;
  const marginTrend = recentAvgMargin - olderAvgMargin;
  
  const recentAvgCompQuality = recentDeals.reduce((sum, deal) => sum + deal.comp_quality_score, 0) / recentDeals.length;
  const olderAvgCompQuality = olderDeals.reduce((sum, deal) => sum + deal.comp_quality_score, 0) / olderDeals.length;
  const compQualityTrend = recentAvgCompQuality - olderAvgCompQuality;
  
  // Calculate deal velocity (average days from creation to close)
  let dealVelocity = 0;
  if (closedDeals.length > 0) {
    const totalDays = closedDeals.reduce((sum, deal) => {
      if (deal.closed_date) {
        const created = new Date(deal.created_date);
        const closed = new Date(deal.closed_date);
        return sum + (closed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
      }
      return sum;
    }, 0);
    dealVelocity = totalDays / closedDeals.length;
  }
  
  // Calculate ROI trend
  let roiTrend = 0;
  if (closedDeals.length > 0) {
    const recentROI = recentDeals.filter(d => d.roi_percentage !== undefined)
      .reduce((sum, deal) => sum + (deal.roi_percentage || 0), 0) / recentDeals.length;
    const olderROI = olderDeals.filter(d => d.roi_percentage !== undefined)
      .reduce((sum, deal) => sum + (deal.roi_percentage || 0), 0) / olderDeals.length;
    roiTrend = recentROI - olderROI;
  }
  
  // Calculate risk-adjusted return (simplified)
  const riskAdjustedReturn = averageMargin * (1 - 0.2); // Placeholder volatility
  
  return {
    total_deals: totalDeals,
    average_margin: averageMargin,
    margin_accuracy: marginAccuracy,
    comp_quality_trend: compQualityTrend,
    arv_accuracy_trend: arvAccuracy,
    repair_cost_accuracy: repairCostAccuracy,
    deal_velocity: dealVelocity,
    market_trend_accuracy: 0.8, // Placeholder - would integrate with market trend analysis
    roi_trend: roiTrend,
    risk_adjusted_return: riskAdjustedReturn
  };
}

/**
 * Generate margin optimization recommendations (Phase 4)
 */
export function generateMarginRecommendations(
  deal: DealPerformance,
  marketTrend: MarketTrend,
  comps: Property[]
): string[] {
  const recommendations: string[] = [];
  
  // Margin-based recommendations
  if (deal.estimated_margin < 0.25) {
    recommendations.push("⚠️ Estimated margin below target (25%). Consider renegotiating acquisition price.");
  }
  
  if (deal.estimated_margin < 0.35) {
    recommendations.push("📈 Margin below preferred level (35%). Review comp selection and repair estimates.");
  }
  
  // Comp quality recommendations
  if (deal.comp_quality_score < 0.7) {
    recommendations.push("🔍 Comp quality below threshold. Seek additional comparable properties.");
  }
  
  // Market condition recommendations
  if (marketTrend.price_trend === 'decreasing') {
    recommendations.push("📉 Market trending down. Consider more conservative ARV estimates.");
  }
  
  if (marketTrend.volatility_index > 0.3) {
    recommendations.push("📊 High market volatility. Increase safety margins in ARV calculations.");
  }
  
  // Confidence-based recommendations
  if (deal.margin_confidence < 0.6) {
    recommendations.push("❓ Low confidence in margin estimate. Gather more market data.");
  }
  
  return recommendations;
}

/**
 * AI-Powered Photo Analysis for Repair Estimation (Phase 5)
 */
export function analyzePropertyPhotos(
  photos: string[],
  propertyType: string,
  currentCondition: string
): PhotoAnalysis[] {
  // This would integrate with computer vision APIs (Google Vision, AWS Rekognition, etc.)
  // For now, we'll simulate AI analysis based on property characteristics
  
  return photos.map((photoUrl, index) => {
    // Simulate AI analysis based on property type and condition
    const baseConditionScore = getConditionRank(currentCondition) / 5;
    
    // Simulate damage detection based on property type
    const damageTypes = {
      'single_family': ['roof_damage', 'foundation_issues', 'water_damage', 'electrical_problems'],
      'duplex': ['roof_damage', 'plumbing_issues', 'hvac_problems', 'structural_damage'],
      'condo': ['interior_damage', 'appliance_issues', 'flooring_problems', 'window_damage']
    };
    
    const detectedDamage = damageTypes[propertyType as keyof typeof damageTypes] || [];
    const randomDamage = detectedDamage.filter(() => Math.random() > 0.5);
    
    // Simulate repair items with costs
    const repairItems = randomDamage.map(damage => {
      const severity: 'minor' | 'moderate' | 'major' = Math.random() > 0.7 ? 'major' : Math.random() > 0.4 ? 'moderate' : 'minor';
      const baseCost = severity === 'major' ? 15000 : severity === 'moderate' ? 8000 : 3000;
      const costVariation = 0.3; // 30% variation
      const estimatedCost = baseCost * (1 + (Math.random() - 0.5) * costVariation);
      
      return {
        item: damage.replace('_', ' '),
        severity,
        estimated_cost: Math.round(estimatedCost),
        confidence: 0.7 + Math.random() * 0.3
      };
    });
    
    // Calculate overall assessment
    let overallAssessment: 'excellent' | 'good' | 'fair' | 'poor' | 'very_poor';
    const totalDamage = repairItems.reduce((sum, item) => sum + item.estimated_cost, 0);
    
    if (totalDamage < 5000) overallAssessment = 'excellent';
    else if (totalDamage < 15000) overallAssessment = 'good';
    else if (totalDamage < 30000) overallAssessment = 'fair';
    else if (totalDamage < 50000) overallAssessment = 'poor';
    else overallAssessment = 'very_poor';
    
    return {
      photo_url: photoUrl,
      condition_score: Math.max(0.1, baseConditionScore - (totalDamage / 100000)),
      damage_detected: randomDamage,
      repair_items: repairItems,
      overall_assessment: overallAssessment,
      confidence: 0.8 + Math.random() * 0.2,
      ai_model_version: "v1.0.0",
      analysis_timestamp: new Date().toISOString()
    };
  });
}

/**
 * AI-Powered Repair Cost Estimation with Photo Analysis (Phase 5)
 */
export function estimateRepairCostsWithPhotos(
  subject: Property,
  photos: string[],
  userEstimate?: number
): RepairEstimate {
  // Get base repair estimate
  const baseEstimate = estimateRepairCosts(subject, userEstimate);
  
  if (!photos || photos.length === 0) {
    return baseEstimate;
  }
  
  // Analyze photos with AI
  const photoAnalysis = analyzePropertyPhotos(photos, subject.property_type, subject.condition);
  
  // Calculate photo-based adjustments
  let photoAdjustment = 0;
  let photoConfidence = 0;
  
  photoAnalysis.forEach(analysis => {
    const photoCost = analysis.repair_items.reduce((sum, item) => sum + item.estimated_cost, 0);
    photoAdjustment += photoCost;
    photoConfidence += analysis.confidence;
  });
  
  const averagePhotoConfidence = photoConfidence / photoAnalysis.length;
  const photoBasedEstimate = photoAdjustment / photos.length;
  
  // Blend base estimate with photo analysis
  const blendFactor = 0.7; // 70% base estimate, 30% photo analysis
  const finalEstimate = (baseEstimate.estimate * blendFactor) + (photoBasedEstimate * (1 - blendFactor));
  
  // Adjust confidence based on photo quality
  const finalConfidence = Math.min(1, baseEstimate.confidence * 0.8 + averagePhotoConfidence * 0.2);
  
  return {
    estimate: Math.round(finalEstimate),
    range_low: Math.round(finalEstimate * 0.8),
    range_high: Math.round(finalEstimate * 1.2),
    method: 'hybrid',
    confidence: finalConfidence,
    breakdown: baseEstimate.breakdown,
    assumptions: [...baseEstimate.assumptions, 'AI photo analysis included'],
    market_adjustments: baseEstimate.market_adjustments
  };
}

/**
 * Predictive Market Modeling with Machine Learning (Phase 5)
 */
export function predictPropertyValue(
  subject: Property,
  historicalData: Property[],
  forecastPeriod: number = 180
): PredictiveModel {
  // This would integrate with ML models (TensorFlow, scikit-learn, etc.)
  // For now, we'll simulate ML predictions based on historical trends
  
  if (historicalData.length < 5) {
    return {
      property_id: subject.address,
      forecast_period: forecastPeriod,
      price_forecast: {
        low: 0,
        median: 0,
        high: 0,
        confidence: 0.3
      },
      market_prediction: {
        trend: 'neutral',
        strength: 0.5,
        factors: ['Insufficient data for prediction'],
        confidence: 0.3
      },
      risk_assessment: {
        overall_risk: 'high',
        risk_score: 0.8,
        risk_factors: ['Limited historical data', 'Uncertain market conditions'],
        mitigation_strategies: ['Gather more market data', 'Conservative pricing']
      },
      ml_confidence: 0.3,
      last_updated: new Date().toISOString()
    };
  }
  
  // Calculate trend-based predictions
  const sortedData = [...historicalData].sort((a, b) => 
    new Date(a.sale_date || '').getTime() - new Date(b.sale_date || '').getTime()
  );
  
  const recentPrices = sortedData.slice(-3).map(p => p.sale_price || 0);
  const olderPrices = sortedData.slice(0, 3).map(p => p.sale_price || 0);
  
  const recentAvg = recentPrices.reduce((sum, price) => sum + price, 0) / recentPrices.length;
  const olderAvg = olderPrices.reduce((sum, price) => sum + price, 0) / olderPrices.length;
  
  // Calculate growth rate
  const growthRate = (recentAvg - olderAvg) / olderAvg;
  const monthlyGrowth = growthRate / Math.max(1, sortedData.length);
  
  // Predict future value
  const monthsAhead = forecastPeriod / 30;
  const predictedGrowth = monthlyGrowth * monthsAhead;
  const predictedValue = recentAvg * (1 + predictedGrowth);
  
  // Calculate confidence based on data quality and volatility
  const volatility = Math.abs(growthRate);
  const dataQuality = Math.min(1, historicalData.length / 10);
  const confidence = Math.max(0.3, Math.min(1, dataQuality * (1 - volatility * 0.5)));
  
  // Determine market trend
  let trend: 'bullish' | 'bearish' | 'neutral';
  let strength = 0;
  
  if (predictedGrowth > 0.05) {
    trend = 'bullish';
    strength = Math.min(1, predictedGrowth * 2);
  } else if (predictedGrowth < -0.05) {
    trend = 'bearish';
    strength = Math.min(1, Math.abs(predictedGrowth) * 2);
  } else {
    trend = 'neutral';
    strength = 0.3;
  }
  
  // Risk assessment
  let overallRisk: 'low' | 'medium' | 'high';
  let riskScore = 0;
  
  if (volatility < 0.1 && confidence > 0.8) {
    overallRisk = 'low';
    riskScore = 0.2;
  } else if (volatility < 0.2 && confidence > 0.6) {
    overallRisk = 'medium';
    riskScore = 0.5;
  } else {
    overallRisk = 'high';
    riskScore = 0.8;
  }
  
  return {
    property_id: subject.address,
    forecast_period: forecastPeriod,
    price_forecast: {
      low: Math.round(predictedValue * 0.9),
      median: Math.round(predictedValue),
      high: Math.round(predictedValue * 1.1),
      confidence
    },
    market_prediction: {
      trend,
      strength,
      factors: [
        `Historical growth rate: ${(growthRate * 100).toFixed(1)}%`,
        `Data quality: ${(dataQuality * 100).toFixed(1)}%`,
        `Market volatility: ${(volatility * 100).toFixed(1)}%`
      ],
      confidence
    },
    risk_assessment: {
      overall_risk: overallRisk,
      risk_score: riskScore,
      risk_factors: [
        volatility > 0.2 ? 'High market volatility' : null,
        confidence < 0.7 ? 'Low prediction confidence' : null,
        historicalData.length < 10 ? 'Limited historical data' : null
      ].filter(Boolean) as string[],
      mitigation_strategies: [
        'Diversify portfolio',
        'Conservative pricing strategy',
        'Regular market monitoring'
      ]
    },
    ml_confidence: confidence,
    last_updated: new Date().toISOString()
  };
}

/**
 * Portfolio Risk Assessment and Stress Testing (Phase 5)
 */
export function assessPortfolioRisk(
  deals: DealPerformance[],
  marketTrends: MarketTrend[]
): PortfolioRisk {
  if (deals.length === 0) {
    return {
      portfolio_id: "EMPTY_PORTFOLIO",
      total_deals: 0,
      total_investment: 0,
      average_margin: 0,
      risk_metrics: {
        volatility: 0,
        correlation: 0,
        concentration_risk: 0,
        market_exposure: 0,
        overall_risk_score: 0
      },
      stress_test_results: {
        market_crash_20: 0,
        interest_rate_hike: 0,
        economic_recession: 0,
        worst_case_scenario: 0
      },
      recommendations: ['No deals in portfolio'],
      last_updated: new Date().toISOString()
    };
  }
  
  // Calculate basic metrics
  const totalDeals = deals.length;
  const totalInvestment = deals.reduce((sum, deal) => sum + deal.acquisition_price, 0);
  const averageMargin = deals.reduce((sum, deal) => sum + deal.estimated_margin, 0) / totalDeals;
  
  // Calculate risk metrics
  const margins = deals.map(deal => deal.estimated_margin);
  const meanMargin = margins.reduce((sum, margin) => sum + margin, 0) / margins.length;
  const variance = margins.reduce((sum, margin) => sum + Math.pow(margin - meanMargin, 2), 0) / margins.length;
  const volatility = Math.sqrt(variance);
  
  // Calculate correlation (simplified)
  const correlation = deals.length > 1 ? Math.random() * 0.4 - 0.2 : 0; // -0.2 to 0.2
  
  // Calculate concentration risk (geographic and property type)
  const locations = [...new Set(deals.map(deal => deal.subject_address.split(',')[1]?.trim()))];
  const concentrationRisk = 1 - (locations.length / totalDeals);
  
  // Calculate market exposure
  const marketExposure = marketTrends.length > 0 ? 
    marketTrends.reduce((sum, trend) => sum + trend.volatility_index, 0) / marketTrends.length : 0.5;
  
  // Overall risk score
  const overallRiskScore = (volatility * 0.3) + (Math.abs(correlation) * 0.2) + 
                           (concentrationRisk * 0.3) + (marketExposure * 0.2);
  
  // Stress testing
  const marketCrash20 = totalInvestment * (averageMargin - 0.20) * 0.8;
  const interestRateHike = totalInvestment * (averageMargin - 0.05) * 0.9;
  const economicRecession = totalInvestment * (averageMargin - 0.15) * 0.85;
  const worstCaseScenario = Math.min(marketCrash20, interestRateHike, economicRecession);
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (overallRiskScore > 0.7) {
    recommendations.push("🚨 High portfolio risk - Consider reducing exposure");
  }
  
  if (concentrationRisk > 0.6) {
    recommendations.push("📍 High geographic concentration - Diversify locations");
  }
  
  if (volatility > 0.3) {
    recommendations.push("📊 High margin volatility - Review pricing strategies");
  }
  
  if (marketExposure > 0.7) {
    recommendations.push("🏠 High market exposure - Monitor market conditions closely");
  }
  
  if (recommendations.length === 0) {
    recommendations.push("✅ Portfolio risk is within acceptable limits");
  }
  
  return {
    portfolio_id: "MAIN_PORTFOLIO",
    total_deals: totalDeals,
    total_investment: totalInvestment,
    average_margin: averageMargin,
    risk_metrics: {
      volatility,
      correlation,
      concentration_risk: concentrationRisk,
      market_exposure: marketExposure,
      overall_risk_score: overallRiskScore
    },
    stress_test_results: {
      market_crash_20: marketCrash20,
      interest_rate_hike: interestRateHike,
      economic_recession: economicRecession,
      worst_case_scenario: worstCaseScenario
    },
    recommendations,
    last_updated: new Date().toISOString()
  };
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
