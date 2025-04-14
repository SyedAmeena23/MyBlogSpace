import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { userAuthorContextObj } from "../contexts/UserAuthorContext.jsx";
import { adminContextObj } from "../contexts/AdminContext.jsx";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
// import { search } from "../../../../server/API/commonApi.js";

function Home() {
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const { admin, setAdmin } = useContext(adminContextObj);
  console.log(admin);
  // setAdmin(...admin,)
  console.log("curr" + currentUser);
  const { isSignedIn, isLoaded, user } = useUser();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  console.log("isSignedIn", isSignedIn);
  console.log("isLoaded", isLoaded);
  console.log("context", currentUser);
  console.log("user", user);

  async function onSelectRole(e) {
    const selectedRole = e.target.value;
    currentUser.role = selectedRole;
    console.log(e.target.value);
    let res = null;
    try {
      if (selectedRole === "author") {
        res = await axios.post(
          "http://localhost:3000/author-api/author",
          currentUser
        );
        let { message, payload } = res.data;
        console.log(message, payload);
        if (message === "author") {
          setCurrentUser({ ...currentUser, ...payload });
          // save user to localstorage
          localStorage.setItem("currentUser", JSON.stringify(payload));
          // setError(null)
        } else {
          setError(message);
        }
      }

      if (selectedRole === "user") {
        res = await axios.post(
          "http://localhost:3000/user-api/user",
          currentUser
        );
        let { message, payload } = res.data;
        console.log(message);
        if (message === "user") {
          setCurrentUser({ ...currentUser, ...payload });
          localStorage.setItem("currentUser", JSON.stringify(payload));
          // setError(null)
        } else {
          setError(message);
        }
      }

      if (selectedRole === "admin") {
        // console.log(user.fullName);

        setAdmin({
          ...admin,
          nameOfAdmin: currentUser.firstName,
          email: currentUser.email,
        });

        console.log(admin);
        res = await axios.post(
          "http://localhost:3000/admin-api/create-admin",
          admin
        );

        localStorage.setItem("admin", JSON.stringify(admin));
        // navigate(`admin-profile/${admin.email}`);
      }
    } catch (err) {
      // console.log(JSON.stringify(err));
      console.log("err is ", err);
      setError(err.message);
    }
  }

  // loading user from DB
  async function findUserRole(user) {
    let res = await axios.get("http://localhost:3000/common-api/get-all");
    // console.log(res.data.payload);
    const allUsersAuthors = res.data.payload;
    let search_res = allUsersAuthors.find(
      (obj) => obj.email === user.emailAddresses[0].emailAddress
    );
    // console.log(search_res);
    if (search_res !== undefined) {
      setCurrentUser({ ...currentUser, ...search_res });

      // return search_res.role;
      return search_res.role;
    } else {
      res = await axios.get("http://localhost:3000/common-api/get-admins");
      // console.log(res.data.payload);
      const all_admins = res.data.payload;
      search_res = all_admins.find(
        (obj) => user.emailAddresses[0].emailAddress === obj.email
      );
      if (search_res !== undefined) return "admin";
    }
    return "new-user";
    // let res = allUsersAuthors.find()
  }

  // if role was already selected
  useEffect(() => {
    if (isLoaded === true && isSignedIn === true) {
      setCurrentUser((currentUser) => ({
        ...currentUser,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0].emailAddress,
        profileImageUrl: user.imageUrl,
      }));

      const fetchrole = async () => {
        const role = await findUserRole(user);
        const email = user.emailAddresses[0].emailAddress;
        if (role != "new-user") {
          currentUser.role = role;
          localStorage.setItem("currentUser", JSON.stringify(currentUser));
          if (role === "author" && error.length == 0)
            navigate(`author-profile/${email}`);
          if (role === "admin" && error.length == 0)
            navigate(`admin-profile/${email}`);
          if (role === "user" && error.length == 0) {
            navigate(`user-profile/${email}`);
          }
        }

        console.log(role);
      };
      fetchrole();
    }
    console.log(currentUser);
  }, [isLoaded]);

  // selecting role first time
  useEffect(() => {
    if (currentUser?.role === "author" && error.length == 0)
      navigate(`author-profile/${currentUser.email}`);

    if (currentUser?.role === "admin" && error.length == 0)
      navigate(`admin-profile/${currentUser.email}`);
    if (currentUser?.role === "user" && error.length == 0) {
      navigate(`user-profile/${currentUser.email}`);
    }
  }, [currentUser?.role]);

  return (
    <div className="container">
      {isSignedIn === false && (
        <div>
          <p className="lead">lorem</p>
          <p className="lead">lorem</p>
          <p className="lead">lorem</p>
        </div>
      )}
      {isSignedIn === true && (
        <div>
          <div className="d-flex justify-content-evenly align-items-center bg-info p-3">
            <img
              src={user.imageUrl}
              width="100px"
              className="rounded-circle"
            ></img>
            <p className="display-6">{user.firstName}</p>
            <p className="lead">{user.emailAddresses[0].emailAddress}</p>
          </div>
          <p className="lead">Select role</p>
          {error != null && <div className="text-danger">{error}</div>}
          <div className="d-flex justify-content-center py-3">
            <div className="form-check">
              <input
                type="radio"
                name="role"
                value="user"
                id="user"
                // ?defaultChecked:
                className="form-check-input"
                onChange={(e) => onSelectRole(e)}
              ></input>
              <label htmlFor="user" className="form-check-label">
                User
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                name="role"
                value="author"
                id="author"
                className="form-check-input"
                onChange={(e) => onSelectRole(e)}
              ></input>
              <label htmlFor="author" className="form-check-label">
                Author
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                name="role"
                value="admin"
                id="admin"
                className="form-check-input"
                onChange={(e) => onSelectRole(e)}
              ></input>
              <label htmlFor="author" className="form-check-label">
                Admin
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
