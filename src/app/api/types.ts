// API response types

export interface ApiResponse<T> {
    data: T;
    success: true;
}

export interface ApiError {
    message: string;
    success: false;
    code?: number;
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

// Dashboard data shape
export interface DashboardData {
    totalPersonnel: number;
    activePersonnel: number;
    contractPersonnel: number;
    mobilizedPersonnel: number;
    withAwards: number;
    unitStats: { name: string; abbreviation?: string; count: number }[];
    positionStats: { name: string; category: string; count: number }[];
}
