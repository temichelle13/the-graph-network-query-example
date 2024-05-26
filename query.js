// Import necessary libraries
const { ApolloClient, InMemoryCache, HttpLink, gql } = require('@apollo/client');
const fetch = require('node-fetch');
require('dotenv').config();

// Ensure API_KEY is set in the environment variables
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.error("API_KEY is not set in the environment variables");
  process.exit(1);
}

// Create an instance of HttpLink that connects to your GraphQL API
const link = new HttpLink({
  uri: `https://gateway-arbitrum.network.thegraph.com/api/${API_KEY}/subgraphs/id/CBf1FtUKFnipwKVme36mHyeMtkuhjmh4KHzY3uWNNq5ow`,
  fetch
});

// Create the Apollo Client instance
const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
});

// Define a GraphQL query
const GET_USER_PROFILES = gql`
  query GetUserProfiles {
    userProfiles(
      where: {
        transactionCount_gt: 50,
        cryptocurrencyBalance_gt: 1000
      },
      orderBy: cryptocurrencyBalance,
      orderDirection: desc
    ) {
      id
      username
      transactionCount
      cryptocurrencyBalance
      transactions {
        id
        amount
        timestamp
      }
    }
  }
`;

/**
 * Fetch data from the GraphQL API
 */
async function fetchData() {
  try {
    const result = await client.query({
      query: GET_USER_PROFILES
    });
    console.log(result.data.userProfiles);
  } catch (error) {
    console.error("Error fetching data: ", error.message);
  }
}

// Call the function to fetch data
fetchData();