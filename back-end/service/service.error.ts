export class ServiceError extends Error {
    public status: number; 

    constructor(message: string, status: number = 500) { 
        super(message);
        this.name = 'ServiceError';
        this.status = status; 
    }
}