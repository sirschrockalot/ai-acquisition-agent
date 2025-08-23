# 🗄️ Database Setup Guide

Your learning system uses **MongoDB** for flexible, scalable data storage and analytics!

## 🚀 **Why MongoDB for Business?**

### **Advantages Over File Storage:**
- ✅ **Scalability**: Handle thousands of users and interactions
- ✅ **Flexibility**: Schema-less design adapts to changing requirements
- ✅ **Performance**: Fast queries with proper indexing
- ✅ **Analytics**: Rich aggregation pipeline for business intelligence
- ✅ **Integration**: Connect with BI tools, dashboards, and business systems
- ✅ **Security**: User authentication, role-based access, encryption
- ✅ **Backup**: Automated backups, point-in-time recovery

## 🛠️ **Setup Options**

### **Option 1: Local MongoDB (Development)**
```bash
# Install MongoDB Community on macOS
brew install mongodb-community
brew services start mongodb-community

# Create database (automatically created on first use)
# MongoDB will create the database when you first insert data
```

### **Option 2: Cloud MongoDB (Production - Recommended)**

#### **A. MongoDB Atlas (Free Tier Available)**
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create account and new cluster
3. Get connection string from Connect button
4. **Free tier**: 512MB database, shared cluster

#### **B. Railway (Paid but Affordable)**
1. Go to [railway.app](https://railway.app)
2. Create account and new project
3. Add MongoDB service
4. **Pricing**: $5/month for 1GB database

#### **C. AWS DocumentDB (Enterprise)**
1. AWS Console > DocumentDB > Create Cluster
2. Choose MongoDB-compatible version
3. **Pricing**: ~$15/month for db.t3.medium

## 📋 **Setup Steps**

### **Step 1: Install Dependencies**
```bash
npm install mongodb mongoose
```

### **Step 2: Set Environment Variables**
Add to your `.env` file:
```bash
# Database connection
MONGODB_URI="mongodb://localhost:27017/acquisitions_agent"

# For MongoDB Atlas example:
# MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/acquisitions_agent?retryWrites=true&w=majority"

# For Railway example:
# MONGODB_URI="mongodb://username:password@host:port/database"
```

### **Step 3: Initialize Database**
```bash
# Start local MongoDB service
brew services start mongodb-community

# Or connect to cloud MongoDB
# The database and collections will be created automatically on first use
```

### **Step 4: Verify Setup**
```bash
# Check MongoDB connection
npm run dev

# The bot will automatically connect to MongoDB on startup
# Check console logs for connection status
```

## 🗂️ **Database Collections Overview**

### **Core Collections:**
- **`users`**: Slack users with engagement metrics
- **`channels`**: Slack channels and metadata
- **`interactions`**: Every bot interaction with business context
- **`conversations`**: Chat history for context
- **`feedback`**: User ratings and improvement data

### **Collection Schemas**

#### **Users Collection**
```javascript
{
  _id: ObjectId,
  slackId: String,
  email: String,
  name: String,
  lastActive: Date,
  totalInteractions: Number,
  successfulInteractions: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### **Channels Collection**
```javascript
{
  _id: ObjectId,
  slackId: String,
  name: String,
  isPrivate: Boolean,
  totalInteractions: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### **Interactions Collection**
```javascript
{
  _id: ObjectId,
  type: String, // 'command' or 'mention'
  userId: String,
  channelId: String,
  request: String,
  response: String,
  success: Boolean,
  model: String,
  tokens: Number,
  responseTime: Number,
  errorCode: String,
  errorMessage: String,
  propertyAddress: String,
  requestType: String,
  userRole: String,
  createdAt: Date
}
```

#### **Conversations Collection**
```javascript
{
  _id: ObjectId,
  userId: String,
  channelId: String,
  messages: [
    {
      timestamp: Date,
      userMessage: String,
      botResponse: String,
      context: String
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

#### **Feedback Collection**
```javascript
{
  _id: ObjectId,
  userId: String,
  channelId: String,
  originalRequest: String,
  feedback: String, // 'positive' or 'negative'
  reason: String,
  createdAt: Date
}
```

## 🔧 **MongoDB Commands**

### **Local MongoDB Management**
```bash
# Start MongoDB service
brew services start mongodb-community

# Stop MongoDB service
brew services stop mongodb-community

# Check MongoDB status
brew services list | grep mongodb

# Connect to MongoDB shell
mongosh

# List databases
show dbs

# Use acquisitions_agent database
use acquisitions_agent

# Show collections
show collections

# Query data
db.users.find()
db.interactions.find().sort({createdAt: -1}).limit(10)
```

### **MongoDB Atlas Management**
1. **Access**: Use MongoDB Atlas web interface
2. **Collections**: Navigate to Browse Collections
3. **Queries**: Use MongoDB Compass or Atlas Data Explorer
4. **Indexes**: Create indexes for better performance
5. **Backups**: Automated backups with point-in-time recovery

## 📊 **Performance & Optimization**

### **Indexing Strategy**
```javascript
// Create indexes for common queries
db.users.createIndex({ "slackId": 1 })
db.channels.createIndex({ "slackId": 1 })
db.interactions.createIndex({ "userId": 1, "createdAt": -1 })
db.interactions.createIndex({ "channelId": 1, "createdAt": -1 })
db.conversations.createIndex({ "userId": 1, "channelId": 1 })
```

### **Connection Pooling**
The application uses Mongoose connection pooling for optimal performance:
- **Min connections**: 5
- **Max connections**: 20
- **Connection timeout**: 30 seconds
- **Socket timeout**: 45 seconds

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Connection Refused**
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Start MongoDB if stopped
brew services start mongodb-community
```

#### **Authentication Failed**
- Check username/password in connection string
- Ensure user has proper permissions
- Verify network access (for Atlas)

#### **Database Not Found**
- MongoDB creates databases automatically
- Check connection string for correct database name
- Verify user has create database permissions

### **Logs & Debugging**
```bash
# View MongoDB logs
tail -f /usr/local/var/log/mongodb/mongo.log

# Check application logs
npm run dev
# Look for MongoDB connection messages in console
```

## 🔒 **Security Best Practices**

### **Local Development**
- MongoDB runs without authentication by default
- Suitable for development only
- Never expose to internet

### **Production (MongoDB Atlas)**
- Use strong passwords
- Enable IP whitelist
- Use VPC peering if on AWS
- Enable encryption at rest
- Regular security audits

## 📈 **Monitoring & Maintenance**

### **Health Checks**
- Monitor connection pool usage
- Track query performance
- Watch disk space usage
- Monitor backup success

### **Backup Strategy**
- **Automated**: Daily backups with 7-day retention
- **Manual**: Export collections as needed
- **Recovery**: Point-in-time recovery available

---

**Next Steps**: After setting up MongoDB, see [LEARNING_SYSTEM.md](LEARNING_SYSTEM.md) for how the bot uses the database for learning and improvement.
