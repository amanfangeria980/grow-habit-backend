import { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

export default function swagger(app: Express) {
  const options: swaggerJsdoc.Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Grow Habit API",
        version: "0.0.1",
        description: "API documentation for the Grow Habit application",
      },
      servers: [
        {
          url: process.env.BACKEND_URL || "http://localhost:3000",
          description: "Development server",
        },
      ],
    },
    apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
  };

  const swaggerSpec = swaggerJsdoc(options);

  // Serve swagger docs
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Serve swagger spec in JSON format
  app.get("/api-docs-json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(
    `\x1b[32m \n Documentation is Visible at ${process.env.BACKEND_URL}/api-docs \n\x1b[0m`
  );
}
