import { BrowserRouter, Route, Routes } from "react-router-dom";

import Body from "./Body";
import Login from "./Login";
import Profile from "./Profile";

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        {/* / is where application route is present all routing inside this will work relative to this  / is base + something*/}
        <Routes>
          <Route path="/" element={<Body></Body>}>
            {/* childern routs  */}
            <Route path="/login" element={<Login />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
          </Route>

          {/* <Route path="/login" element={<div>loginpage</div>} />
          <Route path="/test" element={<div>testpage</div>} /> */}

          {/* what inside element will be rendered here we put jsx component  */}
        </Routes>
      </BrowserRouter>
      {/* <NavBar /> */}
      {/* <h1 className="text-3xl font-bold underline">Hello world!</h1> */}
    </>
  );
}

export default App;
