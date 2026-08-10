export interface Service {
    id: number;
    name: string;
    duration: number;
    price: number;
    description: string;
}


export interface ServiceCreate {
    name: string;
    duration: number;
    price: number;
    description: string;
}


export interface ServiceUpdate {
    name?: string;
    duration?: number;
    price?: number;
    description?: string;
}