import { Router } from "express";
import { emailController } from "./controller";

const emailRoutes = Router();

emailRoutes.get("/", (req, res) => {
  res.send("Email route is working");
});

emailRoutes.get("/order-status/:invoiceType/:invoiceNo", emailController.getOrderStatus);
emailRoutes.post("/inbound", (req, res) => {
  // Handle inbound email processing here
  res.status(200).send("Inbound email received");
});

export default emailRoutes;