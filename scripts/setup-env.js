const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.join(__dirname, '..', '.env');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists. This script will not overwrite it.');
  console.log('If you want to create a new .env file, please delete the existing one first.');
  process.exit(0);
}

console.log('🔧 Setting up environment variables for Tacitron');
console.log('Please enter your Supabase credentials:');

rl.question('Supabase Project URL: ', (supabaseUrl) => {
  rl.question('Supabase Anon Key: ', (supabaseAnonKey) => {
    const envContent = `# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=${supabaseUrl}
EXPO_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}
`;

    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!');
    console.log('Remember to restart your development server.');
    rl.close();
  });
}); 