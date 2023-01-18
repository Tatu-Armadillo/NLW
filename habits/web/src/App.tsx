import './styles/global.css';
import { Habit } from "./components/Habit"

function App() {
  return (
    <div>
      <Habit completed={5} />
      <Habit completed={50} />
      <Habit completed={32} />
      <Habit completed={78} />
    </div>
  )
}

export default App
