import { Api } from './Api';

const network_ip: string = '192.168.176.1'
export const http: boolean = false
export const host: string = http ? network_ip : 'localhost';

export const api = new Api({
    baseURL: http ? `http://${host}:8000/api/` : `https://${host}:8000/api/`,
    withCredentials: true
});
