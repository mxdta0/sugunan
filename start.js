const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Starting deployment script for Sarvam AI Telegram Bot...');

const repoUrl = 'https://github.com/mxdta0/sugunan'; 

try {
  // Check if the directory is already a git repository
  if (fs.existsSync('./.git')) {
    console.log('📦 Git repository found. Pulling latest changes...');
    execSync('git pull', { stdio: 'inherit' });
  } else {
    // If not, clone the repository
    console.log('📦 No repository found. Cloning...');
    execSync(`git clone ${repoUrl} .`, { stdio: 'inherit' });
  }

  // Install dependencies
  console.log('🔧 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Start the bot
  console.log('✅ Installation complete. Starting the bot...');
  execSync('npm start', { stdio: 'inherit' });

  console.log('✨ Bot is now online!');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
}
