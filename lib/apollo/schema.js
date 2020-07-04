import { makeExecutableSchema } from "graphql-tools";
import { typeDefs } from "../../server/graphql/schema";
import { resolvers } from "../../server/graphql/resolvers";

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
