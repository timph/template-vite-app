import { MouseEvent, useCallback } from 'react';
import "./App.css";
import useFetchData from './utils/useFetchData';
import debounce from './utils/debounce';

export interface Pokemon {
  name: string
}
const pokemonUrl = 'https://pokeapi.co/api/v2/pokemon/';

export default function App() {
  const { data, isLoading, setUrl } = useFetchData<Pokemon>(pokemonUrl);
  
  const loadRandom = () => {
    let id = Math.floor(Math.random() * 1000) + 1;
    setUrl(pokemonUrl + id);
  };

  const debounceOnChange = useCallback(debounce(loadRandom, 1000), []);

  return (
    <div className="App">
      <h1>Pokemon App</h1>
      <button 
        onClick={e => debounceOnChange()} 
        style={{ borderRadius: '8px', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)'}}>
        Get Random Pokemon
      </button>
      <pre>
      {isLoading
        ? "Loading..."
        : data
        ? <div style={{ textTransform: 'capitalize'}}>{data.name}</div>
        : "No pokemon fetched."}
        </pre>
    </div>
  );
}
