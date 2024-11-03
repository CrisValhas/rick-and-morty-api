import React, { useState, useRef, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./characterList.css";
import useDebounce from "../../hooks/useDebounce.ts";
import Skeleton from "../skeleton/skeleton.tsx";

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  origin: { name: string };
  location: { name: string };
  image: string;
}

const GET_CHARACTERS = gql`
  query GetCharacters(
    $page: Int
    $name: String
    $status: String
    $gender: String
  ) {
    characters(
      page: $page
      filter: { name: $name, status: $status, gender: $gender }
    ) {
      info {
        pages
      }
      results {
        id
        name
        status
        species
        gender
        origin {
          name
        }
        location {
          name
        }
        image
      }
    }
  }
`;

const CharacterList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [page, setPage] = useState(Number(queryParams.get("page")) || 1);
  const [filter, setFilter] = useState({
    name: queryParams.get("name") || "",
    status: queryParams.get("status") || "",
    gender: queryParams.get("gender") || "",
  });
  const debouncedFilter = useDebounce(filter, 600);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const {
    loading: pageLoader,
    error,
    data,
  } = useQuery(GET_CHARACTERS, {
    variables: { page, ...debouncedFilter },
  });

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [debouncedFilter]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (filter.name) params.set("name", filter.name);
    if (filter.status) params.set("status", filter.status);
    if (filter.gender) params.set("gender", filter.gender);
    navigate({ search: params.toString() });
  }, [page, filter, navigate]);

  useEffect(() => {
    setLoading(false);
  }, [data]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setPage(1);
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLoading(true);
    setPage(1);
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilter({ name: "", status: "", gender: "" });
    setPage(1);
  };

  if (error) {
    console.log("Failed-api-connect");
    return <div className="skeleton-box">Error: {error.message}</div>;
  }

  const characters: Character[] = data?.characters?.results;
  const totalPages = data?.characters?.info.pages;

  return (
    <div className="container">
      <div className="filter-container">
        <div className="logo-container">Api Rick And Morty</div>
        <button onClick={clearFilters} className="button clear-button">
          Reset
        </button>
      </div>
      <div className="table-body">
        <table className="table">
          <thead className="thead">
            <tr>
              <th>Id</th>
              <th>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={filter.name}
                  onChange={handleFilterChange}
                  className="filter-input"
                  ref={nameInputRef}
                />
              </th>
              <th>
                <select
                  name="status"
                  value={filter.status}
                  onChange={handleDropdownChange}
                  className="filter-input"
                >
                  <option value="">Status</option>
                  <option value="alive">Alive</option>
                  <option value="dead">Dead</option>
                  <option value="unknown">Unknown</option>
                </select>
              </th>
              <th>Species</th>
              <th>
                <select
                  name="gender"
                  value={filter.gender}
                  onChange={handleDropdownChange}
                  className="filter-input"
                >
                  <option value="">Gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="genderless">Genderless</option>
                  <option value="unknown">Unknown</option>
                </select>
              </th>
              <th>Origin</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {loading || pageLoader ? (
              <Skeleton nColumnas={11} />
            ) : characters.length ? (
              characters.map((character) => (
                <tr key={character.id}>
                  <td className="link">
                    {character.id}
                    <img
                      src={character.image}
                      alt={character.name}
                      className="character-image-list"
                    />
                  </td>
                  <td>
                    <Link
                      className="link"
                      to={`/character/${character.id}?page=${page}&name=${filter.name}&status=${filter.status}&gender=${filter.gender}`}
                    >
                      {character.name}
                    </Link>
                  </td>
                  <td>{character.status}</td>
                  <td>{character.species}</td>
                  <td>{character.gender}</td>
                  <td>{character.origin.name}</td>
                  <td>{character.location.name}</td>
                </tr>
              ))
            ) : (
              <div className="empty-container">sin resultados</div>
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination-container">
        <button
          onClick={() => setPage(page - 1)}
          className="button"
          disabled={page === 1}
        >
          Previous
        </button>
        <span>{`${page} ${totalPages ? "of" : ""} ${
          totalPages ? totalPages : ""
        }`}</span>
        <button
          onClick={() => setPage(page + 1)}
          className="button"
          disabled={!totalPages || page === totalPages}
        >
          Next
        </button>
        {!totalPages && !(loading || pageLoader) && (
          <button
            onClick={() => {
              clearFilters();
              window.history.back();
            }}
            className="button"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
};

export default CharacterList;
