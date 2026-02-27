import { ApiResult, DashboardData } from './types';
import { db, maybeError } from './mockDb';

/** Get pre-calculated dashboard statistics */
export async function getDashboardData(): Promise<ApiResult<DashboardData>> {
    const err = maybeError();
    if (err) return { success: false, message: err };

    const personnel = db.personnel;
    const units = db.units;
    const positions = db.positions;

    const totalPersonnel = personnel.length;
    const activePersonnel = personnel.filter((p) => p.status === 'Служить').length;
    const contractPersonnel = personnel.filter((p) => p.serviceType === 'Контракт').length;
    const mobilizedPersonnel = personnel.filter((p) => p.serviceType === 'Мобілізований').length;
    const withAwards = personnel.filter((p) => p.awards && p.awards.length > 0).length;

    // Unit breakdown — groups under "Вузол зв'язку" (parentId '3')
    const unitStats = units
        .filter((u) => u.parentId === '3')
        .map((unit) => ({
            name: unit.name,
            abbreviation: unit.abbreviation,
            count: personnel.filter((p) => p.unitId === unit.id).length,
        }))
        .filter((stat) => stat.count > 0);

    // Top-5 positions by count
    const positionStats = positions
        .map((position) => ({
            name: position.name,
            category: position.category,
            count: personnel.filter((p) => p.positionId === position.id).length,
        }))
        .filter((stat) => stat.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    return {
        success: true,
        data: {
            totalPersonnel,
            activePersonnel,
            contractPersonnel,
            mobilizedPersonnel,
            withAwards,
            unitStats,
            positionStats,
        },
    };
}
