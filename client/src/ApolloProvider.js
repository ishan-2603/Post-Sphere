import React from 'react';
import App from './App';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';


const httpLink = createHttpLink({
  uri: 'http://localhost:5000/graphql'
});

const authLink=setContext(() => {
  const token=localStorage.getItem('jwtToken');
  return {
    headers:{
      Authorization: token ? `Bearer ${token}` : ''
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});



export default function ApolloApp() {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
}
