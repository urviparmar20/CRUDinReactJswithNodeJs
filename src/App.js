import "./App.css";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Books from "./screens/Books";
import AddOrEditBook from "./screens/AddOrEditBook";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const token = localStorage.getItem("token");
  let routes = useRoutes([
    { path: "/", element: <Login /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/add-or-edit", element: token ? <AddOrEditBook /> : <Login /> },
    { path: "/books", element: token ? <Books /> : <Login /> },
  ]);
  return routes;
};

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;
