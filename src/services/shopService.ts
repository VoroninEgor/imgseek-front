import axios from 'axios';
import type { ShopResponse, ShopItem, CreateShopRequest, UpdateShopRequest, SearchResult, ConfigureImagesSourceRequest } from '../types/shop';

const API_URL = '';

interface ImageSourceResponse {
    url: string | null;
    key: string | null;
    secretKey: string | null;
    bucketName: string | null;
    callback: string | null;
}

export const shopService = {
    async getShopList(): Promise<ShopResponse> {
        const token = localStorage.getItem('token');
        const response = await axios.get<ShopResponse>(`${API_URL}/shop`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    async createShop(data: CreateShopRequest): Promise<ShopItem> {
        const token = localStorage.getItem('token');
        const response = await axios.post<ShopItem>(`${API_URL}/shop`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    async updateShop(id: number, data: UpdateShopRequest): Promise<ShopItem> {
        const token = localStorage.getItem('token');
        const response = await axios.put<ShopItem>(`${API_URL}/shop/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    async deleteShop(id: number): Promise<void> {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/shop/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },

    async getShopS3Config(shopId: number): Promise<ImageSourceResponse> {
        const token = localStorage.getItem('token');
        const response = await axios.get<ImageSourceResponse>(`${API_URL}/shop/${shopId}/images/source`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    async searchInShop(shopId: number, file: File, topK: number = 3): Promise<SearchResult[]> {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('file', file);

        const s3Config = await this.getShopS3Config(shopId);
        
        const s3ConfigData = {
            endpoint_url: s3Config.url,
            aws_access_key_id: s3Config.key,
            aws_secret_access_key: s3Config.secretKey,
            bucket_name: s3Config.bucketName,
            callback: s3Config.callback
        };
        
        formData.append('s3_config', JSON.stringify(s3ConfigData));

        console.log('Отправляю POST запрос на поиск:', {
            url: `${API_URL}/search/${shopId}?top_k=${topK}`,
            s3Config: s3ConfigData,
            fileName: file.name
        });

        const response = await axios.post<SearchResult[]>(
            `${API_URL}/search/${shopId}?top_k=${topK}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    },

    async configureImagesSource(data: ConfigureImagesSourceRequest): Promise<void> {
        await axios.put('/shop/images/source', data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
    }
}; 