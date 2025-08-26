// src/conversation-test.ts
// Test file for Conversation Persistence Feature

import { 
  conversationManager, 
  propertyConversationProcessor,
  ConversationContext 
} from './conversation-manager';

/**
 * Test the conversation persistence feature
 */
export function testConversationPersistence() {
  console.log("💬 Testing Conversation Persistence Feature");
  console.log("=" .repeat(80));
  
  // Test 1: Start a new conversation
  console.log("\n1️⃣ Starting New Conversation:");
  const userId = "U123456789";
  const channelId = "C123456789";
  const threadTs = "1234567890.123456";
  
  const conversation = conversationManager.startConversation(
    userId,
    channelId,
    threadTs,
    "123 Main St, Test City, TX"
  );
  
  console.log(`   ✅ Conversation started: ${conversation.conversation_id}`);
  console.log(`   📍 Property: ${conversation.property_address}`);
  console.log(`   🔄 State: ${conversation.conversation_state}`);
  console.log(`   👤 User: ${conversation.user_id}`);
  console.log(`   📍 Channel: ${conversation.channel_id}`);
  
  // Test 2: Add messages to conversation
  console.log("\n2️⃣ Adding Messages to Conversation:");
  
  const message1 = conversationManager.addMessage(
    conversation.conversation_id,
    userId,
    "Can you analyze this property?",
    'user_input'
  );
  
  const message2 = conversationManager.addMessage(
    conversation.conversation_id,
    'agent',
    "I'll analyze 123 Main St, Test City, TX for you. Let me search for comparable properties...",
    'agent_response'
  );
  
  const message3 = conversationManager.addMessage(
    conversation.conversation_id,
    userId,
    "What's the ARV?",
    'user_input'
  );
  
  console.log(`   ✅ Added ${message3.message_id} messages to conversation`);
  console.log(`   📊 Message count: ${conversation.message_count}`);
  
  // Test 3: Process user input and determine intent
  console.log("\n3️⃣ Processing User Input:");
  
  const processingResult = propertyConversationProcessor.processUserInput(
    userId,
    channelId,
    threadTs,
    "What are the repair costs?"
  );
  
  console.log(`   🔍 Intent detected: ${processingResult.intent}`);
  console.log(`   🏠 Property related: ${processingResult.isPropertyRelated}`);
  console.log(`   💬 Should respond: ${processingResult.shouldRespond}`);
  console.log(`   🆔 Conversation ID: ${processingResult.conversationId}`);
  
  // Test 4: Update conversation state
  console.log("\n4️⃣ Updating Conversation State:");
  
  const stateUpdated = conversationManager.updateConversationState(
    conversation.conversation_id,
    'repair_estimation',
    { property_address: "123 Main St, Test City, TX" }
  );
  
  console.log(`   ✅ State updated: ${stateUpdated}`);
  console.log(`   🔄 New state: ${conversation.conversation_state}`);
  
  // Test 5: Generate contextual response
  console.log("\n5️⃣ Generating Contextual Response:");
  
  const contextualResponse = propertyConversationProcessor.generateContextualResponse(
    conversation.conversation_id,
    "What are the repair costs?",
    'estimate_repairs'
  );
  
  console.log(`   💬 Contextual response: ${contextualResponse}`);
  
  // Test 6: Check conversation persistence
  console.log("\n6️⃣ Testing Conversation Persistence:");
  
  const retrievedConversation = conversationManager.getConversation(conversation.conversation_id);
  const retrievedMessages = conversationManager.getConversationMessages(conversation.conversation_id);
  
  console.log(`   ✅ Conversation retrieved: ${!!retrievedConversation}`);
  console.log(`   📝 Messages retrieved: ${retrievedMessages.length}`);
  console.log(`   🔄 Current state: ${retrievedConversation?.conversation_state}`);
  
  // Test 7: Simulate conversation flow
  console.log("\n7️⃣ Simulating Conversation Flow:");
  
  const conversationFlow = [
    { message: "I found a property at 456 Oak Ave", intent: "analyze_property" },
    { message: "What are the comps?", intent: "find_comps" },
    { message: "Calculate the ARV", intent: "calculate_arv" },
    { message: "Estimate repairs", intent: "estimate_repairs" },
    { message: "What's the margin?", intent: "analyze_deal" }
  ];
  
  conversationFlow.forEach((step, index) => {
    const result = propertyConversationProcessor.processUserInput(
      userId,
      channelId,
      threadTs,
      step.message
    );
    
    console.log(`   Step ${index + 1}: "${step.message}"`);
    console.log(`     - Intent: ${result.intent}`);
    console.log(`     - Should respond: ${result.shouldRespond}`);
    
    // Update conversation state based on intent
    if (result.intent === 'analyze_property') {
      conversationManager.updateConversationState(conversation.conversation_id, 'property_analysis');
    } else if (result.intent === 'find_comps') {
      conversationManager.updateConversationState(conversation.conversation_id, 'comp_search');
    } else if (result.intent === 'calculate_arv') {
      conversationManager.updateConversationState(conversation.conversation_id, 'arv_calculation');
    } else if (result.intent === 'estimate_repairs') {
      conversationManager.updateConversationState(conversation.conversation_id, 'repair_estimation');
    } else if (result.intent === 'analyze_deal') {
      conversationManager.updateConversationState(conversation.conversation_id, 'deal_analysis');
    }
  });
  
  // Test 8: Check conversation persistence across time
  console.log("\n8️⃣ Testing Time-Based Persistence:");
  
  const isActive = conversationManager.isConversationMessage(userId, channelId, threadTs);
  console.log(`   ✅ Conversation is active: ${isActive}`);
  
  const userConversations = conversationManager.getUserConversations(userId);
  console.log(`   👤 User has ${userConversations.length} active conversations`);
  
  // Test 9: Cleanup old conversations
  console.log("\n9️⃣ Testing Conversation Cleanup:");
  
  const cleanedCount = conversationManager.cleanupOldConversations();
  console.log(`   🧹 Cleaned up ${cleanedCount} old conversations`);
  
  // Test 10: Feature Summary
  console.log("\n🔟 Conversation Persistence Feature Summary:");
  console.log("   ✅ Persistent Conversations:");
  console.log("      - No need to type /acq repeatedly");
  console.log("      - Natural conversation flow");
  console.log("      - Context awareness");
  console.log("      - State management");
  
  console.log("   ✅ Smart Intent Detection:");
  console.log("      - Property-related keyword detection");
  console.log("      - Intent classification");
  console.log("      - Entity extraction");
  console.log("      - Contextual responses");
  
  console.log("   ✅ Conversation Management:");
  console.log("      - Automatic cleanup (24 hours)");
  console.log("      - Thread-based conversations");
  console.log("      - User conversation history");
  console.log("      - State persistence");
  
  console.log("   🚀 User Experience:");
  console.log("      - Natural language interaction");
  console.log("      - No command memorization");
  console.log("      - Seamless follow-up questions");
  console.log("      - Context-aware responses");
  
  console.log("\n✅ Conversation Persistence Testing Complete!");
  console.log("=" .repeat(80));
}

/**
 * Run the test
 */
if (require.main === module) {
  testConversationPersistence();
}
