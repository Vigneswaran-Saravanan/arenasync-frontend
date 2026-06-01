// React Router handle navigation between pages
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Bootstrap CSS - give us grid system and some base styles
import 'bootstrap/dist/css/bootstrap.min.css'

// Custom global styles
import './index.css'

import HomePage from './pages/HomePage'

function App(){
  return(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage/>} />
    </Routes>
  </BrowserRouter>
 ) 
}

export default App