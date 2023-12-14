import { gql } from "@apollo/client";

const BOOK_DETAILS = gql`
fragment BookDetails on Book {
  title
  author {
    name
  }
  published
  id
}
`

export const ALL_BOOKS = gql`
query {
  allBooks {
    ...BookDetails
  }
}
${BOOK_DETAILS}
`

export const ADD_BOOK = gql`
mutation($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
  addBook(title: $title, author: $author, published: $published, genres: $genres) {
    ...BookDetails
  }
}
${BOOK_DETAILS}
`

export const LOGIN = gql`
mutation login($username: String!, $password: String!) {
  login(username: $username, password: $password)  {
    value
  }
}
`
export const GET_BOOKS = gql`
query Query($genre: String) {
  allBooks(genre: $genre) {
    ...BookDetails
  }
}
${BOOK_DETAILS}
`
export const ALL_GENRES = gql`
query Query {
  allGenres
}
`

export const GET_FAVORITE_GENRE = gql`
query Query {
  me {
    favoriteGenre
  }
}
`

export const BOOK_ADDED = gql`
subscription {
  bookAdded {
    ...BookDetails
    genres
  }
}
${BOOK_DETAILS}
`
export const ALL_AUTHORS = gql`
query {
	allAuthors {
	  name
	  born
	  bookCount
	  id
	}
}
`
export const EDIT_AUTHOR = gql`
mutation($name: String!, $setBornTo: Int!) {
  editAuthor(name: $name, setBornTo: $setBornTo) {
    name
    born
    bookCount
    id
  }
}
`
