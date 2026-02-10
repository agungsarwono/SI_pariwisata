import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { readData, writeData } from './utils/db'

const app = new Hono()

app.use('/*', cors())

// Types
interface Destination {
    id: string
    label: string
    type: string
    tags: string[]
    users: number // Represents monthly avg visitors
    href: string
    description?: string
    location?: string
    category?: string
    image?: string
}

interface Report {
    id: string
    title: string
    category: string
    date: string
    author: string
    status: 'Published' | 'Draft' | 'Review'
    size: string
    fileName?: string
    fileData?: string // Base64 string
}

interface Event {
    id: string
    title: string
    date: string
    time: string
    location: string
    category: string
    attendees: string
    status: 'Upcoming' | 'Past'
    image: string
    description?: string
}

// Routes
app.get('/', (c) => {
    return c.text('Hello Hono with JSON DB!')
})

app.get('/search', async (c) => {
    const query = c.req.query('q')?.toLowerCase() || ''
    const dbDestinations = await readData<Destination>('destinations.json')

    if (!query) return c.json(dbDestinations)

    // Simulating database filtering
    const filtered = dbDestinations.filter(item =>
        item.label.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
    )
    return c.json(filtered)
})

app.get('/destinasi/:slug', async (c) => {
    const slug = c.req.param('slug')
    const fullPath = `/destinasi/${slug}`
    const dbDestinations = await readData<Destination>('destinations.json')

    const destination = dbDestinations.find(d => d.href === fullPath)

    if (!destination) {
        return c.json({ error: 'Destination not found' }, 404)
    }

    return c.json(destination)
})

app.post('/destinasi', async (c) => {
    try {
        const body = await c.req.json()

        // Simple validation
        if (!body.title) {
            return c.json({ error: 'Title is required' }, 400)
        }

        const newId = `d${Date.now()}`
        const slug = body.title.toLowerCase().replace(/\s+/g, '-')
        const href = `/destinasi/${slug}`

        const newDestination: Destination = {
            id: newId,
            label: body.title,
            type: 'file',
            tags: body.tags ? body.tags.split(',').map((t: string) => t.trim()) : ['destinasi'],
            users: body.users !== undefined ? Number(body.users) : Math.floor(Math.random() * 1000) + 100,
            href: href,
            description: body.description,
            location: body.location,
            category: body.category,
            image: body.image
        }

        const dbDestinations = await readData<Destination>('destinations.json')
        dbDestinations.push(newDestination)
        await writeData('destinations.json', dbDestinations)

        return c.json({ message: 'Success', data: newDestination }, 201)
    } catch (e) {
        return c.json({ error: 'Invalid JSON' }, 400)
    }
})

app.delete('/destinasi/:id', async (c) => {
    const id = c.req.param('id')
    const dbDestinations = await readData<Destination>('destinations.json')
    const index = dbDestinations.findIndex(d => d.id === id)

    if (index === -1) {
        return c.json({ error: 'Destination not found' }, 404)
    }

    const deleted = dbDestinations.splice(index, 1)
    await writeData('destinations.json', dbDestinations)

    return c.json({ message: 'Deleted successfully', data: deleted[0] })
})

app.put('/destinasi/:id', async (c) => {
    try {
        const id = c.req.param('id')
        const body = await c.req.json()
        const dbDestinations = await readData<Destination>('destinations.json')
        const index = dbDestinations.findIndex(d => d.id === id)

        if (index === -1) {
            return c.json({ error: 'Destination not found' }, 404)
        }

        // Update fields
        const updatedDestination = {
            ...dbDestinations[index],
            label: body.title || dbDestinations[index].label,
            category: body.category || dbDestinations[index].category,
            location: body.location || dbDestinations[index].location,
            description: body.description || dbDestinations[index].description,
            tags: body.tags ? body.tags.split(',').map((t: string) => t.trim()) : dbDestinations[index].tags,
            users: body.users !== undefined ? Number(body.users) : dbDestinations[index].users,
            // Re-generate slug if title changes
            href: body.title ? `/destinasi/${body.title.toLowerCase().replace(/\s+/g, '-')}` : dbDestinations[index].href,
            image: body.image || dbDestinations[index].image
        }

        dbDestinations[index] = updatedDestination
        await writeData('destinations.json', dbDestinations)

        return c.json({ message: 'Updated successfully', data: updatedDestination })
    } catch (e) {
        return c.json({ error: 'Invalid JSON' }, 400)
    }
})

app.get('/destinasi/id/:id', async (c) => {
    const id = c.req.param('id')
    const dbDestinations = await readData<Destination>('destinations.json')
    const destination = dbDestinations.find(d => d.id === id)

    if (!destination) {
        return c.json({ error: 'Destination not found' }, 404)
    }

    return c.json(destination)
})

// Import Endpoint
app.post('/import/destinations', async (c) => {
    try {
        // Accepts an array of destinations from a JSON file
        const body = await c.req.json()

        if (!Array.isArray(body)) {
            return c.json({ error: 'Input must be an array' }, 400)
        }

        const dbDestinations = await readData<Destination>('destinations.json')

        // Strategy: Append new data. Generate IDs if missing, or keep if provided?
        // Let's assume the user provides a clean list or we just append.
        // For simplicity: We will just push them.

        let addedCount = 0

        body.forEach((item: any) => {
            // Basic validation
            if (item.label || item.title) {
                const title = item.label || item.title
                const newId = `d${Date.now() + Math.random()}`
                const slug = title.toLowerCase().replace(/\s+/g, '-')
                const href = `/destinasi/${slug}`

                const newDestination: Destination = {
                    id: newId,
                    label: title,
                    type: 'file',
                    tags: item.tags || ['destinasi'],
                    users: item.users || 0,
                    href: href,
                    description: item.description || '',
                    location: item.location || '',
                    category: item.category || 'Umum',
                    image: item.image || '' // Base64 or url
                }
                dbDestinations.push(newDestination)
                addedCount++
            }
        })

        await writeData('destinations.json', dbDestinations)
        return c.json({ message: `Successfully imported ${addedCount} destinations` }, 201)

    } catch (e) {
        return c.json({ error: 'Invalid JSON or persistence failed' }, 400)
    }
})


// Report Endpoints
app.get('/laporan', async (c) => {
    const dbReports = await readData<Report>('reports.json')
    return c.json(dbReports)
})

app.post('/laporan', async (c) => {
    try {
        const body = await c.req.json()
        if (!body.title) return c.json({ error: 'Title required' }, 400)

        const newReport: Report = {
            id: `RPT-${Date.now()}`,
            title: body.title,
            category: body.category || 'Umum',
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            author: 'Admin', // Hardcoded for now
            status: body.status || 'Draft',
            size: body.size || '0 KB',
            fileName: body.fileName,
            fileData: body.fileData
        }

        const dbReports = await readData<Report>('reports.json')
        dbReports.unshift(newReport) // Add to beginning
        await writeData('reports.json', dbReports)

        return c.json({ message: 'Report created', data: newReport }, 201)
    } catch (e) {
        return c.json({ error: 'Invalid JSON' }, 400)
    }
})

app.delete('/laporan/:id', async (c) => {
    const id = c.req.param('id')
    const dbReports = await readData<Report>('reports.json')
    const index = dbReports.findIndex(r => r.id === id)
    if (index === -1) return c.json({ error: 'Not found' }, 404)

    const deleted = dbReports.splice(index, 1)
    await writeData('reports.json', dbReports)

    return c.json({ message: 'Deleted', data: deleted[0] })
})

// Event Endpoints
app.get('/events', async (c) => {
    const dbEvents = await readData<Event>('events.json')
    return c.json(dbEvents)
})

app.get('/events/:id', async (c) => {
    const id = c.req.param('id')
    const dbEvents = await readData<Event>('events.json')
    const event = dbEvents.find(e => e.id === id)
    if (!event) return c.json({ error: 'Event not found' }, 404)
    return c.json(event)
})

app.post('/events', async (c) => {
    try {
        const body = await c.req.json()
        if (!body.title) return c.json({ error: 'Title required' }, 400)

        const newEvent: Event = {
            id: `e${Date.now()}`,
            title: body.title,
            date: body.date,
            time: body.time,
            location: body.location,
            category: body.category || 'Umum',
            attendees: '0',
            status: 'Upcoming',
            image: body.image || 'from-blue-500 to-indigo-500', // Default gradient
            description: body.description
        }

        const dbEvents = await readData<Event>('events.json')
        dbEvents.unshift(newEvent)
        await writeData('events.json', dbEvents)

        return c.json({ message: 'Event created', data: newEvent }, 201)
    } catch (e) {
        return c.json({ error: 'Invalid JSON' }, 400)
    }
})

app.delete('/events/:id', async (c) => {
    const id = c.req.param('id')
    const dbEvents = await readData<Event>('events.json')
    const index = dbEvents.findIndex(e => e.id === id)
    if (index === -1) return c.json({ error: 'Not found' }, 404)

    const deleted = dbEvents.splice(index, 1)
    await writeData('events.json', dbEvents)

    return c.json({ message: 'Deleted', data: deleted[0] })
})

// Dashboard Analytics Endpoint
app.get('/dashboard/metrics', async (c) => {
    const dbDestinations = await readData<Destination>('destinations.json')
    const dbEvents = await readData<Event>('events.json')
    const dbReports = await readData<Report>('reports.json')

    // 1. Calculate Totals
    const totalDestinations = dbDestinations.length
    const totalEvents = dbEvents.filter(e => e.status === 'Upcoming').length
    const totalReports = dbReports.length

    // Calculate total visits from all destinations (This represents Monthly Average)
    const totalMonthlyVisits = dbDestinations.reduce((acc, curr) => acc + curr.users, 0)

    // 2. Generate Top Destinations (Sorted by users)
    const topDestinations = [...dbDestinations]
        .sort((a, b) => b.users - a.users)
        .slice(0, 5)
        .map(d => ({
            name: d.label,
            uv: d.users
        }))

    // 3. Generate Monthly Visitor Trend
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentMonthIndex = new Date().getMonth()

    // Generate trend based on the Creation Date of Destinations
    const visitorData = months.slice(0, currentMonthIndex + 2).map((month, index) => {
        // Create a date object for the end of this month in the current year
        const currentYear = new Date().getFullYear()
        const endOfMonthDate = new Date(currentYear, index + 1, 0).getTime() // Last day of month

        // Filter destinations that existed by the end of this month
        const activeDestinations = dbDestinations.filter(d => {
            // Check if ID has timestamp (d177...)
            const match = d.id.match(/^d(\d+)/)
            if (match && match[1].length > 10) {
                const timestamp = Number(match[1])
                return timestamp <= endOfMonthDate
            }
            // If ID matches old format (d1, d2...), assume it existed since Jan 1st
            return true
        })

        // Sum up users for this month
        const monthlyTotal = activeDestinations.reduce((acc, curr) => acc + curr.users, 0)

        // For future months (index > currentMonthIndex), show 0 or projection?
        // Let's show 0 to be accurate, or just slice up to current month.
        // User wants accurate history.
        return {
            name: month,
            value: monthlyTotal
        }
    }).slice(0, currentMonthIndex + 1) // Strict: Only show up to current month

    return c.json({
        stats: {
            destinations: totalDestinations,
            visits: totalMonthlyVisits, // Show actual total monthly visits
            rating: 4.8,
            events: totalEvents,
            reports: totalReports
        },
        visitorData,
        topDestinations
    })
})

const port = 4000
console.log(`Server is running on port ${port}`)

serve({
    fetch: app.fetch,
    port
})
