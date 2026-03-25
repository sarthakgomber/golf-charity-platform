const { spawn } = require('child_process');
const path = require('path');

console.log('Starting both frontend and backend servers...\n');

// Start backend
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit'
});

// Start frontend
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: __dirname,
  stdio: 'inherit'
});

backend.on('error', (error) => {
  console.error('Error starting backend:', error);
});

frontend.on('error', (error) => {
  console.error('Error starting frontend:', error);
});
