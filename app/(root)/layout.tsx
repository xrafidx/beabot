import React, { ReactNode } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <nav>
        <h1>Beabot</h1>

        <div className="me-auto">
          <button>Sign In</button>
        </div>
      </nav>
      {children}
    </div>
  );
};

export default RootLayout;
