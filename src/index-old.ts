// src/index.ts
require('dotenv').config();
const { App } = require('@slack/bolt');
const OpenAI = require('openai');
const { promises: fs } = require('fs');
const { z } = require('zod');
const path = require('path');

// MongoDB service for learning system
const { MongoService } = require('./mongo-service');
const mongoService = new MongoService();
  async storeFeedback(userId: string, channelId: string, originalRequest: string, feedback: 'positive' | 'negative', reason?: string) {
    try {
      const feedbackData = await this.loadFeedback();
      feedbackData.push({
        userId,
        channelId,
        originalRequest,
        feedback,
        reason,
        timestamp: new Date().toISOString()
      });
      
      await fs.writeFile(this.feedbackFile, JSON.stringify(feedbackData, null, 2));
      console.log(`👍 Feedback stored: ${feedback} from ${userId}`);
    } catch (error: any) {
      console.error('Failed to store feedback:', error.message);
    }
  }

  // Analyze interaction patterns for learning
  async analyzePatterns(): Promise<any> {
    try {
      const interactions = await this.loadInteractions();
      const feedback = await this.loadFeedback();
      
      const analysis = {
        totalInteractions: interactions.length,
        successRate: interactions.filter(i => i.success).length / interactions.length,
        popularRequests: this.getPopularRequests(interactions),
        userEngagement: this.getUserEngagement(interactions),
        feedbackSummary: this.getFeedbackSummary(feedback),
        recommendations: this.generateRecommendations(interactions, feedback)
      };
      
      return analysis;
    } catch (error: any) {
      console.error('Failed to analyze patterns:', error.message);
      return null;
    }
  }

  // Generate learning insights and recommendations
  private generateRecommendations(interactions: any[], feedback: any[]): string[] {
    const recommendations = [];
    
    // Analyze success patterns
    const successfulRequests = interactions.filter(i => i.success).map(i => i.request);
    const failedRequests = interactions.filter(i => !i.success).map(i => i.request);
    
    if (failedRequests.length > 0) {
      recommendations.push(`Consider improving responses for: ${failedRequests.slice(0, 3).join(', ')}`);
    }
    
    if (feedback.length > 0) {
      const negativeFeedback = feedback.filter(f => f.feedback === 'negative');
      if (negativeFeedback.length > 0) {
        recommendations.push(`Address negative feedback: ${negativeFeedback.slice(0, 2).map(f => f.reason || 'No reason given').join(', ')}`);
      }
    }
    
    return recommendations;
  }

  private getPopularRequests(interactions: any[]): any[] {
    const requestCounts: { [key: string]: number } = {};
    interactions.forEach(i => {
      const key = i.request.toLowerCase().trim();
      requestCounts[key] = (requestCounts[key] || 0) + 1;
    });
    
    return Object.entries(requestCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([request, count]) => ({ request, count }));
  }

  private getUserEngagement(interactions: any[]): any[] {
    const userCounts: { [key: string]: number } = {};
    interactions.forEach(i => {
      userCounts[i.userId] = (userCounts[i.userId] || 0) + 1;
    });
    
    return Object.entries(userCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([userId, count]) => ({ userId, count }));
  }

  private getFeedbackSummary(feedback: any[]): any {
    const total = feedback.length;
    const positive = feedback.filter(f => f.feedback === 'positive').length;
    const negative = feedback.filter(f => f.feedback === 'negative').length;
    
    return { total, positive, negative, satisfactionRate: positive / total };
  }

  private extractContext(message: string): string {
    // Extract key information from user message for context
    const addressMatch = message.match(/\d+\s+[^,]+(?:,\s*[^,]+)*/g);
    const context = {
      hasAddress: !!addressMatch,
      addressCount: addressMatch ? addressMatch.length : 0,
      messageLength: message.length,
      hasQuestions: message.includes('?'),
      hasNumbers: /\d/.test(message)
    };
    
    return JSON.stringify(context);
  }

  private async loadInteractions(): Promise<any[]> {
    try {
      const data = await fs.readFile(this.interactionsFile, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  private async loadConversations(): Promise<any> {
    try {
      const data = await fs.readFile(this.conversationsFile, 'utf-8');
      return JSON.parse(data);
    } catch {
      return {};
    }
  }

  private async loadFeedback(): Promise<any[]> {
    try {
      const data = await fs.readFile(this.feedbackFile, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
}

async function main() {
  const {
    SLACK_BOT_TOKEN,
    SLACK_SIGNING_SECRET,
    OPENAI_API_KEY,
    PORT = '3000',
    TEST_MODE = 'false',
  } = process.env as Record<string, string>;

  const app = new App({
    token: SLACK_BOT_TOKEN!,
    signingSecret: SLACK_SIGNING_SECRET!,
  });

  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
  const learningSystem = new LearningSystem();

  // Load your rulebook & instructions at startup
  let agentInstructions = '';
  let compRules = '';
  
  try {
    agentInstructions = await fs.readFile('./agent_instructions.md', 'utf-8');
    compRules = await fs.readFile('./comping_rules.json', 'utf-8');
  } catch (error: any) {
    console.log('Warning: Could not load instruction files:', error.message);
  }

  // Helper: call OpenAI Responses API with your context
  async function runAcqAgent(userPrompt: string, userId: string, channelId: string) {
    // Test mode - return test response without calling OpenAI
    if (TEST_MODE === 'true') {
      const testResponse = `🧪 TEST MODE ENABLED 🧪\n\nReceived prompt: "${userPrompt}"\n\nThis is a test response to verify Slack integration is working. OpenAI API calls are disabled.\n\n✅ Slack → Your App → Slack flow is working!`;
      
      // Log the test interaction
      await learningSystem.logInteraction({
        type: 'command',
        userId,
        channelId,
        request: userPrompt,
        response: testResponse,
        success: true,
        timestamp: new Date().toISOString(),
        metadata: { mode: 'test' }
      });
      
      // Store conversation context
      await learningSystem.storeConversation(userId, channelId, userPrompt, testResponse);
      
      return testResponse;
    }

    try {
      // Get conversation context for better responses
      const conversationContext = await learningSystem.getConversationContext(userId, channelId);
      
      const system = [
        `You are the acquisitions valuation assistant for Presidential Digs Real Estate, LLC.`,
        `Follow these instructions verbatim:\n\n${agentInstructions}`,
        `Here are the comping rules (JSON):\n\n${compRules}`,
        conversationContext ? `\nPrevious conversation context:\n${conversationContext}` : '',
        `\n\nLearn from this interaction to improve future responses.`
      ].join('\n\n');

      // Responses API call (text-only minimal example)
      // Docs: model + input; responses.create returns output_text
      // (Use gpt-4o-mini for cost or gpt-4o for higher quality)
      const resp = await openai.responses.create({
        model: 'gpt-4o-mini',
        input: [
          { role: 'system', content: system },
          { role: 'user', content: userPrompt },
        ],
      });

      // Quick extraction
      // In the Responses API, you can also read structured output;
      // here we use the convenience field output_text.
      // Ref: API reference & quickstart. 
      // (If output_text undefined, parse resp.output array.)
      // @ts-ignore
      const response = resp.output_text ?? 'No content.';
      
      // Log successful interaction
      await learningSystem.logInteraction({
        type: 'command',
        userId,
        channelId,
        request: userPrompt,
        response,
        success: true,
        timestamp: new Date().toISOString(),
        metadata: { model: 'gpt-4o-mini', tokens: resp.usage?.total_tokens }
      });
      
      // Store conversation context
      await learningSystem.storeConversation(userId, channelId, userPrompt, response);
      
      return response;
    } catch (error: any) {
      console.error('OpenAI API Error:', error);
      const errorResponse = `❌ Error calling OpenAI API: ${error.message}\n\nPlease check your API key and quota.`;
      
      // Log failed interaction
      await learningSystem.logInteraction({
        type: 'command',
        userId,
        channelId,
        request: userPrompt,
        response: errorResponse,
        success: false,
        timestamp: new Date().toISOString(),
        metadata: { error: error.message, errorCode: error.code }
      });
      
      return errorResponse;
    }
  }

  // Slash command: /acq 123 Main St, Anytown
  app.command('/acq', async ({ command, ack, respond }: any) => {
    await ack(); // must ack within 3s
    const text = command.text?.trim() || '';
    if (!text) {
      await respond({
        response_type: 'ephemeral',
        text: 'Usage: /acq <address> [optional notes/photos URLs]',
      });
      return;
    }
    await respond({ response_type: 'ephemeral', text: 'Analyzing…' });
    const answer = await runAcqAgent(
      `Analyze this property using the schemas:\n${text}\n` +
      `Return BOTH: (1) the JSON schema described in agent_instructions.md, and (2) a short human summary.`,
      command.user_id,
      command.channel_id
    );
    // Post result back into the channel (threaded if user used it inside a thread)
    await respond({ response_type: 'in_channel', text: answer });
  });

  // Respond when mentioned: @AcqBot 7948 Snow Hill Dr…
  app.event('app_mention', async ({ event, client }: any) => {
    const userPrompt = event.text?.replace(/<@[^>]+>\s*/, '') ?? '';
    const result = await runAcqAgent(
      `Conversation in Slack. User said:\n"${userPrompt}"\n` +
      `If an address is present, run full analysis; else, ask for address and optional details.`,
      event.user,
      event.channel
    );
    await client.chat.postMessage({
      channel: event.channel,
      thread_ts: event.ts, // reply in thread
      text: result,
    });
  });

  // New command: /learn - Get learning insights
  app.command('/learn', async ({ command, ack, respond }: any) => {
    await ack();
    
    try {
      const analysis = await learningSystem.analyzePatterns();
      if (analysis) {
        const insights = `🧠 Learning Insights:\n\n` +
          `📊 Total Interactions: ${analysis.totalInteractions}\n` +
          `✅ Success Rate: ${(analysis.successRate * 100).toFixed(1)}%\n` +
          `👥 Top Users: ${analysis.userEngagement.map((u: any) => `<@${u.userId}> (${u.count})`).join(', ')}\n` +
          `🔥 Popular Requests: ${analysis.popularRequests.map((r: any) => `${r.request} (${r.count})`).join(', ')}\n` +
          `💡 Recommendations:\n${analysis.recommendations.map((r: any) => `• ${r}`).join('\n')}`;
        
        await respond({ response_type: 'ephemeral', text: insights });
      } else {
        await respond({ response_type: 'ephemeral', text: 'No learning data available yet.' });
      }
    } catch (error: any) {
      await respond({ response_type: 'ephemeral', text: `Error getting insights: ${error.message}` });
    }
  });

  // New command: /feedback - Provide feedback on responses
  app.command('/feedback', async ({ command, ack, respond }: any) => {
    await ack();
    
    const text = command.text?.trim() || '';
    if (!text) {
      await respond({
        response_type: 'ephemeral',
        text: 'Usage: /feedback <positive|negative> [reason] - Provide feedback on bot responses',
      });
      return;
    }
    
    const parts = text.split(' ');
    const feedbackType = parts[0].toLowerCase();
    const reason = parts.slice(1).join(' ');
    
    if (!['positive', 'negative'].includes(feedbackType)) {
      await respond({
        response_type: 'ephemeral',
        text: 'Feedback must be "positive" or "negative". Usage: /feedback <positive|negative> [reason]',
      });
      return;
    }
    
    // Store the feedback
    await learningSystem.storeFeedback(
      command.user_id,
      command.channel_id,
      'User feedback command',
      feedbackType as 'positive' | 'negative',
      reason || 'No reason provided'
    );
    
    await respond({
      response_type: 'ephemeral',
      text: `Thank you for your ${feedbackType} feedback! This helps improve the bot's responses.`,
    });
  });

  await app.start(Number(PORT));
  // eslint-disable-next-line no-console
  console.log(`⚡️ Acquisitions Agent running on :${PORT}`);
  console.log(`🧪 Test Mode: ${TEST_MODE === 'true' ? 'ENABLED' : 'DISABLED'}`);
  console.log(`🧠 Learning System: ENABLED`);
}

// Start the application
main().catch(console.error);
