import { BrowserRouter, Route , Routes } from "react-router-dom"
import Auth from "./Pages/Auth"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Auth />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
