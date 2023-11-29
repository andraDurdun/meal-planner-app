import React, { createContext, ReactNode, useEffect, useState } from "react";

interface User {
  id: number | null;
  role: string | null;
  firstName: string | null;
  lastName: string | null;
  token: string | null;
}

export const UserContext = createContext<User>({
  id: null,
  role: null,
  firstName: null,
  lastName: null,
  token: null,
});

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User>({
    id: null,
    role: null,
    firstName: null,
    lastName: null,
    token: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("in UserProvider effect with token: ", token);

    if (token) {
      console.log("in UserProvider effect, not empty token");

      const endpointUrl = "http://localhost:8080/meal-planner/api/users/me";

      fetch(endpointUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Authentication failed");
          }
          return response.json();
        })
        .then((responseData) => {
          console.log(responseData);
          setUser({
            id: responseData.id,
            role: responseData.role,
            firstName: responseData.firstName,
            lastName: responseData.lastName,
            token: token,
          });
        })
        .catch((error) => console.log(error));
    }
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
