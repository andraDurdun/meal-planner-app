import React, { createContext, ReactNode, useState } from "react";

interface User {
  id: number | null;
  role: string | null;
  name: string | null;
  token: string | null;
}

interface UserData {
  user: User;
  setUser: (user: User) => void;
}

export const UserContext = createContext<UserData>({
  user: { id: null, role: null, name: null, token: null },
  setUser: () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [userProvider, setUserProvider] = useState<UserData>({
    user: {
      id: null,
      role: null,
      name: null,
      token: null,
    },
    setUser: (userData: User) =>
      setUserProvider({ ...userProvider, user: userData }),
  });

  return (
    <UserContext.Provider value={userProvider}>{children}</UserContext.Provider>
  );
};
