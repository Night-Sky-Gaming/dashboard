import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'database.sqlite');
    
    try {
      db = new Database(dbPath, { 
        readonly: true, // Read-only to prevent accidental modifications
        fileMustExist: false 
      });
      
      // Enable WAL mode for better concurrent access
      db.pragma('journal_mode = WAL');
      
      console.log(`Database connected at: ${dbPath}`);
    } catch (error) {
      console.error('Failed to connect to database:', error);
      throw new Error('Database connection failed');
    }
  }
  
  return db;
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

// Graceful shutdown
process.on('exit', closeDatabase);
process.on('SIGINT', () => {
  closeDatabase();
  process.exit(0);
});
