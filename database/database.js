let books = [
    {
        ISBN: "12345Book",
        title: "Hello World",
        pubDate: "2021-07-01",
        language: "en",
        numPage: 250, 
        author: [1,2],
        publication: [1],
        category: ["tech","programming","education"],
    },
];

const author = [
    {
      id: 1,
      name: "programmer",
      books:["12345Book","5678book2"],  
    },
    {
        id: 2,
        name: "jrprogrammer",
        books: ["12345Book"],
    }
];

const publication = [
    {
        id: 1,
        name: "oswall",
        books: ["12345Book"],
    },
    {
        id: 2,
        name: "pearson",
        books:[],
    }
];

module.exports = {books,author,publication};