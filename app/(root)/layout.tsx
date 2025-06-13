import React, { ReactNode } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <nav>
        <div className="grid grid-rows-1 grid-cols-5 container my-4 mx-5">
          <div className="me-auto">
            <h1 className="text-3xl">Beabot</h1>
          </div>

          <div className="mx-auto">
            <a href="#">Services</a>
            <a href="#">How it Works</a>
          </div>

          <div className="ms-auto">a</div>
        </div>

        {/* <h1>Beabot</h1>

        <div className="me-auto">
          <button>Sign In</button>
        </div> */}
      </nav>
      {children}
    </div>
  );
};

export default RootLayout;
