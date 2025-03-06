#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');
const readline = require('readline');

const execAsync = promisify(exec);

function question(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function init() {
  try {
    // Get the current working directory
    const targetDir = process.cwd();
    
    // Ask for project name
    const projectName = await question('What is your project name? ');
    if (!projectName) {
      console.error('Error: Project name is required');
      process.exit(1);
    }

    // Create project directory
    const projectDir = path.join(targetDir, projectName);
    if (fs.existsSync(projectDir)) {
      console.error(`Error: Directory ${projectName} already exists`);
      process.exit(1);
    }
    fs.mkdirSync(projectDir);

    // Change to project directory
    process.chdir(projectDir);
    
    console.log('Initializing EVM UI project...');

    // Clone the repository
    await execAsync('git clone https://github.com/zeJabun/evm-ui.git .');
    
    // Remove .git directory
    fs.rmSync(path.join(projectDir, '.git'), { recursive: true, force: true });
    
    // Install dependencies
    console.log('Installing dependencies...');
    execSync('pnpm install', { stdio: 'inherit' });

    console.log('\n✨ Project initialized successfully!');
    console.log('\nNext steps:');
    console.log(`1. cd ${projectName}`);
    console.log('2. pnpm dev');
    console.log('\nHappy coding! 🚀');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

init(); 