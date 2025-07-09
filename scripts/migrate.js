const { execSync } = require('child_process');

console.log('Running database migration...');

try {
  // Run the migration
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('Migration completed successfully!');
  
  // Generate Prisma client
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma client generated successfully!');
  
} catch (error) {
  console.error('Migration failed:', error.message);
  process.exit(1);
} 