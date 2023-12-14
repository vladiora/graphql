import { useMutation, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const Authors = (props) => {
	const [name, setName] = useState('')
	const [born, setBorn] = useState('')

	const authors = useQuery(ALL_AUTHORS)
	const [editAuthor, result] = useMutation(EDIT_AUTHOR)

	useEffect(() => {
		if (result.data && result.data.editAuthor === null) {
		alert('author not found')
		}
	}, [result.data])

	if (authors.loading) {
		return <div>loading authors...</div>
	}

	if (!props.show) {
		return null
	}

	const submit = (event) => {
		event.preventDefault()

		editAuthor({variables: {name, setBornTo: Number(born)}})

		setName('')
		setBorn('')
	}

	const options = authors.data.allAuthors.map(author => {return {value: author.name, label: author.name}})

	return (
		<div>
		<h2>authors</h2>
		<table>
			<tbody>
			<tr>
				<th></th>
				<th>born</th>
				<th>books</th>
			</tr>
			{authors.data.allAuthors.map((a) => (
				<tr key={a.name}>
				<td>{a.name}</td>
				<td>{a.born}</td>
				<td>{a.bookCount}</td>
				</tr>
			))}
			</tbody>
		</table>
		<h3>Set birthyear</h3>
		<form onSubmit={submit}>
			<div>
				<Select
					defaultValue={{value: '', label: ''}}
					value={{value: name, label: name}}
					onChange={(option) => setName(option.value)}
					options={options}
				/>
			</div>
			<div>
			born
			<input
				type="number"
				value={born}
				onChange={({ target }) => setBorn(target.value)}
			/>
			</div>
			<button type='submit'>update author</button>
		</form>
		</div>
	)
}

export default Authors
