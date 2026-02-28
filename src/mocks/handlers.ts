import { http, HttpResponse, delay } from 'msw'
import { db, maybeError } from '../app/api/mockDb'
import { PersonnelFilters } from '../app/types/personnel'

const API_BASE = '/api'

export const handlers = [
    // GET all personnel with filters
    http.get(`${API_BASE}/personnel`, async ({ request }) => {
        await delay(200)

        const err = maybeError()
        if (err) return HttpResponse.json({ success: false, message: err }, { status: 500 })

        const url = new URL(request.url)
        const filters: PersonnelFilters = {
            search: url.searchParams.get('search') || undefined,
            unitId: url.searchParams.get('unitId') || undefined,
            positionId: url.searchParams.get('positionId') || undefined,
            status: url.searchParams.get('status') as any || undefined,
            serviceType: url.searchParams.get('serviceType') as any || undefined,
            roleId: url.searchParams.get('roleId') || undefined,
        }

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
        const personData = await request.json() as any

        const err = maybeError()
        if (err) return HttpResponse.json({ success: false, message: err }, { status: 500 })

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
        const updates = await request.json() as any

        const err = maybeError()
        if (err) return HttpResponse.json({ success: false, message: err }, { status: 500 })

        const idx = db.personnel.findIndex((p) => p.id === id)
        if (idx === -1) return HttpResponse.json({ success: false, message: 'Особу не знайдено' }, { status: 404 })

        db.personnel[idx] = {
            ...db.personnel[idx],
            ...updates,
            id,
            updatedAt: new Date().toISOString(),
        }
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
]
