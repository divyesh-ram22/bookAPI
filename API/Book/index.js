//prefix: /book

//Initializing Express Router
const Router = require("express").Router();

//Database Models
const BookModels = require("../../database/book");
/*
Route           /
Description     Get all books
Access          Public
Parameter       None
Methods         GET
*/ 

Router.get("/",async (req, res)=>{
    const getAllBooks = await BookModels.find();
    return res.json(getAllBooks);
})

/*
Route           /is/(ISBN value)
Description     Get specific book based on ISBN
Access          Public
Parameter       ISBN
Methods         GET
*/ 
Router.get("/is/:isbn", async (req, res) =>{
    const getSpecificBook = await BookModels.findOne({ ISBN: req.params.isbn }); 
    if(!getSpecificBook){
        return res.json({
            error: `No book found for the ISBN of ${req.params.isbn}`,});
    }
    return res.json({book: getSpecificBook});
});
/*
Route           /c/(category name)
Description     Get specific book based on category
Access          Public
Parameter       category
Methods         GET
*/ 
Router.get("/c/:category", async (req, res) =>{
    // const getSpecificBook = database.books.filter((book) => 
    // book.category.includes(req.params.category)
    // );
    const getSpecificBook = await  BookModels.findOne({category : req.params.category})
    if(!getSpecificBook){
        return res.json({error: `No book found of this category ${req.params.category}`});
    }
    return res.json({book: getSpecificBook});
});

/*
Route           /lang/(language name)
Description     Get specific book based on language
Access          Public
Parameter       language
Methods         GET
*/ 
Router.get("/lang/:language",async (req, res) =>{
    // const getSpecificBook = database.books.filter((book) => 
    // book.language.includes(req.params.language)
    // );
    const getSpecificBook = await BookModels.findOne({language: req.params.language})
    if(!getSpecificBook){
        return res.json({error: `No book found of this language ${req.params.language}`});
    }
    return res.json({book: getSpecificBook});
});

/*
Route           /book/add
Description     add new books
Access          Public
Parameter       None
Methods         POST
*/
Router.post("/add", async(req, res)=>{
    const {newBook} = req.body;
    //database.books.push(newBook);
    BookModels.create(newBook);
    return res.json({ message: "Book Added!!"});
});
/*
Route           /book/update/title/:isbn
Description     update book title
Access          Public
Parameter       isbn
Methods         PUT
*/
Router.put("/update/title/:isbn", async (req,res)=>{
    
    const updatedTitle = await BookModels.findOneAndUpdate(
        {ISBN : req.params.isbn},
        {title : req.body.newBookTitle},
        {new: true});
    
    // database.books.forEach((book)=>{
    //     if(book.ISBN === req.params.isbn){
    //         book.title = req.body.newBookTitle;
    //         return;
    //     }
    // });

    return res.json({books: updatedTitle});
});

/*
Route           /book/update/author
Description     update/add new author for a book
Access          Public
Parameter       isbn
Methods         PUT
*/
Router.put("/update/author/:isbn", async(req, res)=>{
    //update book database
    const updatedBook = await BookModels.findOneAndUpdate(
        {
          ISBN: req.params.isbn,
        },
        {
          $addToSet: {
            author: req.body.newAuthor,
          },
        },
        {
          new: true,
        }
      );
    // database.books.forEach((book)=>{
    //     if(book.ISBN === req.params.isbn){
    //         return book.author.push(parseInt(req.params.authorId));
    //     }
    // });

    //update author database
    const updatedAuthor = await AuthorModels.findOneAndUpdate(
        {
          id: req.body.newAuthor,
        },
        {
          $addToSet: {
            books: req.params.isbn,
          },
        },
        { new: true }
      );
    
    // database.author.forEach((author)=>{
    //     if(author.id === parseInt(req.params.authorId)){
    //         return author.books.push(req.params.isbn);
    //     }
    // });
    return res.json({
        books: updatedBook,
        author: updatedAuthor,
        message: "New author was added!!",
    });
});

/*
Route           /book/delete
Description     delete a book using its ISBN
Access          Public
Parameter       ISBN
Methods         DELETE
*/
Router.delete("/delete/:isbn", async (req,res)=>{
    const updatedBookDatabase = await BookModels.findOneAndDelete({ISBN : req.params.isbn});    
    // const updatedBookDatabase = database.books.filter(
    //     (book) => book.ISBN !== req.params.isbn 
    // );

    // database.books = updatedBookDatabase;
    return res.json({books: updatedBookDatabase, message: "Book Deleted!!"});
});

/*
Route           /book/delete/author
Description     delete an author from a book using its ISBN
Access          Public
Parameter       ISBN, Author ID
Methods         DELETE
*/
Router.delete("/delete/author/:isbn/:authorId", async(req, res)=>{
    //update the book database
    const updatedBook = await BookModels.findOneAndUpdate(
        {
            ISBN : req.params.isbn,
        },
        {
            $pull:{
                author : parseInt(req.params.authorId),
            }
        },
        {
            new : true,
        }
        );
    
    // database.books.forEach((book)=>{
    //     if(book.ISBN === req.params.isbn){
    //         const newAuthorList = book.author.filter(
    //             (author) => author !== parseInt(req.params.authorId)
    //         );
    //         book.author = newAuthorList;
    //         return;
    //     }
    // });
    //update author database
        const updatedAuthor = await AuthorModels.findOneAndUpdate({
            id: parseInt(req.params.authorId),
        },
        {
            $pull:{
                books: req.params.isbn,
            }
        },
        {
            new: true,
        });

    // database.author.forEach((author)=>{
    //     if(author.id == parseInt(req.params.authorId)){
    //         const newBookList = author.books.filter(
    //             (book)=> book !== req.params.isbn
    //         );

    //         author.books = newBookList;
    //         return;
    //     }
    // });
    return res.json({message:"Author was deleted!",book : updatedBook, author : updatedAuthor})

});


//export
module.exports = Router;