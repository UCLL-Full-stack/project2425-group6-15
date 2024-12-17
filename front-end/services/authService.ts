import { AccountLogin, AccountRegistraion } from "@/types";

const register = (Account: AccountRegistraion) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(process.env.NEXT_PUBLIC_API_KEY && { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }),
      },
      body: JSON.stringify(Account),
    });
  };
  
const login = (Account: AccountLogin) => {
      return fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/login", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...(process.env.NEXT_PUBLIC_API_KEY && { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }),
          },
          body: JSON.stringify(Account),
        });

    
  };

const refreshAccessToken = async () => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/refresh", {
        method: "POST",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        ...(process.env.NEXT_PUBLIC_API_KEY && { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }),
        },
    });
};

export default { register, login, refreshAccessToken };