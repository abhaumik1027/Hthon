const express = require('express')
const mongoose = require('mongoose')
const validUrl = require('valid_url')
const ShortUrl = require('./models/shortUrl')
const app = express()

mongoose.connect('mongodb+srv://abmongo:mongo@cluster0.exdyq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
  // Check  url
  if (!validUrl(req.body.fullUrl)) {
    return res.status(401).json('Invalid url');
  }
  //Check if url exists
  else{ 
    try {
      let url = await ShortUrl.findOne({ full: req.body.fullUrl });

      if (url) {
        return res.status(401).json('URL already exists');
      } 
      else {
        await ShortUrl.create({ full: req.body.fullUrl, short: "a/"+req.body.shortUrl, date: new Date().toLocaleString() })
        res.redirect('/')
      }
    }
    catch (err) {
      console.error(err);
      res.status(500).json('Server error');
    }
  }
})

app.get('/a/:shortUrl', async (req, res) => {
 const shortUrl = await ShortUrl.findOne({ short: "a/"+req.params.shortUrl })
 if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000);

