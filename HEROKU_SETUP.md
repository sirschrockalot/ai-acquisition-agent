# 🚀 Heroku Deployment Setup Guide

> **Quick setup guide to deploy your AI agent to Heroku using containers**

## 🎯 **What We Just Set Up**

✅ **Updated GitHub Actions** - Now supports Heroku container deployment  
✅ **Container-based deployment** - Uses Docker for better reliability  
✅ **Multi-platform options** - Choose between Heroku, DigitalOcean, Railway, or Fly.io  
✅ **Automatic deployment** - Deploy on every push to main  

## 🚀 **Quick Heroku Setup**

### **Step 1: Create Heroku Account**
1. Go to [heroku.com](https://heroku.com)
2. Sign up for free account
3. Add credit card (required for add-ons)

### **Step 2: Install Heroku CLI**
```bash
# macOS
brew install heroku/brew/heroku

# Windows
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

### **Step 3: Login to Heroku**
```bash
heroku login
```

### **Step 4: Create Heroku App**
```bash
# Create new app
heroku create ai-acquisition-agent

# Verify app creation
heroku apps:info
```

### **Step 5: Add MongoDB Addon**
```bash
# Add MongoDB Atlas (free tier)
heroku addons:create mongolab:sandbox

# Verify addon
heroku addons
```

## 🔐 **Add GitHub Secrets**

Go to: `https://github.com/sirschrockalot/ai-acquisition-agent/settings/secrets/actions`

Add these secrets:

```
HEROKU_API_KEY = your-heroku-api-key
HEROKU_EMAIL = your-heroku-email@example.com
```

### **Get Your Heroku API Key**
1. Go to [heroku.com/account/applications](https://heroku.com/account/applications)
2. Click **Generate API Key**
3. Copy the generated key

## 🚀 **Deploy to Heroku**

### **Option 1: Manual Deployment (Test First)**
```bash
# Build and push container
heroku container:push web --app ai-acquisition-agent

# Release container
heroku container:release web --app ai-acquisition-agent

# Set environment variables
heroku config:set NODE_ENV=production --app ai-acquisition-agent
heroku config:set OPENAI_API_KEY=your-openai-key --app ai-acquisition-agent
heroku config:set SLACK_BOT_TOKEN=your-slack-token --app ai-acquisition-agent
heroku config:set SLACK_SIGNING_SECRET=your-slack-secret --app ai-acquisition-agent
heroku config:set SLACK_APP_TOKEN=your-slack-app-token --app ai-acquisition-agent

# Open app
heroku open
```

### **Option 2: GitHub Actions (Automatic)**
1. **Push to main branch** → Triggers automatic deployment
2. **Or manually trigger** → Go to Actions tab → Run workflow

## 🔧 **Configure Slack App**

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Select your AI Acquisition Agent app
3. Update **Event Subscriptions URL** to:
   ```
   https://ai-acquisition-agent.herokuapp.com/slack/events
   ```

## ✅ **Verify Deployment**

### **Health Check**
```bash
# Test health endpoint
curl https://ai-acquisition-agent.herokuapp.com/health

# Should return: {"status":"ok","timestamp":"..."}
```

### **Check Logs**
```bash
# View application logs
heroku logs --tail --app ai-acquisition-agent

# Check recent logs
heroku logs --app ai-acquisition-agent
```

### **App Status**
```bash
# Check app status
heroku ps --app ai-acquisition-agent

# Check app info
heroku apps:info --app ai-acquisition-agent
```

## 🎯 **Deployment Options**

### **🔄 Automatic Deployment**
- **Push to main** → Auto-deploys to Heroku
- **Uses containers** → Better reliability
- **Health checks** → Ensures deployment success

### **🎛️ Manual Control**
- **Choose platform** → Heroku, DigitalOcean, Railway, Fly.io
- **Environment selection** → Production or staging
- **Manual triggers** → Deploy when you want

## 🚨 **Troubleshooting**

### **Common Issues**

#### **1. "Build failed" Error**
```bash
# Check build logs
heroku logs --app ai-acquisition-agent

# Verify Dockerfile exists
ls -la Dockerfile
```

#### **2. "App not responding" Error**
```bash
# Check app status
heroku ps --app ai-acquisition-agent

# Restart app
heroku restart --app ai-acquisition-agent
```

#### **3. "MongoDB connection failed"**
```bash
# Check MongoDB addon
heroku addons --app ai-acquisition-agent

# Verify connection string
heroku config:get MONGODB_URI --app ai-acquisition-agent
```

### **Debug Commands**
```bash
# Run app locally with Heroku config
heroku local

# Check all environment variables
heroku config --app ai-acquisition-agent

# Run one-off dyno for debugging
heroku run bash --app ai-acquisition-agent
```

## 📊 **Monitoring & Maintenance**

### **App Metrics**
```bash
# View app metrics
heroku addons:open scout --app ai-acquisition-agent

# Check dyno usage
heroku ps:scale --app ai-acquisition-agent
```

### **Log Management**
```bash
# View real-time logs
heroku logs --tail --app ai-acquisition-agent

# Download logs
heroku logs --app ai-acquisition-agent > app-logs.txt
```

## 🎉 **Success!**

**Your AI agent is now running on Heroku with:**
- ✅ **Container-based deployment** - More reliable than buildpacks
- ✅ **Automatic scaling** - Handles traffic spikes
- ✅ **MongoDB Atlas** - Managed database
- ✅ **SSL included** - HTTPS out of the box
- ✅ **Free tier** - Start for free, scale as needed

### **🌐 Your App URLs**
- **Main App**: https://ai-acquisition-agent.herokuapp.com
- **Health Check**: https://ai-acquisition-agent.herokuapp.com/health
- **Slack Events**: https://ai-acquisition-agent.herokuapp.com/slack/events

### **📱 Next Steps**
1. **Test your Slack bot** - Try `/acq` command
2. **Upload photos** - Test photo analysis feature
3. **Monitor logs** - Watch for any issues
4. **Scale if needed** - Upgrade dyno for more resources

**Your AI agent is now live on Heroku!** 🚀✨

<!-- Test deployment trigger - Heroku container deployment ready! -->
<!-- Testing MongoDB Atlas connection with existing cluster -->
