const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

let db;
const app = express();
const port = 3000;

// Start MongoDB instance.
const spawn = require('child_process').spawn;
const pipe = spawn('mongod')

app.use(function(req, res, next) {
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

app.get('/api/contacts', (req, res) => {
  db.collection('contacts').find().toArray().then( contacts => {
    const metadata = { total_count: contacts.length };
    res.json({ _metadata: metadata, contacts: contacts});
  }).catch(error => {
    console.log(error);
    res.status(500).json({message: `Internal Server Error: ${error}`});
  })
})

// app.delete @ route: /api/contact/:contactID

// app.delete @ route: /api/interaction/:interactionID

// app.post @ route: /api/contact

// app.post @ route: /api/interaction


app.post('/api/contacts', (req, res) => {
  const newContact = req.body;
  db.collection('contact').updateOne({email:newContact.email}, {$set: newContact}, {upsert:true}).then(result =>
    {
        console.log(`modified count: ${result.modifiedCount}`)
        console.log(`matched count: ${result.matchedCount}`)

        if (!(result.matchedCount === 0 && result.modifiedCount === 0)){
            throw Error('Contact Exists Already')
        }
        console.log(`result.upsertedId: ${result.upsertedId._id}`)
        var o_id = new mongo.ObjectID(result.upsertedId._id)
        console.log(`objectid: ${o_id}`)
        return db.collection('contacts').find({_id: o_id }).limit(1).next()
    }
).then(newContact => {
    console.log(`server newContact: ${JSON.stringify(newContact)}`)
res.json(newContact);
}).catch(error => {
console.log(error);
res.status(500).json({message: `Internal Server Error: ${error}`});
});


})

// Close the mongodb instance.
pipe.kill();
