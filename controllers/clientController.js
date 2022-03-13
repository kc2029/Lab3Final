const { Client } = require("../models/entities");

const loginControl = (request, response) => {
  const clientServices = require("../services/clientServices");
  console.log("-----------00------------");
  console.log(request.body.username);
  console.log(request.body.password);
  let username = request.body.username;
  let password = request.body.password;
  if (!username || !password) {
    response.render("log_regis", { username: "failed" });
  } else {
    if (request.session && request.session.user) {
      response.render("login_post", { username: username });
    } else {
      clientServices.loginService(username, password, function (
        err,
        dberr,
        client
      ) {
        console.log("Client from login service :" + JSON.stringify(client));
        if (client === null) {
          //console.log("Auhtentication problem!");
          response.render("log_regis", { username: "failed" });
        } else {
          console.log("User from login service :" + client[0].num_client);
          //add to session
          request.session.user = username;
          request.session.num_client = client[0].num_client;
          //request.session.admin = false;
          response.render("login_post", { username: username });
        }
      });
    }
  }
};

const registerControl = (request, response) => {
  const clientServices = require("../services/clientServices");

  let username = request.body.username;
  let password = request.body.passwsord;
  let society = request.body.society;
  let contact = request.body.contact;
  let addres = request.body.addres;
  let zipcode = request.body.zipcode;
  let city = request.body.city;
  let phone = request.body.phone;
  let fax = request.body.fax;
  let max_outstanding = request.body.max_outstanding;
  let client = new Client(
    username,
    password,
    0,
    society,
    contact,
    addres,
    zipcode,
    city,
    phone,
    fax,
    max_outstanding
  );

  clientServices.registerService(client, function (err, exists, insertedID) {
    console.log("User from register service :" + insertedID);
    if (exists) {
      console.log("Username taken!");
      response.send(
        `registration failed. Username (${username}) already taken!`
      ); //invite to register
    } else {
      client.num_client = insertedID;
      console.log(`Registration (${username}, ${insertedID}) successful!`);
      response.send(
        `Successful registration ${client.contact} (ID.${client.num_client})!`
      );
    }
    response.end();
  });
};

const getClients = (request, response) => {
  const clientServices = require("../services/clientServices");
  clientServices.searchService(function (err, rows) {
    response.json(rows);
    response.end();
  });
};

const getClientByNumclient = (request, response) => {
  const clientServices = require("../services/clientServices");
  let num_client = request.params.num_client;
  clientServices.searchNumclientService(num_client, function (err, rows) {
    response.json(rows);
    response.end();
  });
};

module.exports = {
  loginControl,
  registerControl,
  getClients,
  getClientByNumclient
};
