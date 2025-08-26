# Heroku Setup Guide

This guide will help you deploy your AI Acquisition Agent to Heroku.

## Prerequisites

1. **Heroku Account**: Sign up at [heroku.com](https://heroku.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **GitHub Secrets**: Configure the required secrets (see `GITHUB_SECRETS_SETUP.md`)

## Quick Deploy

1. **Push to main branch** - This automatically triggers deployment
2. **Monitor deployment** - Check GitHub Actions and Heroku logs
3. **Test the app** - Visit your Heroku app URL

## Manual Deploy

If you need to deploy manually:

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login to Heroku
heroku login

# Deploy to your app
heroku container:push web --app ai-acquisition-agent
heroku container:release web --app ai-acquisition-agent
```

## Troubleshooting

- **App crashes**: Check Heroku logs with `heroku logs --tail --app ai-acquisition-agent`
- **Environment variables**: Verify with `heroku config --app ai-acquisition-agent`
- **Container status**: Check with `heroku ps --app ai-acquisition-agent`

## Current Status

✅ **Latest fix deployed**: Fixed app.get scope error by moving health endpoint inside main function
🔄 **Deployment in progress**: New container should be built with the fixed code
