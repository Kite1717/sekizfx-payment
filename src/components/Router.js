import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Main from '../Main'
export default function Routes() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="*">
            <Main />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
