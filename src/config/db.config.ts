import * as mongoose from "mongoose";
export const db = () => {
  return mongoose.connect(
    `mongodb+srv://voltron1234:fn2F57cxPON5wuZF@cluster0.htylr.mongodb.net/hms?retryWrites=true&w=majority&socketTimeoutMS=360000&connectTimeoutMS=360000`,
    {
      useCreateIndex: true,
      useFindAndModify: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
};
