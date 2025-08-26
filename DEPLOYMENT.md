# 🚀 DigitalOcean Deployment Guide

> **Complete guide to deploy your AI Acquisition Agent to DigitalOcean**

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Deploy](#quick-deploy)
- [Manual Deployment](#manual-deployment)
- [Environment Setup](#environment-setup)
- [SSL & Domain Setup](#ssl--domain-setup)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

## ✅ Prerequisites

### **1. DigitalOcean Account**
- [Sign up for DigitalOcean](https://www.digitalocean.com/)
- Add payment method
- Generate API token

### **2. Install doctl CLI**
```bash
# macOS
brew install doctl

# Linux
snap install doctl

# Windows
# Download from: https://github.com/digitalocean/doctl/releases
```

### **3. Authenticate with DigitalOcean**
```bash
doctl auth init
# Enter your API token when prompted
```

### **4. Add SSH Key**
```bash
# List existing keys
doctl compute ssh-key list

# Add new SSH key (if needed)
doctl compute ssh-key import your-key-name --public-key-file ~/.ssh/id_rsa.pub
```

## 🚀 Quick Deploy

### **1. Prepare Environment File**
```bash
# Copy the example file
cp env.production.example .env.production

# Edit with your production values
nano .env.production
```

**Required values:**
- `OPENAI_API_KEY` - Your OpenAI API key
- `SLACK_BOT_TOKEN` - Slack bot token (xoxb-...)
- `SLACK_SIGNING_SECRET` - Slack app signing secret
- `SLACK_APP_TOKEN` - Slack app token (xapp-...)

### **2. Run Deployment Script**
```bash
# Make script executable
chmod +x deploy.sh

# Deploy to default region (nyc1)
./deploy.sh

# Or specify custom name and region
./deploy.sh my-ai-agent sfo3
```

**Available Regions:**
- `nyc1` - New York
- `sfo3` - San Francisco
- `ams3` - Amsterdam
- `sgp1` - Singapore
- `fra1` - Frankfurt

### **3. Update Slack App**
1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Select your AI Acquisition Agent app
3. Update Event Subscriptions URL to: `http://YOUR_DROPLET_IP:3000/slack/events`

## 🔧 Manual Deployment

### **1. Create Droplet**
```bash
# Create droplet
doctl compute droplet create ai-acquisition-agent \
    --size s-2vcpu-2gb \
    --image ubuntu-22-04-x64 \
    --region nyc1 \
    --ssh-keys YOUR_SSH_KEY_ID \
    --wait

# Get droplet IP
DROPLET_IP=$(doctl compute droplet get ai-acquisition-agent --format IPAddress --no-header)
echo "Droplet IP: $DROPLET_IP"
```

### **2. SSH into Droplet**
```bash
ssh ubuntu@$DROPLET_IP
```

### **3. Install Dependencies**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Logout and login again for Docker group to take effect
exit
ssh ubuntu@$DROPLET_IP
```

### **4. Deploy Application**
```bash
# Clone repository
git clone https://github.com/sirschrockalot/ai-acquisition-agent.git
cd ai-acquisition-agent

# Create environment file
nano .env
# Add your production environment variables

# Build and start
docker-compose up -d --build
```

## ⚙️ Environment Setup

### **Production Environment Variables**
```bash
# Database
MONGODB_URI="mongodb://admin:password@localhost:27017/acquisitions_agent?authSource=admin"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# Slack
SLACK_BOT_TOKEN="xoxb-your-bot-token"
SLACK_SIGNING_SECRET="your-signing-secret"
SLACK_APP_TOKEN="xapp-your-app-token"

# Server
PORT=3000
NODE_ENV=production
TEST_MODE=false
SHOW_JSON_PAYLOAD=false
```

### **MongoDB Setup**
```bash
# MongoDB is automatically set up via Docker Compose
# Default credentials:
# Username: admin
# Password: password
# Database: acquisitions_agent

# To change credentials, edit docker-compose.yml
```

## 🔒 SSL & Domain Setup

### **1. Add Domain to DigitalOcean**
1. Go to DigitalOcean Dashboard → Networking → Domains
2. Add your domain (e.g., `ai-agent.yourdomain.com`)
3. Point to your droplet IP

### **2. Install Nginx for SSL**
```bash
# SSH into droplet
ssh ubuntu@$DROPLET_IP

# Install Nginx
sudo apt install nginx -y

# Install Certbot
sudo apt install certbot python3-certbot-nginx -y
```

### **3. Configure Nginx**
```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/ai-agent

# Add this configuration:
server {
    listen 80;
    server_name ai-agent.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/ai-agent /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### **4. Get SSL Certificate**
```bash
sudo certbot --nginx -d ai-agent.yourdomain.com
```

### **5. Update Slack App URL**
Update your Slack app's Event Subscriptions URL to:
`https://ai-agent.yourdomain.com/slack/events`

## 📊 Monitoring & Maintenance

### **Check Application Status**
```bash
# SSH into droplet
ssh ubuntu@$DROPLET_IP

# Check Docker containers
docker-compose ps

# View logs
docker-compose logs -f

# Check system resources
htop
df -h
```

### **Update Application**
```bash
# SSH into droplet
ssh ubuntu@$DROPLET_IP

# Navigate to app directory
cd ai-acquisition-agent

# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### **Backup MongoDB**
```bash
# Create backup
docker exec ai-acquisition-agent-mongodb-1 mongodump --out /data/backup

# Copy backup to local machine
scp -r ubuntu@$DROPLET_IP:~/ai-acquisition-agent/mongodb_data/backup ./backup
```

### **Monitor Logs**
```bash
# View real-time logs
docker-compose logs -f ai-acquisition-agent

# View specific time range
docker-compose logs --since="2024-01-01T00:00:00" ai-acquisition-agent

# Export logs
docker-compose logs ai-acquisition-agent > app.log
```

## 🚨 Troubleshooting

### **Common Issues**

**1. Application won't start**
```bash
# Check logs
docker-compose logs ai-acquisition-agent

# Check environment variables
docker-compose exec ai-acquisition-agent env | grep -E "(OPENAI|SLACK|MONGODB)"

# Restart containers
docker-compose restart
```

**2. Slack events not working**
```bash
# Check if app is accessible
curl http://localhost:3000/health

# Verify Slack URL is correct
# Should be: https://yourdomain.com/slack/events or http://IP:3000/slack/events

# Check Slack app settings
# - Event subscriptions enabled
# - Correct URL
# - Bot token scopes
```

**3. MongoDB connection issues**
```bash
# Check MongoDB status
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"

# Check connection string
docker-compose exec ai-acquisition-agent env | grep MONGODB_URI

# Restart MongoDB
docker-compose restart mongodb
```

**4. High memory usage**
```bash
# Check container resources
docker stats

# Restart containers
docker-compose restart

# Check for memory leaks
docker-compose logs ai-acquisition-agent | grep -i memory
```

### **Performance Optimization**

**1. Scale Resources**
```bash
# Upgrade droplet size
doctl compute droplet-action resize ai-acquisition-agent --size s-4vcpu-8gb
```

**2. Add Load Balancer**
```bash
# Create load balancer
doctl compute load-balancer create \
    --name ai-agent-lb \
    --region nyc1 \
    --forwarding-rules protocol:http,port:80,destination_port:80,health_check:http,health_check_port:80
```

**3. Enable Monitoring**
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs -y

# Set up log rotation
sudo nano /etc/logrotate.d/docker
```

## 🎯 **Deployment Checklist**

- [ ] DigitalOcean account created
- [ ] doctl CLI installed and authenticated
- [ ] SSH key added to DigitalOcean
- [ ] Environment variables configured
- [ ] Droplet created and accessible
- [ ] Application deployed and running
- [ ] Slack app URL updated
- [ ] Domain configured (optional)
- [ ] SSL certificate installed (optional)
- [ ] Monitoring set up
- [ ] Backup strategy configured

## 🚀 **Your AI Agent is Now Live!**

Once deployed, your AI Acquisition Agent will be accessible at:
- **Local**: `http://YOUR_DROPLET_IP:3000`
- **Domain**: `https://yourdomain.com` (if configured)

**Test your deployment:**
1. Send a message in Slack
2. Upload photos for analysis
3. Ask natural language questions
4. Verify all features are working

**Monitor your deployment:**
- Check logs regularly
- Monitor resource usage
- Set up alerts for downtime
- Keep backups current

**Congratulations! Your AI Acquisition Agent is now running in production on DigitalOcean!** 🎉
