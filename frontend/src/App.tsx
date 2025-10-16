import { Routes, Route, Link } from 'react-router-dom';
import CovidOcupacaoHospitalar from './pages/CovidOcupacaoHospitalar';
import CovidNotificacaoSindromeGripalLeve from './pages/CovidNotificacaoSindromGripalLeve';

function Home() {
  return (

    <div className="text-center p-10">

      <h1 className="text-4xl font-bold mb-4">Bem-vindo ao Projeto</h1>
      
      <p className="mb-6">Selecione qual tipo de informação deseja visualizar</p>

      {/* REGISTROS DE OCUPAÇÃO HOSPITALAR POR COVID */}
      <Link 
        to="/covid/registro-ocupacao-hospitalar" 
        className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded"
      >
        Registros de Ocupação Hospitalar por Covid-19
      </Link>

      <br />
      
      {/* NOTIFICACOES DE SINDROME GRIPAL LEVE */}
      <Link 
        to="/covid/notificacao-sindrome-gripal-leve" 
        className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded"
      >
        Notificações de Síndrome Gripal Leve
      </Link>
    </div>
  );
}

function App() {
  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans">
      
      <nav className="bg-slate-800 p-4 shadow-md">
        <ul className="flex gap-6">
          <li>
            <Link to="/" className="hover:text-sky-400 transition-colors">Home</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/covid/registro-ocupacao-hospitalar" element={<CovidOcupacaoHospitalar />} />
        <Route path="/covid/notificacao-sindrome-gripal-leve" element={<CovidNotificacaoSindromeGripalLeve />}></Route>
      </Routes>

    </div>
  );
}

export default App;