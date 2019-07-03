const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongo = require('mongodb')
const MongoClient = mongo.MongoClient;
const ObjectId = mongo.ObjectId;
const { Utilities } = require('./utilities.js');
const Utility = new Utilities();

let db;
const app = express();
const port = 3000;

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(cors())

app.use(bodyParser.json())

// Connect to Database and start the app.
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
// retrieves all contacts from the database.
app.get('/api/contacts', (req, res) => {
  db.collection('contacts').find().toArray().then(contacts => {
    const metadata = { total_count: contacts.length };
    // Returns the total contacts count and a JSON of all of the contacts.
    res.json({ _metadata: metadata, contacts: contacts });
  }).catch(error => {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error: ${error}` });
  })
})

// gets a single contact with the matching email.
// :email - parameter of single email to search for.
app.get('/api/contacts/:email', (req, res) => {
  db.collection('contacts').find({ email: req.params.email }).toArray().then(contacts => {
    const metadata = { total_count: contacts.length };
    // Returns the total contacts count and a JSON of all of the contacts.
    res.json({ _metadata: metadata, contacts: contacts });
  }).catch(error => {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error: ${error}` });
  })
})

// adds or updates a new contact to the database.
// req - the JSON that is processed by this service to create or update a contact.
app.post('/api/contacts', (req, res) => {
  const newContact = req.body;
  Object.keys(newContact).map(x => {
    if (typeof(x) === 'string') {
      newContact[x] = newContact[x].toLowerCase()
    }
  })

  // Updates the designated contact, or creates a new one if one does not exist - Emails are unique.
  db.collection('contacts').updateOne({ email: newContact.email }, { $set: newContact }, { upsert: true }).then(result => {
    console.log(`DEBUG - modified count: ${result.modifiedCount}`)
    console.log(`DEBUG - matched count: ${result.matchedCount}`)

    // Get the contact that was updated or created so that we can send the response.
    var contact = db.collection('contacts').find({email: newContact.email}).limit(1).next()

    console.log(`DEBUG - objectid: ${contact._id}`)
    return contact
  }
  ).then(newContact => {
    console.log(`DEBUG - server updated / new Contact: ${JSON.stringify(newContact)}`)
    // Send the JSON response of the contact.
    res.json(newContact);
  }).catch(error => {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error: ${error}` });
  });
})

// deletes a designated email from the database.
app.delete('/api/contacts/:email', (req, res) => {
  // Delete the designated contact.
  db.collection('contacts').deleteOne({email: req.params.email.toLowerCase()}).then(result => {
    console.log(`DEBUG - deleted count: ${result.deletedCount}`)

    // If one was deleted, respond 200.
    if (result.deletedCount > 0){
      console.log(`DEBUG - server deleted: ${JSON.stringify(result.deletedCount)}`)
      res.status(200).json({message: `Deleted ${result.deletedCount} contacts.`})
    }
    // Else, one was not found, send the failure message.
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
// gets a list of all interactions in the database.
app.get('/api/interactions', (req, res) => {
  db.collection('interactions').find().toArray().then(interactions => {
    const metadata = { total_count: interactions.length };
    res.json({ _metadata: metadata, interactions: interactions });
  }).catch(error => {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error: ${error}` });
  })
})

// Gets a single designated interaction, based on the unique ID.
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

// Create or update a designated interaction.
app.post('/api/interactions', (req, res) => {
  const newInteraction = req.body;
  console.log("DEBUG - ")
  // Update based on the uniqueStamp, a value created in the frontend.
  db.collection('interactions').updateOne({ uniqueStamp: newInteraction.uniqueStamp }, { $set: newInteraction }, { upsert: true }).then(result => {
    console.log(`modified count: ${result.modifiedCount}`)
    console.log(`matched count: ${result.matchedCount}`)

    // Once the interaction has been updated or created, update the contacts who were a part of the interaction.
    // This updates each contacts rapport to the new value.
    Utility.UpdateContacts(newInteraction.members, db)

    // Find and return the updated or created interaction.
    return db.collection('interactions').find({uniqueStamp: newInteraction.uniqueStamp}).limit(1).next()
  }).then(newInteraction => {
    console.log(`server newContact: ${JSON.stringify(newInteraction)}`)
    res.json(newInteraction);
  }).catch(error => {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error: ${error}` });
  });
})

// deletes a designated interaction.
app.delete('/api/interactions/:uniqueStamp', (req, res) => {
  db.collection('interactions').deleteOne({uniqueStamp: req.params.uniqueStamp}).then(result => {
    console.log(`DEBUG - deleted count: ${result.deletedCount}`)

    // If one was deleted, respond 200.
    if (result.deletedCount > 0){
      console.log(`DEBUG - server deleted: ${JSON.stringify(result.deletedCount)}`)
      res.status(200).json({message: `Deleted ${result.deletedCount} interactions.`})
    }
    // Else, send the failure message.
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
