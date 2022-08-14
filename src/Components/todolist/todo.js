import axios from "axios";
import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./todo.css";

export const Todo = () => {
  const navigate = useNavigate();
  const [addactivity, setaddactivity] = useState(false);
  const [todovalue, settodovalue] = useState("");
  const [listdata, setlistdata] = useState([]);
  const [username, setusername] = useState("");

  useEffect(() => {
    let token = localStorage.getItem("token");
    axios({
      method: "GET",
      url: "https://mern-todo-list-0.herokuapp.com/post",
      headers: {
        token: token,
      },
    }).then((res) => {
      setlistdata(res.data);
    });
  }, [listdata]);

  const HandleAdd = () => {
    const token = localStorage.getItem("token");
    axios({
      method: "POST",
      url: "https://mern-todo-list-0.herokuapp.com/post",
      data: {
        activity: todovalue,
      },
      headers: {
        token: token,
      },
    })
      .then((data) => {
        setaddactivity(false);
        window.location.reload(false);
      })
      .catch((err) => alert(err.data));
  };
  const HandleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    let token = localStorage.getItem("token");
    axios({
      method: "GET",
      url: "https://mern-todo-list-0.herokuapp.com/username",
      headers: {
        token: token,
      },
    }).then((res) => {
      setusername(res.data.username);
    });
  }, []);

  return (
    <>
      <header className="header-fixed">
        <div className="header-limiter">
          <h1>
            <span>{username}</span>
          </h1>
        </div>
        <div>
          <button className="custom-btn btn-16 log-btn" onClick={HandleLogout}>
            LOG OUT{" "}
          </button>
        </div>
      </header>
      <div className="add_container">
        <div className="add">
          <button
            className="custom-btn btn-16"
            onClick={() => setaddactivity(true)}
          >
            Add Activity
          </button>
        </div>

        {addactivity && (
          <div className="add_container">
            <input
              value={todovalue}
              onChange={(e) => settodovalue(e.target.value)}
              type="text"
              placeholder="Enter Activity"
            />
            <div>
              <button className="custom-btn btn-16" onClick={HandleAdd}>
                {" "}
                ADD{" "}
              </button>{" "}
            </div>
          </div>
        )}
      </div>

      <div className="wrapper">
        <table>
          <thead> 
          <tr>
            <th>Activity</th>
            <th>Status</th>
            <th>Time-taken</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody> 
          {listdata.length > 0 &&
            listdata.map((item) => {
              return (
                <tr>
                  <td>{item.activity}</td>
                  <td>{item.status}</td>
                  <td>{item.timeTaken}</td>
                  <td>
                    <TimerBtn id={"Buttons"} item={item}></TimerBtn>
                  </td>
                </tr>
              );
            })}
            </tbody>
        </table>
      </div>
    </>
  );
};

function TimerBtn(props) {
  const [timerOn, setTimerOn] = useState(false);
  const [time, setTime] = useState(0);
  const HandleEnd = (e) => {
    let token = localStorage.getItem("token");
    let finaltime =
      ("0" + Math.floor((time / 3600000) % 24)).slice(-2) +
      ":" +
      ("0" + Math.floor((time / 60000) % 60)).slice(-2) +
      ":" +
      ("0" + Math.floor((time / 1000) % 60)).slice(-2);
    axios({
      method: "PUT",
      url: "https://mern-todo-list-0.herokuapp.com/put",
      data: {
        id: e.target.id,
        time_Taken: finaltime,
      },
      headers: {
        token: token,
      },
    });
    setTime(0);
  };
  useEffect(() => {
    let interval = null;

    if (timerOn) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (!timerOn) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timerOn]);
  return (
    <div id={props.id}>
      {!timerOn && time === 0 && props.item.status === "Pending" && (
        <button
          className="custom-btn btn-16"
          id={props.item._id}
          onClick={() => setTimerOn(true)}
        >
          Start
        </button>
      )}
      {timerOn && (
        <button className="custom-btn btn-16" onClick={() => setTimerOn(false)}>
          Pause
        </button>
      )}
      {!timerOn && time > 0 && (
        <button
          className="custom-btn btn-16"
          id={props.item._id}
          onClick={HandleEnd}
        >
          End
        </button>
      )}
      {!timerOn && time > 0 && (
        <button className="custom-btn btn-16" onClick={() => setTimerOn(true)}>
          Resume
        </button>
      )}
    </div>
  );
}
