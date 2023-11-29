import React, { createContext, ReactNode, useEffect, useState } from "react";
import { axiosPrivateInstance } from "../api/apiService";
import { USERS_ME_ENDPOINT } from "../api/apiConstants";

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

    if (token) {
      axiosPrivateInstance
        .get(USERS_ME_ENDPOINT)
        .then((response) => {
          const responseData = response.data;
          setUser({
            id: responseData.id,
            role: responseData.role,
            firstName: responseData.firstName,
            lastName: responseData.lastName,
            token: token,
          });
        })
        .catch((error) => console.log("Cannot fetch logged user: ", error));
    }
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
