import axios from 'axios';
import type { HelpdeskContract } from '../types';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const helpdeskApi = {
    getAll: () => api.get<HelpdeskContract[]>('/responses'),
    getOne: (id: string) => api.get<HelpdeskContract>(`/responses/${id}`),
    create: (data: HelpdeskContract) => api.post<HelpdeskContract>('/responses', data),
    update: (id: string, data: Partial<HelpdeskContract>) => api.put<HelpdeskContract>(`/responses/${id}`, data),
    delete: (id: string) => api.delete<{ message: string }>(`/responses/${id}`)
};
