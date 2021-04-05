import mongoose, { Schema, model, Model, Document } from "mongoose";

const UserSchema: Schema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    firstName: {
      type: String,
      default: false,
    },
    lastName: {
      type: String,
      default: false,
    },
    email: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);
// defining interface
export interface IUser extends Document {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  email?: string;
}
// Define the mongoose document from the schema
const Users: Model<IUser> = model<IUser>("users", UserSchema);
export default Users;
