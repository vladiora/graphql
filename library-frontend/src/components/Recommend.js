import { useQuery, useSubscription} from "@apollo/client"
import { ALL_BOOKS, BOOK_ADDED, GET_BOOKS, GET_FAVORITE_GENRE } from "../queries"
import { useEffect, useState } from "react"
import { updateCache } from "../App"

const Recommend = (props) => {
	const [genre, setGenre] = useState(null)
	const favoriteGenre = useQuery(GET_FAVORITE_GENRE)
	const books = useQuery(genre ? GET_BOOKS : ALL_BOOKS,
		{
		  variables: { genre: genre },
		})

	useEffect(() => {

		if (!favoriteGenre.loading && favoriteGenre.data) {
		  setGenre(favoriteGenre.data.me.favoriteGenre)
		}
	}, [favoriteGenre.data, favoriteGenre.loading])

	useSubscription(BOOK_ADDED, {
		onData: ({ data, client }) => {

		  const addedBook = data.data.bookAdded;

		  updateCache(client.cache, { query: ALL_BOOKS }, addedBook)

		  if (addedBook.genres.includes(genre))
			updateCache(client.cache, { query: GET_BOOKS, variables: {genre: genre} }, addedBook)

		}
	  })

	if (!props.show) {
		return null
	}

	if (books.loading) {
		return <div>loading books...</div>
	}

	return (
		<div>
		<h2>Recommendations</h2>

		<table>
			<tbody>
				<tr>
					<th></th>
					<th>author</th>
					<th>published</th>
				</tr>
				{books.data.allBooks.map((a) => (
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

export default Recommend
