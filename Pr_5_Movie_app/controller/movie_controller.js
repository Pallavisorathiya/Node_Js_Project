const Movie = require("../model/Movie_model");
const path = require("path");
const fs = require("fs");
// exports.homepage = async (req, res) => {
//   try {
//       let searchQuery = (req.query.q || "").trim();
//     let category = (req.query.category || "all").trim();

//     let perPage = 4; 
//     let page = Math.max(parseInt(req.query.page) || 1, 1);
//     let skip = (page - 1) * perPage;

//     let filter = {};
//     if (searchQuery) {
//       filter.$or = [
//         { name:     { $regex: searchQuery, $options: "i" } },
//         { category: { $regex: searchQuery, $options: "i" } },
//         { language: { $regex: searchQuery, $options: "i" } },
//       ];
//     }
//     if (category.toLowerCase() !== "all") {
//       const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
//       filter.category = new RegExp(`^${esc(category)}$`, "i");
//     }

//     let [movies, total] = await Promise.all([
//       Movie.find(filter).sort({ createdAt: -1 }).skip(skip).limit(perPage),
//       Movie.countDocuments(filter),
//     ]);

//     let totalPages = Math.max(Math.ceil(total / perPage), 1);

//     res.render("index", {
//       movies,
//       searchQuery,
//       currentCategory: category,
//       page,
//       perPage,
//       total,
//       totalPages,
//     });
//   } catch (e) {
//     console.error(e);
//     res.status(500).send("Server Error");
//   }
// };


// exports.homepage = async (req, res) => {
//   try {
//     let searchQuery = (req.query.q || "").trim();
//     let category    = (req.query.category || "all").trim();

//     let perPage = 4;
//     let page    = Math.max(parseInt(req.query.page) || 1, 1);
//     let skip    = (page - 1) * perPage;

//     let filter = {};

//     if (searchQuery) {
//       filter.$or = [
//         { name:     { $regex: searchQuery, $options: "i" } },
//         { category: { $regex: searchQuery, $options: "i" } },
//         { language: { $regex: searchQuery, $options: "i" } },
//       ];
//     }

//     if (category.toLowerCase() !== "all") {
//       const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
//       filter.category = new RegExp(`^${esc(category)}$`, "i");
//     }

//     const sort = { createdAt: -1, _id: -1 };

//     const [movies, total] = await Promise.all([
//       Movie.find(filter).sort(sort).skip(skip).limit(perPage).lean(),
//       Movie.countDocuments(filter),
//     ]);

//     const totalPages = Math.max(Math.ceil(total / perPage), 1);

//     res.render("index", {
//       movies,
//       searchQuery,
//       currentCategory: category,
//       page,
//       perPage,
//       total,
//       totalPages,
//     });
//   } catch (e) {
//     console.error(e);
//     res.status(500).send("Server Error");
//   }
// };

exports.homepage = async (req, res) => {
  try {
    let searchQuery = (req.query.q || "").trim();
    let category = (req.query.category || "all").trim();

    let filter = {};

    // 🔍 Search filter
    if (searchQuery) {
      filter.$or = [
        { name:     { $regex: searchQuery, $options: "i" } },
        { category: { $regex: searchQuery, $options: "i" } },
        { language: { $regex: searchQuery, $options: "i" } },
      ];
    }

    // 🎬 Category filter
    if (category.toLowerCase() !== "all") {
      const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.category = new RegExp(`^${esc(category)}$`, "i");
    }

    // 🆕 Show latest first (requires timestamps in schema)
    const movies = await Movie.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .lean();

    res.render("index", {
      movies,
      searchQuery,
      currentCategory: category,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("Server Error");
  }
};



exports.addForm = async (req, res) => {
    res.render('add_movie')
}

exports.addMovie = async (req, res) => {
    const image = req.file ? '/uploads/' + req.file.filename : "";
    await Movie.create({ ...req.body, image });
    res.redirect("/");
}

exports.editForm = async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    res.render("edit_movie", { movies: movie });
}

exports.editmovie = async (req, res) => {
    const id = req.params.id;
    let movie = await Movie.findById(id);
    if (!movie) {
        return res.redirect("back");
    }
    let imagePath = movie.image;
    if (req.file) {
        const oldImagePath = path.join(__dirname, "..", movie.image);
        if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        }
        imagePath = `/uploads/${req.file.filename}`;
    }
    await Movie.findByIdAndUpdate(id, { ...req.body, image: imagePath }, { new: true });
    res.redirect("/");
};

exports.deletemovie = async (req, res) => {
    const id = req.params.id;
    const record = await Movie.findById(id);
    if (record?.image) {
        const imagePath = path.join(__dirname, "..", record.image);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }
    await Movie.findByIdAndDelete(id);
    res.redirect("/");
};

exports.viewSingleMovie = async (req, res) => {
    try {
        const id = req.params.id;
        const movie = await Movie.findById(id);

        if (!movie) {
            return res.status(404).send("Movie not found");
        }

        res.render("view_movie", { movie });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};


