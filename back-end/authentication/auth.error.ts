export class AuthError extends Error {
    status: number;
    constructor(message: string) {
        super(message);
        this.name = 'TokenError';
        this.status = 401;
    }
}