# 🚀 GitHub Actions CI/CD Pipeline

> **Automated deployment to DigitalOcean using GitHub Actions**

## 📋 Table of Contents

- [Overview](#overview)
- [Workflows](#workflows)
- [Setup](#setup)
- [Usage](#usage)
- [Environments](#environments)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This repository uses GitHub Actions to automatically:
- **Test** your code on every push
- **Build** Docker images
- **Deploy** to DigitalOcean on main branch pushes
- **Protect** production deployments with approval gates

## 🔄 Workflows

### **1. Simple Deploy (`deploy.yml`)**
- **Trigger**: Push to main branch
- **Purpose**: Quick deployment without testing
- **Use case**: When you need fast deployments

### **2. Full CI/CD (`ci-cd.yml`)**
- **Trigger**: Push to main/develop, PRs, manual
- **Purpose**: Complete testing, building, and deployment
- **Features**: Testing, TypeScript checks, Docker builds, staging/production

## ⚙️ Setup

### **1. DigitalOcean API Token**
1. Go to [DigitalOcean API](https://cloud.digitalocean.com/account/api/tokens)
2. Generate new token with **Write** access
3. Copy the token

### **2. Add GitHub Secrets**
Go to your repository → **Settings** → **Secrets and variables** → **Actions**

**Required Secrets:**
```
DIGITALOCEAN_ACCESS_TOKEN = your-do-api-token
```

**Optional Secrets:**
```
SLACK_WEBHOOK_URL = your-slack-webhook-url
DISCORD_WEBHOOK_URL = your-discord-webhook-url
```

### **3. SSH Key Setup**
1. **Generate SSH key** (if you don't have one):
   ```bash
   ssh-keygen -t rsa -b 4096 -C "github-actions@yourdomain.com"
   ```

2. **Add public key to DigitalOcean**:
   ```bash
   doctl compute ssh-key import github-actions --public-key-file ~/.ssh/id_rsa.pub
   ```

3. **Add private key to GitHub Secrets**:
   ```
   SSH_PRIVATE_KEY = your-private-key-content
   ```

## 🚀 Usage

### **Automatic Deployment**
- **Push to main** → Automatic production deployment
- **Push to develop** → Automatic staging deployment
- **Create PR** → Run tests only

### **Manual Deployment**
1. Go to **Actions** tab in your repository
2. Select **CI/CD Pipeline** workflow
3. Click **Run workflow**
4. Choose environment (staging/production)
5. Click **Run workflow**

### **Deployment Process**
```
1. 🧪 Run Tests
   ├── TypeScript compilation
   ├── Unit tests
   ├── Linting
   └── Docker build

2. 🚀 Deploy to Environment
   ├── Get droplet IP
   ├── Copy deployment files
   ├── Pull latest code
   ├── Build and start containers
   └── Health check

3. ✅ Verify Deployment
   ├── Check container status
   ├── Test application health
   └── Generate deployment summary
```

## 🌍 Environments

### **Production Environment**
- **Branch**: `main`
- **Protection**: Required reviewer approval
- **Wait timer**: 5 minutes
- **Auto-deploy**: On push to main

### **Staging Environment**
- **Branch**: `develop`
- **Protection**: Minimal (2-minute wait)
- **Auto-deploy**: On push to develop

## 📊 Workflow Triggers

| Event | Branch | Action |
|-------|--------|---------|
| Push | `main` | Test + Deploy to Production |
| Push | `develop` | Test + Deploy to Staging |
| Pull Request | `main` | Test only |
| Manual | Any | Test + Deploy to chosen environment |

## 🔧 Customization

### **Change Droplet Name**
Edit `.github/workflows/ci-cd.yml`:
```yaml
env:
  DROPLET_NAME: your-droplet-name
```

### **Change Region**
Edit `.github/workflows/ci-cd.yml`:
```yaml
env:
  REGION: sfo3  # San Francisco
```

### **Add Notifications**
Add to deployment steps:
```yaml
- name: 🔔 Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: success
    webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### **Add Database Migrations**
Add before deployment:
```yaml
- name: 🗄️ Run database migrations
  run: |
    ssh ubuntu@${{ steps.get-ip.outputs.droplet_ip }} << 'EOF'
      cd ai-acquisition-agent
      npm run migrate
    EOF
```

## 🚨 Troubleshooting

### **Common Issues**

**1. "Droplet not found"**
```bash
# Check if droplet exists
doctl compute droplet list

# Create droplet if missing
./deploy.sh
```

**2. "SSH connection failed"**
- Verify SSH key is added to DigitalOcean
- Check droplet firewall settings
- Ensure droplet is running

**3. "Docker build failed"**
- Check Dockerfile syntax
- Verify all files are included
- Check for missing dependencies

**4. "Health check failed"**
- Check application logs: `docker-compose logs -f`
- Verify environment variables
- Check port configuration

### **Debugging Steps**

**1. Check Workflow Logs**
- Go to Actions tab
- Click on failed workflow
- Review step-by-step logs

**2. SSH into Droplet**
```bash
# Get droplet IP
doctl compute droplet get ai-acquisition-agent --format IPAddress --no-header

# SSH into droplet
ssh ubuntu@DROPLET_IP
```

**3. Check Container Status**
```bash
# Check running containers
docker-compose ps

# View logs
docker-compose logs -f ai-acquisition-agent

# Check environment
docker-compose exec ai-acquisition-agent env
```

**4. Manual Deployment Test**
```bash
# Test deployment manually
./deploy.sh
```

## 📈 Monitoring & Alerts

### **GitHub Actions Notifications**
- **Success**: Automatic deployment summary
- **Failure**: Error details and troubleshooting steps
- **Manual**: Workflow dispatch notifications

### **Deployment Status**
- **Green**: All tests passed, deployment successful
- **Yellow**: Tests passed, deployment in progress
- **Red**: Tests failed or deployment failed

### **Health Checks**
- **Application**: HTTP health endpoint
- **Database**: MongoDB connection
- **Containers**: Docker container status

## 🎯 Best Practices

### **1. Branch Strategy**
```
main (production) ← develop (staging) ← feature branches
```

### **2. Deployment Safety**
- Always test on staging first
- Use feature flags for risky changes
- Monitor deployments closely
- Have rollback plan ready

### **3. Environment Management**
- Keep staging and production similar
- Use environment-specific configurations
- Regular environment syncs
- Clean up unused resources

### **4. Security**
- Rotate API tokens regularly
- Use least-privilege access
- Monitor for suspicious activity
- Keep dependencies updated

## 🚀 **Ready to Deploy!**

Your GitHub Actions pipeline is now configured for:

✅ **Automatic testing** on every push  
✅ **Automated deployment** to DigitalOcean  
✅ **Environment protection** with approval gates  
✅ **Health monitoring** and verification  
✅ **Rollback capabilities** if needed  

**To get started:**
1. **Add DigitalOcean API token** to GitHub secrets
2. **Push to main branch** for automatic deployment
3. **Monitor Actions tab** for deployment status
4. **Test your AI agent** in production

**Your AI agent will now deploy automatically on every push!** 🎉
