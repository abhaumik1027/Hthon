const express = require('express')
const mongoose = require('mongoose')
const validUrl = require('valid_url')
const ShortUrl = require('./models/shortUrl')
const app = express()
const shortid = require('shortid');

mongoose.connect('mongodb+srv://abmongo:mongo@cluster0.exdyq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))


//Load the table
app.get('/', async (req, res) => {
  let shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls, message: 'render' })
})

//Create a record
app.post('/shortUrls', async (req, res) => {
  // Check  url
  console.log(req.body)
  if (!validUrl(req.body.fullUrl)) {
      let shortUrls = await ShortUrl.find()
      res.render('index', { shortUrls: shortUrls, message: 'invalid_url' })
  }
  //Check if url exists
  else{ 
    try {
      let lUrl = await ShortUrl.findOne({ full: req.body.fullUrl });
      let sUrl = await ShortUrl.findOne({ short: req.body.shortUrl });

      if (lUrl) {
        let shortUrls = await ShortUrl.find()
        res.render('index', { shortUrls: shortUrls, message: 'url_exists' })
      }
      else if(sUrl){
        let shortUrls = await ShortUrl.find()
        res.render('index', { shortUrls: shortUrls, message: 'alink_exists' })
      }
      else {
        let urlCode = shortid.generate();
        await ShortUrl.create({linkID: urlCode, full: req.body.fullUrl, 
                       short: req.body.shortUrl, date: new Date().toLocaleDateString(), tag: req.body.tag, creator: "Ani Bhaumik"})
        let shortUrls = await ShortUrl.find()
        res.render('index', { shortUrls: shortUrls, message: 'alink_added' })
      }
    }
    catch (err) {
      res.status(500).json(err);
    }
  }
})

//Direct a alink to the long url
app.get('/:shortUrl', async (req, res) => {
 const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
 if (shortUrl == null) {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls, message: 'search' })
    
 }
 else {
    shortUrl.clicks++
    shortUrl.save()
    res.redirect(shortUrl.full)
 }
})

//Get `by tags
app.get('/tag/:tag', async (req, res) => {
  let tag = req.params.tag.toUpperCase();
  const shortUrl = await ShortUrl.find({ tag: tag })
  if (shortUrl.length == 0) {
     const shortUrls = await ShortUrl.find()
     res.render('index', { shortUrls: shortUrls, message: 'no_tag' })
  }
  else {
    res.render('index', { shortUrls: shortUrl, message: '' })
  }
 })

//Delete an alink
app.post('/delUrl', async (req, res) => {
  try {
    await ShortUrl.findOneAndDelete({linkID:req.body.linkID});
    const shortUrls = await ShortUrl.find();
    res.render('index', { shortUrls: shortUrls, message: 'alink_deleted' })

  }
  catch (err) {
    res.status(500).json('Server error');
  }
})

//Edit an alink
app.post('/editUrl', async (req, res) => {
  if (!validUrl(req.body.fullUrl)) {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls, message: 'invalid_url' })
  }
  else{
    try {
      
      var shID= await ShortUrl.findOne({linkID:req.body.linkID})
      var mID = shID._id.toString()
      await ShortUrl.findByIdAndUpdate(mID, {full: req.body.fullUrl, short: req.body.shortUrl, 
        date: new Date().toLocaleDateString(), tag: req.body.tag, creator: "Ani Bhaumik"})
      let shortUrls = await ShortUrl.find()
      res.render('index', { shortUrls: shortUrls, message: 'alink_updated' })
  }
  catch (err) {
    res.status(500).json('Server error');
  }
}
})

app.listen(process.env.PORT || 5000);

