export interface ShopItem {
    id: number;
    uid: string;
    name: string;
    locked: boolean;
    callback?: string;
}

export interface ShopResponse {
    list: ShopItem[];
}

export interface CreateShopRequest {
    name: string;
    callback: string;
}

export interface UpdateShopRequest {
    name: string;
    callback: string;
}

export interface LoginResponse {
    token: string;
    username: string;
    roles: string[];
}

export interface SearchResult {
    product_id: string;
    similarity_score: number;
    image_url: string;
}

export interface ConfigureImagesSourceRequest {
    shopId: number;
    s3Url: string;
    s3Key: string;
    s3SecretKey: string;
    s3Bucket: string;
} 