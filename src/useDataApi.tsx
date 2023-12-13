import { MouseEvent } from "react";
import "./styles.css";
// import useFetchData from "./utils/useFetchData";
import useFetchData from "./utils/useFetch";

export interface Pokemon {
  name: string
}
const pokemonUrl = 'https://pokeapi.co/api/v2/pokemon/';

export default function App() {
  const { data, isLoading, setUrl } = useFetchData(pokemonUrl);

  const loadRandom = (_e: MouseEvent<HTMLButtonElement>) => {
    let id = Math.floor(Math.random() * 1000) + 1;
    setUrl(pokemonUrl + id);
  };

  return (
    <div className="App">
      <h1>Pokemon App</h1>
      <button onClick={loadRandom}>Get Random Pokeemon</button>
      <br />
      {isLoading
        ? "Loading..."
        : data
        ? data.name
        : "No pokemon fetched."}
    </div>
  );
}
