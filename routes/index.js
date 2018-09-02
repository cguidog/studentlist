const express = require('express');
const app = express();
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const mongoose = require('mongoose');
const metOvrr = require("method-override");
const url = 'mongodb://localhost:27017/test';

mongoose.connect(url);
app.use(metOvrr("_method"));
const studentSchema = new mongoose.Schema({
  name: String,
  last_name: String
});

const Student = mongoose.model('Student', studentSchema);

/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

app.get('/students', function(req, res){

  MongoClient.connect(url, function(err, database){
    if(err){
      console.log('Unable to connect to the server', err);
    } else {
      console.log('Connection Established');

      const db = database.db('test');
      
      db.collection('students').find({}).toArray((err, result)=> {
        if (err) {
          res.send(err);
        } else if (result.length) {
          res.render('studentlist', {
            'studentlist' : result
          });
        } else {
          res.send('No documents found');
        }
        database.close();
      });
    }
  });
});
app.get('/students/new', (req, res)=>{
  res.render('newstudent')
});

app.post('/students', (req, res)=> {
  Student.create({name: req.body.name, last_name: req.body.last_name}, (err, newStudent)=>{
  if (err) {
    res.render('newstudent');
  } else { res.redirect('/students');
  
  }
  });
  });

app.get('/students/:id', (req, res)=>{
Student.findById(req.params.id, (err, showStudent)=>{
  if(err) {
    console.log(err);
  } else {
    res.render('show', {student: showStudent})
  }
});
});

app.get('/students/:id/edit', (req, res)=>{
Student.findById(req.params.id, (err, showStudent)=>{
if (err){
  res.redirect('/students');
} else {
  res.render('editstudent', {student: showStudent});
}
});
});

app.put('/students/:id', (req, res)=>{
Student.findByIdAndUpdate(req.params.id, {name: req.body.name, last_name: req.body.last_name}, (err, UpdtStudent)=>{
  if (err) {
    res.redirect('/students/' + req.params.id);
  } else {
    res.redirect('/students');
  }
});
});

app.delete('/students/:id', (req, res)=>{
Student.findByIdAndRemove(req.params.id, (err)=>{
  if (err) {
    res.redirect('/students/' + req.params.id);
  } else {
    res.redirect('/students');
  }
});
});

module.exports = app;
