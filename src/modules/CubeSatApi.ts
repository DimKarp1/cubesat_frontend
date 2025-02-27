import { mockCubeSats } from '../mock-services/mockData';

const API_PREFIX = '/api/';

interface GetCubeSatsParams {
    title?: string;
}

interface CubeSat {
    id: number;
    title: string;
    shortDescription: string;
    description: string;
    is_active: boolean;
    imgSrc?: string;
    price: number;
}

export const api = {

    async getCubeSats(searchQuery: string = "") {
        const params: GetCubeSatsParams = {};
        if (searchQuery) {
            params.title = searchQuery;
        }
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_PREFIX}cubesats/?${queryString}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: CubeSat[] = await response.json();
            return data;
        } catch (error) {
            console.error("Ошибка получения устройств с сервера:", error.message);
            console.warn("Возвращаем данные из mock-объектов");
            const filteredMocks = searchQuery
                ? mockCubeSats.filter((item) =>
                    item.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
                : mockCubeSats;
            return { cubeSats: filteredMocks };
        }
    },

    async getCubeSat(id: string) {
        const url = `${API_PREFIX}cubesat/${id}/`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Ошибка получения устройства с сервера:", error.message);
            console.warn("Возвращаем данные из mock-объектов для ингредиента");
            const cubeSat = mockCubeSats.find((item) => item.id === parseInt(id));
            return cubeSat || null;
        }
    },
};
