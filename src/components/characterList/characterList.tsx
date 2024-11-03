import React, { useState, useRef, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import './characterList.css';
import useDebounce from '../../hooks/useDebounce.ts';

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
  query GetCharacters($page: Int, $name: String, $status: String, $gender: String) {
    characters(page: $page, filter: { name: $name, status: $status, gender: $gender }) {
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
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({ name: '', status: '', gender: '' });
  const debouncedFilter = useDebounce(filter, 600);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const history = useNavigate();
  const [loading, setLoading] = useState(false);
  const { loading: pageLoader, error, data } = useQuery(GET_CHARACTERS, {
    variables: { page, ...debouncedFilter },
  });

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [debouncedFilter]);
  useEffect(() => {
    setLoading(false)
  }, [data]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPage(1);
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLoading(true)
    setPage(1);
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setLoading(true)
    setFilter({ name: '', status: '', gender: '' });
    setPage(1);
  };

  if (error) {
    console.log("Failed-api-connect")
    return <div className="skeleton-box">Error: {error.message}</div>
  };

  const characters: Character[] = data?.characters?.results;
  const totalPages = data?.characters?.info.pages;

  return (
    <div className="container">
      <div className="filter-container">
        <div className='logo-container'> Api Rick And Morty</div>
        <button onClick={clearFilters} disabled={(filter.gender === '' && filter.name === '' && filter.status === '')} className="button clear-button">Clear Filters</button>
      </div>
      <div className='table-body'>
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
          <tbody >
            {(loading || pageLoader) ? <div className="skeleton-container">
              {Array.from({ length: 10 }, (_, index) => (
                <div className="skeleton-box" key={index} />
              ))}
              <p>Loading...</p>
            </div> : characters.length ? characters?.map((character) => (
              <tr key={character.id}>
                <td className='link'>
                  {character.id}
                  <img src={character.image} alt={character.name} className="character-image-list" />
                </td>
                <td>
                  <Link className='link' to={`/character/${character.id}`}>
                    {character.name}
                  </Link>
                </td>
                <td>{character.status}</td>
                <td>{character.species}</td>
                <td>{character.gender}</td>
                <td>{character.origin.name}</td>
                <td>{character.location.name}</td>
              </tr>
            )) : <div className="empty-container">sin resultados</div>}
          </tbody>

        </table>
      </div>
      {totalPages ?
        (<div className="pagination-container">
          <button onClick={() => setPage(page - 1)} className="button" disabled={page === 1}>
            Previous
          </button>
          <span>{`${page} ${totalPages ? 'of' : ''} ${totalPages ? totalPages : ''}`}</span>
          <button onClick={() => setPage(page + 1)} className="button" disabled={!totalPages || page === totalPages}>
            Next
          </button>
        </div>) : !(loading || pageLoader) && (<div className="container">
          <button
            onClick={() => (history('/'), clearFilters())}
            className="button"
          >
            Back
          </button>
        </div>)}
    </div>
  );

};

export default CharacterList;
