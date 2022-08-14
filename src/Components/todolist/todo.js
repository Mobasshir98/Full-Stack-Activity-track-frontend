import axios from "axios";
import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./todo.css";

export const Todo = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
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

  const HandleEnd = (e) => {
    let token = localStorage.getItem("token");
    let finaltime =
      ("0" + Math.floor((time / 60000) % 60)).slice(-2) +
      ":" +
      ("0" + Math.floor((time / 1000) % 60)).slice(-2) +
      ":" +
      ("0" + ((time / 10) % 100)).slice(-2);
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
      .then((data) => {setaddactivity(false); window.location.reload(false) })
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
      <header>
        <h1>{username}</h1>
      </header>
      <div className="wrapper">
        <table>
          <tr>
            <th>Activity</th>
            <th>Status</th>
            <th>Time-taken</th>
            <th>Action</th>
          </tr>
          {listdata.length > 0 &&
            listdata.map((item) => {
              return (
                <tr>
                  <td>{item.activity}</td>
                  <td>{item.status}</td>
                  <td>{item.timeTaken}</td>
                  <td>
                    <div id="buttons">
                      {!timerOn && time === 0 && item.status === "Pending" && (
                        <button id={item._id} onClick={()=>setTimerOn(true)}>Start</button>
                      )}
                      {timerOn && (
                        <button onClick={() => setTimerOn(false)}>Pause</button>
                      )}
                      {!timerOn && time > 0 && (
                        <button id={item._id} onClick={HandleEnd}>
                          End
                        </button>
                      )}
                      {!timerOn && time > 0 && (
                        <button onClick={() => setTimerOn(true)}>Resume</button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
        </table>
      </div>
      <div className="add">
        <button onClick={() => setaddactivity(true)}>Add Activity</button>
      </div>
      <div>
        <button onClick={HandleLogout}>LOG OUT </button>
      </div>
      {addactivity && (
        <div>
          <input
            value={todovalue}
            onChange={(e) => settodovalue(e.target.value)}
            type="text"
            placeholder="Enter Activity"
          />
          <div>
            <button onClick={HandleAdd}> ADD </button>{" "}
          </div>
        </div>
      )}
    </>
  );
};
