//prefix: /publication

//Initializing Express Router
const Router = require("express").Router();

//Database Models
const PublicationModel = require("../../database/publication");

/*
Route           /publications
Description     Get all publications
Access          Public
Parameter       none
Methods         GET
*/
Router.get("/",async (req, res)=>{
    const getAllPublication = await PublicationModel.find();
    return res.json(getAllPublication);
})

/*
Route           /publications/(publication name)
Description     Get specific publication
Access          Public
Parameter       publication name
Methods         GET
*/

Router.get("/:name", async (req,res)=>{
    // const getSpecificPublication = database.publication.filter((publication) => 
    // publication.name === req.params.name);
    const getSpecificPublication = await PublicationModel.findOne({name: req.params.name})
    if(!getSpecificPublication){
        return res.json({error: `No publication found of this name ${req.params.name}`});
    }
    return res.json({publication: getSpecificPublication});
});

/*
Route           /publications/book/(ISBN value)
Description     Get list of publications based on book
Access          Public
Parameter       ISBN
Methods         GET
*/
Router.get("/book/:isbn",async (req,res)=>{
    // const getSpecificPublication = database.publication.filter((publication) => 
    // publication.books.includes(req.params.isbn)
    // );
    const getSpecificPublication = await PublicationModel.findOne({books: req.params.isbn})
    if(!getSpecificPublication){
        return res.json({error: `No publication found of this book ${req.params.isbn}`});
    }
    return res.json({publications: getSpecificPublication});
});

/*
Route           /publication/add
Description     add new publications
Access          Public
Parameter       None
Methods         POST
*/
Router.post("/add",(req,res)=>{
    const{newPublication} = req.body;
    //database.publication.push(newPublication);
    PublicationModel.create(newPublication)
    return res.json({message: "Publication Added!!"})
});

/*
Route           /publication/update/name/:id
Description     update publication name using its ID
Access          Public
Parameter       ID
Methods         PUT
*/
Router.put("/update/name/:id", async(req,res)=>{
    const updatedName = await PublicationModel.findOneAndUpdate(
        {
            id : req.params.id,
        },
        {
            name : req.body.newPublicationName,
        },
        {
            new: true,
        }
        );
    
    // database.publication.forEach((publication)=>{
    //     if(publication.id === parseInt(req.params.id)){
    //         publication.name = req.body.newPublicationName;
    //         return;
    //     }
    // });

    return res.json({publication: updatedName,message:"Publication Name Updated!!"});
});

/*
Route           /publication/update/book/:isbn
Description     update/add books in publication
Access          Public
Parameter       ISBN
Methods         PUT
*/
Router.put("/update/book/:isbn",async (req, res)=>{
    //update the publication database
    const updatePublication = await PublicationModel.findOneAndUpdate(
        {
            id : req.body.pubId,
        },
        {
            $addToSet:{
                books : req.params.isbn,
            }
        },
        {
            new : true,
        }
        );
    
    // database.publication.forEach((publication)=>{
    //     if(publication.id === req.body.pubId){
    //         return publication.books.push(req.params.isbn);
    //     }
    // });
    //update book database
    const updateBook = await BookModels.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            $addToSet:{
            publication: req.body.pubId,
            }
        },
        {
            new: true,
        }
        );
    
    // database.books.forEach((book)=>{
    //     if(book.ISBN === req.params.isbn){
    //         book.publication = req.body.pubId;
    //         return;
    //     }
    // });
    return res.json({books : updateBook, 
        publication: updatePublication, 
        message: "Sucessfully updated publication!"});
});

/*
Route           /publication/delete
Description     delete an publication using its id
Access          Public
Parameter       ID
Methods         DELETE
*/
Router.delete("/delete/:id", async(req,res)=>{
    const updatedPublicationDatabase = await PublicationModel.findOneAndDelete({id : req.params.id});
    // const updatedPublicationDatabase = database.publication.filter(
    //     (publication) => publication.id !== parseInt(req.params.id) 
    // );

    // database.publication = updatedPublicationDatabase;
    return res.json({publication: updatedPublicationDatabase, message: "Publication Deleted!!"});
});

/*
Route           /publication/delete/book
Description     delete a book from publication using its ISBN
Access          Public
Parameter       ISBN, Publication ID
Methods         DELETE
*/
Router.delete("/delete/book/:isbn/:pubId", async(req, res)=>{
    //update publication database
    const updatePub = await PublicationModel.findOneAndDelete(
        {
            id: parseInt(req.params.pubId),
        },
        {
            $pull:{
                books : req.params.isbn,
            }
        },
        {
            new: true,
        }
        );
    // database.publication.forEach((publication)=>{
    //     if(publication.id === parseInt(req.params.pubId)){
    //         const newBookList = publication.books.filter(
    //             (book)=> book !== req.params.isbn
    //         );

    //         publication.books = newBookList;
    //         return;
    //     }
    // });

    //update book database
    const updateBook= await BookModels.findOneAndUpdate(
        {
            ISBN : req.params.isbn,
        },
        {
        $set:{
            publication : 0,
        }
        },
        {
            new: true,
        }
    );
    return res.json({books: updateBook, publication: updatePub,message: "Deleted a book from publication!!"});
});
//Exporting
module.exports = Router;