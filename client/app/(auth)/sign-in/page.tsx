import React from "react";
import AuthForm from "@/components/AuthForm";
const page = () => {
  return (
    <div>
      <div className="auth-split-layout">
        <div className="auth-left-panel">
          <div className="auth-left-text">
            Ace your <span className="font-extrabold">interviews </span>
            and perfect your <span className="font-extrabold">essays</span>
          </div>
        </div>

        <div className="auth-right-panel">
          <AuthForm type="sign-in"></AuthForm>
        </div>
      </div>
    </div>
  );
};

export default page;
