import { expiredTimeToken } from './utils/amadeusAPI.js';
import { useEffect, useState } from 'react';
import { searchLocations } from './utils/amadeusAPI.js';
import DetailSearch from './DetailSearch.jsx';
import './App.css';

const MAX_HISTORY_ITEMS = 4;

const App = () => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [token, setToken] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
    const fetchToken = async () => {
      try {
        const infoToken = await expiredTimeToken();
        setToken(infoToken);
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Error fetching token:', error);
        setLoading(false);
      }
    };
    fetchToken();
  }, []);

  const addToHistory = (searchTerm) => {
    const newHistory = [
      searchTerm,
      ...searchHistory.filter(term => term !== searchTerm)
    ].slice(0, MAX_HISTORY_ITEMS);
    
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const locations = await searchLocations(keyword);
      setResults(locations);
      setShowDetails(true);
      addToHistory(keyword);
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLoading(false);
    }
  };

  const handleHistoryClick = (term) => {
    setKeyword(term);
    handleSearch();
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const goBack = () => {
    setShowDetails(false);
    setResults([]);
  };

  if (loading && !showDetails) {
    return (
      <section style={{ position: 'relative' }}>
        <div className="Hole">
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </div>
      </section>
    );
  }

  return (
    <div>
      {!showDetails ? (
        <div>
          <h1>¿Qué ciudades con aeropuertos existen?</h1>
          <h2>Aquí puedes encontrar las ciudades con aeropuertos en tiempo real que contengan las palabras que se busquen</h2>
          <h2>Notas importantes:</h2>
          <ol className="NotesApi">
            <li>Los aeropuertos deben tener un mínimo de vuelos comerciales por semana para que aparezcan.</li>
            <li>Se excluyen aeropuertos militares y privados.</li>
            <li>Solo aparecen las ciudades con aeropuertos.</li>
          </ol>
          <h4>El token expira {token}</h4>

          <div className="InputSearchData">
            <input
              className="InputSearchData__input"
              type="text"
              placeholder="Busca una ciudad o aeropuerto"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <button onClick={handleSearch} disabled={!keyword.trim()}>
              Buscar
            </button>
          </div>

          {searchHistory.length > 0 && (
            <div className="ContainerHistory">
              <h3>Búsquedas recientes:</h3>
              <div className="ContainerHistory__buttons">
                <div className="ContainerHistory__buttons__previous">
                  {searchHistory.map((term, index) => (
                      <button
                        key={index}
                        onClick={() => handleHistoryClick(term)}
                        >
                        {term}
                      </button>
                  ))}
                </div>
                <button
                  onClick={clearHistory}>
                  Borrar historial
                </button>
              </div>
            </div>
          )}

        </div>
      ) : (
        <div>
          {results.length > 0 ? (
            <DetailSearch results={results} goBack={goBack} />
          ) : (
            <div>
              <h2>No hay resultados para la búsqueda: "{keyword}"</h2>
              <button onClick={goBack}>Volver</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
