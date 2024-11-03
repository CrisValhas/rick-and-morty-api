import React, { FC, useEffect, useState } from "react";
import "./characterDetail.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import Skeleton from "../skeleton/skeleton.tsx";

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  origin: { name: string };
  location: { name: string; type: string };
  image: string;
}

const CharacterDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [character, setCharacter] = useState<Character | null>(null);

  useEffect(() => {
    axios
      .get(`https://rickandmortyapi.com/api/character/${id}`)
      .then((response) => setCharacter(response.data));
  }, [id]);

  return (
    <div className="container">
      <button onClick={() => window.history.back()} className="button">
        Back
      </button>
      {!character ? (
        <Skeleton nColumnas={11} />
      ) : (
        <div className="character-detail">
          <img
            src={character.image}
            alt={character.name}
            className="character-image"
          />
          <div className="character-info">
            <h1>{character.name}</h1>
            <p>Status: {character.status}</p>
            <p>Species: {character.species}</p>
            <p>Gender: {character.gender}</p>
            <p>Origin: {character.origin.name}</p>
            <p>Location: {character.location.name}</p>
            {character.location.type === "Dimension" && (
              <p>Dimension: {character.location.name}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterDetail;
