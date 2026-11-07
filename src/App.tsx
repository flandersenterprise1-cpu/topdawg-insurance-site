import { Route, Router, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./site/Layout";
import { isPreview } from "./site/config";
import Home from "./pages/Home";
import { Business, Health, Life, Personal } from "./pages/Coverage";
import { About, Contact, Licensing, NotFound, Privacy, Quote, StateDetail, States } from "./pages/Pages";


function Routes() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/personal" component={Personal} />
        <Route path="/business" component={Business} />
        <Route path="/life" component={Life} />
        <Route path="/health" component={Health} />
        <Route path="/about" component={About} />
        <Route path="/states" component={States} />
        <Route path="/states/:code" component={StateDetail} />
        <Route path="/contact" component={Contact} />
        <Route path="/quote" component={Quote} />
        <Route path="/licensing" component={Licensing} />
        <Route path="/privacy" component={Privacy} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      {isPreview ? (
        <Router hook={useHashLocation}>
          <Routes />
        </Router>
      ) : (
        <Routes />
      )}
    </ErrorBoundary>
  );
}
