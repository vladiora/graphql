const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
	Query: {

		bookCount: async () => Book.collection.countDocuments(),

		authorCount: async () => Author.collection.countDocuments(),

		allBooks: async (root, args) => {

			const filter = {}

			if (args.author) {
				const author = await Author.findOne({name: args.author})

				if (!author)
					return []

				filter.author = author._id
			}

			if (args.genre)
				filter.genres = args.genre

			return Book.find(filter).populate('author', { name: 1, born: 1 })
		},

		allAuthors: async () => {
			const authors = await Author.aggregate([
				{
				  $lookup: {
					from: 'books',
					localField: '_id',
					foreignField: 'author',
					as: 'books',
				  },
				},
				{
				  $addFields: {
					bookCount: { $size: '$books' },
				  },
				},
			])

			return authors.map((author) => ({
				...author,
				id: author._id.toString(), // Convert _id to string to match GraphQL ID type
			}));
		},

		me: (root, args, context) => {
			return context.currentUser
		},

		allGenres: async () => {

			const allBooks = await Book.find({}, { genres: 1, _id: 0 });
			const allGenres = allBooks.reduce((genres, book) => {
				return genres.concat(book.genres);
			}, []);

			// Remove duplicates
			return [...new Set(allGenres)];
		}
	},
	Mutation: {

		addBook: async (root, args, { currentUser }) => {

			if (!currentUser) {

				throw new GraphQLError('not authenticated', {
					extensions: {
						code: 'BAD_USER_INPUT',
					}
				})
			}

			let author = await Author.findOne({name: args.author})

			if (!author) {
				author = new Author({name: args.author})
				try {
					await author.save()
				} catch (error) {
					throw new GraphQLError('Saving author failed', {
						extensions: {
							code: 'BAD_USER_INPUT',
							invalidArgs: args.author,
							error
						}
					})
				}
			}

			const book = new Book({ ...args, author: author._id})

			try {
				await book.save()
			} catch (error) {
				throw new GraphQLError('Saving book failed', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args.book,
						error
					}
				})
			}

			await book.populate('author', { name: 1, born: 1 })

			pubsub.publish('BOOK_ADDED', { bookAdded: book })

			return book
		},

		editAuthor: async (root, args, { currentUser }) => {

			if (!currentUser) {

				throw new GraphQLError('not authenticated', {
					extensions: {
						code: 'BAD_USER_INPUT',
					}
				})
			}

			const author = await Author.findOne({name: args.name})

			if (!author)
				return null

			author.born = args.setBornTo
			await author.save()

			const count = await Book.countDocuments({author: author._id})
			author.bookCount = count

			return author
		},

		createUser: async (root, args) => {

			const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

			return user.save()
			  .catch(error => {
					throw new GraphQLError('Creating the user failed', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args.username,
						error
					}
					})
			  })
		},

		login: async (root, args) => {

			const user = await User.findOne({ username: args.username })

			if ( !user || args.password !== 'secret' ) {
				throw new GraphQLError('wrong credentials', {
					extensions: {
					code: 'BAD_USER_INPUT'
					}
				})
			}

			const userForToken = {
				username: user.username,
				favoriteGenre: user.favoriteGenre,
				id: user._id,
			}

			return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
		},
	},
	Subscription: {
		bookAdded: {
		  subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
		},
	},
}

module.exports = resolvers
