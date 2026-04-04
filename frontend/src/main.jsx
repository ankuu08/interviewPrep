console.log("MAIN.JSX LOADED");
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "@/components/ui/provider"
import App from "./App.jsx";
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from "@/components/ui/toaster";
// import ChatProvider from "./context/chatProvider.jsx";
import { ChatProvider } from "./context/ChatProvider";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <Provider>
        <ChatProvider>
          <App />
        </ChatProvider>
        <Toaster />
      </Provider>
    </StrictMode>
  </BrowserRouter>

);
