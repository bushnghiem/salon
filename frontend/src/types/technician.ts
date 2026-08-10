export interface Technician {
    id: number;
    name: string;
    phone: string;
    work_start: number;
    work_end: number;
}


export interface TechnicianCreate {
    name: string;
    phone: string;
    work_start: number;
    work_end: number;
}


export interface TechnicianUpdate {
    name?: string;
    phone?: string;
    work_start?: number;
    work_end?: number;
}
