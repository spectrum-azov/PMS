import { http, HttpResponse, delay } from 'msw'
import { db, maybeError } from '../app/api/mockDb'
import { PersonSchema, PersonnelFiltersSchema } from '../app/schemas/personnel'

const API_BASE = '/api'

export const handlers = [
    // GET all personnel with filters
    http.get(`${API_BASE}/personnel`, async ({ request }) => {
        await delay(200)

        const err = maybeError()
        if (err) return HttpResponse.json({ success: false, message: err }, { status: 500 })

        const url = new URL(request.url)
        const rawFilters = {
            search: url.searchParams.get('search') || undefined,
            unitId: url.searchParams.get('unitId') || undefined,
            positionId: url.searchParams.get('positionId') || undefined,
            status: url.searchParams.get('status') || undefined,
            serviceType: url.searchParams.get('serviceType') || undefined,
            roleId: url.searchParams.get('roleId') || undefined,
        }

        const filterResult = PersonnelFiltersSchema.safeParse(rawFilters)
        if (!filterResult.success) {
            return HttpResponse.json({ success: false, message: 'Invalid filters', errors: filterResult.error.format() }, { status: 400 })
        }
        const filters = filterResult.data

        let result = [...db.personnel]

        if (filters.search) {
            const s = filters.search.toLowerCase()
            result = result.filter(
                (p) =>
                    p.callsign.toLowerCase().includes(s) ||
                    p.fullName.toLowerCase().includes(s) ||
                    p.phone.includes(s) ||
                    p.militaryId?.toLowerCase().includes(s)
            )
        }
        if (filters.unitId) result = result.filter((p) => p.unitId === filters.unitId)
        if (filters.positionId) result = result.filter((p) => p.positionId === filters.positionId)
        if (filters.status) result = result.filter((p) => p.status === filters.status)
        if (filters.serviceType) result = result.filter((p) => p.serviceType === filters.serviceType)
        if (filters.roleId) result = result.filter((p) => p.roleIds.includes(filters.roleId!))

        return HttpResponse.json({ success: true, data: result })
    }),

    // GET single person
    http.get(`${API_BASE}/personnel/:id`, async ({ params }) => {
        await delay(100)
        const { id } = params

        const err = maybeError()
        if (err) return HttpResponse.json({ success: false, message: err }, { status: 500 })

        const person = db.personnel.find((p) => p.id === id)
        if (!person) return HttpResponse.json({ success: false, message: 'Особу не знайдено' }, { status: 404 })

        return HttpResponse.json({ success: true, data: { ...person } })
    }),

    // POST create person
    http.post(`${API_BASE}/personnel`, async ({ request }) => {
        await delay(200)
        const body = await request.json()

        const err = maybeError()
        if (err) return HttpResponse.json({ success: false, message: err }, { status: 500 })

        const validation = PersonSchema.safeParse(body)
        if (!validation.success) {
            return HttpResponse.json({ success: false, message: 'Invalid person data', errors: validation.error.format() }, { status: 400 })
        }
        const personData = validation.data

        const now = new Date().toISOString()
        const newPerson = {
            ...personData,
            id: db.nextId(),
            createdAt: now,
            updatedAt: now,
        }

        db.personnel.push(newPerson)
        db.persist('personnel-data', db.personnel)

        return HttpResponse.json({ success: true, data: newPerson }, { status: 201 })
    }),

    // PATCH update person
    http.patch(`${API_BASE}/personnel/:id`, async ({ params, request }) => {
        await delay(200)
        const { id } = params
        const body = await request.json()

        const err = maybeError()
        if (err) return HttpResponse.json({ success: false, message: err }, { status: 500 })

        const validation = PersonSchema.partial().safeParse(body)
        if (!validation.success) {
            return HttpResponse.json({ success: false, message: 'Invalid update data', errors: validation.error.format() }, { status: 400 })
        }
        const updates = validation.data

        const idx = db.personnel.findIndex((p) => p.id === id)
        if (idx === -1) return HttpResponse.json({ success: false, message: 'Особу не знайдено' }, { status: 404 })

        db.personnel[idx] = {
            ...db.personnel[idx],
            ...updates,
            id,
            updatedAt: new Date().toISOString(),
        } as any
        db.persist('personnel-data', db.personnel)

        return HttpResponse.json({ success: true, data: db.personnel[idx] })
    }),

    // DELETE person
    http.delete(`${API_BASE}/personnel/:id`, async ({ params }) => {
        await delay(200)
        const { id } = params

        const err = maybeError()
        if (err) return HttpResponse.json({ success: false, message: err }, { status: 500 })

        const idx = db.personnel.findIndex((p) => p.id === id)
        if (idx === -1) return HttpResponse.json({ success: false, message: 'Особу не знайдено' }, { status: 404 })

        db.personnel.splice(idx, 1)
        db.persist('personnel-data', db.personnel)

        return HttpResponse.json({ success: true, data: { id } })
    }),

    // POST check duplicates
    http.post(`${API_BASE}/personnel/check-duplicates`, async ({ request }) => {
        await delay(300)
        const { items } = await request.json() as { items: any[] }

        const err = maybeError()
        if (err) return HttpResponse.json({ success: false, message: err }, { status: 500 })

        const results = items.map((item, index) => {
            const matchedFields: string[] = []
            for (const person of db.personnel) {
                if (item.callsign && person.callsign && item.callsign.toLowerCase() === person.callsign.toLowerCase()) {
                    if (!matchedFields.includes('callsign')) matchedFields.push('callsign')
                }
                if (item.militaryId && person.militaryId && item.militaryId === person.militaryId) {
                    if (!matchedFields.includes('militaryId')) matchedFields.push('militaryId')
                }
                if (item.passport && person.passport && item.passport === person.passport) {
                    if (!matchedFields.includes('passport')) matchedFields.push('passport')
                }
                if (item.taxId && person.taxId && item.taxId === person.taxId) {
                    if (!matchedFields.includes('taxId')) matchedFields.push('taxId')
                }
            }
            return {
                index,
                isDuplicate: matchedFields.length > 0,
                matchedFields,
            }
        })

        return HttpResponse.json({ success: true, data: results })
    }),

    // --- Dictionaries ---

    // Units
    http.get(`${API_BASE}/units`, async () => {
        await delay(100)
        return HttpResponse.json({ success: true, data: [...db.units] })
    }),
    http.post(`${API_BASE}/units`, async ({ request }) => {
        const body = await request.json() as any
        const newUnit = { ...body, id: db.nextId() }
        db.units.push(newUnit)
        db.persist('units-data', db.units)
        return HttpResponse.json({ success: true, data: newUnit }, { status: 201 })
    }),
    http.patch(`${API_BASE}/units/:id`, async ({ params, request }) => {
        const { id } = params
        const body = await request.json() as any
        const idx = db.units.findIndex(u => u.id === id)
        if (idx === -1) return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 })
        db.units[idx] = { ...db.units[idx], ...body, id }
        db.persist('units-data', db.units)
        return HttpResponse.json({ success: true, data: db.units[idx] })
    }),
    http.delete(`${API_BASE}/units/:id`, async ({ params }) => {
        const { id } = params
        const idx = db.units.findIndex(u => u.id === id)
        if (idx === -1) return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 })
        db.units.splice(idx, 1)
        db.persist('units-data', db.units)
        return HttpResponse.json({ success: true, data: { id } })
    }),

    // Positions
    http.get(`${API_BASE}/positions`, async () => {
        await delay(100)
        return HttpResponse.json({ success: true, data: [...db.positions] })
    }),
    http.post(`${API_BASE}/positions`, async ({ request }) => {
        const body = await request.json() as any
        const newItem = { ...body, id: db.nextId() }
        db.positions.push(newItem)
        db.persist('positions-data', db.positions)
        return HttpResponse.json({ success: true, data: newItem }, { status: 201 })
    }),
    http.patch(`${API_BASE}/positions/:id`, async ({ params, request }) => {
        const { id } = params
        const body = await request.json() as any
        const idx = db.positions.findIndex(u => u.id === id)
        if (idx === -1) return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 })
        db.positions[idx] = { ...db.positions[idx], ...body, id }
        db.persist('positions-data', db.positions)
        return HttpResponse.json({ success: true, data: db.positions[idx] })
    }),
    http.delete(`${API_BASE}/positions/:id`, async ({ params }) => {
        const { id } = params
        const idx = db.positions.findIndex(u => u.id === id)
        if (idx === -1) return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 })
        db.positions.splice(idx, 1)
        db.persist('positions-data', db.positions)
        return HttpResponse.json({ success: true, data: { id } })
    }),

    // Roles
    http.get(`${API_BASE}/roles`, async () => {
        await delay(100)
        return HttpResponse.json({ success: true, data: [...db.roles] })
    }),
    http.post(`${API_BASE}/roles`, async ({ request }) => {
        const body = await request.json() as any
        const newItem = { ...body, id: db.nextId() }
        db.roles.push(newItem)
        db.persist('roles-data', db.roles)
        return HttpResponse.json({ success: true, data: newItem }, { status: 201 })
    }),
    http.patch(`${API_BASE}/roles/:id`, async ({ params, request }) => {
        const { id } = params
        const body = await request.json() as any
        const idx = db.roles.findIndex(u => u.id === id)
        if (idx === -1) return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 })
        db.roles[idx] = { ...db.roles[idx], ...body, id }
        db.persist('roles-data', db.roles)
        return HttpResponse.json({ success: true, data: db.roles[idx] })
    }),
    http.delete(`${API_BASE}/roles/:id`, async ({ params }) => {
        const { id } = params
        const idx = db.roles.findIndex(u => u.id === id)
        if (idx === -1) return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 })
        db.roles.splice(idx, 1)
        db.persist('roles-data', db.roles)
        return HttpResponse.json({ success: true, data: { id } })
    }),

    // Directions
    http.get(`${API_BASE}/directions`, async () => {
        await delay(100)
        return HttpResponse.json({ success: true, data: [...db.directions] })
    }),
    http.post(`${API_BASE}/directions`, async ({ request }) => {
        const body = await request.json() as any
        const newItem = { ...body, id: db.nextId() }
        db.directions.push(newItem)
        db.persist('directions-data', db.directions)
        return HttpResponse.json({ success: true, data: newItem }, { status: 201 })
    }),
    http.patch(`${API_BASE}/directions/:id`, async ({ params, request }) => {
        const { id } = params
        const body = await request.json() as any
        const idx = db.directions.findIndex(u => u.id === id)
        if (idx === -1) return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 })
        db.directions[idx] = { ...db.directions[idx], ...body, id }
        db.persist('directions-data', db.directions)
        return HttpResponse.json({ success: true, data: db.directions[idx] })
    }),
    http.delete(`${API_BASE}/directions/:id`, async ({ params }) => {
        const { id } = params
        const idx = db.directions.findIndex(u => u.id === id)
        if (idx === -1) return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 })
        db.directions.splice(idx, 1)
        db.persist('directions-data', db.directions)
        return HttpResponse.json({ success: true, data: { id } })
    }),

    // Ranks
    http.get(`${API_BASE}/ranks`, async () => {
        await delay(100)
        return HttpResponse.json({ success: true, data: [...db.ranks] })
    }),
    http.post(`${API_BASE}/ranks`, async ({ request }) => {
        const body = await request.json() as any
        const newItem = { ...body, id: db.nextId() }
        db.ranks.push(newItem)
        db.persist('ranks-data', db.ranks)
        return HttpResponse.json({ success: true, data: newItem }, { status: 201 })
    }),
    http.patch(`${API_BASE}/ranks/:id`, async ({ params, request }) => {
        const { id } = params
        const body = await request.json() as any
        const idx = db.ranks.findIndex(u => u.id === id)
        if (idx === -1) return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 })
        db.ranks[idx] = { ...db.ranks[idx], ...body, id }
        db.persist('ranks-data', db.ranks)
        return HttpResponse.json({ success: true, data: db.ranks[idx] })
    }),
    http.delete(`${API_BASE}/ranks/:id`, async ({ params }) => {
        const { id } = params
        const idx = db.ranks.findIndex(u => u.id === id)
        if (idx === -1) return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 })
        db.ranks.splice(idx, 1)
        db.persist('ranks-data', db.ranks)
        return HttpResponse.json({ success: true, data: { id } })
    }),
]
