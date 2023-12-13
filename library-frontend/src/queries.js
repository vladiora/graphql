import { gql } from "@apollo/client";

export const ALL_BOOKS = gql(`
query {
  allBooks {
    title
    author {
      name
    }
    published
    id
  }
}
`)

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
    title
    published
    author {
      name
    }
    id
  }
}
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
