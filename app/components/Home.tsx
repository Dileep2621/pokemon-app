"use client";
import React from "react";
import Card from "./Card";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Loader from "./Loader";

interface Pokemon {
  name: string;
  url: string;
  id: number;
  sprites: {
    front_default: string;
  };
  types: { type: { name: string } }[];
}

interface ApiResponseItem {
  url: string;
}

interface ApiResponse {
  results: ApiResponseItem[];
  next: string | null;
  previous: string | null;
}

const Home = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [types, setTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchPokemonList = async () => {
      setLoading(true);
      try {
        const response = await axios.get<{
          results: { name: string; url: string }[];
        }>("https://pokeapi.co/api/v2/pokemon?limit=100");

        const pokemonDetails = await Promise.all(
          response.data.results.map(async (pokemon) => {
            const pokemonData = await axios.get<Pokemon>(pokemon.url);
            return pokemonData.data;
          })
        );

        setPokemonList(pokemonDetails);
        setFilteredPokemon(pokemonDetails);

        const typeResponse = await axios.get<{ results: { name: string }[] }>(
          "https://pokeapi.co/api/v2/type"
        );
        setTypes(typeResponse.data.results.map((type) => type.name));
      } catch (err) {
        setError("Failed to fetch Pokémon list");
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonList();
  }, []);

  useEffect(() => {
    const filtered = pokemonList.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedType === "all" ||
          pokemon.types.some((type) => type.type.name === selectedType))
    );
    setFilteredPokemon(filtered);
  }, [searchTerm, selectedType, pokemonList]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setIsDropdownVisible(true);
  };

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value);
  };

  const handleSelectOption = (name: string) => {
    setSearchTerm(name);
    setFilteredPokemon([]);
    setIsDropdownVisible(false);
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="search w-full lg:w-96">
            <div className="grid gap-2">
              <select
                value={selectedType}
                onChange={handleSelect}
                className="border border-e-slate-50 rounded-md text-sm p-2 w-full"
              >
                <option value="all">All Types</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="flex relative">
                <div className="relative w-full">
                  <FaSearch className="text-gray fill-gray-400 absolute top-3 left-2" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="border border-e-slate-50 rounded-md text-sm p-2 px-8 w-full"
                  />
                  {isDropdownVisible &&
                    searchTerm &&
                    filteredPokemon.length > 0 && (
                      <ul className="absolute bg-white w-full p-2 border rounded-md shadow-md top-10">
                        {filteredPokemon.slice(0, 10).map((pokemon) => (
                          <li
                            key={pokemon.name}
                            onClick={() => handleSelectOption(pokemon.name)}
                            className="cursor-pointer"
                          >
                            {pokemon.name}
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
                <button className="bg-[#004368] text-white py-[6px] px-[10px]">
                  Search
                </button>
              </div>
            </div>
          </div>
          <div className="result grid grid-cols-1 lg:grid-cols-4 mt-10 gap-8">
            {filteredPokemon &&
              filteredPokemon.map((item) => {
                return <Card key={item.id} pokemon={item} />;
              })}
          </div>
        </>
      )}
    </>
  );
};
export default Home;
