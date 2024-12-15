import React from 'react';

interface User {
    id: number;
    email: string;
    password: string;
    role: string;
}

const users: User[] = [
    { id: 1, email: 'user@gmail.com',password:'user123', role: 'user' },
    { id: 2,  email: 'admin@gmail.com', password:'admin123', role: 'admin' },
    { id: 3,  email: 'guest@gmail.com',password:'guest', role: 'guest' },
];

const LoginUsersTable: React.FC = () => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Role</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td className='p-3'>{user.email}</td>
                        <td className='p-3'>{user.password}</td>
                        <td className='p-3'>{user.role}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default LoginUsersTable;