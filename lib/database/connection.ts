import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    // Try multiple possible database paths in order of preference
    const possiblePaths = [
      process.env.DATABASE_PATH,
      '/var/lib/dashboard/leveling.db',
      '/home/ubuntu/background/leveling.db',
      path.join(process.cwd(), 'database.sqlite'),
    ].filter(Boolean) as string[];
    
    let dbPath: string | null = null;
    
    // Find the first path that exists
    for (const testPath of possiblePaths) {
      if (fs.existsSync(testPath)) {
        dbPath = testPath;
        break;
      }
    }
    
    if (!dbPath) {
      const errorMsg = `Database file not found. Tried paths:\n${possiblePaths.join('\n')}`;
      console.error(errorMsg);
      console.error('DATABASE_PATH env var:', process.env.DATABASE_PATH);
      console.error('Current working directory:', process.cwd());
      throw new Error(errorMsg);
    }
    
    try {
      // Check if we can read the file
      try {
        fs.accessSync(dbPath, fs.constants.R_OK);
      } catch (err) {
        throw new Error(`Cannot read database file at: ${dbPath}. Permission denied.`);
      }
      
      console.log(`Attempting to connect to database at: ${dbPath}`);
      
      db = new Database(dbPath, { 
        readonly: true, // Read-only to prevent accidental modifications
        fileMustExist: true 
      });
      
      // Don't set WAL mode in readonly mode (causes error)
      // WAL mode should be set by the bot when it creates/opens the database
      
      console.log(`Database connected successfully at: ${dbPath}`);
    } catch (error) {
      console.error('Failed to connect to database:', error);
      console.error('Database path attempted:', dbPath);
      console.error('Current working directory:', process.cwd());
      console.error('DATABASE_PATH env var:', process.env.DATABASE_PATH);
      throw new Error(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
