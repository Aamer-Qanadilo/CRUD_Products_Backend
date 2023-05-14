import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();

app.use(cors());

// Using normal express.json() will act like a middle ware to transfer the req as json
// Using this express.json({limit: '100mb'}) is to allow uploading images
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb'}));

const query = mysql.createConnection({
    host: 'localhost',
    database: 'products',
    user: 'root',
    password: ''
});

app.get('/search/:name?', (req, res) => {
    let {name} = req.params;
    if(typeof name === 'undefined') name = '';
    query.execute(`SELECT * FROM informations
                    WHERE name LIKE '%${name}%';`, (err, data) => {
                        if(err) res.json({message: 'failed', error: err});
                        res.json({message: 'success', Products: data});
                    })
});

app.get('/getAllProducts', (req, res) => {
     query.execute('SELECT * FROM informations', (err, data) => {
        if(err) res.json({message: 'failed', error: err});
        res.json({message: 'success', Products: data});
    })
});



app.post('/addProduct', (req, res) => {
    const {name, quantity, price, description, image} = req.body;
    query.execute(`INSERT INTO informations 
                          VALUES (NULL,'${name}','${quantity}','${price}','${description}','${image}')`, (err, data) =>{
                            if(err) res.json({message: 'failed', error: err});
                            res.json({message: 'success'});
    })
});

app.put('/updateProduct', (req, res) => {
    const {id, name, quantity, price, description, image} = req.body;
    query.execute(`UPDATE informations SET  name='${name}',
                                            quantity='${quantity}',
                                            price='${price}',
                                            description='${description}',
                                            image='${image}' 
                                            WHERE id=${id}`, (err, data) => {
        if(err) res.json({message: 'failed', error: err});
        else res.json({message: 'success'});
    })
});

app.delete('/deleteProduct', (req, res) => {
    const {id} = req.body;
    query.execute(`DELETE FROM informations WHERE id=${id}`, (err, data) => {
        if(err) res.json({message: 'failed', error: err});
        res.json({message: 'success'});
    })
});

app.delete('/deleteAllProducts', (req, res) => {
    query.execute(`DELETE FROM informations WHERE 1`, (err, data) => {
        if(err) res.json({message: 'failed', error: err});
        res.json({message: 'success'});
    })
});

app.listen(3000);