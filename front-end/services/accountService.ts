import { AccountLogin, AccountInput, AccountSummary } from "@/types";
import { console } from "inspector";


const getAllAccounts = async () => {
  let token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }
  return await fetch(process.env.NEXT_PUBLIC_API_URL + "/account", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(process.env.NEXT_PUBLIC_API_KEY && { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }),
    },
  });
}

const addInterestToAccount = async (interest: string[]) => {
  let token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }
  return await fetch(process.env.NEXT_PUBLIC_API_URL + `/account/interests`, {
    method: 'POST',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(process.env.NEXT_PUBLIC_API_KEY && { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }),
    },
    body: JSON.stringify(interest),
  });
};

const findAccountByEmail = async (email:string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/email/${email}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(process.env.NEXT_PUBLIC_API_KEY && { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }),
    },
  });

  if (!response.ok) {
    throw new Error('Account not found');
  }

  const Account = await response.json();
  return Account;
};


const findCurrentAccount = async () => {
  let token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }

  return fetch(process.env.NEXT_PUBLIC_API_URL + "/account/me", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(process.env.NEXT_PUBLIC_API_KEY && { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }),
    },
  });

};

const changePassword = async (currentPassword: string, newPassword : string) => {
  let token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }
  return await fetch(process.env.NEXT_PUBLIC_API_URL + `/auth/change-password`, {
    method: 'POST',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      ...(process.env.NEXT_PUBLIC_API_KEY && { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }),
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

const updateAccount = async (accountInput: AccountInput) => {
  let token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }

  return fetch(process.env.NEXT_PUBLIC_API_URL + "/account", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(process.env.NEXT_PUBLIC_API_KEY && { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }),
    },
    body: JSON.stringify(accountInput),
  });
};
const deleteUser = async (id: number) => {
  let token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }

  return fetch(process.env.NEXT_PUBLIC_API_URL + `/account/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(process.env.NEXT_PUBLIC_API_KEY && { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }),
    },
  });
};
export default {getAllAccounts, addInterestToAccount, findAccountByEmail, findCurrentAccount , changePassword , updateAccount , deleteUser};
