require("dotenv").config();

const express = require("express");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const app = express();

const {
  AUTH0_API_DOMAIN: auth0Domain,
  AUTH0_API_IDENTIFIER: apiIdentifier,
} = process.env;

app.use(
  jwt({
    /**
     * Dynamically provide a signing key based on the kid
     * in the header and the singing keys provided
     * by the JWKS endpoint.
     */

    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${auth0Domain}/.well-known/jwks.json`,
    }),

    // Validate the audience and the issuer.
    audience: apiIdentifier,
    issuer: `https://${auth0Domain}/`,
    algorithms: ["RS256"],
  })
);

app.get("/private", (req, res) =>
  res.send("Only authenticated users can read this message.")
);

app.listen(3000, () => console.log("Example app listening on port 3000!"));
