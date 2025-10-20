import { Routes, Route, Link } from 'react-router-dom';
import CovidOcupacaoHospitalar from './pages/CovidOcupacaoHospitalar';
import CovidNotificacaoSindromeGripalLeve from './pages/CovidNotificacaoSindromGripalLeve';
import TuberculoseCasosConfirmadosRegiaoEstadoAno from './pages/TuberculoseCasosConfirmadosRegiaoEstadoAno';

function Home() {
  return (
    <div className="container text-center p-5">
      <div className="bg-transparent">
        <h1 className="display-4">Bem-vindo ao Projeto</h1>
        <p className="lead">Selecione qual tipo de informação deseja visualizar.</p>
        <hr className="my-4" />
        <div className="d-grid gap-3 col-md-8 mx-auto">
          <Link 
            to="/covid/registro-ocupacao-hospitalar" 
            className="btn btn-primary btn-lg"
          >
            Registros de Ocupação Hospitalar por Covid-19
          </Link>
          <Link 
            to="/covid/notificacao-sindrome-gripal-leve" 
            className="btn btn-info btn-lg text-white"
          >
            Notificações de Síndrome Gripal Leve
          </Link>
          <Link 
            to="/tuberculose/casos-confirmados-estado-ano" 
            className="btn btn-secondary btn-lg"
          >
            Casos confirmados de Tuberculose por região/estado e ano
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container">
          <Link to="/" className="navbar-brand">Painel de Saúde</Link>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/" className="nav-link active">Home</Link>
            </li>
          </ul>
        </div>
      </nav>

      <main className="flex-shrink-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/covid/registro-ocupacao-hospitalar" element={<CovidOcupacaoHospitalar />} />
          <Route path="/covid/notificacao-sindrome-gripal-leve" element={<CovidNotificacaoSindromeGripalLeve />} />
          <Route path="/tuberculose/casos-confirmados-estado-ano" element={<TuberculoseCasosConfirmadosRegiaoEstadoAno />} />
        </Routes>
      </main>
    </>
  );
}

export default App;