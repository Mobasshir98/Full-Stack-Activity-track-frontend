import { React, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

export const Register = () => {
  const navigate = useNavigate();
  const wrapper = useRef(null);
  const toggleForm = () => {
    wrapper.current.classList.toggle("active");
  };
  const [LoginInfo, setLoginInfo] = useState({
    username: "",
    password: "",
  });
  const [RegisterInfo, setRegisterInfo] = useState({
    username: "",
    password: "",
    cmpassword: "",
  });
  const HandleLogin = (e) => {
    let { name, value } = e.target;
    setLoginInfo({
      ...LoginInfo,
      [name]: value,
    });
  };
  const HandleRegister = (e) => {
    let { name, value } = e.target;
    setRegisterInfo({
      ...RegisterInfo,
      [name]: value,
    });
  };
  const HandleLoginSubmit = (e) => {
    e.preventDefault();
    axios({
      method: "POST",
      url: "https://mern-todo-list-0.herokuapp.com/login",
      data: LoginInfo,
    })
      .then((res) => {
        localStorage.setItem("token", res.data);
        navigate("/TodoList");
      })
      .catch((err) => alert(err.response.data));
  };
  const HandleRegisterSubmit = (e) => {
    e.preventDefault();
    axios({
      method: "POST",
      url: "https://mern-todo-list-0.herokuapp.com/register",
      data: RegisterInfo,
    })
      .then(() => toggleForm())
      .catch((err) => alert(err.response.data));
  };
  
  return (
    <section>
      <div ref={wrapper} className="container">
        <div className="user signinBx">
          <div className="imgBx">
            <img
              src="https://clickup.com/blog/wp-content/uploads/2019/01/to-do-list-apps.png"
              alt=""
            />
          </div>
          <div className="formBx">
            <form>
              <h2>Sign In</h2>
              <input
                type="text"
                name="username"
                onChange={HandleLogin}
                placeholder="Username"
              />
              <input
                type="password"
                name="password"
                onChange={HandleLogin}
                placeholder="Password"
              />
              <input
                onClick={HandleLoginSubmit}
                type="submit"
                name=""
                value="Login"
              />
              <p className="signup">
                Don't have an account ?
                <p  className="signbtn" onClick={toggleForm}>Sign Up.</p>
              </p>
            </form>
          </div>
        </div>
        <div className="user signupBx">
          <div className="formBx">
            <form>
              <h2>Create an account</h2>
              <input
                type="text"
                name="username"
                onChange={HandleRegister}
                placeholder="Username"
              />
              <input
                type="password"
                name="password"
                onChange={HandleRegister}
                placeholder="Create Password"
              />
              <input
                type="password"
                name="cmpassword"
                onChange={HandleRegister}
                placeholder="Confirm Password"
              />
              <input
                type="submit"
                onClick={HandleRegisterSubmit}
                value="Sign Up"
              />
              <p className="signup">
                Already have an account ?
                <p className="signbtn" onClick={toggleForm}>Sign in.</p>
              </p>
            </form>
          </div>
          <div className="imgBx">
            <img
              src="https://clickup.com/blog/wp-content/uploads/2019/01/to-do-list-apps.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </section>
  );
};
