import { 
  User, 
  Channel, 
  Interaction, 
  Conversation, 
  Feedback, 
  BusinessMetrics, 
  PropertyAddress,
  mongoose 
} from './mongo-schema';

export class MongoService {
  private isConnected = false;

  async connect(): Promise<void> {
    if (this.isConnected) return;

    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/acquisitions-agent';
      await mongoose.connect(mongoUri);
      this.isConnected = true;
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) return;
    await mongoose.disconnect();
    this.isConnected = false;
    console.log('🔌 Disconnected from MongoDB');
  }

  async ensureUser(slackId: string, email?: string, name?: string): Promise<void> {
    try {
      await User.findOneAndUpdate(
        { slackId },
        { 
          slackId, 
          email, 
          name, 
          lastActive: new Date() 
        },
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error('Error ensuring user:', error);
    }
  }

  async ensureChannel(slackId: string, name?: string, isPrivate?: boolean): Promise<void> {
    try {
      await Channel.findOneAndUpdate(
        { slackId },
        { 
          slackId, 
          name, 
          isPrivate, 
          updatedAt: new Date() 
        },
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error('Error ensuring channel:', error);
    }
  }

  async logInteraction(data: {
    type: string;
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
    propertyAddress?: string;
    requestType?: string;
    userRole?: string;
  }): Promise<void> {
    try {
      await this.connect();
      
      const interaction = new Interaction(data);
      await interaction.save();

      // Update user stats
      await User.findOneAndUpdate(
        { slackId: data.userId },
        { 
          $inc: { 
            totalInteractions: 1,
            successfulInteractions: data.success ? 1 : 0
          },
          lastActive: new Date()
        }
      );

      // Update business metrics
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      await BusinessMetrics.findOneAndUpdate(
        { date: today },
        { 
          $inc: { 
            totalInteractions: 1,
            successfulInteractions: data.success ? 1 : 0,
            totalTokens: data.tokens || 0
          },
          updatedAt: new Date()
        },
        { upsert: true }
      );
    } catch (error) {
      console.error('Error logging interaction:', error);
    }
  }

  async storeConversation(userId: string, channelId: string, userMessage: string, botResponse: string): Promise<void> {
    try {
      await this.connect();
      
      const context = this.extractContext(userMessage);
      
      const conversation = new Conversation({
        userId,
        channelId,
        userMessage,
        botResponse,
        messageLength: userMessage.length,
        ...context
      });
      
      await conversation.save();
    } catch (error) {
      console.error('Error storing conversation:', error);
    }
  }

  async getConversationContext(userId: string, channelId: string, limit: number = 5): Promise<string> {
    try {
      await this.connect();
      
      const recent = await Conversation.find({ userId, channelId })
        .sort({ timestamp: -1 })
        .limit(limit);
      
      if (recent.length === 0) return '';
      
      return recent.map(h => `User: ${h.userMessage}\nBot: ${h.botResponse}`).join('\n\n');
    } catch (error) {
      console.error('Error getting conversation context:', error);
      return '';
    }
  }

  async storeFeedback(data: {
    userId: string;
    channelId: string;
    interactionId?: string;
    originalRequest: string;
    feedback: 'positive' | 'negative';
    reason?: string;
    responseQuality?: number;
    category?: string;
  }): Promise<void> {
    try {
      await this.connect();
      
      const feedback = new Feedback(data);
      await feedback.save();
    } catch (error) {
      console.error('Error storing feedback:', error);
    }
  }

  async getAnalytics(): Promise<any> {
    try {
      await this.connect();
      
      const totalInteractions = await Interaction.countDocuments();
      const successfulInteractions = await Interaction.countDocuments({ success: true });
      const successRate = totalInteractions > 0 ? successfulInteractions / totalInteractions : 0;
      
      const topUsers = await Interaction.aggregate([
        { $group: { _id: '$userId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);
      
      const popularRequests = await Interaction.aggregate([
        { $group: { _id: '$request', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);
      
      const recommendations = this.generateRecommendations({
        totalInteractions,
        successRate,
        topUsers,
        popularRequests
      });
      
      return {
        totalInteractions,
        successRate,
        topUsers,
        popularRequests,
        recommendations
      };
    } catch (error) {
      console.error('Error getting analytics:', error);
      return null;
    }
  }

  private extractContext(message: string): any {
    const hasAddress = /\b\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Way|Place|Pl)\b/i.test(message);
    const addressCount = (message.match(/\b\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Way|Place|Pl)\b/gi) || []).length;
    const hasQuestions = /\?/.test(message);
    const hasNumbers = /\d/.test(message);
    
    return {
      hasAddress,
      addressCount,
      hasQuestions,
      hasNumbers
    };
  }

  private generateRecommendations(data: any): string[] {
    const recommendations = [];
    
    if (data.successRate < 0.8) {
      recommendations.push('Consider improving error handling and user input validation');
    }
    
    if (data.totalInteractions < 100) {
      recommendations.push('Increase user engagement by promoting the bot in more channels');
    }
    
    if (data.topUsers.length > 0 && data.topUsers[0].count > 50) {
      recommendations.push('Power users detected - consider advanced features for heavy users');
    }
    
    if (data.popularRequests.length > 0) {
      recommendations.push(`Most common request: "${data.popularRequests[0].request}" - consider creating a quick action for this`);
    }
    
    return recommendations;
  }
}
