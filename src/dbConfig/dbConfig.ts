import mongoose from "mongoose";

export default async function connect() {
  try {
    mongoose.connect(process.env.MONGODB_URL!);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("Connected to database sucessfully");
    });

    connection.on("error", (error) => {
      console.log("Error connecting to database: ", error);
    });
  } catch (error) {
    console.log(
      "Error connecting to database: ",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}
