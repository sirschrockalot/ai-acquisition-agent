# 🔐 GitHub Secrets Setup Guide

> **Complete guide to configure GitHub secrets for automated deployment**

## 📋 Table of Contents

- [Overview](#overview)
- [Required Secrets](#required-secrets)
- [Setup Instructions](#setup-instructions)
- [Secret Management](#secret-management)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

Your GitHub Actions workflows need access to sensitive information (API keys, tokens, etc.) to deploy your AI agent to DigitalOcean. These are stored as **GitHub Secrets** and are securely injected into your workflows.

## 🔑 Required Secrets

### **1. DigitalOcean API Token**
```
Name: DIGITALOCEAN_ACCESS_TOKEN
Value: dop_v1_your_digitalocean_token_here
Purpose: Access DigitalOcean API to manage droplets
```

### **2. OpenAI API Key**
```
Name: OPENAI_API_KEY
Value: sk-... (your OpenAI API key)
Purpose: Power the AI agent's natural language processing
```

### **3. Slack Bot Token**
```
Name: SLACK_BOT_TOKEN
Value: xoxb-... (your Slack bot token)
Purpose: Authenticate with Slack API
```

### **4. Slack Signing Secret**
```
Name: SLACK_SIGNING_SECRET
Value: your-slack-app-signing-secret
Purpose: Verify Slack webhook requests
```

### **5. Slack App Token**
```
Name: SLACK_APP_TOKEN
Value: xapp-... (your Slack app token)
Purpose: Socket mode and app-level authentication
```

## ⚙️ Setup Instructions

### **Step 1: Access GitHub Secrets**
1. Go to your repository: `https://github.com/sirschrockalot/ai-acquisition-agent`
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**

### **Step 2: Add Each Secret**

# Note: DigitalOcean deployment removed - using Heroku only

#### **OpenAI API Key**
```
Secret name: OPENAI_API_KEY
Secret value: sk-your-openai-api-key-here
```

#### **Slack Bot Token**
```
Secret name: SLACK_BOT_TOKEN
Secret value: xoxb-your-slack-bot-token-here
```

#### **Slack Signing Secret**
```
Secret name: SLACK_SIGNING_SECRET
Secret value: your-slack-app-signing-secret-here
```

#### **Slack App Token**
```
Secret name: SLACK_APP_TOKEN
Secret value: xapp-your-slack-app-token-here
```

#### **Heroku API Key (Optional - for Heroku deployment)**
```
Secret name: HEROKU_API_KEY
Secret value: your-heroku-api-key-here
```

#### **Heroku Email (Optional - for Heroku deployment)**
```
Secret name: HEROKU_EMAIL
Secret value: your-heroku-email@example.com
```

### **Step 3: Verify Secrets**
After adding all secrets, you should see:
```
DIGITALOCEAN_ACCESS_TOKEN    ••••••••••••••••••
OPENAI_API_KEY              ••••••••••••••••••
SLACK_BOT_TOKEN             ••••••••••••••••••
SLACK_SIGNING_SECRET        ••••••••••••••••••
SLACK_APP_TOKEN             ••••••••••••••••••
HEROKU_API_KEY              ••••••••••••••••••
HEROKU_EMAIL                ••••••••••••••••••
```

## 🔒 Secret Management

### **Security Best Practices**
- **Never commit secrets** to your repository
- **Use unique tokens** for each environment
- **Rotate tokens regularly** (every 90 days)
- **Limit token permissions** to minimum required
- **Monitor token usage** for suspicious activity

### **Token Permissions**

# Note: DigitalOcean deployment removed - using Heroku only

#### **Slack App Scopes**
- `chat:write` - Send messages
- `commands` - Use slash commands
- `app_mentions:read` - Respond to mentions
- `files:read` - Access uploaded files

### **Environment-Specific Secrets**
You can create different secrets for different environments:

```
# Production
OPENAI_API_KEY_PROD
SLACK_BOT_TOKEN_PROD

# Staging
OPENAI_API_KEY_STAGING
SLACK_BOT_TOKEN_STAGING
```

## 🚀 How Secrets Are Used

### **In GitHub Actions Workflows**
Your secrets are automatically injected into the deployment process:

# Note: DigitalOcean deployment removed - using Heroku only

#### **Heroku Deployment**
```yaml
# The workflow sets environment variables on Heroku:
heroku config:set OPENAI_API_KEY="${{ secrets.OPENAI_API_KEY }}"
heroku config:set SLACK_BOT_TOKEN="${{ secrets.SLACK_BOT_TOKEN }}"
heroku config:set SLACK_SIGNING_SECRET="${{ secrets.SLACK_SIGNING_SECRET }}"
heroku config:set SLACK_APP_TOKEN="${{ secrets.SLACK_APP_TOKEN }}"
```

### **Secret Injection Process**
1. **GitHub Actions** runs your workflow
2. **Secrets are injected** into the deployment script
3. **Script sets environment variables** on Heroku
4. **Docker containers** use the Heroku environment
5. **Your AI agent** runs with production credentials

## 🔍 Troubleshooting

### **Common Issues**

#### **1. "Secret not found" Error**
```
Error: Secret 'OPENAI_API_KEY' not found
```
**Solution:**
- Check secret name spelling (case-sensitive)
- Verify secret exists in repository settings
- Ensure workflow has access to secrets

#### **2. "Permission denied" Error**
```
Error: Heroku API returned 403 Forbidden
```
**Solution:**
- Verify `HEROKU_API_KEY` is correct
- Check token has write permissions
- Ensure token hasn't expired

#### **3. "Slack API error" Error**
```
Error: Slack API returned 401 Unauthorized
```
**Solution:**
- Verify `SLACK_BOT_TOKEN` is correct
- Check bot is installed to workspace
- Ensure bot has required scopes

#### **4. "OpenAI API error" Error**
```
Error: OpenAI API returned 401 Unauthorized
```
**Solution:**
- Verify `OPENAI_API_KEY` is correct
- Check API key hasn't expired
- Ensure account has sufficient credits

### **Debugging Steps**

#### **1. Check Secret Names**
```bash
# In your workflow, add debug step:
- name: 🔍 Debug secrets
  run: |
    echo "Checking secrets..."
    if [ -n "${{ secrets.OPENAI_API_KEY }}" ]; then
      echo "✅ OPENAI_API_KEY is set"
    else
      echo "❌ OPENAI_API_KEY is missing"
    fi
```

#### **2. Verify Token Permissions**
```bash
# Test DigitalOcean token
doctl auth list

# Test OpenAI token
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models

# Test Slack token
curl -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
  https://slack.com/api/auth.test
```

#### **3. Check Workflow Logs**
- Go to **Actions** tab in your repository
- Click on the failed workflow
- Review step-by-step logs
- Look for secret-related errors

## 📊 Secret Status Dashboard

### **Required Secrets Checklist**
- [ ] `OPENAI_API_KEY` - OpenAI API authentication
- [ ] `SLACK_BOT_TOKEN` - Slack bot authentication
- [ ] `SLACK_SIGNING_SECRET` - Slack webhook verification
- [ ] `SLACK_APP_TOKEN` - Slack app authentication
- [ ] `HEROKU_API_KEY` - Heroku API access (for deployment)
- [ ] `HEROKU_EMAIL` - Heroku account email (for deployment)

### **Optional Secrets**
- [ ] `SLACK_WEBHOOK_URL` - Slack notifications
- [ ] `DISCORD_WEBHOOK_URL` - Discord notifications
- [ ] `EMAIL_SMTP_*` - Email notifications

## 🎯 **Ready to Deploy!**

Once you've added all required secrets:

1. **Push to main branch** → Triggers automatic deployment
2. **Monitor Actions tab** → Watch deployment progress
3. **Check deployment logs** → Verify secrets are working
4. **Test your AI agent** → Ensure all features work

### **Deployment Flow**
```
Push to main → GitHub Actions → Inject secrets → Deploy to DigitalOcean → AI Agent running! 🚀
```

**Your AI agent will now deploy automatically with all the right credentials!** 🎉

---

## 📚 **Additional Resources**

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [DigitalOcean API Documentation](https://docs.digitalocean.com/reference/api/)
- [Slack API Documentation](https://api.slack.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
