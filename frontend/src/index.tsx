import React from "react";
import ReactDom from "react-dom";
import { Router, Route, Switch } from "react-router";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

import { createBrowserHistory } from "history";
const history = createBrowserHistory();

import Tasks from "./components/Tasks";

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql"
});

export default function App() {
  return (
    <Router history={history}>
      <ApolloProvider client={client}>
        <Switch>
          <Route exact={true} path="/" component={Tasks} />
        </Switch>
      </ApolloProvider>
    </Router>
  );
}

ReactDom.render(<App />, document.getElementById("app"));
