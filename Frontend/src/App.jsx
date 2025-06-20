import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Oficinas from './pages/Oficinas'
import Presencas from './pages/Presencas'





function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path='/students' element={<Students/>}/>
          <Route path='/workshops' element={<Oficinas/>}/>
          <Route path='/attendance' element={<Presencas/>}/>

        </Routes>
      </main>
    </div>
  );
}

export default App;
