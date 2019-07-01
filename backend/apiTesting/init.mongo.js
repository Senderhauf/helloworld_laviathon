const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
//const MongoClient = mongo.MongoClient;

const url = 'mongodb://localhost:27017/';

//let db;
//console.log(`DEBUG: db: ${db}`)

MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  const db = client.db("FIS_Connected");
  db.collection("contacts").insertMany([
    {name : "Jim Bob", email : "jim.bob@fisglobal.com", team : "apex", position : "scrum master", rapport : 5, lastInteraction : "2019-06-17T11:49:41.753Z" },
    {name : "Tom Petty", email : "tom.petty@fisglobal.com", team : "digital one", position : "developer", rapport : 7, lastInteraction : "2019-06-17T11:49:41.753Z" },
    {name : "Eddy Murphy", email : "eddy.murphy@fisglobal.com", team : "apex", position : "product owner", rapport : 6, lastInteraction : "2019-06-17T11:49:41.753Z" },
    {name : "Morgan Freeman", email : "morgan.freeman@fisglobal.com", team : "unified payments", position : "developer", rapport : 7, lastInteraction : "2019-06-22T09:49:41.753Z" },
    {name : "Dan Smith", email : "dan.smith@fisglobal.com", team : "digital one", position : "scrum master", rapport : 2, lastInteraction : "2019-06-26T09:49:41.753Z" },
    {name : "Kaity Smith", email : "kaity.smith@fisglobal.com", team : "apex", position : "developer", rapport : 5, lastInteraction : "2019-06-25T09:49:41.753Z"  },
    {name : "Morgan Hamm", email : "morgan.hamm@fisglobal.com", team : "digital one", position : "product owner", rapport : 6, lastInteraction : "2019-06-24T09:49:41.753Z"  },
    {name : "Paul Hamm", email : "paul.hamm@fisglobal.com", team : "unified payments", position : "developer", rapport : 7, lastInteraction : "2019-06-23T09:49:22.753Z"  },
    {name : "test1", email : "test1@fisglobal.com", team : "unified payments", position : "developer", rapport : 7, lastInteraction : "2019-06-23T09:49:22.753Z"  },
    {name : "test2", email : "test2@fisglobal.com", team : "unified payments", position : "developer", rapport : 7, lastInteraction : "2019-06-23T09:49:22.753Z"  },
    {name : "test3", email : "test3@fisglobal.com", team : "unified payments", position : "developer", rapport : 7, lastInteraction : "2019-06-23T09:49:22.753Z"  },
    {name : "test4", email : "test4@fisglobal.com", team : "unified payments", position : "developer", rapport : 7, lastInteraction : "2019-06-23T09:49:22.753Z"  },
    {name : "test5", email : "test5@fisglobal.com", team : "unified payments", position : "developer", rapport : 7, lastInteraction : "2019-06-23T09:49:22.753Z"  },
    {name : "test6", email : "test6@fisglobal.com", team : "unified payments", position : "developer", rapport : 7, lastInteraction : "2019-06-23T09:49:22.753Z"  },
    {name : "test7", email : "test7@fisglobal.com", team : "unified payments", position : "developer", rapport : 7, lastInteraction : "2019-06-23T09:49:22.753Z"  },
    {name : "test8", email : "test8@fisglobal.com", team : "unified payments", position : "developer", rapport : 7, lastInteraction : "2019-06-23T09:49:22.753Z"  },
    {name : "test9", email : "test9@fisglobal.com", team : "unified payments", position : "developer", rapport : 7, lastInteraction : "2019-06-23T09:49:22.753Z"  }
  ])
  db.collection("contacts").createIndex({email:1});

  db.collection("interactions").insertMany([
    { eventType: "Lunch", eventQualtity: 5, eventLocation: "Davians", startTime: "2019-06-22T09:49:41.753Z", endTime: "2019-06-22T10:49:41.753Z", members : ["kaity.smith@fisglobal.com", "eddy.murphy@fisglobal.com"], uniqueStamp: "Davians_2019-06-22T09:49:41.753Z"},
    { eventType: "Coffee", eventQualtity: 3, eventLocation: "Davians", startTime: "2019-06-26T09:49:41.753Z", endTime: "2019-06-26T10:49:41.753Z", members : ["morgan.hamm@fisglobal.com", "eddy.murphy@fisglobal.com"], uniqueStamp: "Davians_2019-06-26T09:49:41.753Z"}
 ])

  client.close();
});


/* MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/', { useNewUrlParser: true }).then(client => {
  console.log('YEAH')
  return client.db('FIS_Connected');
}).then(connection => {
  db = connection;
  console.log(`DEBUG: db: ${db}`)
}).catch(error => {
  console.log(`DB connection error: ${error}`);
}) */


