import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient.ts';
import "./index.css";
import App from "./App.tsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
