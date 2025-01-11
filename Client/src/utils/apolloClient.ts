import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';

// Create the http link
const httpLink = createHttpLink({
    uri: '/graphql',
});

// Create auth middleware
const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('id_token');
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        }
    };
});

// Create retry link with exponential backoff
const retryLink = new RetryLink({
    delay: {
        initial: 1000, // Initial delay of 1 second
        max: 10000,    // Maximum delay of 10 seconds
        jitter: true   // Add randomness to the delay
    },
    attempts: {
        max: 3,        // Maximum number of retry attempts
        retryIf: (error, _operation) => {
            const doNotRetry = !error || error.statusCode === 400 || error.statusCode === 401;
            return !doNotRetry;
        },
    }
});

// Create error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) => {
            console.error(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            );
        });
    }

    if (networkError) {
        console.error(`[Network error]: ${networkError}`);
    }

    // Return forward(operation) to retry the operation
    return forward(operation);
});

// Combine all links
const link = from([
    retryLink,
    errorLink,
    authLink,
    httpLink
]);

// Create the Apollo Client
const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'network-only',
            nextFetchPolicy: 'cache-first', // Use cache after initial load
            errorPolicy: 'all',             // Handle errors without killing the whole request
        },
        query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
        },
        mutate: {
            errorPolicy: 'all',
        },
    },
    connectToDevTools: process.env.NODE_ENV === 'development', // Enable Apollo dev tools in development
});

export default client;

