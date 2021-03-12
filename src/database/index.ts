const { MONGO_DATABASE_NAME, MONGO_PASSWORD, MONGO_USER_NAME } = process.env;

export const dbConnection = {
  url: `mongodb+srv://${MONGO_USER_NAME}:${MONGO_PASSWORD}@main.glmzg.mongodb.net/${MONGO_DATABASE_NAME}?retryWrites=true&w=majority`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
};
