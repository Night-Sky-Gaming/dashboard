import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Cache the database path but not the connection
let cachedDbPath: string | null = null;

export function getDatabase(): Database.Database {
	// Find database path if not cached
	if (!cachedDbPath) {
		// Try multiple possible database paths in order of preference
		const possiblePaths = [
			process.env.DATABASE_PATH,
			'/var/lib/dashboard/leveling.db',
			'/home/ubuntu/background/leveling.db',
			path.join(process.cwd(), 'database.sqlite'),
		].filter(Boolean) as string[];
		
		// Find the first path that exists
		for (const testPath of possiblePaths) {
			if (fs.existsSync(testPath)) {
				cachedDbPath = testPath;
				break;
			}
		}
		
		if (!cachedDbPath) {
			const errorMsg = `Database file not found. Tried paths:\n${possiblePaths.join('\n')}`;
			console.error(errorMsg);
			console.error('DATABASE_PATH env var:', process.env.DATABASE_PATH);
			console.error('Current working directory:', process.cwd());
			throw new Error(errorMsg);
		}
	}

	try {
		// Check if we can read the file
		try {
			fs.accessSync(cachedDbPath, fs.constants.R_OK);
		} catch (err) {
			throw new Error(`Cannot read database file at: ${cachedDbPath}. Permission denied.`);
		}
		
		console.log(`Connecting to database at: ${cachedDbPath}`);
		
		// Open a NEW connection each time to ensure fresh data
		const db = new Database(cachedDbPath, { 
			readonly: true,
			fileMustExist: true 
		});
		
		console.log(`Database connected successfully at: ${cachedDbPath}`);
		return db;
	} catch (error) {
		console.error('Failed to connect to database:', error);
		console.error('Database path attempted:', cachedDbPath);
		console.error('Current working directory:', process.cwd());
		console.error('DATABASE_PATH env var:', process.env.DATABASE_PATH);
		throw new Error(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}