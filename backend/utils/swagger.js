const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { version } = require("../package.json");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Travel Agency REST API docs",
      version,
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: "http",
          schema: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./index.js",
    "./models/travelStory.model.js",
    "./models/user.model.js",
  ],
};

const swaggerSpec = swaggerJsDoc(options);

function swaggerDocs(app) {
  //Swagger page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  //Docs in JSON format
  app.get("/docs.json", (_, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}

module.exports = swaggerDocs;
