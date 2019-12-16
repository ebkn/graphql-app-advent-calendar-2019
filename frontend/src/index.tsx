import React from "react";
import ReactDom from "react-dom";
import { Router } from "react-router-dom";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

import { createBrowserHistory } from "history";

const history = createBrowserHistory();

import styles from "./styles/main.css";

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql"
});

export default function App() {
  return (
    <Router history={history}>
      <ApolloProvider client={client}>
        <div className={styles.color_red}>テスト</div>
      </ApolloProvider>
    </Router>
  );
}

ReactDom.render(<App />, document.getElementById("app"));
