const bcrypt = require('bcryptjs');
const db = require('./db');
const path = require('path');
const fs = require('fs');

async function seed() {
  const data = db.get();
  let modified = false;

  // 1. Seed Admin User
  const adminEmail = 'admin@gmail.com';
  const existingAdmin = data.users.find(u => u.email === adminEmail);
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin@123', 10);
    const adminUser = {
      id: 'usr_admin_001',
      name: 'System Administrator',
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
      phone: '+91 98765 43210',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.users.push(adminUser);
    modified = true;
    console.log('✓ Initial administrator seeded: admin@gmail.com');
  }

  // 2. Categories Initialization if empty
  if (data.categories.length === 0) {
    try {
      const categoriesDataPath = path.join(__dirname, '..', 'src', 'data', 'categoriesData.js');
      if (fs.existsSync(categoriesDataPath)) {
        let content = fs.readFileSync(categoriesDataPath, 'utf8');
        const match = content.match(/export const categories = ([\s\S]*?);\s*$/);
        if (match) {
          const cats = eval(match[1]);
          if (Array.isArray(cats)) {
            data.categories = cats.map(c => ({
              ...c,
              createdAt: new Date().toISOString()
            }));
            modified = true;
            console.log(`✓ Seeded ${data.categories.length} categories.`);
          }
        }
      }
    } catch (err) {
      console.error('Failed to import categories:', err);
    }
  }

  if (modified) {
    db.save();
    console.log('✓ Database initialization complete.');
  } else {
    console.log('✓ Database is already initialized.');
  }
}

module.exports = seed;

if (require.main === module) {
  seed();
}
