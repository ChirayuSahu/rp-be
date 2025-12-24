import { Request, Response } from "express";
import { orderStatus } from "./services";
import { sendOrderStatusEmail } from "../utils/mailer";

export async function getOrderStatus(req: Request, res: Response) {
    const { invoiceType, invoiceNo } = req.params;

    try {
        const result = await orderStatus(invoiceType, invoiceNo);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function handleInboundEmail(req: Request, res: Response) {
  const { from, subject = "", body = "" } = req.body;

  const content = `${subject} ${body}`;

  const match = content.match(/\b[A-Z]+-\d+\b/i);

  if (!match) {
    return res.sendStatus(200);
  }

  const orderId = match[0].toUpperCase();

  const [type, number] = orderId.split("-");

  const order = await orderStatus(type, number);

  if(order.status !== 'Invalid'){
    await sendOrderStatusEmail(from, {
      name: order.name,
      invType: order.invType,
      invNo: order.invNo,
      status: order.status
    });
  }

  res.sendStatus(200);
}


export * as emailController from "./controller";