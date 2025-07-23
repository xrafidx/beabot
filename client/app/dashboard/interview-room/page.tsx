// "use client";

// import { useEffect, useState } from "react";
// import Vapi from "@vapi-ai/web";

// const vapi = new Vapi("");

// export default function VapiWorkflowButton() {
//   const [isCalling, setIsCalling] = useState(false);

//   const startWorkflowCall = async () => {
//     try {
//       setIsCalling(true);
//       await vapi.start(undefined, undefined, undefined, "", {
//         variableValues: {
//           userId: "123", // hardcode dulu
//           cardId: "456",
//         },
//       });
//     } catch (error) {
//       console.error("Gagal memulai workflow:", error);
//     }
//   };

//   const stopCall = () => {
//     vapi.stop();
//   };

//   useEffect(() => {
//     const onCallStart = () => setIsCalling(true);
//     const onCallEnd = () => setIsCalling(false);

//     vapi.on("call-start", onCallStart);
//     vapi.on("call-end", onCallEnd);

//     return () => {
//       vapi.off("call-start", onCallStart);
//       vapi.off("call-end", onCallEnd);
//     };
//   }, []);

//   return <button onClick={isCalling ? stopCall : startWorkflowCall}>{isCalling ? "Hentikan Panggilan" : "Mulai Interview (Workflow)"} 🎙️</button>;
// }
