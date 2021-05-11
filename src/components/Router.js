import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Main from '../Main'
export default function Routes() {
  return (
    <Router>
      <div>
        <Switch>
          <Route  path="/:token/:userId">
            <Main />
          </Route>
          <Route  path="/">
            <Main />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
