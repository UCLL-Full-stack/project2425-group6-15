import jwt from 'jsonwebtoken'

const getEmailByToken = async (): Promise<string> => {
    const token = sessionStorage.getItem('token');
    if (!token) {
        throw new Error('Token not found');
    }
    let decode =  jwt.verify(token as string, process.env.NEXT_PUBLIC_JWT_SECRET as string) as { email: string };
    if (!decode.email) {
        throw new Error('Email not found');
    }
    return decode.email;
}

 export {getEmailByToken};