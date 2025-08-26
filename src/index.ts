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

// Conversation manager for persistent conversations
const { conversationManager, propertyConversationProcessor } = require('./conversation-manager');

// Photo upload handler for zip files
const { photoUploadHandler } = require('./photo-upload-handler');

// Format photo analysis results for Slack
function formatPhotoAnalysisResults(uploadResult: any): string {
  const { summary, photo_analysis, total_photos, processed_photos, processing_time_ms, advanced_analysis } = uploadResult;
  
  let formatted = `📸 *PHOTO ANALYSIS COMPLETE*\n\n`;
  formatted += `📊 *Processing Summary:*\n`;
  formatted += `• Total Photos: ${total_photos}\n`;
  formatted += `• Successfully Processed: ${processed_photos}\n`;
  formatted += `• Processing Time: ${(processing_time_ms / 1000).toFixed(1)}s\n\n`;
  
  // Overall property assessment
  formatted += `🏠 *Overall Property Assessment:*\n`;
  formatted += `• Condition: ${summary.overall_condition.toUpperCase()}\n`;
  formatted += `• Average Condition Score: ${(summary.average_condition_score * 100).toFixed(1)}%\n`;
  formatted += `• Total Repair Cost: $${summary.total_repair_cost.toLocaleString()}\n`;
  formatted += `• Construction Quality: ${summary.property_insights.construction_quality}\n`;
  formatted += `• Maintenance Level: ${summary.property_insights.maintenance_level}\n`;
  formatted += `• Renovation Potential: ${summary.property_insights.renovation_potential}\n\n`;
  
  // Room breakdown
  if (Object.keys(summary.room_breakdown).length > 0) {
    formatted += `🏘️ *Room-by-Room Analysis:*\n`;
    Object.entries(summary.room_breakdown).forEach(([roomType, data]: [string, any]) => {
      formatted += `• ${roomType.replace('_', ' ').toUpperCase()}: ${data.count} photos, ${(data.average_condition * 100).toFixed(1)}% condition, $${data.total_repair_cost.toLocaleString()} repairs\n`;
    });
    formatted += `\n`;
  }
  
  // Critical issues
  if (summary.critical_issues.length > 0) {
    formatted += `⚠️ *Critical Issues Detected:*\n`;
    summary.critical_issues.forEach((issue: string) => {
      formatted += `• ${issue}\n`;
    });
    formatted += `\n`;
  }
  
  // Major repairs
  if (summary.major_repairs.length > 0) {
    formatted += `🔧 *Major Repairs Required:*\n`;
    summary.major_repairs.forEach((repair: any) => {
      formatted += `• ${repair.item}: $${repair.estimated_cost.toLocaleString()} (${repair.severity})\n`;
    });
    formatted += `\n`;
  }
  
  // Photo details (top 5)
  if (photo_analysis.length > 0) {
    formatted += `📷 *Photo Analysis Details (Top 5):*\n`;
    photo_analysis.slice(0, 5).forEach((photo: any, index: number) => {
      formatted += `${index + 1}. ${photo.original_filename}\n`;
      formatted += `   • Room: ${photo.analysis.room_type}\n`;
      formatted += `   • Condition: ${(photo.analysis.condition_score * 100).toFixed(1)}%\n`;
      formatted += `   • Assessment: ${photo.analysis.overall_assessment.toUpperCase()}\n`;
      if (photo.analysis.repair_items.length > 0) {
        formatted += `   • Repairs: $${photo.analysis.repair_items.reduce((sum: number, item: any) => sum + item.estimated_cost, 0).toLocaleString()}\n`;
      }
    });
  }
  
  // Advanced Analysis Section
  if (advanced_analysis) {
    formatted += `\n🏗️ *ADVANCED STRUCTURAL ASSESSMENT*\n`;
    formatted += `• Overall Risk Score: ${advanced_analysis.overall_risk_score.toFixed(1)}%\n`;
    formatted += `• Total Estimated Costs: $${advanced_analysis.total_estimated_costs.total.toLocaleString()}\n\n`;
    
    // Structural Assessment
    formatted += `🏠 *Structural Systems:*\n`;
    formatted += `• Foundation: ${advanced_analysis.structural_assessment.foundation.condition.toUpperCase()} ($${advanced_analysis.structural_assessment.foundation.estimated_repair_cost.toLocaleString()})\n`;
    formatted += `• Roof: ${advanced_analysis.structural_assessment.roof.condition.toUpperCase()} ($${advanced_analysis.structural_assessment.roof.estimated_repair_cost.toLocaleString()})\n`;
    formatted += `• Electrical: ${advanced_analysis.structural_assessment.electrical.condition.toUpperCase()} ($${advanced_analysis.structural_assessment.electrical.estimated_repair_cost.toLocaleString()})\n`;
    formatted += `• Plumbing: ${advanced_analysis.structural_assessment.plumbing.condition.toUpperCase()} ($${advanced_analysis.structural_assessment.plumbing.estimated_repair_cost.toLocaleString()})\n`;
    formatted += `• HVAC: ${advanced_analysis.structural_assessment.hvac.condition.toUpperCase()} ($${advanced_analysis.structural_assessment.hvac.estimated_repair_cost.toLocaleString()})\n\n`;
    
    // Building Code Compliance
    formatted += `📋 *Building Code Compliance:*\n`;
    formatted += `• Compliance Score: ${advanced_analysis.building_code_compliance.code_compliance_score.toFixed(1)}%\n`;
    formatted += `• Critical Violations: ${advanced_analysis.building_code_compliance.safety_violations.critical.length}\n`;
    formatted += `• Major Violations: ${advanced_analysis.building_code_compliance.safety_violations.major.length}\n`;
    formatted += `• Compliance Cost: $${advanced_analysis.building_code_compliance.estimated_compliance_cost.toLocaleString()}\n\n`;
    
    // Environmental Hazards
    formatted += `⚠️ *Environmental Hazards:*\n`;
    if (advanced_analysis.environmental_hazards.mold.detected) {
      formatted += `• Mold: ${advanced_analysis.environmental_hazards.mold.severity.toUpperCase()} ($${advanced_analysis.environmental_hazards.mold.estimated_remediation_cost.toLocaleString()})\n`;
    }
    if (advanced_analysis.environmental_hazards.water_damage.detected) {
      formatted += `• Water Damage: ${advanced_analysis.environmental_hazards.water_damage.severity.toUpperCase()} ($${advanced_analysis.environmental_hazards.water_damage.estimated_repair_cost.toLocaleString()})\n`;
    }
    formatted += `• Asbestos Risk: ${advanced_analysis.environmental_hazards.asbestos_risk.risk_level.toUpperCase()}\n`;
    formatted += `• Lead Paint Risk: ${advanced_analysis.environmental_hazards.lead_paint_risk.risk_level.toUpperCase()}\n\n`;
    
    // Energy Efficiency
    formatted += `⚡ *Energy Efficiency:*\n`;
    formatted += `• Overall Score: ${advanced_analysis.energy_efficiency.overall_efficiency_score.toFixed(1)}%\n`;
    formatted += `• Annual Energy Savings: $${advanced_analysis.energy_efficiency.estimated_annual_energy_savings.toLocaleString()}\n`;
    formatted += `• Insulation: ${advanced_analysis.energy_efficiency.insulation.quality.toUpperCase()}\n`;
    formatted += `• Windows: ${advanced_analysis.energy_efficiency.windows.efficiency.toUpperCase()}\n\n`;
    
    // Critical Issues
    if (advanced_analysis.critical_issues.length > 0) {
      formatted += `🚨 *Critical Issues:*\n`;
      advanced_analysis.critical_issues.forEach((issue: string) => {
        formatted += `• ${issue}\n`;
      });
      formatted += `\n`;
    }
    
    // Recommended Actions
    if (advanced_analysis.recommended_actions.length > 0) {
      formatted += `💡 *Recommended Actions:*\n`;
      advanced_analysis.recommended_actions.forEach((action: string) => {
        formatted += `• ${action}\n`;
      });
      formatted += `\n`;
    }
  }
  
  return formatted;
}

// Format response for better Slack readability
function formatSlackResponse(response: string): string {
  try {
    // Try to parse JSON and format it nicely
    const jsonMatch = response.match(/```json\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      const jsonStr = jsonMatch[1];
      const data = JSON.parse(jsonStr);
      
      // Create a clean, readable format
      let formatted = `🏠 *PROPERTY ANALYSIS*\n\n`;
      
      // Basic property info (if available)
      if (data.subject?.address) {
        formatted += `📍 *Address:* ${data.subject.address}\n`;
      }
      
      // ARV Section
      if (data.arv) {
        formatted += `💰 *After Repair Value (ARV):*\n`;
        formatted += `• Value: $${data.arv.value?.toLocaleString() || 'N/A'}\n`;
        if (data.arv.range_low && data.arv.range_high) {
          formatted += `• Range: $${data.arv.range_low.toLocaleString()} - $${data.arv.range_high.toLocaleString()}\n`;
        }
        formatted += `\n`;
      }
      
      // Repairs Section
      if (data.repairs) {
        formatted += `🔧 *Repair Estimate:*\n`;
        formatted += `• Cost: $${data.repairs.estimate?.toLocaleString() || 'N/A'}\n`;
        if (data.repairs.method) {
          formatted += `• Method: ${data.repairs.method}\n`;
        }
        formatted += `\n`;
      }
      
      // Wholesale Section (NEW!)
      if (data.wholesale) {
        formatted += `🎯 *WHOLESALE PRICING*\n`;
        formatted += `• *Target Price:* $${data.wholesale.recommended_price_range?.target?.toLocaleString() || 'N/A'}\n`;
        formatted += `• *Price Range:* $${data.wholesale.recommended_price_range?.low?.toLocaleString() || 'N/A'} - $${data.wholesale.recommended_price_range?.high?.toLocaleString() || 'N/A'}\n`;
        formatted += `• *Discount:* ${((data.wholesale.wholesale_discount?.percent_of_arv || 0) * 100).toFixed(1)}% off ARV\n`;
        formatted += `• *Dollar Discount:* $${data.wholesale.wholesale_discount?.dollar_amount?.toLocaleString() || 'N/A'}\n`;
        if (data.wholesale.pricing_strategy) {
          formatted += `• *Strategy:* ${data.wholesale.pricing_strategy}\n`;
        }
        formatted += `\n`;
      }
      
      // MAO Section
      if (data.mao) {
        formatted += `📊 *Maximum Allowable Offer (MAO):*\n`;
        formatted += `• MAO: $${data.mao.value?.toLocaleString() || 'N/A'}\n`;
        formatted += `• Assignment Fee: $${data.mao.assignment_fee_min?.toLocaleString() || 'N/A'}\n`;
        formatted += `\n`;
      }
      
      // Dispo Section
      if (data.dispo) {
        formatted += `🏪 *Disposition Plan:*\n`;
        formatted += `• Buyer Type: ${data.dispo.recommended_buyer_type || 'N/A'}\n`;
        formatted += `• Ask Price: $${data.dispo.ask_price?.toLocaleString() || 'N/A'}\n`;
        formatted += `• Floor Price: $${data.dispo.floor_price?.toLocaleString() || 'N/A'}\n`;
        if (data.dispo.rationale) {
          formatted += `• Rationale: ${data.dispo.rationale}\n`;
        }
        formatted += `\n`;
      }
      
      // DOM Section
      if (data.dom) {
        formatted += `⏱️ *Days on Market:*\n`;
        formatted += `• Median: ${data.dom.median_days || 'N/A'} days\n`;
        formatted += `• Window: ${data.dom.window || 'N/A'}\n`;
        formatted += `\n`;
      }
      
      // Comps Summary
      if (data.comps && data.comps.length > 0) {
        formatted += `🏘️ *Top Comparable Sales:*\n`;
        data.comps.slice(0, 3).forEach((comp: any, index: number) => {
          formatted += `${index + 1}. ${comp.address || 'N/A'}\n`;
          formatted += `   • Sale: $${comp.sale_price?.toLocaleString() || 'N/A'} (${comp.sale_date || 'N/A'})\n`;
          formatted += `   • Adjusted: $${comp.adjusted_price?.toLocaleString() || 'N/A'}\n`;
          formatted += `   • Distance: ${comp.distance_miles || 'N/A'} mi\n`;
        });
        formatted += `\n`;
      }
      
      // Warnings/Notes
      if (data.warnings && data.warnings.length > 0) {
        formatted += `⚠️ *Warnings:*\n`;
        data.warnings.forEach((warning: string) => {
          formatted += `• ${warning}\n`;
        });
        formatted += `\n`;
      }
      
      // Add the original JSON for reference (collapsed) - only if enabled
      if (process.env.SHOW_JSON_PAYLOAD === 'true') {
        formatted += `📋 *Full Data Available*\n`;
        formatted += `\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``;
      }
      
      return formatted;
    }
  } catch (error) {
    console.error('Error formatting response:', error);
  }
  
  // If parsing fails, return original response
  return response;
}

async function main() {
  const {
    SLACK_BOT_TOKEN,
    SLACK_SIGNING_SECRET,
    OPENAI_API_KEY,
    OPENAI_MODEL = 'gpt-4o-mini',
    PORT = '3000',
    TEST_MODE = 'false',
    SHOW_JSON_PAYLOAD = 'true', // Toggle for JSON display
  } = process.env as Record<string, string>;

  const app = new App({
    token: SLACK_BOT_TOKEN!,
    signingSecret: SLACK_SIGNING_SECRET!,
  });

  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

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
      await mongoService.logInteraction({
        type: 'command',
        userId,
        channelId,
        request: userPrompt,
        response: testResponse,
        success: true
      });
      
      // Store conversation context
      await mongoService.storeConversation(userId, channelId, userPrompt, testResponse);
      
      return testResponse;
    }

    try {
      // Get conversation context for better responses
      const conversationContext = await mongoService.getConversationContext(userId, channelId);
      
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
      const currentModel = process.env.OPENAI_MODEL || OPENAI_MODEL;
      const resp = await openai.responses.create({
        model: currentModel,
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
      const response = resp.output_text ?? 'No content.';
      
      // Format the response for better Slack readability
      const formattedResponse = formatSlackResponse(response);
      
      // Log successful interaction
      await mongoService.logInteraction({
        type: 'command',
        userId,
        channelId,
        request: userPrompt,
        response: formattedResponse,
        success: true,
        model: currentModel,
        tokens: resp.usage?.total_tokens
      });
      
      // Store conversation context
      await mongoService.storeConversation(userId, channelId, userPrompt, formattedResponse);
      
      return formattedResponse;
    } catch (error: any) {
      console.error('OpenAI API Error:', error);
      const errorResponse = `❌ Error calling OpenAI API: ${error.message}\n\nPlease check your API key and quota.`;
      
      // Log failed interaction
      await mongoService.logInteraction({
        type: 'command',
        userId,
        channelId,
        request: userPrompt,
        response: errorResponse,
        success: false,
        errorCode: error.code,
        errorMessage: error.message
      });
      
      return errorResponse;
    }
  }

  // Slack command handler
  app.command('/acq', async ({ command, ack, respond }: any) => {
    await ack();
    
    const text = command.text?.trim() || '';
    if (!text) {
      await respond({
        response_type: 'ephemeral',
        text: 'Please provide a property address or analysis request. Example: `/acq 123 Main St, Anytown, USA`'
      });
      return;
    }
    
    await respond({ response_type: 'ephemeral', text: 'Analyzing…' });
    
    const answer = await runAcqAgent(
      `Analyze this property using the schemas:\n${text}\n` +
      `Return BOTH: (1) the JSON schema described in agent_instructions.md, and (2) a short human summary. ` +
      `Format the JSON response in a code block with \`\`\`json\`\`\` tags for proper parsing.`,
      command.user_id,
      command.channel_id
    );
    
    await respond({ response_type: 'ephemeral', text: answer });
  });

  // Slack mention handler
  app.event('app_mention', async ({ event, client }: any) => {
    const userPrompt = event.text?.replace(/<@[^>]+>\s*/, '') ?? '';
    
    if (!userPrompt.trim()) {
      await client.chat.postMessage({
        channel: event.channel,
        thread_ts: event.ts,
        text: 'Hello! I\'m your acquisitions valuation assistant. Please provide a property address or ask a question about real estate analysis.'
      });
      return;
    }
    
    const result = await runAcqAgent(
      `Conversation in Slack. User said:\n"${userPrompt}"\n` +
      `If an address is present, run full analysis; else, ask for address and optional details.`,
      event.user,
      event.channel
    );
    
    await client.chat.postMessage({
      channel: event.channel,
      thread_ts: event.ts,
      text: result
    });
  });

  // Natural conversation handler - no need for @mentions or /acq commands
  app.message(async ({ message, client }: any) => {
    // Skip bot messages and messages from the app itself
    if (message.bot_id || message.user === undefined) {
      return;
    }
    
    const userId = message.user;
    const channelId = message.channel;
    const threadTs = message.thread_ts;
    const messageText = message.text || '';
    
    // Process the message through conversation manager
    const processingResult = propertyConversationProcessor.processUserInput(
      userId,
      channelId,
      threadTs,
      messageText
    );
    
    // Only respond if this is property-related or part of an active conversation
    if (!processingResult.shouldRespond) {
      return;
    }
    
    // Check if this is a new conversation or continuation
    const conversation = conversationManager.getConversation(processingResult.conversationId);
    
    if (processingResult.isPropertyRelated && !conversation?.current_property) {
      // New property analysis request
      try {
        // Send typing indicator
        await client.chat.postMessage({
          channel: channelId,
          thread_ts: threadTs,
          text: '🤖 Analyzing your request...'
        });
        
        // Run the acquisition agent
        const result = await runAcqAgent(
          `User is asking about property analysis. Message: "${messageText}"\n` +
          `If an address is present, run full analysis; else, ask for address and optional details.`,
          userId,
          channelId
        );
        
        // Update conversation state
        conversationManager.updateConversationState(
          processingResult.conversationId,
          'property_analysis'
        );
        
        // Add agent response to conversation
        conversationManager.addMessage(
          processingResult.conversationId,
          'agent',
          result,
          'agent_response'
        );
        
        // Send response
        await client.chat.postMessage({
          channel: channelId,
          thread_ts: threadTs,
          text: result
        });
        
      } catch (error) {
        console.error('Error processing property request:', error);
        await client.chat.postMessage({
          channel: channelId,
          thread_ts: threadTs,
          text: '❌ Sorry, I encountered an error processing your request. Please try again or use `/acq` for direct analysis.'
        });
      }
      
    } else if (conversation && conversation.current_property) {
      // Continuing conversation about existing property
      const contextualResponse = propertyConversationProcessor.generateContextualResponse(
        processingResult.conversationId,
        messageText,
        processingResult.intent
      );
      
      // Add agent response to conversation
      conversationManager.addMessage(
        processingResult.conversationId,
        'agent',
        contextualResponse,
        'agent_response'
      );
      
      // Send contextual response
      await client.chat.postMessage({
        channel: channelId,
        thread_ts: threadTs,
        text: contextualResponse
      });
      
      // If user wants specific analysis, run it
      if (processingResult.intent === 'find_comps' || 
          processingResult.intent === 'calculate_arv' || 
          processingResult.intent === 'estimate_repairs' ||
          processingResult.intent === 'analyze_deal') {
        
        try {
          await client.chat.postMessage({
            channel: channelId,
            thread_ts: threadTs,
            text: '🔍 Running detailed analysis...'
          });
          
          const analysisResult = await runAcqAgent(
            `User wants ${processingResult.intent.replace('_', ' ')} for property: ${conversation.current_property.address}\n` +
            `User message: "${messageText}"\n` +
            `Provide detailed analysis based on their request.`,
            userId,
            channelId
          );
          
          // Update conversation with analysis results
          conversationManager.storeAnalysisResults(
            processingResult.conversationId,
            { [processingResult.intent]: analysisResult }
          );
          
          // Send detailed analysis
          await client.chat.postMessage({
            channel: channelId,
            thread_ts: threadTs,
            text: analysisResult
          });
          
        } catch (error) {
          console.error('Error running detailed analysis:', error);
          await client.chat.postMessage({
            channel: channelId,
            thread_ts: threadTs,
            text: '❌ Sorry, I encountered an error running the analysis. Please try using `/acq` for direct analysis.'
          });
        }
      }
    }
  });

  // Learning insights command
  app.command('/learn', async ({ command, ack, respond }: any) => {
    await ack();
    
    try {
      const analysis = await mongoService.getAnalytics();
      
      if (analysis) {
        const insights = `🧠 Learning Insights:\n\n` +
          `📊 Total Interactions: ${analysis.totalInteractions}\n` +
          `✅ Success Rate: ${(analysis.successRate * 100).toFixed(1)}%\n` +
          `👥 Top Users: ${analysis.topUsers.map((u: any) => `<@${u._id}> (${u.count})`).join(', ')}\n` +
          `🔥 Popular Requests: ${analysis.popularRequests.map((r: any) => `${r._id} (${r.count})`).join(', ')}\n` +
          `💡 Recommendations:\n${analysis.recommendations.map((r: any) => `• ${r}`).join('\n')}`;
        
        await respond({ response_type: 'ephemeral', text: insights });
      } else {
        await respond({ response_type: 'ephemeral', text: 'No learning data available yet.' });
      }
    } catch (error: any) {
      await respond({ response_type: 'ephemeral', text: `Error getting insights: ${error.message}` });
    }
  });

  // JSON Toggle command
  app.command('/json', async ({ command, ack, respond }: any) => {
    await ack();
    
    const text = command.text?.trim() || '';
    if (!text) {
      const currentSetting = process.env.SHOW_JSON_PAYLOAD === 'true' ? 'ENABLED' : 'DISABLED';
      await respond({
        response_type: 'ephemeral',
        text: `📋 JSON Payload Display: **${currentSetting}**\n\nTo toggle:\n• \`/json on\` - Show full JSON data\n• \`/json off\` - Hide JSON data (clean view only)\n\nNote: This change affects the current session. For permanent changes, update \`SHOW_JSON_PAYLOAD\` in your \`.env\` file.`
      });
      return;
    }
    
    const requestedSetting = text.toLowerCase();
    
    if (!['on', 'off', 'true', 'false'].includes(requestedSetting)) {
      await respond({
        response_type: 'ephemeral',
        text: `❌ Invalid setting. Use: \`/json on\` or \`/json off\``
      });
      return;
    }
    
    // Update environment variable for this session
    const newValue = ['on', 'true'].includes(requestedSetting) ? 'true' : 'false';
    process.env.SHOW_JSON_PAYLOAD = newValue;
    
    await respond({
      response_type: 'ephemeral',
      text: `✅ JSON Payload Display: **${newValue === 'true' ? 'ENABLED' : 'DISABLED'}**\n\nFuture responses will ${newValue === 'true' ? 'include' : 'hide'} the full JSON data.\n\nNote: This change only affects the current session. For permanent changes, update your \`.env\` file.`
    });
  });

  // Model selection command
  app.command('/model', async ({ command, ack, respond }: any) => {
    await ack();
    
    const { getModelInfo, getModelComparison, validateModel } = require('./model-config');
    
    const text = command.text?.trim() || '';
    if (!text) {
      const currentModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';
      const currentModelInfo = getModelInfo(currentModel);
      
      await respond({
        response_type: 'ephemeral',
        text: `🤖 Current AI Model: \`${currentModel}\`\n\n${currentModelInfo ? `**${currentModelInfo.name}**: ${currentModelInfo.description}` : ''}\n\nAvailable models:\n${getModelComparison()}\n\nTo change: \`/model gpt-4o\``
      });
      return;
    }
    
    const requestedModel = text.toLowerCase();
    
    if (!validateModel(requestedModel)) {
      await respond({
        response_type: 'ephemeral',
        text: `❌ Invalid model. Available models:\n${getModelComparison()}`
      });
      return;
    }
    
    // Update environment variable for this session
    process.env.OPENAI_MODEL = requestedModel;
    
    const modelInfo = getModelInfo(requestedModel);
    await respond({
      response_type: 'ephemeral',
      text: `✅ Model changed to \`${requestedModel}\`\n\n**${modelInfo?.name}**: ${modelInfo?.description}\n\nNote: This change only affects the current session. For permanent changes, update your \`.env\` file.`
    });
  });

  // Photo upload command
  app.command('/photos', async ({ command, ack, respond }: any) => {
    await ack();
    
    const text = command.text?.trim() || '';
    if (!text) {
      await respond({
        response_type: 'ephemeral',
        text: 'Please provide a property address and upload a zip file with photos. Example: `/photos 123 Main St, Anytown, USA` (then upload zip file in thread)'
      });
      return;
    }
    
    await respond({
      response_type: 'ephemeral',
      text: `📸 Photo Analysis Setup\n\nProperty: ${text}\n\nPlease upload a zip file containing all property photos in this thread. I'll analyze them for:\n• Room-by-room condition assessment\n• Damage detection and repair estimates\n• Overall property insights\n• Construction quality analysis`
    });
  });

  // File upload handler for photo analysis
  app.event('file_shared', async ({ event, client }: any) => {
    try {
      // Check if this is a zip file
      if (!event.file?.filetype || event.file.filetype !== 'zip') {
        return; // Only process zip files
      }
      
      console.log(`📦 Zip file uploaded: ${event.file.name}`);
      
      // Get file info
      const fileInfo = await client.files.info({
        file: event.file.id
      });
      
      // Download the file
      const filePath = `/tmp/${event.file.id}.zip`;
      const fileStream = await client.files.getReadStream({
        file: event.file.id
      });
      
      const writeStream = require('fs').createWriteStream(filePath);
      fileStream.pipe(writeStream);
      
      await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });
      
      // Process the zip file
      const uploadResult = await photoUploadHandler.processZipUpload(
        filePath,
        'Property from file upload', // You could extract this from thread context
        'single_family'
      );
      
      // Format the analysis results
      const analysisMessage = formatPhotoAnalysisResults(uploadResult);
      
      // Send the analysis
      await client.chat.postMessage({
        channel: event.channel,
        thread_ts: event.thread_ts || event.ts,
        text: analysisMessage
      });
      
      // Clean up the downloaded file
      require('fs').unlinkSync(filePath);
      
    } catch (error) {
      console.error('Error processing file upload:', error);
      await client.chat.postMessage({
        channel: event.channel,
        thread_ts: event.thread_ts || event.ts,
        text: '❌ Sorry, I encountered an error processing the photo upload. Please try again.'
      });
    }
  });

  // Feedback command
  app.command('/feedback', async ({ command, ack, respond }: any) => {
    await ack();
    
    const text = command.text?.trim() || '';
    if (!text) {
      await respond({
        response_type: 'ephemeral',
        text: 'Please provide feedback. Example: `/feedback positive Great analysis!` or `/feedback negative Response was too slow`'
      });
      return;
    }
    
    const parts = text.split(' ');
    const feedbackType = parts[0].toLowerCase();
    const reason = parts.slice(1).join(' ');
    
    if (!['positive', 'negative'].includes(feedbackType)) {
      await respond({
        response_type: 'ephemeral',
        text: 'Feedback must be "positive" or "negative". Example: `/feedback positive Great job!`'
      });
      return;
    }
    
    await mongoService.storeFeedback({
      userId: command.user_id,
      channelId: command.channel_id,
      originalRequest: 'User feedback command',
      feedback: feedbackType as 'positive' | 'negative',
      reason: reason || 'No reason provided'
    });
    
    await respond({
      response_type: 'ephemeral',
      text: `Thank you for your ${feedbackType} feedback! This helps improve the bot's responses.`
    });
  });

  // Set up conversation cleanup (every 6 hours)
  setInterval(() => {
    const cleanedCount = conversationManager.cleanupOldConversations();
    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned up ${cleanedCount} old conversations`);
    }
  }, 6 * 60 * 60 * 1000); // 6 hours

  await app.start(Number(PORT));
  console.log(`⚡️ Acquisitions Agent running on :${PORT}`);
  console.log(`🧪 Test Mode: ${TEST_MODE === 'true' ? 'ENABLED' : 'DISABLED'}`);
  console.log(`🧠 Learning System: MongoDB ENABLED`);
  console.log(`🤖 AI Model: ${OPENAI_MODEL}`);
  console.log(`📋 JSON Payload: ${SHOW_JSON_PAYLOAD === 'true' ? 'ENABLED' : 'DISABLED'}`);
  console.log(`💬 Conversation Persistence: ENABLED`);
}

main().catch(console.error);
