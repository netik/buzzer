const { gql } = require('apollo-server-express');

const User = gql`
  type User {
    id: ID
    firstName: String
    lastName: String
    email: String
  }

  type Query {
    currentUser: User
  }

  type AuthPayload {
    user: User
  }

  type Mutation {
    signup(firstName: String!, lastName: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    logout: Boolean
  }
`;

module.exports = User;
