const express = require('express')
var bodyParser = require('body-parser')
const { MongoClient } = require('mongodb')
const app = express()
app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))


// Connection URL
const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)
const dbName = 'Temperature'

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/home.html')
})


app.get('/log-temp/:temp', function (req, res) {
  const temp = req.params.temp
  console.log(temp)

  async function enter() {
    // Use connect method to connect to the server
    await client.connect()
    console.log('Connected successfully to server')
    const db = client.db(dbName)
    const collection = db.collection('days')

    const Result = await collection.insertOne({ temp : temp })

    return 'done.';
  }
  
  enter()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());

})

app.get('/chart', (req, res) => {
  res.sendFile(__dirname + '/chart.html')
})

app.get('/temp-data', async  (req, res) => {
  await client.connect()
  const db = client.db(dbName)
  const collection = db.collection('days')
  const data = await collection.find().toArray()
  res.json(data)
})



app.listen(3000)
