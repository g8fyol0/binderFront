import { BrowserRouter, Route, Routes } from "react-router-dom";

import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";
import Connections from "./components/Connections";
import Requests from "./components/Requests";

function App() {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          {/* / is where application route is present all routing inside this will work relative to this  / is base + something*/}
          <Routes>
            <Route path="/" element={<Body></Body>}>
              {/* childern routs  */}
              <Route path="/" element={<Feed />}></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/profile" element={<Profile />}></Route>
              <Route path="/connections" element={<Connections />}></Route>
              <Route path="/requests" element={<Requests />}></Route>
            </Route>

            {/* <Route path="/login" element={<div>loginpage</div>} />
          <Route path="/test" element={<div>testpage</div>} /> */}

            {/* what inside element will be rendered here we put jsx component  */}
          </Routes>
        </BrowserRouter>
        {/* <NavBar /> */}
        {/* <h1 className="text-3xl font-bold underline">Hello world!</h1> */}
      </Provider>
    </>
  );
}

export default App;
