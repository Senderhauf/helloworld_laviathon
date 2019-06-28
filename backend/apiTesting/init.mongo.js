const mongo = require("mongodb")
const MongoClient = mongo.MongoClient;

let db;
console.log(`DEBUG: db: ${db}`)

MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/', { useNewUrlParser: true }).then(client => {
  console.log('YEAH')
  return client.db('FIS_Connected');
}).then(connection => {
  db = connection;
  console.log(`DEBUG: db: ${db}`)
}).catch(error => {
  console.log(`DB connection error: ${error}`);
})

db.collection("contacts").insertMany([
  {"name" : "Jim Bob", "email" : "jim.bob@fisglobal.com", "team" : "apex", "position" : "scrum master", "rapport" : 5 },
  {"name" : "Tom Petty", "email" : "tom.petty@fisglobal.com", "team" : "digital one", "position" : "developer", "rapport" : 7 },
  {"name" : "Eddy Murphy", "email" : "eddy.murphy@fisglobal.com", "team" : "apex", "position" : "product owner", "rapport" : 6 },
  {"name" : "Morgan Freeman", "email" : "morgan.freeman@fisglobal.com", "team" : "unified payments", "position" : "developer", "rapport" : 7 },
  {"name" : "Dan Smith", "email" : "dan.smith@fisglobal.com", "team" : "digital one", "position" : "scrum master", "rapport" : 2 },
  {"name" : "Kaity Smith", "email" : "kaity.smith@fisglobal.com", "team" : "apex", "position" : "developer", "rapport" : 5 },
  {"name" : "Morgan Hamm", "email" : "morgan.hamm@fisglobal.com", "team" : "digital one", "position" : "product owner", "rapport" : 6 },
  {"name" : "Paul Hamm", "email" : "paul.hamm@fisglobal.com", "team" : "unified payments", "position" : "developer", "rapport" : 7 }
])

db.contacts.createIndex({email:1});
