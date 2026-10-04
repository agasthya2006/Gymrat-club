// server/db.cjs
const fs = require('fs');
const path = require('path');
const getSeedData = require('./seedData.cjs');

const DB_PATH = path.join(__dirname, 'gymrat_club_db.json');

class Database {
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_PATH)) {
      console.log('[DB] Initializing new database with seed data...');
      const seed = getSeedData();
      fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2), 'utf8');
      this.data = seed;
    } else {
      try {
        const raw = fs.readFileSync(DB_PATH, 'utf8');
        this.data = JSON.parse(raw);
        console.log('[DB] Database loaded successfully from file.');
      } catch (err) {
        console.error('[DB] Failed reading db file, restoring seeds:', err);
        const seed = getSeedData();
        fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2), 'utf8');
        this.data = seed;
      }
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('[DB] Error saving database:', err);
    }
  }

  getTable(tableName) {
    if (!this.data[tableName]) {
      this.data[tableName] = [];
    }
    return this.data[tableName];
  }

  find(tableName, predicate = () => true) {
    const table = this.getTable(tableName);
    return table.filter(predicate);
  }

  findOne(tableName, predicate) {
    const table = this.getTable(tableName);
    return table.find(predicate) || null;
  }

  findById(tableName, id) {
    const table = this.getTable(tableName);
    return table.find(item => item.id === id || item.user_id === id) || null;
  }

  insert(tableName, record) {
    const table = this.getTable(tableName);
    table.push(record);
    this.save();
    return record;
  }

  update(tableName, predicate, updates) {
    const table = this.getTable(tableName);
    const index = table.findIndex(predicate);
    if (index === -1) return null;
    table[index] = { ...table[index], ...updates };
    this.save();
    return table[index];
  }

  updateById(tableName, id, updates) {
    return this.update(tableName, item => (item.id === id || item.user_id === id), updates);
  }

  delete(tableName, predicate) {
    const table = this.getTable(tableName);
    const initialLen = table.length;
    this.data[tableName] = table.filter(item => !predicate(item));
    const changed = this.data[tableName].length !== initialLen;
    if (changed) this.save();
    return changed;
  }

  deleteById(tableName, id) {
    return this.delete(tableName, item => (item.id === id || item.user_id === id));
  }

  reset() {
    const seed = getSeedData();
    this.data = seed;
    this.save();
    return this.data;
  }
}

const db = new Database();
module.exports = db;
