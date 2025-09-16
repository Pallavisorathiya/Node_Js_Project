const express = require('express');
const port = 8007;

const server = express();

server.set("view engine", "ejs");
server.use(express.urlencoded());

let books = [
{
    id:"101",
    title:"The Tale Of The Horse A History Of India On Horseback",
    author:"Chandra, Yashaswini",
    publisher:"Picador India",
    price:"270",
    img:"https://www.bookswagon.com/productimages/mainimages/301/9789390742301.jpg"
},
{
    id:"102",
    title:"Ikigai: The Japanese Secret to a Long and Happy Life(English)",
    author:"Héctor García",
    publisher:"Penguin Random House",
    price:"1300",
    img:"https://bookswagon.com/BW/productimages/mainimages/727/9780143130727.jpg"
},
{
    id:"103",
    title:"Bhagvad Gita As It Is English New Edition ",
    author:"A.C. Bhaktivedanta Swami Prabhupada",
    publisher:"The Bhaktivedanta Book Trust",
    price:"490",
    img:"https://www.eourmart.com/cdn/shop/products/gita.webp?v=1675680091"
},
{
    id:"104",
    title:"Atomic Habits (EXP)",
    author:"James Clear",
    publisher:" Penguin Publishing Group ",
    price:"999",
    img:"https://m.media-amazon.com/images/I/51-nXsSRfZL._SX329_BO1,204,203,200_.jpg"

},
{
    id:"105",
    title:"It Starts With Us ",
    author:"Colleen Hoover",
    publisher:"Atria Books",
    price:"415",
    img:"https://www.bookswagon.com/productimages/mainimages/179/9781398518179.jpg",


},
{
    id:"104",
    title:"It ends with us",
    author:"Colleen Hoover",
    publisher:"Atria Books",
    price:"415",
    img:"https://m.media-amazon.com/images/I/51LCO+afezL._SY445_SX342_.jpg"
},
{
    id:"105",
    title:"Rich Dad Poor Dad ",

    author:" Robert T Kiyosaki ",
  publisher:"Warner Books",
    price:"381",
    img:"https://www.bookswagon.com/productimages/mainimages/139/9781612681139.jpg"
},

]

server.get("/", (req, res) =>{
    res.render("index",{ books})
})

server.get("/add-book", (req, res) =>{
    res.render('addBook')
})

server.post("/add-book", (req, res) =>{
    books.push(req.body);
    return res.redirect("/")
})

server.get("/delete-book/:id", (req, res) =>{
    let id = req.params.id;
    books = books.filter(book => book.id != id);
    return res.redirect("/");
})

server.get("/edit-book/:id", (req, res) =>{
    let id = req.params.id;
    let record = books.find(book => book.id == id);
    return res.render('editBook', {record});
})

server.post("/edit-book/:id", (req, res) =>{
    let id = req.params.id; 
    let updateData = books.map(book =>{
        if(book.id == id)
            return{id , ...req.body}
        else
            return book;
    })
    books = updateData
    return res.redirect("/")
})

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
