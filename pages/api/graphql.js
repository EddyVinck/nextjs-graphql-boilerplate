import { ApolloServer } from "apollo-server-micro";
import { AuthenticationDirective } from "../../server/graphql/directives";
import Cors from "micro-cors";
import { getUserFromReq } from "../../server/utils/auth";
import { schema } from "../../lib/apollo/schema";
import { database } from "../../middlewares/database";

const apolloServer = new ApolloServer({
  schema,
  schemaDirectives: {
    signin: AuthenticationDirective,
  },
  context: async ({ req, res }) => {
    const ctx = { req, res, db: null, user: null };
    ctx.db = req.db;
    console.log({ "ctx.db": ctx.db });
    const user = await getUserFromReq(req);
    ctx.user = user;

    return ctx;
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  allowMethods: ["GET", "POST", "OPTIONS"],
});

const apollo = apolloServer.createHandler({ path: "/api/graphql" });

const handler = database(cors(apollo));

export default handler;
