const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const next = require("next");
const config = require("config");
const { dbUrl, connect } = require("./db");
const { typeDefs } = require("./graphql/schema");
const { resolvers } = require("./graphql/resolvers");
const { AuthenticationDirective } = require("./graphql/directives");

const { PORT = 3000, NODE_ENV } = process.env;
const IS_DEV = NODE_ENV === "development";
const IS_PROD = NODE_ENV === "production";
const SESSION_SECRET = config.get("sessionSecret");

const nextApp = next({ dev: IS_DEV });
const handle = nextApp.getRequestHandler();

const corsOptions = {
  origin: "*",
  credentials: true,
};
const sessionOptions = {
  name: "qid", // this is the cookie name in the devtools
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: IS_PROD,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
};

nextApp.prepare().then(async () => {
  const expressApp = express();
  expressApp.use(cors(corsOptions));

  // Database
  let databaseConnection;
  try {
    databaseConnection = await connect(dbUrl);
    console.log("✔ Database connected!");
  } catch (error) {
    console.error("❌ could not connect to database: " + error);
  }

  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives: {
      signin: AuthenticationDirective,
    },
    context: async ({ req, res }) => {
      const context = { req, res, db: null, user: null };
      context.db = databaseConnection;
      return context;
    },
  });
  apollo.applyMiddleware({
    app: expressApp,
    path: "/graphql",
    cors: true,
  });

  expressApp.all("*", (req, res) => {
    return handle(req, res);
  });

  expressApp.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Ready on http://localhost:${PORT}`);
  });
});
