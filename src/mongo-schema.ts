import mongoose from 'mongoose';

// User information and engagement tracking
const userSchema = new mongoose.Schema({
  slackId: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  name: String,
  role: String,
  department: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
  totalInteractions: { type: Number, default: 0 },
  successfulInteractions: { type: Number, default: 0 },
  averageResponseTime: Number
});

// Channel information
const channelSchema = new mongoose.Schema({
  slackId: { type: String, required: true, unique: true },
  name: String,
  isPrivate: { type: Boolean, default: false },
  memberCount: Number,
  createdAt: { type: Date, default: Date.now }
});

// User interactions with the bot
const interactionSchema = new mongoose.Schema({
  type: { type: String, required: true }, // 'command' or 'mention'
  userId: { type: String, required: true }, // Slack user ID
  channelId: { type: String, required: true }, // Slack channel ID
  request: { type: String, required: true }, // User's request
  response: { type: String, required: true }, // Bot's response
  success: { type: Boolean, required: true }, // Whether the interaction succeeded
  timestamp: { type: Date, default: Date.now },
  model: String, // OpenAI model used
  tokens: Number, // Tokens consumed
  responseTime: Number, // Response time in milliseconds
  errorCode: String, // Error code if failed
  errorMessage: String, // Error message if failed
  propertyAddress: String, // Extracted property address
  requestType: String, // Type of request (analysis, comp, etc.)
  userRole: String // User's role in organization
});

// Conversation history for context
const conversationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  channelId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  userMessage: { type: String, required: true },
  botResponse: { type: String, required: true },
  hasAddress: { type: Boolean, default: false },
  addressCount: { type: Number, default: 0 },
  messageLength: { type: Number, required: true },
  hasQuestions: { type: Boolean, default: false },
  hasNumbers: { type: Boolean, default: false },
  propertyAddress: String,
  requestType: String
});

// User feedback on responses
const feedbackSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  channelId: { type: String, required: true },
  interactionId: String, // Reference to interaction
  originalRequest: { type: String, required: true },
  feedback: { type: String, required: true }, // 'positive' or 'negative'
  reason: String,
  timestamp: { type: Date, default: Date.now },
  responseQuality: Number, // 1-5 rating
  category: String // 'accuracy', 'speed', 'helpfulness', etc.
});

// Business metrics and analytics
const businessMetricsSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  totalInteractions: { type: Number, default: 0 },
  successfulInteractions: { type: Number, default: 0 },
  totalUsers: { type: Number, default: 0 },
  activeUsers: { type: Number, default: 0 },
  averageResponseTime: Number,
  totalTokens: { type: Number, default: 0 },
  totalCost: { type: Number, default: 0 }, // OpenAI API costs
  propertyAnalysisCount: { type: Number, default: 0 },
  compingRequests: { type: Number, default: 0 },
  userSatisfactionScore: Number, // Average feedback score
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Property addresses for analysis tracking
const propertyAddressSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  city: String,
  state: String,
  zipCode: String,
  country: { type: String, default: 'USA' },
  analysisCount: { type: Number, default: 0 },
  lastAnalyzed: Date,
  averageRating: Number,
  marketArea: String,
  propertyType: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create indexes for performance
interactionSchema.index({ userId: 1, timestamp: -1 });
interactionSchema.index({ channelId: 1, timestamp: -1 });
interactionSchema.index({ success: 1, timestamp: -1 });
interactionSchema.index({ propertyAddress: 1 });
interactionSchema.index({ requestType: 1 });

conversationSchema.index({ userId: 1, channelId: 1, timestamp: -1 });
conversationSchema.index({ propertyAddress: 1 });

userSchema.index({ role: 1, department: 1 });
userSchema.index({ isActive: 1, lastActive: -1 });

feedbackSchema.index({ userId: 1, timestamp: -1 });
feedbackSchema.index({ feedback: 1, timestamp: -1 });
feedbackSchema.index({ category: 1 });

// Note: date field already has unique: true, so no need for additional index
// businessMetricsSchema.index({ date: 1 });

// Note: address field already has unique: true, so no need for additional index
// propertyAddressSchema.index({ address: 1 });
propertyAddressSchema.index({ city: 1, state: 1 });
propertyAddressSchema.index({ marketArea: 1 });

// Export models
export const User = mongoose.model('User', userSchema);
export const Channel = mongoose.model('Channel', channelSchema);
export const Interaction = mongoose.model('Interaction', interactionSchema);
export const Conversation = mongoose.model('Conversation', conversationSchema);
export const Feedback = mongoose.model('Feedback', feedbackSchema);
export const BusinessMetrics = mongoose.model('BusinessMetrics', businessMetricsSchema);
export const PropertyAddress = mongoose.model('PropertyAddress', propertyAddressSchema);

// Export mongoose for connection management
export { mongoose };
