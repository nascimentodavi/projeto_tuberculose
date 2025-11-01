import { Routes, Route, Link } from 'react-router-dom';
import VigilanciaMeioAmbiente from './pages/VigilanciaMeioAmbiente';
import CovidOcupacaoHospitalar from './pages/CovidOcupacaoHospitalar';
import CovidNotificacaoSindromeGripalLeve from './pages/CovidNotificacaoSindromGripalLeve';
import TuberculoseCasosConfirmadosRegiaoEstadoAno from './pages/TuberculoseCasosConfirmadosRegiaoEstadoAno';

function Home() {
  return (
    <div className="container text-center p-5">

      <div className="bg-transparent">

        <h1 className="display-4">Bem-vindo ao Projeto</h1>

        <p className="lead">Selecione qual tema deseja visualizar dados</p>

        <hr className="my-4" />

        <div className="d-grid gap-3 col-md-8 mx-auto">
          

          {/* COVID 19 */}
          <Link 
            to="/covid/registro-ocupacao-hospitalar" 
            className="btn btn-primary btn-lg"
          >
            Registros de Ocupação Hospitalar por Covid-19 em 2021
          </Link>


          {/* SINDROME GRIPAL LEVE */}
          {/* <Link 
            to="/covid/notificacao-sindrome-gripal-leve" 
            className="btn btn-info btn-lg text-white"
          >
            Notificações de Síndrome Gripal Leve
          </Link> */}
          <Link
            to="/vigilancia-e-meio-ambiente"
            className="btn btn-info btn-lg text-white"
          >
            Vigilância e Meio Ambiente
          </Link>

          
          {/* CASOS CONFIRMADOS DE TUBERCULOSE */}
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
          
          {/* NAVBAR BRAND */}
          <Link to="/" className="navbar-brand">Painel de Saúde</Link>
          
          {/* LINK */}
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
          <Route path="/vigilancia-e-meio-ambiente" element={<VigilanciaMeioAmbiente />}/>
          <Route path="/covid/notificacao-sindrome-gripal-leve" element={<CovidNotificacaoSindromeGripalLeve />} />
          <Route path="/tuberculose/casos-confirmados-estado-ano" element={<TuberculoseCasosConfirmadosRegiaoEstadoAno />} />
          <Route path="/teste/teste" element={<TuberculoseCasosConfirmadosRegiaoEstadoAno />} />
        </Routes>
      </main>
    </>
  );
}

export default App;