import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('/*', cors())

// Mock Database
interface Destination {
    id: string
    label: string
    type: string
    tags: string[]
    users: number
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
    fileData?: string // Base64 string
}

const dbDestinations: Destination[] = [
    { id: 'd1', label: 'Pulau Panjang', type: 'file', tags: ['destinasi', 'alam'], users: 12, href: '/destinasi/pulau-panjang' },
    { id: 'd2', label: 'Karimunjawa', type: 'file', tags: ['destinasi', 'favorit'], users: 24, href: '/destinasi/karimunjawa' },
    { id: 'd3', label: 'Pantai Kartini', type: 'file', tags: ['destinasi', 'pantai'], users: 8, href: '/destinasi/pantai-kartini' },
    { id: 'd4', label: 'Benteng Portugis', type: 'file', tags: ['destinasi', 'sejarah'], users: 5, href: '/destinasi/benteng-portugis' },
    { id: 'd5', label: 'Museum RA Kartini', type: 'file', tags: ['destinasi', 'sejarah'], users: 15, href: '/destinasi/museum-ra-kartini' },
    { id: 'd6', label: 'Air Terjun Songgo Langit', type: 'file', tags: ['destinasi', 'alam'], users: 7, href: '/destinasi/air-terjun-songgo-langit' },
]

const dbReports: Report[] = [
    { id: 'RPT-001', title: 'Laporan Kunjunguan Bulanan - Januari 2026', category: 'Statistik', date: '31 Jan 2026', author: 'Adi Nugroho', status: 'Published', size: '2.4 MB' },
    { id: 'RPT-002', title: 'Evaluasi Kebersihan Pantai Kartini', category: 'Operasional', date: '28 Jan 2026', author: 'Siti Aminah', status: 'Review', size: '1.2 MB' },
    { id: 'RPT-003', title: 'Audit Keuangan Tiket Masuk Q4 2025', category: 'Keuangan', date: '15 Jan 2026', author: 'Budi Santoso', status: 'Draft', size: '4.8 MB' },
    { id: 'RPT-004', title: 'Laporan Insiden Keamanan - Karimunjawa', category: 'Insiden', date: '12 Jan 2026', author: 'Security Team', status: 'Published', size: '850 KB' },
    { id: 'RPT-005', title: 'Proposal Pengembangan Fasilitas Museum', category: 'Perencanaan', date: '05 Jan 2026', author: 'Dinas Pariwisata', status: 'Review', size: '5.6 MB' },
    { id: 'RPT-006', title: 'Rekapitulasi Event Budaya 2025', category: 'Event', date: '02 Jan 2026', author: 'Event Organizer', status: 'Published', size: '3.1 MB' },

]

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

const dbEvents: Event[] = [
    {
        id: 'e1',
        title: 'Pesta Lomban Kupat',
        date: '20 Apr 2026',
        time: '08:00 - 14:00',
        location: 'Pantai Kartini',
        category: 'Budaya',
        attendees: '12K+',
        status: 'Upcoming',
        image: 'from-blue-500 to-indigo-500'
    },
    {
        id: 'e2',
        title: 'Jepara Jazz Festival',
        date: '15 May 2026',
        time: '19:00 - 23:00',
        location: 'Alun-Alun Jepara',
        category: 'Musik',
        attendees: '5K+',
        status: 'Upcoming',
        image: 'from-purple-500 to-pink-500'
    },
    {
        id: 'e3',
        title: 'Festival Ukir Internasional',
        date: '10 Jun 2026',
        time: '09:00 - 17:00',
        location: 'Sentra Ukir Mulyoharjo',
        category: 'Pameran',
        attendees: '3K+',
        status: 'Upcoming',
        image: 'from-amber-500 to-orange-500'
    },
    {
        id: 'e4',
        title: 'Baratan Ratu Kalinyamat',
        date: '25 Mar 2026',
        time: '18:30 - 21:00',
        location: 'Kalinyamatan',
        category: 'Budaya',
        attendees: '8K+',
        status: 'Past',
        image: 'from-emerald-500 to-teal-500'
    },
    {
        id: 'e5',
        title: 'Karimunjawa Culture Night',
        date: '05 Jul 2026',
        time: '19:00 - 22:00',
        location: 'Karimunjawa',
        category: 'Budaya',
        attendees: '2K+',
        status: 'Upcoming',
        image: 'from-cyan-500 to-blue-500'
    }
]

app.get('/', (c) => {
    return c.text('Hello Hono!')
})

app.get('/search', (c) => {
    const query = c.req.query('q')?.toLowerCase() || ''
    if (!query) return c.json(dbDestinations)

    // Simulating database filtering
    const filtered = dbDestinations.filter(item =>
        item.label.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
    )
    return c.json(filtered)
})

app.get('/destinasi/:slug', (c) => {
    const slug = c.req.param('slug')
    const fullPath = `/destinasi/${slug}`

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
            users: 0,
            href: href,
            description: body.description,
            location: body.location,
            category: body.category,
            image: body.image
        }

        dbDestinations.push(newDestination)

        return c.json({ message: 'Success', data: newDestination }, 201)
    } catch (e) {
        return c.json({ error: 'Invalid JSON' }, 400)
    }
})

app.delete('/destinasi/:id', (c) => {
    const id = c.req.param('id')
    const index = dbDestinations.findIndex(d => d.id === id)

    if (index === -1) {
        return c.json({ error: 'Destination not found' }, 404)
    }

    const deleted = dbDestinations.splice(index, 1)
    return c.json({ message: 'Deleted successfully', data: deleted[0] })
})

app.put('/destinasi/:id', async (c) => {
    try {
        const id = c.req.param('id')
        const body = await c.req.json()
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
            // Re-generate slug if title changes
            href: body.title ? `/destinasi/${body.title.toLowerCase().replace(/\s+/g, '-')}` : dbDestinations[index].href,
            image: body.image || dbDestinations[index].image
        }

        dbDestinations[index] = updatedDestination
        return c.json({ message: 'Updated successfully', data: updatedDestination })
    } catch (e) {
        return c.json({ error: 'Invalid JSON' }, 400)
    }
})

app.get('/destinasi/id/:id', (c) => {
    const id = c.req.param('id')
    const destination = dbDestinations.find(d => d.id === id)

    if (!destination) {
        return c.json({ error: 'Destination not found' }, 404)
    }

    return c.json(destination)
    return c.json(destination)
})

// Report Endpoints
app.get('/laporan', (c) => {
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
            fileData: body.fileData
        }

        dbReports.unshift(newReport) // Add to beginning
        return c.json({ message: 'Report created', data: newReport }, 201)
    } catch (e) {
        return c.json({ error: 'Invalid JSON' }, 400)
    }
})

app.delete('/laporan/:id', (c) => {
    const id = c.req.param('id')
    const index = dbReports.findIndex(r => r.id === id)
    if (index === -1) return c.json({ error: 'Not found' }, 404)

    const deleted = dbReports.splice(index, 1)
    return c.json({ message: 'Deleted', data: deleted[0] })
})

// Event Endpoints
app.get('/events', (c) => {
    return c.json(dbEvents)
})

app.get('/events/:id', (c) => {
    const id = c.req.param('id')
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

        dbEvents.unshift(newEvent)
        return c.json({ message: 'Event created', data: newEvent }, 201)
    } catch (e) {
        return c.json({ error: 'Invalid JSON' }, 400)
    }
})

app.delete('/events/:id', (c) => {
    const id = c.req.param('id')
    const index = dbEvents.findIndex(e => e.id === id)
    if (index === -1) return c.json({ error: 'Not found' }, 404)

    const deleted = dbEvents.splice(index, 1)
    return c.json({ message: 'Deleted', data: deleted[0] })
})

const port = 4000
console.log(`Server is running on port ${port}`)

serve({
    fetch: app.fetch,
    port
})
