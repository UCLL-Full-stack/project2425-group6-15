import { RegisterUser } from "@/types";

const register = (user: RegisterUser) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/users", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
  };

export default { register};
