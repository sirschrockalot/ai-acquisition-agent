// src/conversation-manager.ts
// Conversation Manager for Persistent Property Discussions

import { Property, DealPerformance } from './comping-utils';

export interface ConversationContext {
  conversation_id: string;
  user_id: string;
  channel_id: string;
  thread_ts: string | undefined;
  property_address: string | undefined;
  current_property: Property | undefined;
  conversation_state: 'initializing' | 'property_analysis' | 'comp_search' | 'arv_calculation' | 'repair_estimation' | 'deal_analysis' | 'completed';
  last_activity: Date;
  message_count: number;
  analysis_results: {
    comps?: any[];
    arv_result?: any;
    repair_estimate?: any;
    deal_performance?: DealPerformance;
  } | undefined;
  user_preferences: {
    target_margin?: number;
    preferred_property_types?: string[];
    max_repair_budget?: number;
  } | undefined;
}

export interface ConversationMessage {
  message_id: string;
  conversation_id: string;
  user_id: string;
  timestamp: Date;
  content: string;
  message_type: 'user_input' | 'agent_response' | 'system_notification';
  metadata?: {
    property_address?: string;
    analysis_step?: string;
    confidence_score?: number;
  };
}

export class ConversationManager {
  private conversations: Map<string, ConversationContext> = new Map();
  private conversationMessages: Map<string, ConversationMessage[]> = new Map();
  
  /**
   * Start a new conversation or resume existing one
   */
  startConversation(
    userId: string,
    channelId: string,
    threadTs?: string,
    initialProperty?: string
  ): ConversationContext {
    const conversationId = this.generateConversationId(userId, channelId, threadTs);
    
    // Check if conversation already exists
    let conversation = this.conversations.get(conversationId);
    
    if (!conversation) {
      // Create new conversation
      conversation = {
        conversation_id: conversationId,
        user_id: userId,
        channel_id: channelId,
        thread_ts: threadTs,
        property_address: initialProperty,
        current_property: undefined,
        conversation_state: 'initializing',
        last_activity: new Date(),
        message_count: 0,
        analysis_results: undefined,
        user_preferences: undefined
      };
      
      this.conversations.set(conversationId, conversation);
      this.conversationMessages.set(conversationId, []);
    } else {
      // Resume existing conversation
      conversation.last_activity = new Date();
    }
    
    return conversation;
  }
  
  /**
   * Add a message to the conversation
   */
  addMessage(
    conversationId: string,
    userId: string,
    content: string,
    messageType: 'user_input' | 'agent_response' | 'system_notification' = 'user_input',
    metadata?: any
  ): ConversationMessage {
    const message: ConversationMessage = {
      message_id: this.generateMessageId(),
      conversation_id: conversationId,
      user_id: userId,
      timestamp: new Date(),
      content,
      message_type: messageType,
      metadata
    };
    
    const messages = this.conversationMessages.get(conversationId) || [];
    messages.push(message);
    this.conversationMessages.set(conversationId, messages);
    
    // Update conversation
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      conversation.message_count = messages.length;
      conversation.last_activity = new Date();
    }
    
    return message;
  }
  
  /**
   * Get conversation context
   */
  getConversation(conversationId: string): ConversationContext | undefined {
    return this.conversations.get(conversationId);
  }
  
  /**
   * Get conversation messages
   */
  getConversationMessages(conversationId: string): ConversationMessage[] {
    return this.conversationMessages.get(conversationId) || [];
  }
  
  /**
   * Update conversation state
   */
  updateConversationState(
    conversationId: string,
    newState: ConversationContext['conversation_state'],
    updates?: Partial<ConversationContext>
  ): boolean {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) return false;
    
    conversation.conversation_state = newState;
    if (updates) {
      Object.assign(conversation, updates);
    }
    conversation.last_activity = new Date();
    
    return true;
  }
  
  /**
   * Set current property for conversation
   */
  setCurrentProperty(
    conversationId: string,
    property: Property
  ): boolean {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) return false;
    
    conversation.current_property = property;
    conversation.property_address = property.address;
    conversation.last_activity = new Date();
    
    return true;
  }
  
  /**
   * Store analysis results
   */
  storeAnalysisResults(
    conversationId: string,
    results: ConversationContext['analysis_results']
  ): boolean {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) return false;
    
    conversation.analysis_results = {
      ...conversation.analysis_results,
      ...results
    };
    conversation.last_activity = new Date();
    
    return true;
  }
  
  /**
   * Check if message is part of active conversation
   */
  isConversationMessage(
    userId: string,
    channelId: string,
    threadTs?: string
  ): boolean {
    const conversationId = this.generateConversationId(userId, channelId, threadTs);
    const conversation = this.conversations.get(conversationId);
    
    if (!conversation) return false;
    
    // Check if conversation is recent (within last 30 minutes)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    return conversation.last_activity > thirtyMinutesAgo;
  }
  
  /**
   * Get active conversations for a user
   */
  getUserConversations(userId: string): ConversationContext[] {
    return Array.from(this.conversations.values())
      .filter(conv => conv.user_id === userId)
      .sort((a, b) => b.last_activity.getTime() - a.last_activity.getTime());
  }
  
  /**
   * Clean up conversations older than 24 hours
   */
  cleanupOldConversations(): number {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    let cleanedCount = 0;
    
    for (const [conversationId, conversation] of Array.from(this.conversations.entries())) {
      if (conversation.last_activity < twentyFourHoursAgo) {
        this.conversations.delete(conversationId);
        this.conversationMessages.delete(conversationId);
        cleanedCount++;
      }
    }
    
    return cleanedCount;
  }
  
  /**
   * Generate unique conversation ID
   */
  generateConversationId(
    userId: string,
    channelId: string,
    threadTs?: string
  ): string {
    const base = `${userId}_${channelId}`;
    return threadTs ? `${base}_${threadTs}` : base;
  }
  
  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Natural Language Processor for Property Conversations
 */
export class PropertyConversationProcessor {
  private conversationManager: ConversationManager;
  
  constructor(conversationManager: ConversationManager) {
    this.conversationManager = conversationManager;
  }
  
  /**
   * Process natural language input and determine intent
   */
  processUserInput(
    userId: string,
    channelId: string,
    threadTs: string | undefined,
    message: string
  ): {
    isPropertyRelated: boolean;
    intent: string;
    entities: any;
    shouldRespond: boolean;
    conversationId: string;
  } {
    const conversationId = this.conversationManager.generateConversationId(userId, channelId, threadTs);
    const conversation = this.conversationManager.getConversation(conversationId);
    
    // Check if this is a new conversation or continuation
    const isNewConversation = !conversation;
    const isPropertyRelated = this.isPropertyRelatedMessage(message);
    
    if (isNewConversation && isPropertyRelated) {
      // Start new conversation
      this.conversationManager.startConversation(userId, channelId, threadTs);
    }
    
    // Add message to conversation
    this.conversationManager.addMessage(conversationId, userId, message);
    
    // Determine intent
    const intent = this.determineIntent(message);
    const entities = this.extractEntities(message);
    
    // Determine if agent should respond
    const shouldRespond = this.shouldAgentRespond(message, intent, conversation);
    
    return {
      isPropertyRelated,
      intent,
      entities,
      shouldRespond,
      conversationId
    };
  }
  
  /**
   * Check if message is property-related
   */
  private isPropertyRelatedMessage(message: string): boolean {
    const propertyKeywords = [
      'property', 'house', 'home', 'address', 'street', 'comp', 'comparable',
      'arv', 'repair', 'cost', 'margin', 'profit', 'deal', 'investment',
      'price', 'value', 'condition', 'sqft', 'bedroom', 'bathroom'
    ];
    
    const lowerMessage = message.toLowerCase();
    return propertyKeywords.some(keyword => lowerMessage.includes(keyword));
  }
  
  /**
   * Determine user intent
   */
  private determineIntent(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('analyze') || lowerMessage.includes('look at') || lowerMessage.includes('check')) {
      return 'analyze_property';
    }
    
    if (lowerMessage.includes('comps') || lowerMessage.includes('comparable') || lowerMessage.includes('similar')) {
      return 'find_comps';
    }
    
    if (lowerMessage.includes('arv') || lowerMessage.includes('value') || lowerMessage.includes('worth')) {
      return 'calculate_arv';
    }
    
    if (lowerMessage.includes('repair') || lowerMessage.includes('fix') || lowerMessage.includes('cost')) {
      return 'estimate_repairs';
    }
    
    if (lowerMessage.includes('margin') || lowerMessage.includes('profit') || lowerMessage.includes('deal')) {
      return 'analyze_deal';
    }
    
    if (lowerMessage.includes('thanks') || lowerMessage.includes('thank you') || lowerMessage.includes('bye')) {
      return 'end_conversation';
    }
    
    return 'general_inquiry';
  }
  
  /**
   * Extract entities from message
   */
  private extractEntities(message: string): any {
    const entities: any = {};
    
    // Extract property address patterns
    const addressPattern = /\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd|Circle|Cir|Court|Ct)/gi;
    const addresses = message.match(addressPattern);
    if (addresses) {
      entities.addresses = addresses;
    }
    
    // Extract numbers (prices, sqft, etc.)
    const numberPattern = /\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g;
    const numbers = message.match(numberPattern);
    if (numbers) {
      entities.numbers = numbers.map(n => n.replace('$', ''));
    }
    
    // Extract property types
    const propertyTypes = ['house', 'condo', 'duplex', 'townhouse', 'apartment'];
    const foundTypes = propertyTypes.filter(type => message.toLowerCase().includes(type));
    if (foundTypes.length > 0) {
      entities.propertyTypes = foundTypes;
    }
    
    return entities;
  }
  
  /**
   * Determine if agent should respond
   */
  private shouldAgentRespond(
    message: string,
    intent: string,
    conversation?: ConversationContext
  ): boolean {
    // Always respond to property-related intents
    if (intent !== 'general_inquiry') {
      return true;
    }
    
    // Respond if this is part of an active conversation
    if (conversation && conversation.conversation_state !== 'completed') {
      return true;
    }
    
    // Don't respond to general chat
    return false;
  }
  
  /**
   * Generate contextual response based on conversation state
   */
  generateContextualResponse(
    conversationId: string,
    userMessage: string,
    intent: string
  ): string {
    const conversation = this.conversationManager.getConversation(conversationId);
    if (!conversation) {
      return "I'm here to help with property analysis. What would you like to know?";
    }
    
    const messages = this.conversationManager.getConversationMessages(conversationId);
    const lastAgentMessage = messages
      .filter(m => m.message_type === 'agent_response')
      .pop();
    
    switch (conversation.conversation_state) {
      case 'initializing':
        if (intent === 'analyze_property') {
          return "Great! I can help analyze that property. Please provide the full address so I can get started.";
        }
        return "I'm ready to help with property analysis. What would you like me to analyze?";
        
      case 'property_analysis':
        if (intent === 'find_comps') {
          return "I'll search for comparable properties in that area. This should take just a moment...";
        }
        return "I'm analyzing the property. What specific information would you like to know?";
        
      case 'comp_search':
        if (intent === 'calculate_arv') {
          return "Perfect! I have the comps ready. Let me calculate the ARV for you...";
        }
        return "I found some comparable properties. Would you like me to calculate the ARV or focus on something specific?";
        
      case 'arv_calculation':
        if (intent === 'estimate_repairs') {
          return "Great! Now let me estimate the repair costs to calculate your potential margin...";
        }
        return "I have the ARV calculated. What would you like to know next?";
        
      case 'repair_estimation':
        if (intent === 'analyze_deal') {
          return "Excellent! Let me put it all together and analyze the deal potential...";
        }
        return "I have the repair estimate. Would you like me to analyze the overall deal?";
        
      case 'deal_analysis':
        return "I've completed the full analysis. Is there anything specific you'd like me to explain or any other properties you'd like me to look at?";
        
      default:
        return "I'm here to help! What would you like to know about this property?";
    }
  }
}

// Export singleton instance
export const conversationManager = new ConversationManager();
export const propertyConversationProcessor = new PropertyConversationProcessor(conversationManager);
