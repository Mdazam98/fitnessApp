import {
  BrowserRouter as Router,
  Navigate,
  Routes,
  Route,
  useLocation,
} from "react-router";
import "./App.css";
import { Button, Box } from "@mui/material";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "./store/authSlice";
import { useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import ActivityForm from "./component/ActivityForm";
import ActivityList from "./component/ActivityList";
import ActivityDetail from "./component/ActivityDetail";

const ActivityPage = () => {
  return (
    <Box component="section" sx={{ p: 2, border: "1px dashed grey" }}>
      <ActivityForm onActivityAdded={() => window.location.reload()} />
      <ActivityList />
    </Box>
  );
};

function App() {
  const { token, tokenData, login, logout, isAuthenticated } =
    useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);
  useEffect(() => {
    if (token) {
      dispatch(setCredentials({ token, user: tokenData }));
      setAuthReady(true);
    }
  }, [token, tokenData, dispatch]);
  return (
    <Router>
      {!token ? (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            login();
          }}
        >
          Click Me
        </Button>
      ) : (
        // <div>{JSON.stringify(tokenData, null, 2)}</div>

        <Box component="section" sx={{ p: 2, border: "1px dashed grey" }}>
          <Routes>
            <Route path="/activities" element={<ActivityPage />} />
            <Route path="/activities/:id" element={<ActivityDetail />} />

            <Route
              path="/"
              element={
                token ? <Navigate to="/activities" /> : <div>Please log in</div>
              }
            />
          </Routes>
        </Box>
      )}
    </Router>
  );
}

export default App;
