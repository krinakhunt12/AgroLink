const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }
    return data;
};

export interface AgricultureContent {
    id: string;
    title: string;
    link: string;
    pubDate: string;
    author?: string;
    description: string;
    source: string;
    contentType: 'video' | 'news' | 'scheme';
    usefulnessScore: number;
    detectedSchemes: string[];
    isTrusted: boolean;
    translatedTitle?: string;
    thumbnail?: string;
    relevanceCategory?: string;
}

export interface DashboardData {
    videos: AgricultureContent[];
    news: AgricultureContent[];
    schemes: AgricultureContent[];
    topFeatured: AgricultureContent[];
}

export interface AgricultureDashboardResponse {
    success: boolean;
    data: DashboardData;
    filtersApplied: {
        search?: string;
        dateFilter?: string;
        language?: string;
    };
}

export const agricultureService = {
    getDashboard: async (params: {
        search?: string;
        dateFilter?: string;
        language?: string;
    } = {}): Promise<AgricultureDashboardResponse> => {
        const queryParams = new URLSearchParams();
        if (params.search) queryParams.append('search', params.search);
        if (params.dateFilter) queryParams.append('dateFilter', params.dateFilter);
        if (params.language) queryParams.append('language', params.language);

        return await apiRequest(`/agriculture/dashboard?${queryParams.toString()}`);
    }
};
