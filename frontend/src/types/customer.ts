export interface Customer {
    id: number;
    name: string;
    phone: string;
}


export interface CustomerCreate {
    name: string;
    phone: string;
}


export interface CustomerUpdate {
    name?: string;
    phone?: string;
}
