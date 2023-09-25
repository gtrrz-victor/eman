import { API_URL } from "./constants";
import { Guest } from "./readGuest";

export const updateGuest = (
  id: string,
  guest: Pick<Guest, "address" | "isAssisting" | "additionalPeople">
): Promise<unknown> => {
  const requestOptions = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(guest),
  };
  return fetch(`${API_URL}/${id}`, requestOptions).then((response) =>
    response.json()
  );
};
