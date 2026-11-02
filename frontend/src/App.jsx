
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Home from './pages/Home'
import Mapa from './pages/Mapa'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Pais from './pages/Pais'
import Universidades from './pages/Universidades'
import Quiz from './pages/Quiz'
import ResultadoQuiz from './pages/ResultadoQuiz'
import Oportunidades from './pages/Oportunidades'
import MinhaJornada from './pages/MinhaJornada'
import Administrativo from './pages/Administrativo'
import DetalhesUniversidade from './pages/DetalhesUniversidade'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/pais/:nomePais" element={<Pais />} />
        <Route path="/universidades" element={<Universidades />} />
        <Route path="/universidades/:id" element={<DetalhesUniversidade />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/resultado-quiz" element={<ResultadoQuiz />} />
        <Route path="/oportunidades" element={<Oportunidades />} />
        <Route path="/minha-jornada" element={<MinhaJornada />} />
        <Route path="/admin" element={<Administrativo />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
