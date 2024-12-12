



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



export default { findAll };