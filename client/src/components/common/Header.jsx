import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import.meta.env;
import { useClerk, useUser } from "@clerk/clerk-react";
import { userAuthorContextObj } from "../contexts/UserAuthorContext.jsx";
import { adminContextObj } from "../contexts/AdminContext.jsx";
import logo from "../../assets/logo.png";

function Header() {
  const { signOut } = useClerk();
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const { admin, setAdmin } = useContext(adminContextObj);
  const navigate = useNavigate();
  async function handleSignout() {
    await signOut();
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("admin");
    setAdmin(null);
    navigate("/");
  }
  const { isSignedIn, isLoaded, user } = useUser();
  return (
    <div className="w-[100%] h-[80px] bg-[#fff] border-b-gray-300 border-b-[1px] z-10 sticky top-0 left-0">
      <nav className="w-full flex justify-between">
        <div className="">
          <Link to="/">
            <img
              src={logo}
              className="h-[50px] self-center flex justify-center items-center"
            ></img>
          </Link>
        </div>
        <div className="">
          <ul className="flex flex-row gap-3 mr2-[20%]">
            {!isSignedIn ? (
              <>
                <li>
                  <Link to="">Home</Link>
                </li>
                <li>
                  <Link to="signin">Signin</Link>
                </li>
                <li>
                  <Link to="signup">signup</Link>
                </li>
              </>
            ) : (
              <div className="">
                <div style={{ position: "relative" }}>
                  <img src={user.imageUrl} width="40px" className=""></img>
                  <p style={{ position: "absolute", top: "0px" }}>
                    {user.firstName}
                  </p>
                </div>
                <button className="" id="sign-out" onClick={handleSignout}>
                  Signout
                </button>
              </div>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Header;
