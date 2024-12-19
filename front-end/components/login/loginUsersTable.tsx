import React from "react";

interface Account {
  id: number;
  email: string;
  password: string;
  role: string;
}

const Accounts: Account[] = [
  {
    id: 1,
    email: "Account@gmail.com",
    password: "Account123",
    role: "Account",
  },
  { id: 2, email: "admin@gmail.com", password: "admin123", role: "admin" },
  {
    id: 3,
    email: "organization@gmail.com",
    password: "organization123",
    role: "organization",
  },
];

const LoginAccountsTable: React.FC = () => {
  return (
    <table>
      <thead>
        <tr>
          <th>Accountname</th>
          <th>Password</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        {Accounts.map((Account) => (
          <tr key={Account.id}>
            <td className="p-3">{Account.email}</td>
            <td className="p-3">{Account.password}</td>
            <td className="p-3">{Account.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LoginAccountsTable;
