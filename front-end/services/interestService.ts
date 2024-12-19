



const findAll = async () => {
  let token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/interest", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache",
      ...(process.env.NEXT_PUBLIC_API_KEY && { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }),
    },
  });
};

const createInterest = async (newInterest: { name: string; description: string }) => {
  let token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/interest/create", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache",
      ...(process.env.NEXT_PUBLIC_API_KEY && { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }),
    },
    body: JSON.stringify(newInterest),
  });
};

const getAllForAdmin = () => {
  let token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/interest/admin", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache",
      ...(process.env.NEXT_PUBLIC_API_KEY && { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }),
    },
  });
};

const removeInterest = async (interestId: number) => {
  let token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }
  return await fetch(process.env.NEXT_PUBLIC_API_URL + `/interest/${interestId}`, {
    method: 'DELETE',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(process.env.NEXT_PUBLIC_API_KEY && { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }),
    },
  });
};

export default { findAll,createInterest, getAllForAdmin, removeInterest };
