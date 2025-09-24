const express =  require("express")
const Book = require('./model/Book_Model')
const mongoose_connect  = require('./config/Mongoose_connection')


const app  = express();

app.use(express.urlencoded())
app.set("view engine" , "ejs")
app.use(express.static ("public"))

app.get("/", async (req, res) => {
    let Books =  await Book.find() 
    res.render("index" , {Books})
})

app.get("/add-book", (req, res) => {
    res.render("add-book")

})
app.get("/edit-book/:id",  async (req, res) => {
    let id  =  req.params.id ;
    let Books =  await Book.findById(id) 
    res.render("edit-book", {Books})
})

app.post("/edit-book/:id",  async (req, res) => {
    let id  =  req.params.id ;
    let Books =  await Book.findByIdAndUpdate(id, req.body) 
    res.redirect('/')
})

app.post('/add-Book', async (req, res) => {
    await Book.create(req.body)
    console.log("Create Book  Succesfully");
    res.redirect("/")
})


app.get('/delete-book/:id', async (req, res) => {
     let id =  req.params.id
     let book = await Book.findByIdAndDelete(id)
     res.redirect("/")
})



app.listen(8010, () => {
    mongoose_connect()
    console.log("app Running on http://localhost:8010");
})