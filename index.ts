import express, { Application, Request, Response } from "express";
import { itemRouter } from "./routes";

const app: Application = express();

const port = 3000;
//  We just created a server!

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// use function specifies if we are to use express and json

app.use("/cart-items", itemRouter);
// anything with /items will be sent to itemRouter

app.listen(port, (): void => {
  console.log(`Listening on port ${port}`);
});
// listen takes two parameters
