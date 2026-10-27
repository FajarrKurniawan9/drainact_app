import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { createSeedReports } from '../data';
import type { CleanResult, Report } from '../types.ts';

// 1. Ensure the persistent data directory exists
const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// 2. Initialize the SQLite database
const db = new Database(path.join(dataDir, 'reports.db'));

// 3. Create the schema
db.exec(`
    CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        area TEXT NOT NULL,
        loc TEXT NOT NULL,
        cat TEXT NOT NULL,
        sev TEXT NOT NULL,
        done INTEGER NOT NULL DEFAULT 0,
        mine INTEGER NOT NULL DEFAULT 1,
        cleanedAt TEXT
    )
`);

// 4. Seed default data if the database is completely empty
const { c } = db.prepare('SELECT COUNT(*) as c FROM reports').get() as { c: number };
if (c === 0) {
    const seed = createSeedReports();
    const insert = db.prepare(`
        INSERT INTO reports (id, area, loc, cat, sev, done, mine, cleanedAt) 
        VALUES (@id, @area, @loc, @cat, @sev, @done, @mine, @cleanedAt)
    `);
    
    db.transaction((reports: Report[]) => {
        for (const r of reports) {
            insert.run({
                ...r,
                done: r.done ? 1 : 0,
                mine: r.mine ? 1 : 0,
                cleanedAt: r.cleanedAt || null
            });
        }
    })(seed);
}

// 5. Provide cross-device read access (Missing from Claude's original file)
export function getAllReports(): Report[] {
    const rows = db.prepare('SELECT * FROM reports ORDER BY id DESC').all() as any[];
    return rows.map(r => ({
        ...r,
        done: r.done === 1,
        mine: r.mine === 1,
    }));
}

// 6. Rewrite mutations to use SQL
export function createReport(data: Pick<Report, 'area' | 'loc' | 'cat' | 'sev'>): Report {
    const stmt = db.prepare('INSERT INTO reports (area, loc, cat, sev, done, mine) VALUES (@area, @loc, @cat, @sev, 0, 1)');
    const info = stmt.run(data);
    return {
        id: info.lastInsertRowid as number,
        ...data,
        done: false,
        mine: true
    };
}

export const findReport = (id: number): Report | undefined => {
    const row = db.prepare('SELECT * FROM reports WHERE id = ?').get(id) as any;
    if (!row) return undefined;
    return {
        ...row,
        done: row.done === 1,
        mine: row.mine === 1
    };
};

export function markClean(report: Report): CleanResult {
    const cleanedAt = new Date().toISOString();
    db.prepare('UPDATE reports SET done = 1, cleanedAt = ? WHERE id = ?').run(cleanedAt, report.id);
    return { id: report.id, done: true, cleanedAt };
}