const mongoose =  require('mongoose')

const mongoose_connect = () => {
    // mongoose.connect("mongodb://localhost:27017/BooksInfo")
    mongoose.connect("mongodb+srv://pallavis:231003@cluster0.uetqdm3.mongodb.net/MovieInfo")
    .then(() => console.log("DataBase Connect Succesfully"))
    .catch((err) => console.log(err))
}

module.exports =  mongoose_connect;