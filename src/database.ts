// src/database.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DatabaseService {
  // Ensure user exists in database
  async ensureUser(slackId: string, email?: string, name?: string) {
    try {
      const user = await prisma.user.upsert({
        where: { slackId },
        update: { 
          lastActive: new Date(),
          name: name || undefined
        },
        create: {
          slackId,
          email,
          name,
          lastActive: new Date()
        }
      });
      return user;
    } catch (error: any) {
      console.error('Failed to ensure user:', error.message);
      return null;
    }
  }

  // Ensure channel exists in database
  async ensureChannel(slackId: string, name?: string, isPrivate: boolean = false) {
    try {
      const channel = await prisma.channel.upsert({
        where: { slackId },
        update: { 
          name: name || undefined,
          isPrivate
        },
        create: {
          slackId,
          name,
          isPrivate
        }
      });
      return channel;
    } catch (error: any) {
      console.error('Failed to ensure channel:', error.message);
      return null;
    }
  }

  // Log interaction with full business context
  async logInteraction(interaction: {
    type: 'command' | 'mention';
    userId: string;
    channelId: string;
    request: string;
    response: string;
    success: boolean;
    model?: string;
    tokens?: number;
    responseTime?: number;
    errorCode?: string;
    errorMessage?: string;
  }) {
    try {
      // Extract business context
      const businessContext = this.extractBusinessContext(interaction.request);
      
      // Ensure user and channel exist
      await this.ensureUser(interaction.userId);
      await this.ensureChannel(interaction.channelId);
      
      // Create interaction record
      const interactionRecord = await prisma.interaction.create({
        data: {
          type: interaction.type,
          userId: interaction.userId,
          channelId: interaction.channelId,
          request: interaction.request,
          response: interaction.response,
          success: interaction.success,
          model: interaction.model,
          tokens: interaction.tokens,
          responseTime: interaction.responseTime,
          errorCode: interaction.errorCode,
          errorMessage: interaction.errorMessage,
          propertyAddress: businessContext.propertyAddress,
          requestType: businessContext.requestType,
          userRole: businessContext.userRole
        }
      });

      // Update user metrics
      await prisma.user.update({
        where: { slackId: interaction.userId },
        data: {
          totalInteractions: { increment: 1 },
          successfulInteractions: interaction.success ? { increment: 1 } : undefined,
          lastActive: new Date()
        }
      });

      // Update business metrics
      await this.updateBusinessMetrics(interaction, businessContext);

      console.log(`📝 Logged interaction: ${interaction.type} from ${interaction.userId}`);
      return interactionRecord;
    } catch (error: any) {
      console.error('Failed to log interaction:', error.message);
      return null;
    }
  }

  // Store conversation context
  async storeConversation(userId: string, channelId: string, message: string, response: string) {
    try {
      const businessContext = this.extractBusinessContext(message);
      const context = this.extractContext(message);
      
      // Ensure user and channel exist
      await this.ensureUser(userId);
      await this.ensureChannel(channelId);
      
      // Create conversation record
      const conversation = await prisma.conversation.create({
        data: {
          userId,
          channelId,
          userMessage: message,
          botResponse: response,
          hasAddress: context.hasAddress,
          addressCount: context.addressCount,
          messageLength: context.messageLength,
          hasQuestions: context.hasQuestions,
          hasNumbers: context.hasNumbers,
          propertyAddress: businessContext.propertyAddress,
          requestType: businessContext.requestType
        }
      });

      // Update property address tracking if address found
      if (businessContext.propertyAddress) {
        await this.updatePropertyAddress(businessContext.propertyAddress);
      }

      return conversation;
    } catch (error: any) {
      console.error('Failed to store conversation:', error.message);
      return null;
    }
  }

  // Get conversation context for better responses
  async getConversationContext(userId: string, channelId: string): Promise<string> {
    try {
      const conversations = await prisma.conversation.findMany({
        where: {
          userId,
          channelId
        },
        orderBy: {
          timestamp: 'desc'
        },
        take: 3,
        include: {
          user: true,
          channel: true
        }
      });

      if (conversations.length === 0) return '';

      // Return formatted conversation history
      return conversations.reverse().map(c => 
        `User: ${c.userMessage}\nBot: ${c.botResponse}`
      ).join('\n\n');
    } catch (error: any) {
      console.error('Failed to get conversation context:', error.message);
      return '';
    }
  }

  // Store user feedback
  async storeFeedback(feedback: {
    userId: string;
    channelId: string;
    interactionId?: string;
    originalRequest: string;
    feedback: 'positive' | 'negative';
    reason?: string;
    responseQuality?: number;
    category?: string;
  }) {
    try {
      // Ensure user and channel exist
      await this.ensureUser(feedback.userId);
      await this.ensureChannel(feedback.channelId);
      
      const feedbackRecord = await prisma.feedback.create({
        data: {
          userId: feedback.userId,
          channelId: feedback.channelId,
          interactionId: feedback.interactionId,
          originalRequest: feedback.originalRequest,
          feedback: feedback.feedback,
          reason: feedback.reason,
          responseQuality: feedback.responseQuality,
          category: feedback.category
        }
      });

      console.log(`👍 Feedback stored: ${feedback.feedback} from ${feedback.userId}`);
      return feedbackRecord;
    } catch (error: any) {
      console.error('Failed to store feedback:', error.message);
      return null;
    }
  }

  // Get comprehensive analytics
  async getAnalytics() {
    try {
      const [
        totalInteractions,
        successfulInteractions,
        totalUsers,
        activeUsers,
        feedback,
        popularRequests,
        topUsers,
        businessMetrics
      ] = await Promise.all([
        prisma.interaction.count(),
        prisma.interaction.count({ where: { success: true } }),
        prisma.user.count(),
        prisma.user.count({ where: { lastActive: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
        prisma.feedback.findMany({ take: 10, orderBy: { timestamp: 'desc' } }),
        this.getPopularRequests(),
        this.getTopUsers(),
        this.getBusinessMetrics()
      ]);

      const successRate = totalInteractions > 0 ? successfulInteractions / totalInteractions : 0;
      const feedbackSummary = this.getFeedbackSummary(feedback);

      return {
        totalInteractions,
        successfulInteractions,
        successRate,
        totalUsers,
        activeUsers,
        popularRequests,
        topUsers,
        feedbackSummary,
        businessMetrics,
        recommendations: this.generateRecommendations(feedback, businessMetrics)
      };
    } catch (error: any) {
      console.error('Failed to get analytics:', error.message);
      return null;
    }
  }

  // Get popular requests
  private async getPopularRequests() {
    try {
      const requests = await prisma.interaction.groupBy({
        by: ['requestType'],
        _count: { requestType: true },
        orderBy: { _count: { requestType: 'desc' } },
        take: 5
      });

      return requests.map(r => ({
        request: r.requestType || 'Unknown',
        count: r._count.requestType
      }));
    } catch (error: any) {
      console.error('Failed to get popular requests:', error.message);
      return [];
    }
  }

  // Get top users by engagement
  private async getTopUsers() {
    try {
      const users = await prisma.user.findMany({
        orderBy: { totalInteractions: 'desc' },
        take: 5,
        select: {
          slackId: true,
          name: true,
          totalInteractions: true,
          successfulInteractions: true
        }
      });

      return users.map(u => ({
        userId: u.slackId,
        name: u.name,
        count: u.totalInteractions,
        successRate: u.totalInteractions > 0 ? u.successfulInteractions / u.totalInteractions : 0
      }));
    } catch (error: any) {
      console.error('Failed to get top users:', error.message);
      return [];
    }
  }

  // Get business metrics
  private async getBusinessMetrics() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const metrics = await prisma.businessMetrics.findUnique({
        where: { date: today }
      });

      return metrics;
    } catch (error: any) {
      console.error('Failed to get business metrics:', error.message);
      return null;
    }
  }

  // Update business metrics
  private async updateBusinessMetrics(interaction: any, businessContext: any) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await prisma.businessMetrics.upsert({
        where: { date: today },
        update: {
          totalInteractions: { increment: 1 },
          successfulInteractions: interaction.success ? { increment: 1 } : undefined,
          totalTokens: interaction.tokens ? { increment: interaction.tokens } : undefined,
          propertyAnalysisCount: businessContext.requestType === 'analysis' ? { increment: 1 } : undefined,
          compingRequests: businessContext.requestType === 'comping' ? { increment: 1 } : undefined,
          updatedAt: new Date()
        },
        create: {
          date: today,
          totalInteractions: 1,
          successfulInteractions: interaction.success ? 1 : 0,
          totalUsers: 1,
          activeUsers: 1,
          totalTokens: interaction.tokens || 0,
          propertyAnalysisCount: businessContext.requestType === 'analysis' ? 1 : 0,
          compingRequests: businessContext.requestType === 'comping' ? 1 : 0
        }
      });
    } catch (error: any) {
      console.error('Failed to update business metrics:', error.message);
    }
  }

  // Update property address tracking
  private async updatePropertyAddress(address: string) {
    try {
      await prisma.propertyAddress.upsert({
        where: { address },
        update: {
          analysisCount: { increment: 1 },
          lastAnalyzed: new Date()
        },
        create: {
          address,
          analysisCount: 1,
          lastAnalyzed: new Date()
        }
      });
    } catch (error: any) {
      console.error('Failed to update property address:', error.message);
    }
  }

  // Extract business context from request
  private extractBusinessContext(request: string) {
    const addressMatch = request.match(/\d+\s+[^,]+(?:,\s*[^,]+)*/g);
    const hasComping = request.toLowerCase().includes('comp') || request.toLowerCase().includes('comparable');
    const hasAnalysis = request.toLowerCase().includes('analyze') || request.toLowerCase().includes('analysis');
    
    return {
      propertyAddress: addressMatch ? addressMatch[0] : null,
      requestType: hasComping ? 'comping' : hasAnalysis ? 'analysis' : 'general',
      userRole: 'user' // Could be enhanced with user role detection
    };
  }

  // Extract context from message
  private extractContext(message: string) {
    const addressMatch = message.match(/\d+\s+[^,]+(?:,\s*[^,]+)*/g);
    
    return {
      hasAddress: !!addressMatch,
      addressCount: addressMatch ? addressMatch.length : 0,
      messageLength: message.length,
      hasQuestions: message.includes('?'),
      hasNumbers: /\d/.test(message)
    };
  }

  // Get feedback summary
  private getFeedbackSummary(feedback: any[]) {
    const total = feedback.length;
    const positive = feedback.filter(f => f.feedback === 'positive').length;
    const negative = feedback.filter(f => f.feedback === 'negative').length;
    
    return {
      total,
      positive,
      negative,
      satisfactionRate: total > 0 ? positive / total : 0
    };
  }

  // Generate recommendations
  private generateRecommendations(feedback: any[], businessMetrics: any): string[] {
    const recommendations = [];
    
    if (feedback.length > 0) {
      const negativeFeedback = feedback.filter(f => f.feedback === 'negative');
      if (negativeFeedback.length > 0) {
        recommendations.push(`Address negative feedback: ${negativeFeedback.slice(0, 2).map(f => f.reason || 'No reason given').join(', ')}`);
      }
    }
    
    if (businessMetrics) {
      if (businessMetrics.successRate < 0.9) {
        recommendations.push('Improve success rate - investigate failed interactions');
      }
      if (businessMetrics.averageResponseTime > 5000) {
        recommendations.push('Optimize response times for better user experience');
      }
    }
    
    return recommendations;
  }

  // Close database connection
  async disconnect() {
    await prisma.$disconnect();
  }
}

export default DatabaseService;
