const fs = require('fs');
const path = require('path');

// Ensure directories exist
const dirs = ['app/features', 'app/pricing', 'app/templates', 'app/contact'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

console.log('✅ Directories ready');
console.log('📝 Creating marketing pages...');
console.log('This will take a moment - generating 4 pages with premium styling');
