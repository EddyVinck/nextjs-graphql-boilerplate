import { ApolloServer } from "apollo-server-micro";
import { typeDefs } from "../../server/graphql/schema";
import { resolvers } from "../../server/graphql/resolvers";
import { AuthenticationDirective } from "../../server/graphql/directives";
import { connect, dbUrl } from "../../server/db";
import { createSampleDataIfDbEmpty } from "../../server/db/utils/createSampleData";
import _config from "config";
import Cors from "micro-cors";
import { getUserFromReq } from "../../server/utils/auth";
import { schema } from "../../lib/apollo/schema";

const { PORT, NODE_ENV } = process.env;
const IS_DEV = NODE_ENV === "development";
const IS_PROD = NODE_ENV === "production";
const MONGOOSE_STATE_CONNECTED = 1;

// Database
let databaseConnection;

const createDatabaseConnection = async () => {
  try {
    if (!databaseConnection) {
      databaseConnection = await connect(dbUrl);
      if (IS_DEV && databaseConnection) {
        createSampleDataIfDbEmpty();
      }

      console.log("✔ Database connected!");
    }
  } catch (error) {
    console.error("❌ could not connect to database.");
    console.error("Reason: " + error);
  }
};

createDatabaseConnection();

// GraphQL
const apolloServer = new ApolloServer({
  schema,
  schemaDirectives: {
    signin: AuthenticationDirective,
  },
  context: async ({ req, res }) => {
    const ctx = { req, res, db: null, user: null };
    ctx.db = databaseConnection;
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

// const cors = Cors({
//   allowMethods: ["GET", "POST", "OPTIONS"],
// });

const handler = apolloServer.createHandler({ path: "/api/graphql" });

// export default cors(handler);
export default handler;
