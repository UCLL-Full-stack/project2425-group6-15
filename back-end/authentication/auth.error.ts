export class AuthError extends Error {
    public status: number; 

    constructor(message: string, status: number = 401) { 
        super(message);
        this.name = 'AuthError';
        this.status = status; 
    }
}