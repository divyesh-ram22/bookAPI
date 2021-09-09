//prefix: /author

//Initializing Express Router
const Router = require("express").Router();

//Database Models
const AuthorModels = require("../../database/author");
/*
Route           /author
Description     Get all author
Access          Public
Parameter       None
Methods         GET
*/
Router.get("/", async (req,res) => {
    const getAllAuthors = await AuthorModels.find();
    return res.json({authors: getAllAuthors});
}
);

/*
Route           /author/(author name)
Description     Get specific author name
Access          Public
Parameter       Name
Methods         GET
*/
Router.get("/:name",async (req,res)=>{
    // const getSpecificAuthor = database.author.filter((author) => 
    // author.name === req.params.name);
    const getSpecificAuthor = await AuthorModels.findOne({name: req.params.name}) 
    if(!getSpecificAuthor){
        return res.json({error: `No author found of this name ${req.params.name}`});
    }
    return res.json({author: getSpecificAuthor});
});
/*
Route           /author/book/(ISBN value)
Description     Get specific author based on book ISBN
Access          Public
Parameter       ISBN
Methods         GET
*/
Router.get("/book/:isbn", async(req,res)=>{
    // const getSpecificAuthor = database.author.filter((author) => 
    // author.books.includes(req.params.isbn)
    // );
    const getSpecificAuthor = await AuthorModels.findOne({books : req.params.isbn})
    if(!getSpecificAuthor){
        return res.json({error: `No author found of this book ${req.params.isbn}`});
    }
    return res.json({author : getSpecificAuthor});
});

/*
Route           /author/add
Description     add new authors
Access          Public
Parameter       None
Methods         POST
*/
Router.post("/add",(req,res)=>{
    const{newAuthor} = req.body;
    //database.author.push(newAuthor);
    AuthorModels.create(newAuthor);
    return res.json({ message: "Author Added!!"});
});

/*
Route           /author/update/name/:id
Description     update author name using its ID
Access          Public
Parameter       ID
Methods         PUT
*/
Router.put("/update/name/:id",async (req,res)=>{
    const UpdatedName = await AuthorModels.findOneAndReplace(
        {
            id : req.params.id,
        },
        {
            name : req.body.newAuthorName,
        },
        {
            new: true
        }
        );
    // database.author.forEach((author)=>{
    //     if(author.id === parseInt(req.params.id)){
    //         author.name = req.body.newAuthorName;
    //         return;
    //     }
    // });

    return res.json({author: UpdatedName,message: "Author Name Updated!!"});
});

/*
Route           /author/delete
Description     delete an author using its id
Access          Public
Parameter       ID
Methods         DELETE
*/
Router.delete("/delete/:id",async(req,res)=>{
    const updatedAuthorDatabase = await AuthorModels.findOneAndDelete({id : req.params.id});
    // const updatedAuthorDatabase = database.author.filter(
    //     (author) => author.id !== parseInt(req.params.id) 
    // );

    // database.author = updatedAuthorDatabase;
    return res.json({author: updatedAuthorDatabase,message: "Author Deleted!!"});
});

//Exporting
module.exports = Router;