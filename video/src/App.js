import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header.js";

import {
  Switch,
  Route,
  useHistory,
  useLocation,
  Redirect
} from "react-router-dom";

import JoinCallForm from "./components/JoinCallForm.js";
import InviteForm from "./components/InviteForm";
import InCall from "./pages/InCall.js";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function App() {
  let query = useQuery();
  let history = useHistory();
  let [roomDetails, setRoomDetails] = useState({});

  return (
    <>
      <Header />
      <Switch>
        <Route path="/in-call">
          {roomDetails.name === undefined || roomDetails.room === undefined ? (
            <Redirect to="/" />
          ) : (
            <InCall roomDetails={roomDetails} />
          )}
        </Route>

        <Route path="/invite">
          <InviteForm
            mod={query.get("m") === "mod"}
            roomName={query.get("r")}
            onJoin={({ room, name, mod }) => {
              console.log(name, room, mod);
              setRoomDetails({ name, room, mod });
              console.log(history);
              history.push("/in-call");
            }}
          />
        </Route>
        <Route path="/">
          <JoinCallForm
            onJoin={({ room, name }) => {
              console.log(name, room);
              setRoomDetails({ name, room, mod: true });
              console.log(history);
              history.push("/in-call");
            }}
          />
        </Route>
      </Switch>
    </>
  );
}

export default App;
