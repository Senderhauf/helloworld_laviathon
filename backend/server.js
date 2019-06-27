const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

let db;
const app = express();
const port = 3000;



// Start MongoDB instance.
// const spawn = require('child_process').spawn;
// const pipe = spawn('mongod')

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.json())

MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/', { useNewUrlParser: true }).then(client => {
  return client.db('FIS_Connected');
}).then(connection => {
  db = connection;
  app.listen(port, () => {
    console.log('App started on port ' + port);
  });
}).catch(error => {
  console.log('ERROR:', error);
});


//Contact API

app.get('/api/contacts', (req, res) => {
  db.collection('contacts').find().toArray().then(contacts => {
    const metadata = { total_count: contacts.length };
    res.json({ _metadata: metadata, contacts: contacts });
  }).catch(error => {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error: ${error}` });
  })
})

app.get('/api/contacts/:email', (req, res) => {
  db.collection('contacts').find({ email: req.params.email }).toArray().then(contacts => {
    const metadata = { total_count: contacts.length };
    res.json({ _metadata: metadata, contacts: contacts });
  }).catch(error => {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error: ${error}` });
  })
})

app.post('/api/contact', (req, res) => {
  const newContact = req.body;
  db.collection('contacts').updateOne({ email: newContact.email }, { $set: newContact }, { upsert: true }).then(result => {
    console.log(`modified count: ${result.modifiedCount}`)
    console.log(`matched count: ${result.matchedCount}`)

    if (!(result.matchedCount === 0 && result.modifiedCount === 0)) {
      throw Error('Contact Exists Already')
    }
    console.log(`result.upsertedId: ${result.upsertedId._id}`)
    var o_id = new mongo.ObjectID(result.upsertedId._id)
    console.log(`objectid: ${o_id}`)
    return db.collection('contacts').find({ _id: o_id }).limit(1).next()
  }
  ).then(newContact => {
    console.log(`server newContact: ${JSON.stringify(newContact)}`)
    res.json(newContact);
  }).catch(error => {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error: ${error}` });
  });
})

// app.delete @ route: /api/contact/:contactID


//Interaction API

app.get('/api/interactions', (req, res) => {
  db.collection('interactions').find().toArray().then(interactions => {
    const metadata = { total_count: interactions.length };
    res.json({ _metadata: metadata, interactions: interactions });
  }).catch(error => {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error: ${error}` });
  })
})

app.get('/api/interactions/:id', (req, res) => {
  db.collection('contacts').find({ id: req.params.id }).toArray().then(interactions => {
    const metadata = { total_count: interactions.length };
    res.json({ _metadata: metadata, interactions: interactions });
  }).catch(error => {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error: ${error}` });
  })
})

app.post('/api/interaction', (req, res) => {
  const newInteraction = req.body;
  db.collection('interactions').updateOne({ id: newInteraction.id }, { $set: newInteraction }, { upsert: true }).then(result => {
    console.log(`modified count: ${result.modifiedCount}`)
    console.log(`matched count: ${result.matchedCount}`)

    if (!(result.matchedCount === 0 && result.modifiedCount === 0)) {
      throw Error('Interaction Exists Already')
    }
    console.log(`result.upsertedId: ${result.upsertedId._id}`)
    var o_id = new mongo.ObjectID(result.upsertedId._id)
    console.log(`objectid: ${o_id}`)
    return db.collection('interactions').find({ _id: o_id }).limit(1).next()
  }
  ).then(newInteraction => {
    console.log(`server newContact: ${JSON.stringify(newInteraction)}`)
    res.json(newInteraction);
  }).catch(error => {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error: ${error}` });
  });
})

// app.delete @ route: /api/interaction/:interactionID


// Close the mongodb instance.
// pipe.kill();
