import express, { Express, Request, Response } from "express";

const app: Express = express();
const port: number = 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Grow Habit Backend!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
