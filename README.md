# 🏠 AI Acquisition Agent

> **Professional-grade residential valuation and dispositions assistant for Presidential Digs Real Estate, LLC**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
[![Database](https://img.shields.io/badge/Database-MongoDB-green.svg)](https://www.mongodb.com/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Database Setup](#database-setup)
- [Learning System](#learning-system)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

The AI Acquisition Agent is a sophisticated, lender-grade residential valuation and dispositions assistant designed for real estate professionals. It provides **defensible analyses** that licensed appraisers and underwriters can rely on for making informed investment decisions.

### Key Capabilities

- **🔍 Comparable Sales Analysis**: Intelligent comp selection with adjustment limits
- **💰 ARV Estimation**: After Repair Value calculations using weighted comps
- **🔧 Repair Cost Estimation**: Photo-based and condition-based assessments
- **📊 MAO Calculation**: Max Allowable Offer with minimum $10,000 assignment fee
- **🎯 Buyer Type Recommendations**: Fix & flip vs. buy & hold strategies
- **📈 Market Analysis**: Days on Market (DOM) estimates and local buyer percentages
- **🤖 Slack Integration**: Seamless workflow integration via Slack bot
- **🧠 Learning System**: Continuous improvement through user interactions

## ✨ Features

### Core Valuation Engine
- **Comp Selection**: Enforces distance, recency, property type, and condition limits
- **Adjustment System**: Line-item adjustments with built-in safety limits
- **Evidence Tracking**: Full traceability with MLS/portal/county IDs
- **Quality Control**: Automatic comp replacement when adjustment limits are breached

### Smart Analysis
- **Photo Analysis**: AI-powered condition assessment from property photos
- **Market Intelligence**: Local buyer behavior inference and DOM estimation
- **Risk Management**: Built-in safeguards for profitable deals
- **Flexible Constraints**: Customizable assignment fees and disposition windows

### Integration & Workflow
- **Slash Commands**: `/acq` for property analysis, `/learn` for insights
- **Mention Support**: `@acquisition-agent` for natural language requests
- **Conversation Memory**: Context-aware responses based on chat history
- **Feedback System**: User rating and improvement tracking

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Slack Bot     │    │  OpenAI API     │    │  PostgreSQL     │
│   (@bolt)       │◄──►│   (GPT-4)       │◄──►│   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  TypeScript     │    │  Prisma ORM     │    │  Learning       │
│  Backend        │    │   Client        │    │   System        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack
- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Slack Bolt framework for bot integration
- **AI**: OpenAI GPT-4 for natural language processing
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Zod for schema validation
- **Development**: Nodemon, ts-node for hot reloading

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local) or MongoDB Atlas (production)
- OpenAI API key
- Slack app credentials

### 1. Clone & Install
```bash
git clone https://github.com/sirschrockalot/ai-acquisition-agent.git
cd ai-acquisition-agent
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Database Setup
```bash
# For local MongoDB
npm run db:start

# Or connect to MongoDB Atlas (production)
# Update MONGODB_URI in .env file
```

### 4. Start the Bot
```bash
npm run dev
```

## 📦 Installation

### Step-by-Step Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   - Use local MongoDB for development (see [Database Setup Guide](DATABASE_SETUP.md))
   - Use MongoDB Atlas for production
   - Update `MONGODB_URI` in your `.env` file

3. **Slack App Configuration**
   - Create a new Slack app at [api.slack.com](https://api.slack.com/apps)
   - Add bot token scopes: `chat:write`, `commands`, `app_mentions:read`
   - Install app to your workspace

4. **OpenAI Configuration**
   - Get API key from [OpenAI Platform](https://platform.openai.com/)
   - Add to `.env` file

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# Database
MONGODB_URI="mongodb://localhost:27017/acquisitions_agent"
# For MongoDB Atlas: MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/acquisitions_agent"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# Slack
SLACK_BOT_TOKEN="xoxb-your-bot-token"
SLACK_SIGNING_SECRET="your-signing-secret"
SLACK_APP_TOKEN="xapp-your-app-token"

# Optional: Custom settings
ASSIGNMENT_FEE_MIN=10000
DEFAULT_DISPO_WINDOW=45
```

### Comping Rules

The system uses configurable rules for comparable sales selection. See [comping_rules.json](comping_rules.json) for current settings:

- **Distance Limits**: Maximum miles from subject property
- **Recency Limits**: Maximum days since sale
- **Adjustment Limits**: Maximum percentage adjustments allowed
- **Property Type Matching**: Ensures comparable property types

## 📱 Usage

### Slack Commands

#### `/acq [address]` - Property Analysis
Analyze a property for acquisition potential:

```
/acq 123 Main St, Anytown, CA
```

**Response includes:**
- Comparable sales with adjustments
- ARV estimate and range
- Repair cost estimate
- MAO calculation
- Buyer type recommendations
- DOM estimate

#### `/learn` - Learning Insights
View bot performance analytics and improvement recommendations.

#### `/feedback [positive|negative] [reason]` - Provide Feedback
Rate bot responses to help improve performance.

### Natural Language

Mention the bot for natural language requests:

```
@acquisition-agent analyze 456 Oak Avenue for me
@acquisition-agent what's the ARV for 789 Pine Road?
@acquisition-agent comps for 321 Elm Street
```

## 🔌 API Reference

### Input Schema

```typescript
interface AnalysisRequest {
  subject: {
    address: string;
    lat?: number;
    lon?: number;
    property_type?: 'single_family' | 'condo' | 'townhouse' | 'manufactured_mobile';
    gla_sqft?: number;
    beds?: number;
    baths?: number;
    lot_sqft?: number;
    year_built?: number;
    condition?: 'poor' | 'fair' | 'average' | 'renovated' | 'like_new';
    photos?: string[];
    notes?: string;
  };
  constraints: {
    assignment_fee_min: number;
    buyer_percent_override?: number;
    dispo_window_days: number;
  };
}
```

### Output Schema

```typescript
interface AnalysisResponse {
  arv: {
    value: number;
    range_low: number;
    range_high: number;
    method: string;
  };
  repairs: {
    estimate: number;
    method: string;
    assumptions: string;
  };
  buyer_percent_of_arv: {
    fix_and_flip_percent_range: [number, number];
    buy_and_hold_percent_range: [number, number];
    local_inferred_percent_range: [number | null, number | null];
  };
  mao: {
    value: number;
    breakdown: string;
  };
  comps: ComparableSale[];
  recommendations: {
    buyer_type: string;
    pricing_strategy: string;
    dom_estimate: number;
  };
}
```

## 🗄️ Database Setup

The system uses PostgreSQL for professional-grade data storage. See [DATABASE_SETUP.md](DATABASE_SETUP.md) for detailed setup instructions.

### Quick Database Setup

```bash
# Install MongoDB (macOS)
brew install mongodb-community
brew services start mongodb-community

# Or use MongoDB Atlas (cloud)
# 1. Create account at mongodb.com
# 2. Create cluster and get connection string
# 3. Update MONGODB_URI in .env

# Start local MongoDB service
npm run db:start
```

### Database Collections

- **User**: Slack users with engagement metrics
- **Channel**: Slack channels and metadata  
- **Interaction**: Bot interactions with business context
- **Conversation**: Chat history for context
- **Feedback**: User ratings and improvement data

## 🧠 Learning System

The bot continuously learns and improves through user interactions. See [LEARNING_SYSTEM.md](LEARNING_SYSTEM.md) for details.

### Features
- **Automatic Logging**: Every interaction is tracked and analyzed
- **Conversation Memory**: Context-aware responses based on chat history
- **Performance Analytics**: Success rates, popular requests, user engagement
- **Feedback Integration**: User ratings help identify improvement areas

### Learning Commands
- `/learn` - View performance insights
- `/feedback` - Rate bot responses
- Automatic interaction logging and analysis

## 🛠️ Development

### Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build TypeScript to JavaScript
npm start        # Start production server
npm test         # Run tests (when implemented)
```

### Project Structure

```
ai-acquisition-agent/
├── src/                    # TypeScript source code
│   ├── index.ts           # Main application entry point
│   ├── database.ts        # Database connection and utilities
│   ├── mongo-service.ts   # MongoDB service (legacy)
│   └── model-config.ts    # AI model configuration
├── prisma/                # Database schema (legacy)
│   └── schema.prisma      # Prisma schema (legacy)
├── data/                  # Data storage (legacy file-based)
├── docs/                  # Documentation
└── package.json           # Dependencies and scripts
```

### Development Workflow

1. **Make Changes**: Edit TypeScript files in `src/`
2. **Auto-Reload**: Nodemon automatically restarts on file changes
3. **Database Changes**: Update MongoDB schemas in `src/mongo-schema.ts` and restart the service
4. **Testing**: Use `/learn` and `/feedback` commands to test improvements

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Add tests for new features
- Update documentation for API changes
- Follow the existing code style
- Test thoroughly in development environment

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [Agent Instructions](agent_instructions.md) - Detailed system prompts and rules
- [Database Setup](DATABASE_SETUP.md) - Database configuration guide
- [Learning System](LEARNING_SYSTEM.md) - Bot learning and improvement features

### Issues & Questions
- Create an [issue](https://github.com/sirschrockalot/ai-acquisition-agent/issues) for bugs or feature requests
- Check existing issues for solutions
- Review documentation for common setup questions

---

**Built with ❤️ for Presidential Digs Real Estate, LLC**

*Professional-grade AI-powered real estate analysis and acquisition support.*
