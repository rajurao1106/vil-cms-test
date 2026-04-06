import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
  {
    username: { type: String },
    password: { type: String },
  },
  { timestamps: true }, 
);

const Auth =
  mongoose.models.Authentcation || mongoose.model("Authentication", authSchema);
export default Auth;
 