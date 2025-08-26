# 🏠 AI Acquisition Agent

> **Professional-grade AI-powered property analysis and acquisition platform for real estate professionals**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
[![Database](https://img.shields.io/badge/Database-MongoDB-green.svg)](https://www.mongodb.com/)
[![AI](https://img.shields.io/badge/AI-GPT--4-purple.svg)](https://openai.com/)
[![Slack](https://img.shields.io/badge/Slack-Bot-orange.svg)](https://slack.com/)

## 📋 Table of Contents

- [Overview](#overview)
- [🚀 Key Features](#-key-features)
- [💬 How to Interact](#-how-to-interact)
- [📸 Photo Analysis](#-photo-analysis)
- [🏗️ Advanced Analysis](#️-advanced-analysis)
- [📊 Comping System](#-comping-system)
- [🏗️ Architecture](#️-architecture)
- [⚡ Quick Start](#-quick-start)
- [📦 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [🔧 Development](#-development)
- [📚 Documentation](#-documentation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🎯 Overview

The AI Acquisition Agent is a **comprehensive property analysis platform** that transforms how real estate professionals evaluate investment opportunities. It combines advanced AI, computer vision, and professional-grade analysis to provide **defensible, lender-grade assessments** that support informed investment decisions.

### 🎯 **What Makes This Special**

- **🤖 Natural Conversations** - Chat naturally without commands
- **📸 Advanced Photo Analysis** - Upload zip files for comprehensive property assessment
- **🏗️ Structural Assessment** - Professional-grade building analysis
- **📊 Intelligent Comping** - 5-phase advanced comparable analysis
- **⚠️ Risk Detection** - Environmental hazards and code compliance
- **⚡ Energy Efficiency** - Complete efficiency analysis and savings potential
- **📈 Performance Tracking** - Deal analysis and margin optimization

## 🚀 Key Features

### 💬 **Natural Conversation Interface**
- **No Commands Required** - Chat naturally about properties
- **Context Awareness** - Remembers conversation context
- **Follow-up Questions** - Ask for more details without repeating
- **Persistent Conversations** - Maintains context across messages

### 📸 **Advanced Photo Analysis**
- **Batch Upload** - Upload zip files with all property photos
- **AI-Powered Analysis** - Room-by-room condition assessment
- **Damage Detection** - Automatic identification of issues
- **Repair Estimation** - Accurate cost projections
- **Professional Reports** - Comprehensive analysis summaries

### 🏗️ **Structural Assessment**
- **Foundation Analysis** - Condition, cracks, settling, water infiltration
- **Roof Assessment** - Age, material, damage, ventilation issues
- **Electrical Systems** - Panel type, wiring, code compliance
- **Plumbing Systems** - Pipe materials, leaks, pressure issues
- **HVAC Systems** - Age, efficiency, ductwork assessment
- **Wall Integrity** - Structural condition and materials

### 📋 **Building Code Compliance**
- **Safety Violations** - Critical, major, and minor violations
- **Compliance Scoring** - 0-100% compliance rating
- **Required Upgrades** - Immediate, 1-year, and 5-year timelines
- **Cost Estimation** - Compliance upgrade costs

### ⚠️ **Environmental Hazard Detection**
- **Mold Assessment** - Detection, severity, remediation costs
- **Water Damage** - Extent, locations, repair estimates
- **Asbestos Risk** - Risk levels, suspected materials, testing costs
- **Lead Paint Risk** - Risk assessment, testing recommendations

### ⚡ **Energy Efficiency Analysis**
- **Overall Efficiency Score** - 0-100% rating
- **Insulation Quality** - Type, condition, upgrade costs
- **Window Efficiency** - Type, performance, replacement costs
- **HVAC Efficiency** - Rating, upgrade recommendations
- **Annual Energy Savings** - Potential cost savings

### 📊 **Advanced Comping System**
- **Phase 1: Enhanced Condition Weighting** - Prioritizes condition similarity
- **Phase 2: Advanced Comp Validation** - Transaction type and payment method analysis
- **Phase 3: Location Intelligence** - Micro-market and neighborhood analysis
- **Phase 4: Performance Analytics** - Margin tracking and deal analysis
- **Phase 5: AI-Powered Analysis** - Photo analysis and predictive modeling

## 💬 How to Interact

### 🗣️ **Natural Language Conversations**

**Start a conversation naturally:**
```
User: "I'm looking at a property at 123 Main St, Anytown, USA"
Agent: "Great! I can help analyze that property. Let me get started..."

User: "What do you think about the condition?"
Agent: "Based on the photos, I can see several areas of concern..."

User: "How much would repairs cost?"
Agent: "Let me break down the repair costs by category..."
```

**Ask follow-up questions:**
```
User: "What about the foundation?"
Agent: "The foundation shows signs of settling with visible cracks..."

User: "Is it a good investment?"
Agent: "Based on my analysis, here's my assessment..."
```

### 📸 **Photo Analysis Workflow**

**1. Start Photo Analysis:**
```
User: /photos 123 Main St, Anytown, USA
Agent: 📸 Photo Analysis Setup
Property: 123 Main St, Anytown, USA

Please upload a zip file containing all property photos in this thread. 
I'll analyze them for:
• Room-by-room condition assessment
• Damage detection and repair estimates
• Overall property insights
• Construction quality analysis
```

**2. Upload Zip File:**
- Create a zip file with all property photos
- Upload to the Slack thread
- Agent automatically processes and analyzes

**3. Get Comprehensive Report:**
```
📸 PHOTO ANALYSIS COMPLETE

📊 Processing Summary:
• Total Photos: 15
• Successfully Processed: 15
• Processing Time: 3.2s

🏠 Overall Property Assessment:
• Condition: FAIR
• Average Condition Score: 65.2%
• Total Repair Cost: $28,450
• Construction Quality: MEDIUM
• Maintenance Level: FAIR
• Renovation Potential: HIGH

🏗️ ADVANCED STRUCTURAL ASSESSMENT
• Overall Risk Score: 12.5%
• Total Estimated Costs: $45,200

🏠 Structural Systems:
• Foundation: GOOD ($2,500)
• Roof: FAIR ($8,200)
• Electrical: POOR ($12,800)
• Plumbing: GOOD ($3,200)
• HVAC: FAIR ($6,500)

📋 Building Code Compliance:
• Compliance Score: 78.5%
• Critical Violations: 0
• Major Violations: 1
• Compliance Cost: $5,000

⚠️ Environmental Hazards:
• Mold: MINOR ($2,500)
• Water Damage: NONE ($0)
• Asbestos Risk: MEDIUM (testing recommended)
• Lead Paint Risk: HIGH (testing recommended)

⚡ Energy Efficiency:
• Overall Score: 72.0%
• Annual Energy Savings: $1,200
• Insulation: FAIR
• Windows: POOR
• HVAC: FAIR

🚨 Critical Issues:
1. Electrical system requires attention
2. Lead paint testing recommended

💡 Recommended Actions:
1. Schedule electrical inspection
2. Conduct lead paint testing
3. Consider window replacement
```

### 📊 **Traditional Comping Analysis**

**Use the `/acq` command for detailed comping:**
```
User: /acq 123 Main St, Anytown, USA
Agent: 🔍 Analyzing 123 Main St, Anytown, USA...

📊 COMPARABLE SALES ANALYSIS
• Found 8 comparable properties
• Average sale price: $285,000
• Price range: $265,000 - $310,000

💰 ARV ESTIMATION
• After Repair Value: $295,000
• Range: $285,000 - $305,000
• Method: Weighted median with condition adjustments

🔧 REPAIR ESTIMATION
• Total Repair Cost: $28,450
• Method: Photo-based analysis
• Breakdown: Structural ($12,800), Cosmetic ($15,650)

📈 DEAL ANALYSIS
• MAO (Max Allowable Offer): $185,550
• Potential Profit: $81,000
• Margin: 27.5%
• Recommended Buyer Type: Fix & Flip
• Estimated DOM: 45 days

🎯 RECOMMENDATIONS
• Strong investment potential
• Focus on electrical upgrades
• Consider energy efficiency improvements
• Lead paint testing recommended
```

## 📸 Photo Analysis

### 🎯 **What the AI Analyzes**

**Room-by-Room Assessment:**
- Kitchen condition and appliances
- Bathroom fixtures and plumbing
- Bedroom walls and flooring
- Living areas and common spaces
- Exterior siding and roof
- Basement and foundation
- Attic and insulation
- Garage and storage areas

**Damage Detection:**
- Water damage and mold
- Structural cracks and settling
- Electrical issues and safety hazards
- Plumbing leaks and pressure problems
- HVAC system condition
- Roof damage and ventilation issues

**Professional Insights:**
- Construction quality assessment
- Maintenance level evaluation
- Renovation potential analysis
- Energy efficiency scoring
- Environmental hazard identification
- Code compliance verification

### 📁 **Photo Upload Requirements**

**Supported Formats:**
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- BMP (.bmp)
- WebP (.webp)

**File Organization:**
- Create a zip file containing all photos
- Photos can be in subfolders
- AI automatically categorizes by room type
- Minimum 5 photos recommended for advanced analysis

## 🏗️ Advanced Analysis

### 🏠 **Structural Assessment**

**Foundation Analysis:**
- Condition evaluation (excellent to critical)
- Crack detection and severity
- Settling and structural movement
- Water infiltration assessment
- Repair cost estimation

**Roof Assessment:**
- Age estimation and material identification
- Damage detection (missing shingles, leaks)
- Ventilation system evaluation
- Flashing and gutter condition
- Replacement cost projections

**Systems Analysis:**
- Electrical panel type and capacity
- Plumbing pipe materials and condition
- HVAC system age and efficiency
- Safety code compliance
- Upgrade recommendations

### 📋 **Building Code Compliance**

**Safety Violations:**
- Critical violations requiring immediate attention
- Major violations needing 1-year resolution
- Minor violations for 5-year planning
- Compliance scoring (0-100%)
- Required upgrade timelines

**Code Requirements:**
- Electrical code compliance
- Plumbing code standards
- Structural safety requirements
- Environmental regulations
- Accessibility standards

### ⚠️ **Environmental Hazards**

**Mold Detection:**
- Visual identification from photos
- Severity assessment (none to severe)
- Location mapping
- Remediation cost estimation
- Prevention recommendations

**Hazardous Materials:**
- Asbestos risk assessment
- Lead paint identification
- Testing recommendations
- Risk level classification
- Professional testing costs

### ⚡ **Energy Efficiency**

**Comprehensive Scoring:**
- Overall efficiency rating (0-100%)
- Insulation quality assessment
- Window efficiency analysis
- HVAC system rating
- Annual energy savings potential

**Upgrade Recommendations:**
- Cost-effective improvements
- Energy savings calculations
- ROI projections
- Priority-based recommendations

## 📊 Comping System

### 🔍 **5-Phase Advanced Analysis**

**Phase 1: Enhanced Condition Weighting**
- Prioritizes condition similarity in comp selection
- Weighted median ARV calculation
- Margin-optimizing adjustments
- Conservative estimates for wholesaling

**Phase 2: Advanced Comp Validation**
- Transaction type verification
- Payment method analysis
- Seller concession identification
- Condition change tracking

**Phase 3: Location Intelligence**
- Micro-market analysis
- School district impact
- Neighborhood boundaries
- Market trend analysis

**Phase 4: Performance Analytics**
- Margin tracking
- Deal velocity analysis
- Comp quality metrics
- Market intelligence

**Phase 5: AI-Powered Analysis**
- Photo-based condition assessment
- Predictive market modeling
- Risk assessment
- Portfolio optimization

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Slack Bot     │    │  OpenAI API     │    │  MongoDB        │
│   (@bolt)       │◄──►│   (GPT-4)       │◄──►│   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Conversation   │    │  Photo Analysis │    │  Advanced       │
│  Manager        │    │  Engine         │    │  Analytics      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Natural        │    │  Structural     │    │  Performance    │
│  Language       │    │  Assessment     │    │  Tracking       │
│  Processing     │    │  Engine         │    │  System         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack
- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Slack Bolt framework for bot integration
- **AI**: OpenAI GPT-4 for natural language processing
- **Computer Vision**: AI-powered photo analysis
- **Database**: MongoDB with Mongoose ODM
- **File Processing**: Zip extraction and image analysis
- **Validation**: Zod for schema validation
- **Development**: Nodemon, ts-node for hot reloading

## ⚡ Quick Start

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
   - Add bot token scopes: `chat:write`, `commands`, `app_mentions:read`, `files:read`
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

## 🔧 Development

### Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build TypeScript to JavaScript
npm start        # Start production server
npm test         # Run tests
```

### Project Structure

```
ai-acquisition-agent/
├── src/                           # TypeScript source code
│   ├── index.ts                  # Main application entry point
│   ├── conversation-manager.ts   # Natural conversation handling
│   ├── photo-upload-handler.ts   # Photo analysis engine
│   ├── advanced-photo-analysis.ts # Structural assessment
│   ├── comping-utils.ts          # Advanced comping algorithms
│   ├── mongo-service.ts          # MongoDB service layer
│   └── model-config.ts           # AI model configuration
├── data/                         # Data storage
├── uploads/                      # Photo upload storage
├── temp/                         # Temporary file processing
├── docs/                         # Documentation
└── package.json                  # Dependencies and scripts
```

### Development Workflow

1. **Make Changes**: Edit TypeScript files in `src/`
2. **Auto-Reload**: Nodemon automatically restarts on file changes
3. **Database Changes**: Update MongoDB schemas and restart the service
4. **Testing**: Use natural conversations and photo uploads to test features

## 📚 Documentation

### Core Documentation
- [Agent Instructions](agent_instructions.md) - Detailed system prompts and rules
- [Database Setup](DATABASE_SETUP.md) - Database configuration guide
- [Learning System](LEARNING_SYSTEM.md) - Bot learning and improvement features
- [Comping Improvements](COMPING_IMPROVEMENTS.md) - Advanced comping system details

### Feature Guides
- **Natural Conversations**: Chat naturally without commands
- **Photo Analysis**: Upload zip files for comprehensive assessment
- **Structural Assessment**: Professional-grade building analysis
- **Environmental Hazards**: Mold, asbestos, lead paint detection
- **Energy Efficiency**: Complete efficiency analysis
- **Advanced Comping**: 5-phase intelligent comp selection

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
- [Comping Improvements](COMPING_IMPROVEMENTS.md) - Advanced comping system

### Issues & Questions
- Create an [issue](https://github.com/sirschrockalot/ai-acquisition-agent/issues) for bugs or feature requests
- Check existing issues for solutions
- Review documentation for common setup questions

---

**Built with ❤️ for Presidential Digs Real Estate, LLC**

*Professional-grade AI-powered property analysis and acquisition platform.*

---

## 🎯 **Ready to Transform Your Property Analysis?**

Your AI agent is now a **comprehensive property analysis platform** that can:

✅ **Chat naturally** about properties without commands  
✅ **Analyze photos** with professional-grade assessment  
✅ **Assess structural integrity** like a building inspector  
✅ **Detect environmental hazards** and compliance issues  
✅ **Calculate energy efficiency** and potential savings  
✅ **Provide intelligent comping** with 5-phase analysis  
✅ **Track performance** and optimize margins  

**Start analyzing properties like a professional today!** 🚀
