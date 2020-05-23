import mongoose from "mongoose";
import { connect, dbUrl } from "../server/db";
import { createSampleDataIfDbEmpty } from "../server/db/utils/createSampleData";

const { NODE_ENV } = process.env;
const IS_DEV = NODE_ENV === "development";
const MONGOOSE_CONNECTED = 1;

let connection = null;
// TODO: make sure the Mongoose models are ready as well?
export const database = (handler) => async (req, res, ...restArgs) => {
  console.log("database handler");
  if (mongoose.connection.readyState !== MONGOOSE_CONNECTED) {
    console.log("connecting!");
    connection = await connect(dbUrl);
    console.log("connected!", !!connection);

    if (IS_DEV && connection) {
      await createSampleDataIfDbEmpty();
    }
  }
  req.db = connection;

  console.log(mongoose.models);

  console.log(
    mongoose.connection.readyState,
    mongoose.connection.readyState === MONGOOSE_CONNECTED
  );
  console.log("calling handler");
  return handler(req, res, ...restArgs);
};
