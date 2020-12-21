const { v4: uuidv4 } = require('uuid');

const resolvers = {
  Query: {
    currentUser: (parent, args, context) => context.getUser(),
  },
  Mutation: {
    signup: async (parent, { firstName, lastName, email, password }, context) => {
      const existingUsers = context.User.getUsers();
      const userWithEmailAlreadyExists = !!existingUsers.find(user => user.email === email);

      if (userWithEmailAlreadyExists) {
        throw new Error('User with email already exists');
      }

      const newUser = {
        id: uuidv4(),
        firstName,
        lastName,
        email,
        password,
      };

      context.User.addUser(newUser);

      await context.login(newUser);

      return { user: newUser };
    },
    login: async (parent, { email, password }, context) => {
      const { user } = await context.authenticate('graphql-local', { email, password });
      await context.login(user);
      return { user }
    },
    logout: (parent, args, context) => context.logout(),
  },
};

module.exports = resolvers;