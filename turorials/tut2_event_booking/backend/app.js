const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const graphiqlSchema = require("./graphql/schema/index");
const graphiqlResolvers = require("./graphql/resolvers/index");
const isAuth=require("./middleware/isAuth");
const dotenv=require("dotenv");

const app = express();

dotenv.config();

app.use(bodyParser.json());

app.use(isAuth);

app.use("/graphql", graphqlHTTP({
    schema: graphiqlSchema,
    rootValue: graphiqlResolvers,
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.d4myjah.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => {
        app.listen(5000, () => {
            console.log("Listening on port: 5000");
        });
    })
    .catch(err => {
        console.log(err);
    });