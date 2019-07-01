const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongo = require('mongodb')
const MongoClient = mongo.MongoClient;
const ObjectId = mongo.ObjectId;

let db;
const app = express();
const port = 3000;

// Start MongoDB instance.
//const spawn = require('child_process').spawn;
//const pipe = spawn('mongod')

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(cors())

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

app.post('/api/contacts', (req, res) => {
  const newContact = req.body;
  db.collection('contacts').updateOne({ email: newContact.email }, { $set: newContact }, { upsert: true }).then(result => {
    console.log(`DEBUG - modified count: ${result.modifiedCount}`)
    console.log(`DEBUG - matched count: ${result.matchedCount}`)

    var contact = db.collection('contacts').find({email: newContact.email}).limit(1).next()

    console.log(`DEBUG - objectid: ${contact._id}`)
    return contact
  }
  ).then(newContact => {
    console.log(`DEBUG - server updated / new Contact: ${JSON.stringify(newContact)}`)
    res.json(newContact);
  }).catch(error => {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error: ${error}` });
  });
})

// app.delete @ route: /api/contact/:contactID
app.delete('/api/contacts/:email', (req, res) => {
  db.collection('contacts').deleteOne({email: req.params.email.toLowerCase()}).then(result => {
    console.log(`DEBUG - deleted count: ${result.deletedCount}`)

    if (result.deletedCount > 0){
      console.log(`DEBUG - server deleted: ${JSON.stringify(result.deletedCount)}`)
      res.status(200).json({message: `Deleted ${result.deletedCount} contacts.`})
    }
    else{
      console.log(`DEBUG - Failed to Delete: Contact not found.`)
      res.status(200).json({message: `That contact does not exist.`})
    }
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({ message: `Internal Server Error: ${error}`});
  })
})

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
  db.collection('interactions').find({ _id: ObjectId(req.params.id)}).toArray().then(interactions => {
    const metadata = { total_count: interactions.length };
    console.log(metadata);
    res.json({ _metadata: metadata, interactions: interactions });
  }).catch(error => {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error: ${error}` });
  })
})

app.post('/api/interaction', (req, res) => {
  const newInteraction = req.body;
  console.log("DEBUG - ")
  db.collection('interactions').updateOne({ uniqueStamp: newInteraction.uniqueStamp }, { $set: newInteraction }, { upsert: true }).then(result => {
    console.log(`modified count: ${result.modifiedCount}`)
    console.log(`matched count: ${result.matchedCount}`)

    return db.collection('interactions').find({uniqueStamp: newInteraction.uniqueStamp}).limit(1).next()
  }).then(newInteraction => {
    console.log(`server newContact: ${JSON.stringify(newInteraction)}`)
    res.json(newInteraction);
  }).catch(error => {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error: ${error}` });
  });
})

<<<<<<< HEAD

=======
>>>>>>> 0e7c86475ff7742624fae3a1437353de30720e3f
// app.delete @ route: /api/interaction/:interactionID
app.delete('/api/interactions/:uniqueStamp', (req, res) => {
  db.collection('interactions').deleteOne({uniqueStamp: req.params.uniqueStamp}).then(result => {
    console.log(`DEBUG - deleted count: ${result.deletedCount}`)

    if (result.deletedCount > 0){
      console.log(`DEBUG - server deleted: ${JSON.stringify(result.deletedCount)}`)
      res.status(200).json({message: `Deleted ${result.deletedCount} interactions.`})
    }
    else{
      console.log(`DEBUG - Failed to Delete: Interaction not found.`)
      res.status(200).json({message: `That interaction does not exist.`})
    }
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({ message: `Internal Server Error: ${error}`});
  })
})

// Close the mongodb instance.
//pipe.kill();
