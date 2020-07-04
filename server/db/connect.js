const mongoose = require("mongoose");

const deprecationOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

const connect = (url, options) => {
  return mongoose.connect(url, {
    ...deprecationOptions,
    ...options,
  });
};

module.exports = { connect };
