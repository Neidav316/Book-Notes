import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import env from "dotenv"


const app = express();
const port = 3000;
env.config();

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

db.connect();


let searchedBooks = [];

async function searchBooks(bookName){
    // split words to list
    let title = bookName.split(" ");
    let url = "https://openlibrary.org/search.json?q=";

    // append to url the words with a + in between
    title.forEach(word =>{
        url = url.concat(word);
        if (title[title.length-1] != word)
            url = url.concat("+");
    });
    // add the parameters
    url = url.concat("&fields=title,author_name,lending_edition_s&limit=5&sort=rating");
    try{
    let response = await axios.get(url);
    
    response.data.docs.forEach((doc,index)=>{
        doc["index"]=index;
    });
    return response.data.docs;
    } catch(err){
        console.error("Failed to make request:",err.message);
        return;
    }
}

async function getBooksFromDB(){
    const res = await db.query("SELECT * FROM books");
    let books = []
    res.rows.forEach((book)=>{
        books.push(book);
    });
    return books;
}

app.get("/", async (req,res)=>{
    try{
    const books = await getBooksFromDB();
    res.render("index.ejs",{
        books: books
    });
    } catch (err){
        console.log(err);
    }
});

app.get("/book/:id", async (req,res)=>{
    try{
        const book = await db.query("SELECT * FROM books WHERE id = $1",[req.params.id])
        const bookId = book.rows[0].id;
        try{
            const notes = await db.query("SELECT * FROM notes WHERE book_id = $1 ORDER BY id",[bookId]);
            res.render("booknotes.ejs",{
                book: book.rows[0],
                notes: notes.rows.length > 0 ? notes.rows : null
            });
        } catch (noteError){
            console.log(noteError);
            res.redirect("/");
        }
    } catch (bookError){
        console.log(bookError);
        res.redirect("/");
    }
});

app.post("/book/delete/:id", async (req,res)=>{
    const bookId = req.params.id;
    await db.query("DELETE FROM notes WHERE book_id = $1",[bookId]);
    await db.query("DELETE FROM books WHERE id = $1",[bookId]);
    res.redirect("/");
});
app.post("/note/delete/:bookId", async (req,res)=>{
    await db.query("DELETE FROM notes WHERE id = $1",[req.body.deleteNoteId]);
    res.redirect(`/book/${req.params.bookId}`);
})
app.post("/note/edit/:bookId", async (req,res)=>{
    await db.query("UPDATE notes SET note_content = $1 WHERE id = $2",[req.body.updatedNoteContent,req.body.updatedNoteId]);
    res.redirect(`/book/${req.params.bookId}`);
});

app.get("/add",(req,res)=>{
    res.render("newBook.ejs");
});
app.post("/add", async (req,res)=>{
    const bookName = req.body.bookName;
    searchedBooks = await searchBooks(bookName);
    if(searchedBooks.length > 0){
        res.render("newBook.ejs",{
            searchedBooks : searchedBooks,
            searchTitle:bookName
        })
    } else{

    }

});

app.post("/book/new", async (req,res)=>{
    const chosenBookIndex = req.body.bookIndex;
    try{
        await db.query("INSERT INTO books (title,author,cover_id) \
                        VALUES ($1,$2,$3)",[searchedBooks[chosenBookIndex].title,searchedBooks[chosenBookIndex].author_name[0],searchedBooks[chosenBookIndex].lending_edition_s]);
        res.redirect("/");
    } catch(err){
        console.log(err);
    }
});

app.post("/note/add",async (req,res)=>{
    const bookId = req.body.bookId;
    await db.query("INSERT INTO notes (note_content,book_id)\
                    VALUES ($1,$2)",[req.body.noteContent,bookId]);
    res.redirect("/book/"+bookId);
});

app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`);
});
