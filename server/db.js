const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data', 'database.json');

function initDb() {
  if (!fs.existsSync(DB_FILE)) {
    const defaultData = {
      users: [],
      products: [],
      categories: [],
      brands: [],
      orders: [],
      payments: [],
      feedback: [],
      reviews: [],
      settings: {
        storeName: 'BYTECART Flagship Store',
        storeEmail: 'contact@bytecart.in',
        storePhone: '+91 44 2621 8900',
        storeAddress: '14, 2nd Avenue, Anna Nagar, Chennai, Tamil Nadu 600040',
        taxEnabled: false,
        taxRate: 0,
        shippingCharge: 0,
        freeShippingThreshold: 0,
        paymentGateway: 'Razorpay',
        paymentGatewayConnected: true,
        allowCOD: true,
      },
      auditLogs: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
    return defaultData;
  }
  try {
    const content = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading database file:', err);
    return {
      users: [],
      products: [],
      categories: [],
      brands: [],
      orders: [],
      payments: [],
      feedback: [],
      reviews: [],
      settings: {},
      auditLogs: []
    };
  }
}

let db = initDb();

function saveDb() {
  try {
    const tmpFile = DB_FILE + '.tmp';
    fs.writeFileSync(tmpFile, JSON.stringify(db, null, 2), 'utf8');
    fs.renameSync(tmpFile, DB_FILE);
  } catch (err) {
    console.error('Error saving database:', err);
  }
}

function logAudit(adminId, action, entity, entityId, details = '') {
  const log = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    adminId: adminId || 'system',
    action,
    entity,
    entityId: String(entityId),
    details,
    createdAt: new Date().toISOString()
  };
  db.auditLogs.unshift(log);
  if (db.auditLogs.length > 500) {
    db.auditLogs = db.auditLogs.slice(0, 500);
  }
  saveDb();
  return log;
}

function getDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf8');
      db = JSON.parse(content);
    }
  } catch (err) {
    console.error('Error refreshing database from disk:', err);
  }
  return db;
}

module.exports = {
  get: getDb,
  save: saveDb,
  reload: () => {
    db = initDb();
    return db;
  },
  logAudit
};
