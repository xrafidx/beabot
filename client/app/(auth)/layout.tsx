import { ReactNode } from "react";
import React from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return <div className="auth-layout">{children}</div>;
};

export default AuthLayout;
