// src/photo-upload-handler.ts
// Photo Upload Handler for Zip Files and Batch Photo Analysis

import { promises as fs } from 'fs';
import * as path from 'path';
import extract from 'extract-zip';
import { v4 as uuidv4 } from 'uuid';
import { advancedPhotoAnalyzer, AdvancedPhotoAnalysis } from './advanced-photo-analysis';

export interface PhotoUploadResult {
  upload_id: string;
  total_photos: number;
  processed_photos: number;
  failed_photos: number;
  photo_analysis: PhotoAnalysisResult[];
  summary: PhotoAnalysisSummary;
  advanced_analysis?: AdvancedPhotoAnalysis;
  upload_timestamp: Date;
  processing_time_ms: number;
}

export interface PhotoAnalysisResult {
  photo_id: string;
  original_filename: string;
  file_path: string;
  file_size_bytes: number;
  mime_type: string;
  dimensions: {
    width: number;
    height: number;
  } | undefined;
  analysis: {
    room_type: string;
    condition_score: number;
    damage_detected: string[];
    repair_items: RepairItem[];
    overall_assessment: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    confidence: number;
  };
  metadata: {
    upload_timestamp: Date;
    processing_time_ms: number;
  };
}

export interface RepairItem {
  item: string;
  severity: 'minor' | 'moderate' | 'major';
  estimated_cost: number;
  confidence: number;
  location_in_photo: string;
}

export interface PhotoAnalysisSummary {
  overall_condition: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  average_condition_score: number;
  total_repair_cost: number;
  critical_issues: string[];
  major_repairs: RepairItem[];
  room_breakdown: {
    [roomType: string]: {
      count: number;
      average_condition: number;
      total_repair_cost: number;
    };
  };
  property_insights: {
    property_type: string;
    construction_quality: string;
    maintenance_level: string;
    renovation_potential: string;
  };
}

export class PhotoUploadHandler {
  private uploadDir: string;
  private tempDir: string;
  
  constructor() {
    this.uploadDir = path.join(process.cwd(), 'uploads', 'photos');
    this.tempDir = path.join(process.cwd(), 'temp', 'extractions');
    this.ensureDirectories();
  }
  
  /**
   * Ensure upload and temp directories exist
   */
  private async ensureDirectories(): Promise<void> {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Error creating directories:', error);
    }
  }
  
  /**
   * Process zip file upload with multiple photos
   */
  async processZipUpload(
    zipFilePath: string,
    propertyAddress: string,
    propertyType: string = 'single_family'
  ): Promise<PhotoUploadResult> {
    const startTime = Date.now();
    const uploadId = uuidv4();
    
    try {
      console.log(`📦 Processing zip upload: ${zipFilePath}`);
      
      // Extract zip file
      const extractionPath = path.join(this.tempDir, uploadId);
      await fs.mkdir(extractionPath, { recursive: true });
      
      await extract(zipFilePath, { dir: extractionPath });
      console.log(`✅ Zip extracted to: ${extractionPath}`);
      
      // Get all image files
      const imageFiles = await this.findImageFiles(extractionPath);
      console.log(`📸 Found ${imageFiles.length} image files`);
      
      // Process each photo
      const photoAnalysis: PhotoAnalysisResult[] = [];
      let processedCount = 0;
      let failedCount = 0;
      
      for (const imageFile of imageFiles) {
        try {
          const analysis = await this.analyzeSinglePhoto(
            imageFile,
            propertyType,
            uploadId
          );
          photoAnalysis.push(analysis);
          processedCount++;
        } catch (error) {
          console.error(`❌ Failed to analyze ${imageFile}:`, error);
          failedCount++;
        }
      }
      
      // Generate summary
      const summary = this.generateAnalysisSummary(photoAnalysis, propertyType);
      
      // Perform advanced analysis if we have enough photos
      let advancedAnalysis: AdvancedPhotoAnalysis | undefined;
      if (processedCount >= 5) {
        try {
          advancedAnalysis = await advancedPhotoAnalyzer.performAdvancedAnalysis(photoAnalysis);
        } catch (error) {
          console.error('Error performing advanced analysis:', error);
        }
      }
      
      const result: PhotoUploadResult = {
        upload_id: uploadId,
        total_photos: imageFiles.length,
        processed_photos: processedCount,
        failed_photos: failedCount,
        photo_analysis: photoAnalysis,
        summary,
        advanced_analysis: advancedAnalysis,
        upload_timestamp: new Date(),
        processing_time_ms: Date.now() - startTime
      };
      
      // Clean up temp files
      await this.cleanupTempFiles(extractionPath);
      
      console.log(`✅ Photo upload processing complete: ${processedCount}/${imageFiles.length} photos analyzed`);
      return result;
      
    } catch (error) {
      console.error('❌ Error processing zip upload:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to process zip upload: ${errorMessage}`);
    }
  }
  
  /**
   * Find all image files in a directory
   */
  private async findImageFiles(directory: string): Promise<string[]> {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const files: string[] = [];
    
    const items = await fs.readdir(directory, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(directory, item.name);
      
      if (item.isDirectory()) {
        // Recursively search subdirectories
        const subFiles = await this.findImageFiles(fullPath);
        files.push(...subFiles);
      } else if (item.isFile()) {
        const ext = path.extname(item.name).toLowerCase();
        if (imageExtensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
    
    return files;
  }
  
  /**
   * Analyze a single photo
   */
  private async analyzeSinglePhoto(
    imagePath: string,
    propertyType: string,
    uploadId: string
  ): Promise<PhotoAnalysisResult> {
    const startTime = Date.now();
    const photoId = uuidv4();
    const filename = path.basename(imagePath);
    
    // Get file stats
    const stats = await fs.stat(imagePath);
    
    // Simulate AI photo analysis (in real implementation, this would call computer vision API)
    const analysis = await this.simulatePhotoAnalysis(imagePath, propertyType);
    
    // Copy photo to permanent storage
    const permanentPath = path.join(this.uploadDir, uploadId, `${photoId}_${filename}`);
    await fs.mkdir(path.dirname(permanentPath), { recursive: true });
    await fs.copyFile(imagePath, permanentPath);
    
    return {
      photo_id: photoId,
      original_filename: filename,
      file_path: permanentPath,
      file_size_bytes: stats.size,
      mime_type: this.getMimeType(filename),
      dimensions: analysis.dimensions,
      analysis: analysis.analysis,
      metadata: {
        upload_timestamp: new Date(),
        processing_time_ms: Date.now() - startTime
      }
    };
  }
  
  /**
   * Simulate AI photo analysis (replace with actual computer vision API)
   */
  private async simulatePhotoAnalysis(
    imagePath: string,
    propertyType: string
  ): Promise<{
    dimensions?: { width: number; height: number };
    analysis: PhotoAnalysisResult['analysis'];
  }> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
    
    const filename = path.basename(imagePath).toLowerCase();
    
    // Determine room type based on filename or simulate
    const roomType = this.determineRoomType(filename);
    
    // Simulate condition score based on room type and random factors
    const baseConditionScores: { [key: string]: number } = {
      'kitchen': 0.7,
      'bathroom': 0.6,
      'bedroom': 0.8,
      'living_room': 0.75,
      'exterior': 0.65,
      'basement': 0.5,
      'attic': 0.4,
      'garage': 0.6
    };
    
    const baseScore = baseConditionScores[roomType] || 0.7;
    const conditionScore = Math.max(0.1, Math.min(1.0, baseScore + (Math.random() - 0.5) * 0.3));
    
    // Simulate damage detection
    const damageDetected = this.simulateDamageDetection(roomType, conditionScore);
    
    // Simulate repair items
    const repairItems = this.simulateRepairItems(roomType, conditionScore);
    
    // Determine overall assessment
    const overallAssessment = this.getOverallAssessment(conditionScore);
    
    return {
      dimensions: {
        width: 1920 + Math.floor(Math.random() * 1000),
        height: 1080 + Math.floor(Math.random() * 1000)
      },
      analysis: {
        room_type: roomType,
        condition_score: conditionScore,
        damage_detected: damageDetected,
        repair_items: repairItems,
        overall_assessment: overallAssessment,
        confidence: 0.7 + Math.random() * 0.3
      }
    };
  }
  
  /**
   * Determine room type from filename
   */
  private determineRoomType(filename: string): string {
    const lowerFilename = filename.toLowerCase();
    
    if (lowerFilename.includes('kitchen') || lowerFilename.includes('kitch')) return 'kitchen';
    if (lowerFilename.includes('bath') || lowerFilename.includes('toilet')) return 'bathroom';
    if (lowerFilename.includes('bed') || lowerFilename.includes('room')) return 'bedroom';
    if (lowerFilename.includes('living') || lowerFilename.includes('family')) return 'living_room';
    if (lowerFilename.includes('exterior') || lowerFilename.includes('outside') || lowerFilename.includes('front') || lowerFilename.includes('back')) return 'exterior';
    if (lowerFilename.includes('basement') || lowerFilename.includes('cellar')) return 'basement';
    if (lowerFilename.includes('attic') || lowerFilename.includes('loft')) return 'attic';
    if (lowerFilename.includes('garage') || lowerFilename.includes('carport')) return 'garage';
    
    // Default based on common patterns
    const roomTypes = ['kitchen', 'bathroom', 'bedroom', 'living_room', 'exterior', 'basement', 'attic', 'garage'];
    return roomTypes[Math.floor(Math.random() * roomTypes.length)] || 'kitchen';
  }
  
  /**
   * Simulate damage detection
   */
  private simulateDamageDetection(roomType: string, conditionScore: number): string[] {
    const damageTypes: { [key: string]: string[] } = {
      'kitchen': ['water damage', 'cabinets damaged', 'appliances broken', 'countertop stains'],
      'bathroom': ['mold', 'leaking fixtures', 'tile damage', 'water damage'],
      'bedroom': ['wall damage', 'floor damage', 'window issues', 'electrical problems'],
      'living_room': ['wall damage', 'floor damage', 'ceiling stains', 'electrical issues'],
      'exterior': ['siding damage', 'roof issues', 'foundation cracks', 'landscaping problems'],
      'basement': ['water damage', 'mold', 'structural issues', 'electrical problems'],
      'attic': ['insulation damage', 'roof leaks', 'ventilation issues', 'structural problems'],
      'garage': ['door damage', 'floor cracks', 'electrical issues', 'structural problems']
    };
    
    const roomDamages = damageTypes[roomType] || [];
    const detectedDamages: string[] = [];
    
    // More damage detected for lower condition scores
    const damageProbability = 1 - conditionScore;
    
    roomDamages.forEach((damage: string) => {
      if (Math.random() < damageProbability) {
        detectedDamages.push(damage);
      }
    });
    
    return detectedDamages;
  }
  
  /**
   * Simulate repair items
   */
  private simulateRepairItems(roomType: string, conditionScore: number): RepairItem[] {
    const repairItems: RepairItem[] = [];
    
    // Base repair costs by room type
    const baseRepairCosts: { [key: string]: { minor: number; moderate: number; major: number } } = {
      'kitchen': { minor: 500, moderate: 2000, major: 8000 },
      'bathroom': { minor: 300, moderate: 1500, major: 6000 },
      'bedroom': { minor: 200, moderate: 1000, major: 4000 },
      'living_room': { minor: 300, moderate: 1500, major: 6000 },
      'exterior': { minor: 1000, moderate: 5000, major: 15000 },
      'basement': { minor: 500, moderate: 3000, major: 10000 },
      'attic': { minor: 300, moderate: 2000, major: 8000 },
      'garage': { minor: 400, moderate: 2000, major: 7000 }
    };
    
    const costs = baseRepairCosts[roomType] || { minor: 500, moderate: 2000, major: 5000 };
    
    // Generate repair items based on condition
    const repairProbability = 1 - conditionScore;
    
    if (Math.random() < repairProbability) {
      const severity = Math.random() < 0.6 ? 'minor' : Math.random() < 0.8 ? 'moderate' : 'major';
      const cost = costs[severity] * (0.8 + Math.random() * 0.4); // ±20% variance
      
      repairItems.push({
        item: `${roomType} repairs`,
        severity,
        estimated_cost: Math.round(cost),
        confidence: 0.7 + Math.random() * 0.3,
        location_in_photo: 'general area'
      });
    }
    
    return repairItems;
  }
  
  /**
   * Get overall assessment from condition score
   */
  private getOverallAssessment(conditionScore: number): 'excellent' | 'good' | 'fair' | 'poor' | 'critical' {
    if (conditionScore >= 0.9) return 'excellent';
    if (conditionScore >= 0.7) return 'good';
    if (conditionScore >= 0.5) return 'fair';
    if (conditionScore >= 0.3) return 'poor';
    return 'critical';
  }
  
  /**
   * Generate analysis summary from all photos
   */
  private generateAnalysisSummary(
    photoAnalysis: PhotoAnalysisResult[],
    propertyType: string
  ): PhotoAnalysisSummary {
    if (photoAnalysis.length === 0) {
      return {
        overall_condition: 'fair',
        average_condition_score: 0.5,
        total_repair_cost: 0,
        critical_issues: [],
        major_repairs: [],
        room_breakdown: {},
        property_insights: {
          property_type: propertyType,
          construction_quality: 'unknown',
          maintenance_level: 'unknown',
          renovation_potential: 'unknown'
        }
      };
    }
    
    // Calculate averages and totals
    const totalConditionScore = photoAnalysis.reduce((sum, photo) => sum + photo.analysis.condition_score, 0);
    const averageConditionScore = totalConditionScore / photoAnalysis.length;
    
    const allRepairItems = photoAnalysis.flatMap(photo => photo.analysis.repair_items);
    const totalRepairCost = allRepairItems.reduce((sum, item) => sum + item.estimated_cost, 0);
    
    const criticalIssues = photoAnalysis
      .flatMap(photo => photo.analysis.damage_detected)
      .filter((damage, index, array) => array.indexOf(damage) === index);
    
    const majorRepairs = allRepairItems.filter(item => item.severity === 'major');
    
    // Room breakdown
    const roomBreakdown: PhotoAnalysisSummary['room_breakdown'] = {};
    photoAnalysis.forEach(photo => {
      const roomType = photo.analysis.room_type;
      if (!roomBreakdown[roomType]) {
        roomBreakdown[roomType] = {
          count: 0,
          average_condition: 0,
          total_repair_cost: 0
        };
      }
      
      roomBreakdown[roomType].count++;
      roomBreakdown[roomType].average_condition += photo.analysis.condition_score;
      roomBreakdown[roomType].total_repair_cost += photo.analysis.repair_items.reduce((sum, item) => sum + item.estimated_cost, 0);
    });
    
    // Calculate averages for room breakdown
    Object.keys(roomBreakdown).forEach(roomType => {
      const room = roomBreakdown[roomType];
      if (room) {
        room.average_condition = room.average_condition / room.count;
      }
    });
    
    // Property insights
    const propertyInsights = this.generatePropertyInsights(averageConditionScore, totalRepairCost, propertyType);
    
    return {
      overall_condition: this.getOverallAssessment(averageConditionScore),
      average_condition_score: averageConditionScore,
      total_repair_cost: totalRepairCost,
      critical_issues: criticalIssues,
      major_repairs: majorRepairs,
      room_breakdown: roomBreakdown,
      property_insights: propertyInsights
    };
  }
  
  /**
   * Generate property insights
   */
  private generatePropertyInsights(
    averageCondition: number,
    totalRepairCost: number,
    propertyType: string
  ): PhotoAnalysisSummary['property_insights'] {
    let constructionQuality = 'unknown';
    let maintenanceLevel = 'unknown';
    let renovationPotential = 'unknown';
    
    // Construction quality based on condition
    if (averageCondition >= 0.8) constructionQuality = 'high';
    else if (averageCondition >= 0.6) constructionQuality = 'medium';
    else constructionQuality = 'low';
    
    // Maintenance level based on condition
    if (averageCondition >= 0.7) maintenanceLevel = 'good';
    else if (averageCondition >= 0.5) maintenanceLevel = 'fair';
    else maintenanceLevel = 'poor';
    
    // Renovation potential based on condition and repair costs
    if (averageCondition >= 0.7 && totalRepairCost < 10000) renovationPotential = 'low';
    else if (averageCondition >= 0.5 && totalRepairCost < 25000) renovationPotential = 'medium';
    else renovationPotential = 'high';
    
    return {
      property_type: propertyType,
      construction_quality: constructionQuality,
      maintenance_level: maintenanceLevel,
      renovation_potential: renovationPotential
    };
  }
  
  /**
   * Get MIME type from filename
   */
  private getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.bmp': 'image/bmp',
      '.webp': 'image/webp'
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }
  
  /**
   * Clean up temporary files
   */
  private async cleanupTempFiles(extractionPath: string): Promise<void> {
    try {
      await fs.rm(extractionPath, { recursive: true, force: true });
      console.log(`🧹 Cleaned up temp files: ${extractionPath}`);
    } catch (error) {
      console.error('Error cleaning up temp files:', error);
    }
  }
  
  /**
   * Get upload statistics
   */
  async getUploadStats(): Promise<{
    total_uploads: number;
    total_photos_processed: number;
    average_processing_time_ms: number;
    storage_used_bytes: number;
  }> {
    try {
      const uploads = await fs.readdir(this.uploadDir);
      let totalPhotos = 0;
      let totalProcessingTime = 0;
      let storageUsed = 0;
      
      for (const upload of uploads) {
        const uploadPath = path.join(this.uploadDir, upload);
        const stats = await fs.stat(uploadPath);
        
        if (stats.isDirectory()) {
          const photos = await fs.readdir(uploadPath);
          totalPhotos += photos.length;
          
          // Calculate storage used
          for (const photo of photos) {
            const photoPath = path.join(uploadPath, photo);
            const photoStats = await fs.stat(photoPath);
            storageUsed += photoStats.size;
          }
        }
      }
      
      return {
        total_uploads: uploads.length,
        total_photos_processed: totalPhotos,
        average_processing_time_ms: totalPhotos > 0 ? totalProcessingTime / totalPhotos : 0,
        storage_used_bytes: storageUsed
      };
    } catch (error) {
      console.error('Error getting upload stats:', error);
      return {
        total_uploads: 0,
        total_photos_processed: 0,
        average_processing_time_ms: 0,
        storage_used_bytes: 0
      };
    }
  }
}

// Export singleton instance
export const photoUploadHandler = new PhotoUploadHandler();
