// "use client";

// import { useQuery } from "@tanstack/react-query";
// import React, { ReactNode } from "react";

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   avatarUrl?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   isLoading: boolean;
//   isLoggedIn: boolean;
//   login: (userData: User) => void;
//   logout: () => void;
//   refetchUser: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// interface AuthProviderProps {
//   children: ReactNode;
// }

// const {
//   data: user,
//   isLoading: isQueryLoading,
//   isError: isQueryError,
//   error: queryError,
//   refetch: refetchUser,
//   isFetched,
// } = useQuery<User | null, Error>({
//   queryKey: ["currentUser"],
// });

// const AuthContext = () => {
//   return <div></div>;
// };

// export default AuthContext;
