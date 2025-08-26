#!/bin/bash

# DigitalOcean Deployment Script for AI Acquisition Agent
# Usage: ./deploy.sh [droplet-name] [region]

set -e

# Configuration
DROPLET_NAME=${1:-"ai-acquisition-agent"}
REGION=${2:-"nyc1"}
SIZE="s-2vcpu-2gb"
IMAGE="ubuntu-22-04-x64"
SSH_KEY_ID=""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting DigitalOcean Deployment${NC}"
echo "Droplet Name: $DROPLET_NAME"
echo "Region: $REGION"
echo "Size: $SIZE"
echo ""

# Check if doctl is installed
if ! command -v doctl &> /dev/null; then
    echo -e "${RED}❌ doctl CLI is not installed${NC}"
    echo "Please install doctl first: https://docs.digitalocean.com/reference/doctl/how-to/install/"
    exit 1
fi

# Check if authenticated
if ! doctl auth list &> /dev/null; then
    echo -e "${RED}❌ Not authenticated with DigitalOcean${NC}"
    echo "Please run: doctl auth init"
    exit 1
fi

echo -e "${YELLOW}📋 Creating Droplet...${NC}"
doctl compute droplet create $DROPLET_NAME \
    --size $SIZE \
    --image $IMAGE \
    --region $REGION \
    --ssh-keys $SSH_KEY_ID \
    --wait

echo -e "${GREEN}✅ Droplet created successfully!${NC}"

# Get droplet IP
echo -e "${YELLOW}🔍 Getting droplet IP...${NC}"
DROPLET_IP=$(doctl compute droplet get $DROPLET_NAME --format IPAddress --no-header)
echo "Droplet IP: $DROPLET_IP"

# Wait for droplet to be ready
echo -e "${YELLOW}⏳ Waiting for droplet to be ready...${NC}"
sleep 30

# Copy deployment files
echo -e "${YELLOW}📁 Copying deployment files...${NC}"
scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
    Dockerfile docker-compose.yml .dockerignore \
    ubuntu@$DROPLET_IP:~/

# Copy environment file (you'll need to create this)
if [ -f ".env.production" ]; then
    scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
        .env.production ubuntu@$DROPLET_IP:~/.env
else
    echo -e "${YELLOW}⚠️  No .env.production file found. Please create one manually.${NC}"
fi

# SSH into droplet and setup
echo -e "${YELLOW}🔧 Setting up droplet...${NC}"
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null ubuntu@$DROPLET_IP << 'EOF'
    # Update system
    sudo apt update && sudo apt upgrade -y
    
    # Install Docker
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    
    # Install Docker Compose
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    
    # Install Node.js (for building)
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    
    # Clone repository
    git clone https://github.com/sirschrockalot/ai-acquisition-agent.git
    cd ai-acquisition-agent
    
    # Copy environment file
    if [ -f ~/.env ]; then
        cp ~/.env .env
    fi
    
    # Install dependencies
    npm install
    
    # Build and start with Docker Compose
    docker-compose up -d --build
    
    echo "🚀 AI Acquisition Agent is starting up!"
    echo "Check status with: docker-compose ps"
    echo "View logs with: docker-compose logs -f"
EOF

echo -e "${GREEN}✅ Deployment completed!${NC}"
echo ""
echo -e "${GREEN}🎯 Your AI Agent is now running on: $DROPLET_IP${NC}"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. SSH into your droplet: ssh ubuntu@$DROPLET_IP"
echo "2. Check application status: docker-compose ps"
echo "3. View logs: docker-compose logs -f"
echo "4. Update Slack app webhook URL to: http://$DROPLET_IP:3000/slack/events"
echo ""
echo -e "${GREEN}🚀 Your AI Acquisition Agent is now live on DigitalOcean!${NC}"
