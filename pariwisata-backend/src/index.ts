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

        const newId = `d${dbDestinations.length + 1}`
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
            id: `RPT-${String(dbReports.length + 1).padStart(3, '0')}`,
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

const port = 4000
console.log(`Server is running on port ${port}`)

serve({
    fetch: app.fetch,
    port
})
