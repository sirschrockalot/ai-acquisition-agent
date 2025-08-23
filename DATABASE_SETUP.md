# 🗄️ Database Setup Guide

Your learning system now uses **PostgreSQL** for professional-grade data storage and analytics!

## 🚀 **Why PostgreSQL for Business?**

### **Advantages Over File Storage:**
- ✅ **Scalability**: Handle thousands of users and interactions
- ✅ **Reliability**: ACID compliance, backup/recovery, crash protection
- ✅ **Performance**: Fast queries with proper indexing
- ✅ **Analytics**: Complex business intelligence queries
- ✅ **Integration**: Connect with BI tools, dashboards, and business systems
- ✅ **Security**: User authentication, role-based access, encryption
- ✅ **Backup**: Automated backups, point-in-time recovery

## 🛠️ **Setup Options**

### **Option 1: Local PostgreSQL (Development)**
```bash
# Install PostgreSQL on macOS
brew install postgresql
brew services start postgresql

# Create database
createdb acquisitions_agent
```

### **Option 2: Cloud PostgreSQL (Production - Recommended)**

#### **A. Supabase (Free Tier Available)**
1. Go to [supabase.com](https://supabase.com)
2. Create account and new project
3. Get connection string from Settings > Database
4. **Free tier**: 500MB database, 2GB bandwidth/month

#### **B. Neon (Free Tier Available)**
1. Go to [neon.tech](https://neon.tech)
2. Create account and new project
3. Get connection string from dashboard
4. **Free tier**: 3GB database, unlimited bandwidth

#### **C. Railway (Paid but Affordable)**
1. Go to [railway.app](https://railway.app)
2. Create account and new project
3. Add PostgreSQL service
4. **Pricing**: $5/month for 1GB database

#### **D. AWS RDS (Enterprise)**
1. AWS Console > RDS > Create Database
2. Choose PostgreSQL
3. **Pricing**: ~$15/month for db.t3.micro

## 📋 **Setup Steps**

### **Step 1: Install Dependencies**
```bash
npm install @prisma/client prisma
```

### **Step 2: Set Environment Variables**
Add to your `.env` file:
```bash
# Database connection
DATABASE_URL="postgresql://username:password@localhost:5432/acquisitions_agent"

# For Supabase example:
# DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# For Neon example:
# DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]/[DB_NAME]?sslmode=require"
```

### **Step 3: Initialize Database**
```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push

# (Optional) View database in browser
npx prisma studio
```

### **Step 4: Verify Setup**
```bash
# Check database connection
npx prisma db pull

# View database schema
npx prisma format
```

## 🗂️ **Database Schema Overview**

### **Core Tables:**
- **`User`**: Slack users with engagement metrics
- **`Channel`**: Slack channels and metadata
- **`Interaction`**: Every bot interaction with business context
- **`Conversation`**: Chat history for context
- **`Feedback`**: User ratings and feedback
- **`BusinessMetrics`**: Daily aggregated business KPIs
- **`PropertyAddress`**: Property analysis tracking

### **Key Business Metrics Tracked:**
- 📊 **User Engagement**: Active users, interaction counts
- 🎯 **Success Rates**: Successful vs. failed requests
- 💰 **Cost Tracking**: OpenAI API token usage and costs
- 🏠 **Property Analysis**: Most analyzed addresses, request types
- ⭐ **User Satisfaction**: Feedback scores and trends
- 📈 **Performance**: Response times, error rates

## 📊 **Business Intelligence Queries**

### **Daily Dashboard:**
```sql
-- Get today's business metrics
SELECT * FROM "BusinessMetrics" 
WHERE date = CURRENT_DATE;

-- Top performing users
SELECT name, totalInteractions, successfulInteractions 
FROM "User" 
ORDER BY totalInteractions DESC 
LIMIT 10;

-- Most analyzed properties
SELECT address, analysisCount, lastAnalyzed 
FROM "PropertyAddress" 
ORDER BY analysisCount DESC 
LIMIT 10;
```

### **Weekly Reports:**
```sql
-- Weekly success rate trends
SELECT 
  DATE_TRUNC('week', timestamp) as week,
  COUNT(*) as total,
  COUNT(CASE WHEN success THEN 1 END) as successful,
  ROUND(COUNT(CASE WHEN success THEN 1 END)::decimal / COUNT(*) * 100, 2) as success_rate
FROM "Interaction" 
GROUP BY week 
ORDER BY week DESC;
```

### **Cost Analysis:**
```sql
-- Monthly OpenAI costs
SELECT 
  DATE_TRUNC('month', timestamp) as month,
  SUM(tokens) as total_tokens,
  ROUND(SUM(tokens) * 0.00001, 2) as estimated_cost_usd
FROM "Interaction" 
WHERE tokens IS NOT NULL 
GROUP BY month 
ORDER BY month DESC;
```

## 🔧 **Advanced Configuration**

### **Database Optimization:**
```sql
-- Create additional indexes for performance
CREATE INDEX idx_interaction_timestamp ON "Interaction"(timestamp);
CREATE INDEX idx_conversation_user_channel ON "Conversation"(userId, channelId);
CREATE INDEX idx_feedback_category ON "Feedback"(category);
```

### **Data Retention Policies:**
```sql
-- Archive old interactions (older than 1 year)
-- This can be automated with cron jobs or database triggers
DELETE FROM "Interaction" 
WHERE timestamp < NOW() - INTERVAL '1 year';
```

## 📱 **Integration with Business Tools**

### **BI Dashboards:**
- **Tableau**: Connect directly to PostgreSQL
- **Power BI**: Native PostgreSQL connector
- **Grafana**: Real-time monitoring dashboards
- **Metabase**: Open-source business intelligence

### **Business Systems:**
- **CRM Integration**: Export user engagement data
- **Analytics Platforms**: Google Analytics, Mixpanel
- **Reporting Tools**: Automated weekly/monthly reports
- **Alert Systems**: Monitor success rates, error spikes

## 🚨 **Production Considerations**

### **Security:**
- Use environment variables for database credentials
- Enable SSL connections
- Implement connection pooling
- Regular security updates

### **Performance:**
- Monitor query performance
- Optimize indexes based on usage patterns
- Implement read replicas for heavy analytics
- Use connection pooling (Prisma handles this)

### **Backup & Recovery:**
- Automated daily backups
- Point-in-time recovery capability
- Test restore procedures regularly
- Monitor backup success rates

## 💡 **Pro Tips**

1. **Start with Supabase**: Free tier is perfect for testing
2. **Use Prisma Studio**: Great for debugging and data exploration
3. **Monitor Costs**: Track OpenAI API usage and costs
4. **Regular Maintenance**: Clean up old data, optimize queries
5. **Business Metrics**: Focus on KPIs that matter to your business

## 🔄 **Migration from File Storage**

If you have existing data in JSON files:
```bash
# Export existing data
node scripts/export-data.js

# Import to database
node scripts/import-data.js
```

Your learning system is now enterprise-ready with professional-grade data storage! 🎯
