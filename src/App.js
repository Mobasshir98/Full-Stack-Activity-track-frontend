import { Register } from "./Components/Register/Register";
import { Todo } from "./Components/todolist/todo";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Protected from "./Components/Protected/Protected";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Register />} ></Route>
          <Route element={<Protected />}>
            <Route path="/TodoList" element={<Todo />} ></Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
