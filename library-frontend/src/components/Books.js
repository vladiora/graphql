import { useQuery, useLazyQuery } from "@apollo/client"
import { ALL_BOOKS, ALL_GENRES, GET_BOOKS } from "../queries"
import Select from 'react-select';
import { useEffect, useState } from "react";

const Books = (props) => {
  const [ selGenre, setSelGenre ] = useState('All Genres')
  const allBooks = useQuery(ALL_BOOKS)
  const [getBooks, { loading, error, data }] = useLazyQuery(GET_BOOKS)
  const genres = useQuery(ALL_GENRES)

  useEffect(() => {

      if (selGenre !== 'All Genres') {
        getBooks({ variables: { genre: selGenre } });
      }
    }, [allBooks.loading])

  if (!props.show) {
    return null
  }

  if (allBooks.loading || loading) {
    return <div>loading books...</div>
  }

  if (error)
    window.alert(error.message)

  const filterBooks = (selected) => {

    setSelGenre(selected)

    // Fetch books based on the selected genre using the lazy query
    if (selected !== 'All Genres') {
      getBooks({ variables: { genre: selected } });
    }
  }

  const options = ['All Genres', ...genres.data.allGenres].map((genre) => ({ value: genre, label: genre }));

  return (
    <div>
      <h2>books</h2>

      <Select
        options={options}
        value={selGenre ? { value: selGenre, label: selGenre } : null}
        onChange={(selectedOption) => filterBooks(selectedOption?.value || null)}
        placeholder="Select a genre"
      />

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {(selGenre === 'All Genres' ? allBooks.data.allBooks : data.allBooks).map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
