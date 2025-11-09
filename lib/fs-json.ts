import { promises as fs } from 'fs';
import path from 'path';

// Write queue to prevent race conditions
const writeQueue = new Map<string, Promise<void>>();

/**
 * Atomic write to JSON file using temp file + rename strategy
 */
export async function writeJSON<T>(filePath: string, data: T): Promise<void> {
  const absolutePath = path.join(process.cwd(), filePath);
  const dir = path.dirname(absolutePath);
  const tempPath = `${absolutePath}.tmp`;

  // Queue writes to the same file
  const existing = writeQueue.get(absolutePath);
  const writePromise = (async () => {
    if (existing) await existing;

    try {
      // Ensure directory exists
      await fs.mkdir(dir, { recursive: true });

      // Write to temp file
      await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8');

      // Atomic rename
      await fs.rename(tempPath, absolutePath);
    } catch (error) {
      // Clean up temp file on error
      try {
        await fs.unlink(tempPath);
      } catch {
        // Ignore cleanup errors
      }
      throw error;
    }
  })();

  writeQueue.set(absolutePath, writePromise);
  await writePromise;
  writeQueue.delete(absolutePath);
}

/**
 * Read JSON file
 */
export async function readJSON<T>(filePath: string): Promise<T> {
  const absolutePath = path.join(process.cwd(), filePath);
  
  try {
    const content = await fs.readFile(absolutePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // Return empty array for missing files
      return [] as T;
    }
    throw error;
  }
}

/**
 * Update JSON file with a transform function
 */
export async function updateJSON<T>(
  filePath: string,
  transform: (data: T) => T | Promise<T>
): Promise<T> {
  const data = await readJSON<T>(filePath);
  const updated = await transform(data);
  await writeJSON(filePath, updated);
  return updated;
}

/**
 * Generate unique ID
 */
export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create slug from string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

