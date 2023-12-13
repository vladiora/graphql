import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { useApolloClient } from '@apollo/client'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('login')
  }

  const notify = (message) => {
    window.alert(message)
  }

  const updateToken = (newToken) => {
    setToken(newToken)
    setPage('authors')
  }

  if (!token && !localStorage.getItem('library-user-token')) {
    return (
      <div>
        <h2>Login</h2>
        <LoginForm
          setToken={updateToken}
          setError={notify}
        />
      </div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommend')}>recommend</button>
        <button onClick={logout}>logout</button>
      </div>
      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} setPage={setPage} />

      <Recommend show={page === 'recommend'} />
    </div>
  )
}

export default App
