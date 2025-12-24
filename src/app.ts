import express, { Application } from "express";
import emailRoutes from "./emails/route";

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/emails", emailRoutes);



export default app;
