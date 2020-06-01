const {
  SchemaDirectiveVisitor,
  AuthenticationError,
} = require("apollo-server-express");
const { defaultFieldResolver } = require("graphql");

class AuthenticationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async (root, args, ctx, info) => {
      if (!ctx.user || !ctx.user.id) {
        throw new AuthenticationError("You must be logged in to do this");
      }
      return resolve(root, args, ctx, info);
    };
  }
}

module.exports = { AuthenticationDirective };
