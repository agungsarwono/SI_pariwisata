import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.resolve(process.cwd(), 'data')

export async function readData<T>(filename: string): Promise<T[]> {
    try {
        const filePath = path.join(DATA_DIR, filename)
        const data = await fs.readFile(filePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        // If file doesn't exist, return empty array
        return []
    }
}

export async function writeData<T>(filename: string, data: T[]): Promise<void> {
    try {
        const filePath = path.join(DATA_DIR, filename)
        await fs.mkdir(DATA_DIR, { recursive: true })
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
    } catch (error) {
        console.error(`Error writing to ${filename}:`, error)
        throw error
    }
}
