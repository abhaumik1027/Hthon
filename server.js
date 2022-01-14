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



app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
  // Check  url
  console.log(validUrl(req.body.fullUrl))
  if (!validUrl(req.body.fullUrl)) {
    return res.status(401).json('Invalid url');
  }
  //Check if url exists
  else{ 
    try {
      let lUrl = await ShortUrl.findOne({ full: req.body.fullUrl });
      let sUrl = await ShortUrl.findOne({ short: req.body.shortUrl });

      if (lUrl) {
        return res.status(401).json('URL already exists');
      }
      else if(sUrl){
        return res.status(401).json('A-link already exists');
      }
      else {
        const urlCode = shortid.generate();
        await ShortUrl.create({linkID: urlCode, full: req.body.fullUrl, short: req.body.shortUrl, date: new Date().toLocaleDateString() })
        res.redirect('/')
      }
    }
    catch (err) {
      console.error(err);
      res.status(500).json('Server error');
    }
  }
})

app.get('/:shortUrl', async (req, res) => {
 const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
 if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})

app.post('/delUrl', async (req, res) => {
  try {
    await ShortUrl.findOneAndDelete({linkID:req.body.linkID})
    res.redirect('/')
  }
  catch (err) {
    res.status(500).json('Server error');
  }
})

app.post('/editUrl', async (req, res) => {
  console.log(validUrl(req.body.fullUrl))
  if (!validUrl(req.body.fullUrl)) {
    return res.status(401).json('Invalid url');
  }
  else{
    try {
      
      var shID= await ShortUrl.findOne({linkID:req.body.linkID})
      var mID = shID._id.toString()
      console.log(mID)
      await ShortUrl.findByIdAndUpdate(mID, {full: req.body.fullUrl, short: req.body.shortUrl, date: new Date().toLocaleDateString() })
      res.redirect('/')
  }
  catch (err) {
    res.status(500).json('Server error');
  }
}
})


    
const bodyParser = require('body-parser');
app.use(express.urlencoded({extended: true})); 
app.post("/showMod", function (req, res) {
    const show_modal = !!req.body.modal; // Cast to boolean
    res.render("index", { show_modal });
})

  

app.listen(process.env.PORT || 5000);

