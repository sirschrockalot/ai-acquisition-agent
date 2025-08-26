// src/advanced-photo-analysis.ts
// Advanced Photo Analysis with Structural Assessment

export interface StructuralAssessment {
  foundation: {
    condition: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    issues: string[];
    estimated_repair_cost: number;
    confidence: number;
  };
  roof: {
    condition: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    age_estimate: number;
    material_type: string;
    issues: string[];
    estimated_repair_cost: number;
    confidence: number;
  };
  walls: {
    structural_integrity: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    material_type: string;
    issues: string[];
    estimated_repair_cost: number;
    confidence: number;
  };
  electrical: {
    condition: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    panel_type: string;
    issues: string[];
    estimated_repair_cost: number;
    confidence: number;
  };
  plumbing: {
    condition: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    pipe_material: string;
    issues: string[];
    estimated_repair_cost: number;
    confidence: number;
  };
  hvac: {
    condition: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    system_type: string;
    age_estimate: number;
    issues: string[];
    estimated_repair_cost: number;
    confidence: number;
  };
}

export interface BuildingCodeCompliance {
  safety_violations: {
    critical: string[];
    major: string[];
    minor: string[];
  };
  code_compliance_score: number; // 0-100
  required_upgrades: {
    immediate: string[];
    within_1_year: string[];
    within_5_years: string[];
  };
  estimated_compliance_cost: number;
}

export interface EnvironmentalHazards {
  mold: {
    detected: boolean;
    severity: 'none' | 'minor' | 'moderate' | 'severe';
    locations: string[];
    estimated_remediation_cost: number;
  };
  water_damage: {
    detected: boolean;
    severity: 'none' | 'minor' | 'moderate' | 'severe';
    locations: string[];
    estimated_repair_cost: number;
  };
  asbestos_risk: {
    risk_level: 'low' | 'medium' | 'high';
    suspected_materials: string[];
    testing_recommended: boolean;
    estimated_testing_cost: number;
  };
  lead_paint_risk: {
    risk_level: 'low' | 'medium' | 'high';
    suspected_surfaces: string[];
    testing_recommended: boolean;
    estimated_testing_cost: number;
  };
}

export interface EnergyEfficiency {
  insulation: {
    quality: 'excellent' | 'good' | 'fair' | 'poor';
    type: string;
    estimated_upgrade_cost: number;
  };
  windows: {
    efficiency: 'excellent' | 'good' | 'fair' | 'poor';
    type: string;
    estimated_upgrade_cost: number;
  };
  hvac_efficiency: {
    rating: 'excellent' | 'good' | 'fair' | 'poor';
    estimated_upgrade_cost: number;
  };
  overall_efficiency_score: number; // 0-100
  estimated_annual_energy_savings: number;
}

export interface AdvancedPhotoAnalysis {
  structural_assessment: StructuralAssessment;
  building_code_compliance: BuildingCodeCompliance;
  environmental_hazards: EnvironmentalHazards;
  energy_efficiency: EnergyEfficiency;
  overall_risk_score: number; // 0-100
  critical_issues: string[];
  recommended_actions: string[];
  total_estimated_costs: {
    structural: number;
    compliance: number;
    environmental: number;
    energy: number;
    total: number;
  };
}

export class AdvancedPhotoAnalyzer {
  /**
   * Analyze photos for structural assessment
   */
  async analyzeStructuralElements(photos: any[]): Promise<StructuralAssessment> {
    // Simulate AI analysis of structural elements
    const foundation = await this.analyzeFoundation(photos);
    const roof = await this.analyzeRoof(photos);
    const walls = await this.analyzeWalls(photos);
    const electrical = await this.analyzeElectrical(photos);
    const plumbing = await this.analyzePlumbing(photos);
    const hvac = await this.analyzeHVAC(photos);

    return {
      foundation,
      roof,
      walls,
      electrical,
      plumbing,
      hvac
    };
  }

  /**
   * Analyze foundation condition
   */
  private async analyzeFoundation(photos: any[]): Promise<StructuralAssessment['foundation']> {
    const foundationPhotos = photos.filter(p => 
      p.analysis.room_type === 'basement' || 
      p.original_filename.toLowerCase().includes('foundation') ||
      p.original_filename.toLowerCase().includes('crawl')
    );

    if (foundationPhotos.length === 0) {
      return {
        condition: 'fair',
        issues: ['No foundation photos available for assessment'],
        estimated_repair_cost: 0,
        confidence: 0.3
      };
    }

    // Simulate foundation analysis
    const issues = this.simulateFoundationIssues();
    const condition = this.getConditionFromIssues(issues);
    const repairCost = this.calculateFoundationRepairCost(issues);

    return {
      condition,
      issues,
      estimated_repair_cost: repairCost,
      confidence: 0.7 + Math.random() * 0.3
    };
  }

  /**
   * Analyze roof condition
   */
  private async analyzeRoof(photos: any[]): Promise<StructuralAssessment['roof']> {
    const roofPhotos = photos.filter(p => 
      p.analysis.room_type === 'exterior' || 
      p.original_filename.toLowerCase().includes('roof') ||
      p.original_filename.toLowerCase().includes('attic')
    );

    if (roofPhotos.length === 0) {
      return {
        condition: 'fair',
        age_estimate: 15,
        material_type: 'unknown',
        issues: ['No roof photos available for assessment'],
        estimated_repair_cost: 0,
        confidence: 0.3
      };
    }

    // Simulate roof analysis
    const issues = this.simulateRoofIssues();
    const condition = this.getConditionFromIssues(issues);
    const age = 10 + Math.floor(Math.random() * 20);
    const material = this.getRandomRoofMaterial();
    const repairCost = this.calculateRoofRepairCost(issues, material);

    return {
      condition,
      age_estimate: age,
      material_type: material,
      issues,
      estimated_repair_cost: repairCost,
      confidence: 0.7 + Math.random() * 0.3
    };
  }

  /**
   * Analyze walls and structural integrity
   */
  private async analyzeWalls(photos: any[]): Promise<StructuralAssessment['walls']> {
    const wallPhotos = photos.filter(p => 
      p.analysis.room_type !== 'exterior' && 
      p.analysis.room_type !== 'basement'
    );

    if (wallPhotos.length === 0) {
      return {
        structural_integrity: 'fair',
        material_type: 'unknown',
        issues: ['No interior wall photos available for assessment'],
        estimated_repair_cost: 0,
        confidence: 0.3
      };
    }

    // Simulate wall analysis
    const issues = this.simulateWallIssues();
    const integrity = this.getConditionFromIssues(issues);
    const material = this.getRandomWallMaterial();
    const repairCost = this.calculateWallRepairCost(issues);

    return {
      structural_integrity: integrity,
      material_type: material,
      issues,
      estimated_repair_cost: repairCost,
      confidence: 0.7 + Math.random() * 0.3
    };
  }

  /**
   * Analyze electrical systems
   */
  private async analyzeElectrical(photos: any[]): Promise<StructuralAssessment['electrical']> {
    const electricalPhotos = photos.filter(p => 
      p.original_filename.toLowerCase().includes('electrical') ||
      p.original_filename.toLowerCase().includes('panel') ||
      p.original_filename.toLowerCase().includes('wiring')
    );

    if (electricalPhotos.length === 0) {
      return {
        condition: 'fair',
        panel_type: 'unknown',
        issues: ['No electrical photos available for assessment'],
        estimated_repair_cost: 0,
        confidence: 0.3
      };
    }

    // Simulate electrical analysis
    const issues = this.simulateElectricalIssues();
    const condition = this.getConditionFromIssues(issues);
    const panelType = this.getRandomPanelType();
    const repairCost = this.calculateElectricalRepairCost(issues);

    return {
      condition,
      panel_type: panelType,
      issues,
      estimated_repair_cost: repairCost,
      confidence: 0.7 + Math.random() * 0.3
    };
  }

  /**
   * Analyze plumbing systems
   */
  private async analyzePlumbing(photos: any[]): Promise<StructuralAssessment['plumbing']> {
    const plumbingPhotos = photos.filter(p => 
      p.analysis.room_type === 'bathroom' ||
      p.original_filename.toLowerCase().includes('plumbing') ||
      p.original_filename.toLowerCase().includes('pipe')
    );

    if (plumbingPhotos.length === 0) {
      return {
        condition: 'fair',
        pipe_material: 'unknown',
        issues: ['No plumbing photos available for assessment'],
        estimated_repair_cost: 0,
        confidence: 0.3
      };
    }

    // Simulate plumbing analysis
    const issues = this.simulatePlumbingIssues();
    const condition = this.getConditionFromIssues(issues);
    const pipeMaterial = this.getRandomPipeMaterial();
    const repairCost = this.calculatePlumbingRepairCost(issues);

    return {
      condition,
      pipe_material: pipeMaterial,
      issues,
      estimated_repair_cost: repairCost,
      confidence: 0.7 + Math.random() * 0.3
    };
  }

  /**
   * Analyze HVAC systems
   */
  private async analyzeHVAC(photos: any[]): Promise<StructuralAssessment['hvac']> {
    const hvacPhotos = photos.filter(p => 
      p.original_filename.toLowerCase().includes('hvac') ||
      p.original_filename.toLowerCase().includes('furnace') ||
      p.original_filename.toLowerCase().includes('ac') ||
      p.original_filename.toLowerCase().includes('heating')
    );

    if (hvacPhotos.length === 0) {
      return {
        condition: 'fair',
        system_type: 'unknown',
        age_estimate: 15,
        issues: ['No HVAC photos available for assessment'],
        estimated_repair_cost: 0,
        confidence: 0.3
      };
    }

    // Simulate HVAC analysis
    const issues = this.simulateHVACIssues();
    const condition = this.getConditionFromIssues(issues);
    const systemType = this.getRandomHVACType();
    const age = 5 + Math.floor(Math.random() * 20);
    const repairCost = this.calculateHVACRepairCost(issues);

    return {
      condition,
      system_type: systemType,
      age_estimate: age,
      issues,
      estimated_repair_cost: repairCost,
      confidence: 0.7 + Math.random() * 0.3
    };
  }

  /**
   * Analyze building code compliance
   */
  async analyzeBuildingCodeCompliance(photos: any[], structuralAssessment: StructuralAssessment): Promise<BuildingCodeCompliance> {
    const violations = this.simulateCodeViolations(structuralAssessment);
    const complianceScore = this.calculateComplianceScore(violations);
    const requiredUpgrades = this.determineRequiredUpgrades(violations);
    const complianceCost = this.calculateComplianceCost(requiredUpgrades);

    return {
      safety_violations: violations,
      code_compliance_score: complianceScore,
      required_upgrades: requiredUpgrades,
      estimated_compliance_cost: complianceCost
    };
  }

  /**
   * Analyze environmental hazards
   */
  async analyzeEnvironmentalHazards(photos: any[]): Promise<EnvironmentalHazards> {
    const mold = this.analyzeMoldRisk(photos);
    const waterDamage = this.analyzeWaterDamage(photos);
    const asbestosRisk = this.analyzeAsbestosRisk(photos);
    const leadPaintRisk = this.analyzeLeadPaintRisk(photos);

    return {
      mold,
      water_damage: waterDamage,
      asbestos_risk: asbestosRisk,
      lead_paint_risk: leadPaintRisk
    };
  }

  /**
   * Analyze energy efficiency
   */
  async analyzeEnergyEfficiency(photos: any[], structuralAssessment: StructuralAssessment): Promise<EnergyEfficiency> {
    const insulation = this.analyzeInsulation(photos);
    const windows = this.analyzeWindows(photos);
    const hvacEfficiency = this.analyzeHVACEfficiency(structuralAssessment.hvac);
    const efficiencyScore = this.calculateEfficiencyScore(insulation, windows, hvacEfficiency);
    const annualSavings = this.calculateAnnualEnergySavings(efficiencyScore);

    return {
      insulation,
      windows,
      hvac_efficiency: hvacEfficiency,
      overall_efficiency_score: efficiencyScore,
      estimated_annual_energy_savings: annualSavings
    };
  }

  /**
   * Perform comprehensive advanced analysis
   */
  async performAdvancedAnalysis(photos: any[]): Promise<AdvancedPhotoAnalysis> {
    const structuralAssessment = await this.analyzeStructuralElements(photos);
    const buildingCodeCompliance = await this.analyzeBuildingCodeCompliance(photos, structuralAssessment);
    const environmentalHazards = await this.analyzeEnvironmentalHazards(photos);
    const energyEfficiency = await this.analyzeEnergyEfficiency(photos, structuralAssessment);

    const overallRiskScore = this.calculateOverallRiskScore(
      structuralAssessment,
      buildingCodeCompliance,
      environmentalHazards
    );

    const criticalIssues = this.identifyCriticalIssues(
      structuralAssessment,
      buildingCodeCompliance,
      environmentalHazards
    );

    const recommendedActions = this.generateRecommendedActions(
      structuralAssessment,
      buildingCodeCompliance,
      environmentalHazards,
      energyEfficiency
    );

    const totalCosts = this.calculateTotalCosts(
      structuralAssessment,
      buildingCodeCompliance,
      environmentalHazards,
      energyEfficiency
    );

    return {
      structural_assessment: structuralAssessment,
      building_code_compliance: buildingCodeCompliance,
      environmental_hazards: environmentalHazards,
      energy_efficiency: energyEfficiency,
      overall_risk_score: overallRiskScore,
      critical_issues: criticalIssues,
      recommended_actions: recommendedActions,
      total_estimated_costs: totalCosts
    };
  }

  // Helper methods for simulation (in real implementation, these would call AI/ML models)
  private simulateFoundationIssues(): string[] {
    const issues = [
      'cracks in foundation walls',
      'settling foundation',
      'water infiltration',
      'structural movement'
    ];
    return issues.filter(() => Math.random() < 0.4);
  }

  private simulateRoofIssues(): string[] {
    const issues = [
      'missing shingles',
      'leaking roof',
      'damaged flashing',
      'sagging roof deck',
      'inadequate ventilation'
    ];
    return issues.filter(() => Math.random() < 0.5);
  }

  private simulateWallIssues(): string[] {
    const issues = [
      'cracked drywall',
      'water damage',
      'structural cracks',
      'settling issues'
    ];
    return issues.filter(() => Math.random() < 0.3);
  }

  private simulateElectricalIssues(): string[] {
    const issues = [
      'outdated electrical panel',
      'knob and tube wiring',
      'overloaded circuits',
      'missing GFCI outlets'
    ];
    return issues.filter(() => Math.random() < 0.4);
  }

  private simulatePlumbingIssues(): string[] {
    const issues = [
      'leaking pipes',
      'outdated plumbing',
      'low water pressure',
      'drainage issues'
    ];
    return issues.filter(() => Math.random() < 0.3);
  }

  private simulateHVACIssues(): string[] {
    const issues = [
      'old furnace',
      'inefficient AC unit',
      'ductwork issues',
      'thermostat problems'
    ];
    return issues.filter(() => Math.random() < 0.4);
  }

  private getConditionFromIssues(issues: string[]): 'excellent' | 'good' | 'fair' | 'poor' | 'critical' {
    if (issues.length === 0) return 'excellent';
    if (issues.length <= 1) return 'good';
    if (issues.length <= 2) return 'fair';
    if (issues.length <= 3) return 'poor';
    return 'critical';
  }

  private getRandomRoofMaterial(): string {
    const materials = ['asphalt shingles', 'metal', 'tile', 'slate', 'wood shingles'];
    return materials[Math.floor(Math.random() * materials.length)] || 'asphalt shingles';
  }

  private getRandomWallMaterial(): string {
    const materials = ['drywall', 'plaster', 'wood paneling', 'brick', 'concrete'];
    return materials[Math.floor(Math.random() * materials.length)] || 'drywall';
  }

  private getRandomPanelType(): string {
    const panels = ['100 amp', '200 amp', '400 amp', 'fuse box'];
    return panels[Math.floor(Math.random() * panels.length)] || '200 amp';
  }

  private getRandomPipeMaterial(): string {
    const materials = ['copper', 'PEX', 'PVC', 'galvanized steel', 'polybutylene'];
    return materials[Math.floor(Math.random() * materials.length)] || 'copper';
  }

  private getRandomHVACType(): string {
    const types = ['forced air', 'heat pump', 'boiler', 'mini-split', 'window units'];
    return types[Math.floor(Math.random() * types.length)] || 'forced air';
  }

  private calculateFoundationRepairCost(issues: string[]): number {
    return issues.length * 5000 + Math.random() * 10000;
  }

  private calculateRoofRepairCost(issues: string[], material: string): number {
    const baseCost = material === 'slate' ? 15000 : material === 'metal' ? 12000 : 8000;
    return issues.length * 2000 + baseCost * 0.3;
  }

  private calculateWallRepairCost(issues: string[]): number {
    return issues.length * 1500 + Math.random() * 3000;
  }

  private calculateElectricalRepairCost(issues: string[]): number {
    return issues.length * 2500 + Math.random() * 5000;
  }

  private calculatePlumbingRepairCost(issues: string[]): number {
    return issues.length * 2000 + Math.random() * 4000;
  }

  private calculateHVACRepairCost(issues: string[]): number {
    return issues.length * 3000 + Math.random() * 8000;
  }

  private simulateCodeViolations(structuralAssessment: StructuralAssessment): BuildingCodeCompliance['safety_violations'] {
    const violations = {
      critical: [] as string[],
      major: [] as string[],
      minor: [] as string[]
    };

    if (structuralAssessment.foundation.condition === 'critical') {
      violations.critical.push('Foundation structural integrity compromised');
    }
    if (structuralAssessment.electrical.condition === 'poor' || structuralAssessment.electrical.condition === 'critical') {
      violations.major.push('Electrical system does not meet current code');
    }
    if (structuralAssessment.plumbing.condition === 'poor') {
      violations.major.push('Plumbing system requires updates');
    }

    return violations;
  }

  private calculateComplianceScore(violations: BuildingCodeCompliance['safety_violations']): number {
    let score = 100;
    score -= violations.critical.length * 30;
    score -= violations.major.length * 15;
    score -= violations.minor.length * 5;
    return Math.max(0, score);
  }

  private determineRequiredUpgrades(violations: BuildingCodeCompliance['safety_violations']): BuildingCodeCompliance['required_upgrades'] {
    return {
      immediate: violations.critical,
      within_1_year: violations.major,
      within_5_years: violations.minor
    };
  }

  private calculateComplianceCost(upgrades: BuildingCodeCompliance['required_upgrades']): number {
    return upgrades.immediate.length * 10000 + 
           upgrades.within_1_year.length * 5000 + 
           upgrades.within_5_years.length * 2000;
  }

  private analyzeMoldRisk(photos: any[]): EnvironmentalHazards['mold'] {
    const moldPhotos = photos.filter(p => 
      p.analysis.damage_detected.some((d: string) => d.includes('mold')) ||
      p.analysis.room_type === 'bathroom' ||
      p.analysis.room_type === 'basement'
    );

    const detected = moldPhotos.length > 0 && Math.random() < 0.3;
    const severity = detected ? (Math.random() < 0.5 ? 'minor' : 'moderate') : 'none';
    const locations = detected ? ['bathroom', 'basement'] : [];
    const cost = detected ? (severity === 'moderate' ? 5000 : 2000) : 0;

    return { detected, severity, locations, estimated_remediation_cost: cost };
  }

  private analyzeWaterDamage(photos: any[]): EnvironmentalHazards['water_damage'] {
    const waterPhotos = photos.filter(p => 
      p.analysis.damage_detected.some((d: string) => d.includes('water'))
    );

    const detected = waterPhotos.length > 0;
    const severity = detected ? (Math.random() < 0.6 ? 'minor' : 'moderate') : 'none';
    const locations = detected ? ['basement', 'bathroom'] : [];
    const cost = detected ? (severity === 'moderate' ? 8000 : 3000) : 0;

    return { detected, severity, locations, estimated_repair_cost: cost };
  }

  private analyzeAsbestosRisk(photos: any[]): EnvironmentalHazards['asbestos_risk'] {
    const riskLevel = Math.random() < 0.2 ? 'high' : Math.random() < 0.4 ? 'medium' : 'low';
    const materials = riskLevel === 'high' ? ['popcorn ceiling', 'floor tiles', 'insulation'] : [];
    const testingRecommended = riskLevel !== 'low';
    const testingCost = testingRecommended ? 800 : 0;

    return { risk_level: riskLevel, suspected_materials: materials, testing_recommended: testingRecommended, estimated_testing_cost: testingCost };
  }

  private analyzeLeadPaintRisk(photos: any[]): EnvironmentalHazards['lead_paint_risk'] {
    const riskLevel = Math.random() < 0.3 ? 'high' : Math.random() < 0.5 ? 'medium' : 'low';
    const surfaces = riskLevel === 'high' ? ['exterior trim', 'window frames', 'doors'] : [];
    const testingRecommended = riskLevel !== 'low';
    const testingCost = testingRecommended ? 600 : 0;

    return { risk_level: riskLevel, suspected_surfaces: surfaces, testing_recommended: testingRecommended, estimated_testing_cost: testingCost };
  }

  private analyzeInsulation(photos: any[]): EnergyEfficiency['insulation'] {
    const quality = Math.random() < 0.2 ? 'excellent' : Math.random() < 0.4 ? 'good' : Math.random() < 0.6 ? 'fair' : 'poor';
    const type = quality === 'excellent' ? 'spray foam' : quality === 'good' ? 'fiberglass' : 'minimal';
    const upgradeCost = quality === 'poor' ? 8000 : quality === 'fair' ? 5000 : 0;

    return { quality, type, estimated_upgrade_cost: upgradeCost };
  }

  private analyzeWindows(photos: any[]): EnergyEfficiency['windows'] {
    const efficiency = Math.random() < 0.2 ? 'excellent' : Math.random() < 0.4 ? 'good' : Math.random() < 0.6 ? 'fair' : 'poor';
    const type = efficiency === 'excellent' ? 'double-pane energy star' : efficiency === 'good' ? 'double-pane' : 'single-pane';
    const upgradeCost = efficiency === 'poor' ? 15000 : efficiency === 'fair' ? 8000 : 0;

    return { efficiency, type, estimated_upgrade_cost: upgradeCost };
  }

  private analyzeHVACEfficiency(hvac: StructuralAssessment['hvac']): EnergyEfficiency['hvac_efficiency'] {
    const rating = hvac.condition === 'excellent' ? 'excellent' : hvac.condition === 'good' ? 'good' : hvac.condition === 'fair' ? 'fair' : 'poor';
    const upgradeCost = rating === 'poor' ? 12000 : rating === 'fair' ? 8000 : 0;

    return { rating, estimated_upgrade_cost: upgradeCost };
  }

  private calculateEfficiencyScore(insulation: EnergyEfficiency['insulation'], windows: EnergyEfficiency['windows'], hvac: EnergyEfficiency['hvac_efficiency']): number {
    let score = 50;
    if (insulation.quality === 'excellent') score += 20;
    else if (insulation.quality === 'good') score += 15;
    else if (insulation.quality === 'fair') score += 10;

    if (windows.efficiency === 'excellent') score += 20;
    else if (windows.efficiency === 'good') score += 15;
    else if (windows.efficiency === 'fair') score += 10;

    if (hvac.rating === 'excellent') score += 10;
    else if (hvac.rating === 'good') score += 8;
    else if (hvac.rating === 'fair') score += 5;

    return Math.min(100, score);
  }

  private calculateAnnualEnergySavings(efficiencyScore: number): number {
    if (efficiencyScore >= 80) return 0;
    if (efficiencyScore >= 60) return 800;
    if (efficiencyScore >= 40) return 1500;
    return 2500;
  }

  private calculateOverallRiskScore(
    structural: StructuralAssessment,
    compliance: BuildingCodeCompliance,
    environmental: EnvironmentalHazards
  ): number {
    let riskScore = 0;

    // Structural risk
    const structuralConditions = [structural.foundation.condition, structural.roof.condition, structural.walls.structural_integrity];
    structuralConditions.forEach(condition => {
      if (condition === 'critical') riskScore += 30;
      else if (condition === 'poor') riskScore += 20;
      else if (condition === 'fair') riskScore += 10;
    });

    // Compliance risk
    riskScore += (100 - compliance.code_compliance_score) * 0.3;

    // Environmental risk
    if (environmental.mold.severity === 'severe') riskScore += 25;
    else if (environmental.mold.severity === 'moderate') riskScore += 15;
    if (environmental.asbestos_risk.risk_level === 'high') riskScore += 20;

    return Math.min(100, riskScore);
  }

  private identifyCriticalIssues(
    structural: StructuralAssessment,
    compliance: BuildingCodeCompliance,
    environmental: EnvironmentalHazards
  ): string[] {
    const issues: string[] = [];

    if (structural.foundation.condition === 'critical') issues.push('Critical foundation issues require immediate attention');
    if (structural.roof.condition === 'critical') issues.push('Roof in critical condition - immediate repair needed');
    if (compliance.safety_violations.critical.length > 0) issues.push('Critical safety violations must be addressed immediately');
    if (environmental.mold.severity === 'severe') issues.push('Severe mold infestation requires professional remediation');

    return issues;
  }

  private generateRecommendedActions(
    structural: StructuralAssessment,
    compliance: BuildingCodeCompliance,
    environmental: EnvironmentalHazards,
    energy: EnergyEfficiency
  ): string[] {
    const actions: string[] = [];

    if (structural.foundation.condition === 'poor' || structural.foundation.condition === 'critical') {
      actions.push('Schedule foundation inspection by structural engineer');
    }
    if (compliance.safety_violations.major.length > 0) {
      actions.push('Address major code violations within 1 year');
    }
    if (environmental.asbestos_risk.testing_recommended) {
      actions.push('Conduct asbestos testing before any renovations');
    }
    if (energy.overall_efficiency_score < 60) {
      actions.push('Consider energy efficiency upgrades for long-term savings');
    }

    return actions;
  }

  private calculateTotalCosts(
    structural: StructuralAssessment,
    compliance: BuildingCodeCompliance,
    environmental: EnvironmentalHazards,
    energy: EnergyEfficiency
  ): AdvancedPhotoAnalysis['total_estimated_costs'] {
    const structuralCost = Object.values(structural).reduce((sum, system) => sum + system.estimated_repair_cost, 0);
    const complianceCost = compliance.estimated_compliance_cost;
    const environmentalCost = environmental.mold.estimated_remediation_cost + 
                             environmental.water_damage.estimated_repair_cost +
                             environmental.asbestos_risk.estimated_testing_cost +
                             environmental.lead_paint_risk.estimated_testing_cost;
    const energyCost = energy.insulation.estimated_upgrade_cost + 
                      energy.windows.estimated_upgrade_cost + 
                      energy.hvac_efficiency.estimated_upgrade_cost;

    return {
      structural: structuralCost,
      compliance: complianceCost,
      environmental: environmentalCost,
      energy: energyCost,
      total: structuralCost + complianceCost + environmentalCost + energyCost
    };
  }
}

// Export singleton instance
export const advancedPhotoAnalyzer = new AdvancedPhotoAnalyzer();
