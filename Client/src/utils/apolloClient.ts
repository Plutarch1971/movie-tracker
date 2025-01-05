import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: '/graphql',
});
//Create middleware that will add the jwt token to the request headers
const authLink = setContext((_, { headers}) => {
    const token = localStorage.getItem('id_token'); //replaced 'id_token'
    console.log('Token retrieved:', token); //Check if token is being retrieved
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}`: '',
      }
    };
});

//combine authLink and httpLink
//const link = ApolloLink.from([authLink, httpLink]);

//create the Apollo Client
const client = new ApolloClient({
    link: authLink.concat(httpLink),
    //link: link,
    cache: new InMemoryCache(),
});

export default client;


