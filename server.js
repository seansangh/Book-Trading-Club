// server.js
// where your node app starts
// init project
const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const passport= require('passport');
const LocalStrategy = require('passport-local');
const session= require('express-session');
var accessCode="";
var util = require('util');
var methodOverride = require('method-override');
var GitHubStrategy = require('passport-github').Strategy;
var partials = require('express-partials');
var MongoClient= require('mongodb');
var ObjectId= require('mongodb').ObjectID;


var GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
var GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extend:true}));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(partials());
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

var FileStore = require('session-file-store')(session);
 
app.use(session({
    store: new FileStore({ttl: 60000*100}),
    secret: 'keyboard cat'
}));


MongoClient.connect(process.env.DB, {useNewUrlParser: true},function(err, db){
    if(err) {
        console.log('Database error: ' + err);
    } else {
        console.log('Successful database connection');



passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "https://far-sale.glitch.me/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
  }
));


app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/error' }),
  function(req, res) {
  
    db.collection('book').find({name:req.user.username}).toArray(function(err,docs){
         if(docs.length>0){

           console.log('yes')
           
         }
         else{
           
    db.collection('book').insertOne({name:req.user.username, fullname:'', city:'', state:'', address:'', booka:[], bookr:[[],[]], bookt:[[],[]]}, function(err,docs){
      console.log('new user has been created')
    
    })                
           
           console.log(req.user.username)
         }	 
		 
})
    res.redirect('/success');
  });


//app.get('/', (req, res) => res.sendFile('auth.html', { root : __dirname}));

app.get('/success', function(req, res){

        res.redirect('/user/profile.html'); 

  
});
      
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});








app.get('/views/requests.html',function(req,res){
var title=[[['giver1'],['taker1']],[['giver2'],['taker2','taker3']]]
var name=[]
//, $where:'this.bookr[0].length>0'
db.collection('book').find({bookr : {$exists:true}}).toArray(function(err,docs){
         if(docs.length>0){
           var title=[];  var tArr=[]; var tArr1=[]; var tArr2=[]

           for(var i=0; i<docs.length; i++){
             if(docs[i]['bookr'] != []){  
             
             name.push(docs[i]['bookr'][0][0][0][0])
               

              for(var p=0; p<docs[i]['bookr'][0].length; p++){
              for(var p2=0; p2<docs[i]['bookr'][0][p].length; p2++){
               
               tArr1.push([docs[i]['bookr'][0][p][p2][1],docs[i]['bookr'][0][p][p2][3]])
              }
             }
               
             for(var q=0; q<docs[i]['bookr'][1].length; q++){
              for(var q2=0; q2<docs[i]['bookr'][1][q].length; q2++){
          
               tArr2.push([docs[i]['bookr'][1][q][q2][1],docs[i]['bookr'][1][q][q2][0],docs[i]['bookr'][1][q][q2][3]])
               }
             }              
            
             tArr=[tArr1, tArr2];
               
             title.push(tArr)
             tArr=[]; tArr1=[]; tArr2=[];
             
             }
           
           }
           
         }
         else{
         var title=[]; 
         }            // console.log(JSON.stringify(tArr1))

   res.render(__dirname + '/views/requests.html', {title: title, name: name});
 }) 
})

      
app.get('/views/index.html',function(req,res){
  
 db.collection('book').find({}).toArray(function(err,docs){
         if(docs.length>0){
           var title=[];  var tArr=[];

           for(var i=0; i<docs.length; i++){
             for(var p=0; p<docs[i]['booka'].length; p++){
               tArr=[docs[i]['booka'][p][0],docs[i]['booka'][p][1],docs[i]['booka'][p][2],docs[i]['booka'][p][3]]
                if(tArr[3].length<1){tArr[3]='n/a';}
               title.push(tArr)
               tArr=[];

             }
           }        
         }
         else{
         var title=[]; 
         }

   res.render(__dirname + '/views/index.html', {title: title});
 })
})

      
app.get('/views/trades.html',function(req,res){
var title=[[['giver1'],['taker1']],[['giver2'],['taker2','taker3']]]
var name=[]

db.collection('book').find({bookt : {$exists:true}}).toArray(function(err,docs){
         if(docs.length>0){
           var title=[];  var tArr=[]; var tArr1=[]; var tArr2=[]

           for(var i=0; i<docs.length; i++){
             if(docs[i]['bookt'] != []){  
             
             name.push(docs[i]['bookt'][0][0][0][0])
               

              for(var p=0; p<docs[i]['bookt'][0].length; p++){
              for(var p2=0; p2<docs[i]['bookt'][0][p].length; p2++){
               
               tArr1.push([docs[i]['bookt'][0][p][p2][1],docs[i]['bookt'][0][p][p2][3]])
              }
             }
               
             for(var q=0; q<docs[i]['bookt'][1].length; q++){
              for(var q2=0; q2<docs[i]['bookt'][1][q].length; q2++){
          
               tArr2.push([docs[i]['bookt'][1][q][q2][1],docs[i]['bookt'][1][q][q2][0],docs[i]['bookt'][1][q][q2][3]])
               }
             }              
            
             tArr=[tArr1, tArr2];
               
             title.push(tArr)
             tArr=[]; tArr1=[]; tArr2=[];
             
             }
           
           }
           
         }
         else{
         var title=[]; 
         }
   res.render(__dirname + '/views/trades.html', {title: title, name: name});
 })     
  
})

      
app.get('/views/users.html',function(req,res){
var title=[['a','b','c','d'],['a1','b1','c1','d1']]

db.collection('book').find({}).toArray(function(err,docs){
         if(docs.length>0){
           var title=[];  var tArr=[];

           for(var i=0; i<docs.length; i++){
             if(docs[i]['booka']!=[]){
               for(var p=0; p<docs[i]['booka'].length; p++){
               
               }  
               var m= docs[i]['booka'].length; console.log(m)
             }
             else{
               var m=0;
             }
             if(docs[i]['bookr'][0]!=[]){
               for(var p=0; p<docs[i]['booka'].length; p++){
               
               }  
               var m2= docs[i]['bookr'][0].length;
             }
             else{
               var m2=0;
             }
             if(docs[i]['city']!="" && docs[i]['state']!=""){
               var m3= docs[i]['city']+", "+docs[i]["state"];
             }
             else{
               var m3= "n/a";
             }
               
             tArr=[docs[i]['name'],m3,m,m2]
             title.push(tArr)
             tArr=[];console.log(title)
             
           }        
         }
         else{
         var title=[]; 
         }
   res.render(__dirname + '/views/users.html', {title: title});  
 })  

})


app.get('/views/profile.html',function(req,res){
  db.collection('book').find({name:req.query.user}).toArray(function(err,docs){
         if(docs.length>0){
           var title=[];  var tArr=[];
           title=[docs[0].name, docs[0].fullname, docs[0].city, docs[0].state, docs[0].address]
         }
         else{
         var title=[req.query.user, '' , '' ,'' ,'']; 
         }
  res.render(__dirname + '/views/profile.html', {title: title})
 })
  
})
      
app.get('/views/available.html', function(req,res){
db.collection('book').find({name:req.query.user}).toArray(function(err,docs){
         if(docs.length>0){
           var title=[];  var tArr=[];
           
           for(var i=0; i<docs[0]['booka'].length; i++){
              tArr=[docs[0]['booka'][i][0], docs[0]['booka'][i][1], docs[0]['booka'][i][2], docs[0]['booka'][i][3], docs[0]['booka'][i][4]]
           
           title.push(tArr)
           tArr=[];
           }
         }
         else{
         var title=[]; 
         }
  res.render(__dirname + '/views/available.html', {title: title, user: req.query.user})
 })
  
})


app.get('/views/books.html',function(req,res){
var title=[['1','2','3'],['1','2','3']]
  
  for(var i=0; i<title.length; i++){
    if(!title[i][3]){title[i][3]= 'null';}
  }

  res.render(__dirname + '/views/books.html', {title: title, user: req.user})
})
      

app.get('/views/login.html',function(req,res){
  if(req.query.code){var accessCode= req.query.code; }//res.send(req.query.code)}

  res.render(__dirname + '/views/login.html',{me: accessCode, user: req.user})
})

      
app.get('/', function(request, response) {
 db.collection('book').find({}).toArray(function(err,docs){
   
         if(docs.length>0){
           var title=[];  var tArr=[];

           for(var i=0; i<docs.length; i++){
             for(var p=0; p<docs[i]['booka'].length; p++){
               tArr=[docs[i]['booka'][p][0],docs[i]['booka'][p][1],docs[i]['booka'][p][2],docs[i]['booka'][p][3]]
                if(tArr[3].length<1){tArr[3]='n/a';}
               title.push(tArr)
               tArr=[];

             }
           }        
         }
         else{
         var title=[]; 
         }

   response.render(__dirname + '/views/index.html', {title: title});
 }) 
     
});


app.get('/user/profile.html', ensureAuthenticated, function(req, res) {
  var mee= req.user.username;
  if(req.query.user){
     mee= req.query.user;
  }
  
 db.collection('book').find({name: mee}).toArray(function(err,docs){
   
         if(docs.length>0){
           var title=[];  var tArr=[];

           for(var i=0; i<docs.length; i++){
               tArr=[docs[i]['name'],docs[i]['fullname'],docs[i]['city'],docs[i]['state'],docs[i]['address']]
               title.push(tArr)
               tArr=[];
           }        
         }
         else{
         var title=[]; 
         }

 res.render(__dirname + '/user/profile.html', {user: mee, title: title, user2:req.user.username})
 })   
   
});


app.get('/user/edit.html', ensureAuthenticated,function(req,res){
var title=[[req.user.username,'b','c','d','e','f']]
 db.collection('book').find({name: req.user.username}).toArray(function(err,docs){
   
         if(docs.length>0){
           var title=[];  var tArr=[];

           for(var i=0; i<docs.length; i++){
               tArr=[docs[i]['name'],docs[i]['fullname'],docs[i]['city'],docs[i]['state'],docs[i]['address']]
               title.push(tArr)
               tArr=[];
           }     

         }
         else{
         var title=[]; 
         }
         res.render(__dirname + '/user/edit.html', {user: req.user.username, title: title})

 })   

})


app.post('/user/edit.html', ensureAuthenticated,function(req,res){
var title=[0]; var tArr=[];
   console.log(req.body.a1)
   console.log(req.body.a2)
 db.collection('book').find({name: req.user.username}).toArray(function(err,docs1){
  docs1[0]['fullname']=req.body.a2; docs1[0]['city']=req.body.a3;
  docs1[0]['state']=req.body.a4; docs1[0]['address']=req.body.a5;
  
 db.collection('book').update({name: req.user.username},{$set:{name:docs1[0]['name'], fullname:docs1[0]['fullname'], city:docs1[0]['city'], state:docs1[0]['state'], address:docs1[0]['address'], booka:docs1[0]['booka'], bookr:docs1[0]['bookr'], bookt:docs1[0]['bookt']}},function(err,docs){

 })   
 })
  
var title=[[req.user.username,'b','c','d','e','f']]
 db.collection('book').find({name: req.user.username}).toArray(function(err,docs){
   
         if(docs.length>0){
           var title=[];  var tArr=[];

           for(var i=0; i<docs.length; i++){
               tArr=[docs[i]['name'],docs[i]['fullname'],docs[i]['city'],docs[i]['state'],docs[i]['address']]
               title.push(tArr)
               tArr=[];
           }     

         }
         else{
         var title=[]; 
         }
         res.redirect('/user/profile.html')
 })
})

app.get('/user/requests.html', ensureAuthenticated,function(req,res){
 var title=[[['giver1'],['taker1']],[['giver2'],['taker2','taker3']]]
 var name=[]

db.collection('book').find({bookr : {$exists:true}}).toArray(function(err,docs){
         if(docs.length>0){
           var title=[];  var tArr=[]; var tArr1=[]; var tArr2=[]

           for(var i=0; i<docs.length; i++){
             if(docs[i]['bookr'][0] != []){  
             
             name.push(docs[i]['bookr'][0][0][0][0])
               
             for(var p=0; p<docs[i]['bookr'][0].length; p++){
              for(var p2=0; p2<docs[i]['bookr'][0][p].length; p2++){
               
               tArr1.push([docs[i]['bookr'][0][p][p2][1],docs[i]['bookr'][0][p][p2][3]])
              }
             }
               
             for(var q=0; q<docs[i]['bookr'][1].length; q++){
              for(var q2=0; q2<docs[i]['bookr'][1][q].length; q2++){
          
               tArr2.push([docs[i]['bookr'][1][q][q2][1],docs[i]['bookr'][1][q][q2][0],docs[i]['bookr'][1][q][q2][3]])
               }
             }
            
             tArr=[tArr1, tArr2];
               
             title.push(tArr)
             tArr=[]; tArr1=[]; tArr2=[];
             
             }
           
           }
           
         }
         else{
         var title=[]; 
         }
  res.render(__dirname + '/user/requests.html',{user: req.user.username, title: title, name: name})
 })  
})
      
      

app.get('/user/newrequests.html', ensureAuthenticated,function(req,res){
var title=[]
var title2=[]; var tArr=[];

 /*function fmyF(){
   
db.collection('book').find({name: req.user.username}).toArray(function(err,docs){
   title=[];
         if(docs.length>0){
           for(var i=0; i<req.session.give.length; i++){
             for(var p=0; p<docs[0]['booka'].length; p++){
               tArr=[docs[0]['booka'][p][0],docs[0]['booka'][p][1],docs[0]['booka'][p][2],docs[0]['booka'][p][3]]
                if(tArr[3].length<1){tArr[3]='n/a';}
                if(req.session.give[i]== p){
                  title[i].push(tArr);
                }
               tArr=[];

             }
           }    return title;
         }
         else{
         var title=[]; 
         }

 })    
   
 }
  

 function fmyF2(){
   
db.collection('book').find({}).toArray(function(err,docs){
   title2=[];
         if(docs.length>0){
         
           for(var i=0; i<req.session.take.length; i++){
            var count=0;
            for(var r=0; r<docs.length; r++){  
             for(var p=0; p<docs[r]['booka'].length; p++){
               tArr=[docs[r]['booka'][p][0],docs[r]['booka'][p][1],docs[r]['booka'][p][2],docs[r]['booka'][p][3]]
                if(tArr[3].length<1){tArr[3]='n/a';}
                if(req.session.take[i]== count && docs[r]['name']!=req.user.username){
                  title2[i]=tArr;
                }
               tArr=[];
                if(docs[r]['name']!=req.user.username){
                   count++
                }
             }
           }
           
           
          } return title2;
         }
         else{
         var title2=[]; 
         }

 })    
   
 }*/
  //if(req.session.give != undefined){var title= myF(); console.log('1st function')}
  //if(req.session.take != undefined){var title2= myF2(); console.log('2nd function')}
  

          res.render(__dirname + '/user/newrequests.html',{user: req.user.username, title: title, title2: title2, p: req.session.give, q: req.session.take})
 
 
  
/*else{


  res.render(__dirname + '/user/newrequests.html',{user: req.user.username, title: title, p: req.session.give, q: req.session.take})
}*/
  
})

app.get('/user/mybooks.html', ensureAuthenticated,function(req,res){
 var title=[[['giver1'],['taker1']],[['giver2'],['taker2','taker3']]]
 var mee= req.user.username;
 if(req.query.user){
   mee= req.query.user;
 }
 
 db.collection('book').find({name: mee}).toArray(function(err,docs){
   
         if(docs.length>0){
           var title=[];  var tArr=[];

           for(var i=0; i<docs[0]['booka'].length; i++){
               tArr=[docs[0]['booka'][i][0],docs[0]['booka'][i][1],docs[0]['name'],docs[0]['city']]
               title.push(tArr)
               tArr=[];
             if(title[i][3]==""){title[i][3]='n/a'}
           }
         }
         else{
         var title=[]; 
         }

   
  res.render(__dirname + '/user/mybooks.html',{user: req.user.username, title: title, user2: mee})
 })  
})


app.post('/user/mybooks.html', ensureAuthenticated,function(req,res){

  var title=[]; var tArr=[];
   console.log(req.body.mb1)
   console.log(req.body.mb2)
  if(req.body.mb1!="" && req.body.mb2!="" && req.body.mb3!=""){
 db.collection('book').find({name: req.user.username}).toArray(function(err,docs1){
  docs1[0]['booka'].push([req.body.mb1,req.body.mb2,docs1[0]['name'],docs1[0]['city'],req.body.mb3]);
  
 db.collection('book').update({name: req.user.username},{$set:{name:docs1[0]['name'], fullname:docs1[0]['fullname'], city:docs1[0]['city'], state:docs1[0]['state'], address:docs1[0]['address'], booka:docs1[0]['booka'], bookr:docs1[0]['bookr'], bookt:docs1[0]['bookt']}},function(err,docs){

 })   
 })
}
         
var title=[[req.user.username,'b','c','d','e','f']]
 db.collection('book').find({name: req.user.username}).toArray(function(err,docs){
   
         if(docs.length>0){
           var title=[];  var tArr=[];

           for(var i=0; i<docs.length; i++){
               tArr=[docs[i]['name'],docs[i]['fullname'],docs[i]['city'],docs[i]['state'],docs[i]['address']]
               title.push(tArr)
               tArr=[];
           }     

         }
         else{
         var title=[]; 
         }
         res.redirect('/user/profile.html')
 })
   
})
      

app.get('/user/books.html', ensureAuthenticated,function(req,res){
var title=[[['giver1'],['taker1']],[['giver2'],['taker2','taker3']]]
  db.collection('book').find({}).toArray(function(err,docs){
   
         if(docs.length>0){
           var title=[];  var tArr=[];

           for(var i=0; i<docs.length; i++){
             for(var p=0; p<docs[i]['booka'].length; p++){
               tArr=[docs[i]['booka'][p][0],docs[i]['booka'][p][1],docs[i]['booka'][p][2],docs[i]['booka'][p][3]]
                if(tArr[3].length<1){tArr[3]='n/a';}
               title.push(tArr)
               tArr=[];

             }
           }        
         }
         else{
         var title=[]; 
         }

  res.render(__dirname + '/user/books.html',{user: req.user.username, title: title})
 }) 

})


app.get('/user/trades.html', ensureAuthenticated,function(req,res){
 var title=[[['giver1'],['taker1']],[['giver2'],['taker2','taker3']]];
 var name=[];

db.collection('book').find({bookt : {$exists:true}, $where:'this.bookt[0].length>0'}).toArray(function(err,docs){
         if(docs.length>0){
           var title=[];  var tArr=[]; var tArr1=[]; var tArr2=[]

           for(var i=0; i<docs.length; i++){
             if(docs[i]['bookt'][0] != []){  
             
             name.push(docs[i]['bookt'][0][0][0][0])
               

              for(var p=0; p<docs[i]['bookt'][0].length; p++){
              for(var p2=0; p2<docs[i]['bookt'][0][p].length; p2++){
               
               tArr1.push([docs[i]['name'],docs[i]['bookt'][0][p][p2][1],docs[i]['bookt'][0][p][p2][3]])
              }
             }
               
             for(var q=0; q<docs[i]['bookt'][1].length; q++){
              for(var q2=0; q2<docs[i]['bookt'][1][q].length; q2++){
          
               tArr2.push([docs[i]['bookt'][1][q][q2][1],docs[i]['bookt'][1][q][q2][0],docs[i]['bookt'][1][q][q2][3]])
               }
             }              
            
             tArr=[tArr1, tArr2];
             title.push(tArr)
             tArr=[]; tArr1=[]; tArr2=[];
             }
           
           }
           
         }
         else{
         var title=[]; 
         }
  res.render(__dirname + '/user/trades.html',{user: req.user.username, title: title, name: name})
 })  

})
      

app.get('/user/users.html', ensureAuthenticated,function(req,res){
var title=[['a','b','c','d'],['a1','b1','c1','d1']]

db.collection('book').find({}).toArray(function(err,docs){
         if(docs.length>0){
           var title=[];  var tArr=[];

           for(var i=0; i<docs.length; i++){
             if(docs[i]['booka']!=[]){
               for(var p=0; p<docs[i]['booka'].length; p++){
               
               }  
               var m= docs[i]['booka'].length; console.log(m)
             }
             else{
               var m=0;
             }
             if(docs[i]['bookr'][0]!=[]){
               for(var p=0; p<docs[i]['booka'].length; p++){
               
               }  
               var m2= docs[i]['bookr'][0].length;
             }
             else{
               var m2=0;
             }
             if(docs[i]['city']!="" && docs[i]['state']!=""){
               var m3= docs[i]['city']+", "+docs[i]["state"];
             }
             else{
               var m3= "n/a";
             }
               
             tArr=[docs[i]['name'],m3,m,m2]
             title.push(tArr)
             tArr=[];console.log(title)
             
           }        
         }
         else{
         var title=[]; 
         }
   res.render(__dirname + '/user/users.html', {title: title, user: req.user.username})
 })  
})

      
app.get('/user/books/give', ensureAuthenticated,function(req,res){
var title=[[['giver1'],['taker1']],[['giver2'],['taker2','taker3']]]
  db.collection('book').find({}).toArray(function(err,docs){
   
         if(docs.length>0){
           var title=[];  var tArr=[];

           for(var i=0; i<docs.length; i++){
             for(var p=0; p<docs[i]['booka'].length; p++){
               tArr=[docs[i]['booka'][p][0],docs[i]['booka'][p][1],docs[i]['booka'][p][2],docs[i]['booka'][p][3]]
                if(tArr[3].length<1){tArr[3]='n/a';}
               if(docs[i]['name']== req.user.username){title.push(tArr)}
               tArr=[];

             }
           }        
         }
         else{
         var title=[]; 
         }

  res.render(__dirname + '/user/books/give.html',{user: req.user.username, title: title, p: req.session.give})
 })   
 
})

app.get('/user/books/take', ensureAuthenticated,function(req,res){
var title=[[['giver1'],['taker1']],[['giver2'],['taker2','taker3']]]
  db.collection('book').find({}).toArray(function(err,docs){
   
         if(docs.length>0){
           var title=[];  var tArr=[];

           for(var i=0; i<docs.length; i++){
             for(var p=0; p<docs[i]['booka'].length; p++){
               tArr=[docs[i]['booka'][p][0],docs[i]['booka'][p][1],docs[i]['booka'][p][2],docs[i]['booka'][p][3]]
                if(tArr[3].length<1){tArr[3]='n/a';}
               if(docs[i]['name']!= req.user.username){title.push(tArr)}
               tArr=[];

             }
           }        
         }
         else{
         var title=[]; 
         }

  res.render(__dirname + '/user/books/take.html',{user: req.user.username, title: title})
 })
})

app.post('/user/books/take', ensureAuthenticated,function(req,res){
  var title=[]; 
  db.collection('book').find({}).toArray(function(err,docs){
         if(docs.length>0){
           var title=[];  var tArr=[];
           var ans2= Object.keys(req.body); var ans=[];
//console.log(ans+ " yep")
  for(var x=0; x<ans2.length; x++){
    var d=ans2[x].replace(/\D/gi,'');
    ans.push(d)
  }          
           
           for(var i=0; i<ans.length; i++){
            var count=0;
            for(var r=0; r<docs.length; r++){  
             for(var p=0; p<docs[r]['booka'].length; p++){
               tArr=[docs[r]['booka'][p][0],docs[r]['booka'][p][1],docs[r]['booka'][p][2],docs[r]['booka'][p][3],docs[r]['booka'][p][4]]
                if(tArr[3].length<1){tArr[3]='n/a';}
                if(ans[i]== count && docs[r]['name']!=req.user.username){
                  title[i]=tArr;
                }
               tArr=[];
                if(docs[r]['name']!=req.user.username){
                   count++
                }
             }
           }
             
          }           
           
           
      if(title.length>0){req.session.take=title};
  console.log(req.session.take + " on the post")
  res.redirect('/user/newrequests.html')
         }
         else{
         var title=[]; 
    //     console.log(req.session.take + " on the post")
         res.redirect('/user/newrequests.html')  
         }

 })  

})
      

app.post('/user/books/give', ensureAuthenticated,function(req,res){
  var title=[]; 
  db.collection('book').find({name: req.user.username}).toArray(function(err,docs){
         if(docs.length>0){
           var title=[];  var tArr=[];
var ans2= Object.keys(req.body); var ans=[];
//console.log(ans+ " yep")
  for(var x=0; x<ans2.length; x++){
    var d=ans2[x].replace(/\D/gi,'');
    ans.push(d)
  }          
           
           for(var i=0; i<ans.length; i++){
             for(var p=0; p<docs[0]['booka'].length; p++){
               tArr=[docs[0]['booka'][p][0],docs[0]['booka'][p][1],docs[0]['booka'][p][2],docs[0]['booka'][p][3],docs[0]['booka'][p][4]]
                if(tArr[3].length<1){tArr[3]='n/a';}
                if(ans[i]== p){
                  title[i]=tArr;
                }
               tArr=[];

             }
           
             
          }
   //   req.session.give= title;
      if(title.length>0){req.session.give= title;}
            console.log(req.session.give + " on the post")
  res.redirect('/user/newrequests.html')
         }
         else{
         var title=[]; 
      //   console.log(title +" "+req.session.give + " on the post")
         res.redirect('/user/newrequests.html')  
         }

 })

})



app.post('/user/newrequests.html', ensureAuthenticated,function(req,res){
  
  if(req.session.give != undefined && req.session.take != undefined){
var title=[0]; var tArr=[];console.log(req.session.give)
   var p= [[]]; p[0][0]=req.session.give[0][2]; p[0][1]=req.session.give[0][0]; p[0][2]=req.session.give[0][3]; p[0][3]=req.session.give[0][1];
   var q= [[]]; q[0][0]=req.session.take[0][2]; q[0][1]=req.session.take[0][0]; q[0][2]=req.session.take[0][3]; q[0][3]=req.session.take[0][1];
  console.log(p)
 db.collection('book').find({name: req.user.username}).toArray(function(err,docs1){
   docs1[0]['bookr'][0].push(p);
   docs1[0]['bookr'][1].push(q);
 
  
 db.collection('book').update({name: req.user.username},{$set:{name:docs1[0]['name'], fullname:docs1[0]['fullname'], city:docs1[0]['city'], state:docs1[0]['state'], address:docs1[0]['address'], booka:docs1[0]['booka'], bookr:docs1[0]['bookr'], bookt:docs1[0]['bookt']}},function(err,docs){

 })   
 })
}
   req.session.give= undefined; req.session.take= undefined;
  
         res.redirect('/user/profile.html')

})      
      
      
app.get('/user/deleterequest.html', function(req, res){
  var a= req.query.id; var me= req.query.id;
  var a1= a.match(/^\d/g); a= a.replace(/^\d/g, ''); a= a.replace(/^, /g, '');
  var a2= a.match(/^\d/g); a= a.replace(/^\d/g, ''); a= a.replace(/^, /g, '');
 
//res.send(me +" : "+ a1+ ": "+ a2+" : "+a);
  
 db.collection('book').find({}).toArray(function(err,docs1){
   
   for(var c=0; c< docs1.length; c++){
   
     if(a1==c){
  docs1[c]['bookr'][0][a]="";
  docs1[c]['bookr'][1][a]="";
       
       if(docs1[c]['bookr'][1].length==1){
          docs1[c]['bookr']=[];
        }
       else{
         for(var t=0; t< docs1[c]['bookr'][0].length; t++){
           if(a<=t){
             
             if(docs1[c]['bookr'][0][t+1]){
              docs1[c]['bookr'][0][t]= docs1[c]['bookr'][0][t+1];
              docs1[c]['bookr'][1][t]= docs1[c]['bookr'][1][t+1];
             }
             else{
  docs1[c]['bookr'][0][t]="";
  docs1[c]['bookr'][1][t]="";             
             }
           }
         }
         docs1[c]['bookr'][0]=docs1[c]['bookr'][0].filter(x=>x!="");
         docs1[c]['bookr'][1]=docs1[c]['bookr'][1].filter(x=>x!="");
       }
       
 db.collection('book').update({name: req.user.username},{$set:{name:docs1[c]['name'], fullname:docs1[c]['fullname'], city:docs1[c]['city'], state:docs1[c]['state'], address:docs1[c]['address'], booka:docs1[c]['booka'], bookr:docs1[c]['bookr'], bookt:docs1[c]['bookt']}},function(err,docs){

 })   
     
     
     
     }
   
   }
 })
 
  
 res.redirect('/user/profile.html')

});      
      
      
app.get('/user/deleterequest2.html', function(req, res){
  //res.send('Yep')
var a= req.query.id; var me= req.query.id;
  var a1= a.match(/^\d/g); a= a.replace(/^\d/g, ''); a= a.replace(/^, /g, '');
  var a2= a.match(/^\d/g); a= a.replace(/^\d/g, ''); a= a.replace(/^, /g, '');
 
//res.send(me +" : "+ a1+ ": "+ a2+" : "+a);
  
 db.collection('book').find({}).toArray(function(err,docs1){
   
   for(var c=0; c< docs1.length; c++){
     if(a1==c){
       var contain= 0;
       
       for(var t=0; t<docs1[c]['bookt'][1].length; t++){
        // console.log(docs1[c]['bookr'][0][a]+' and '+ docs1[c]['bookt'][0][t]+'; '+docs1[c]['bookr'][1][a]+' and '+ docs1[c]['bookt'][1][t]+"<br />")
         if(JSON.stringify(docs1[c]['bookr'][0][a])==JSON.stringify(docs1[c]['bookt'][0][t]) && JSON.stringify(docs1[c]['bookr'][1][a])==JSON.stringify(docs1[c]['bookt'][1][t])){
            contain++; 
         }
       }
      // console.log(contain)
  if(contain==0){ 
  docs1[c]['bookt'][0].push(docs1[c]['bookr'][0][a]);
  docs1[c]['bookt'][1].push(docs1[c]['bookr'][1][a]);
     }
        /*        
       if(docs1[c]['bookr'][1].length==1){
          docs1[c]['bookr']=[];
        }
       else{
         for(var t=0; t< docs1[c]['bookr'][0].length; t++){
           if(a<=t){
             
             if(docs1[c]['bookr'][0][t+1]){
              docs1[c]['bookr'][0][t]= docs1[c]['bookr'][0][t+1];
              docs1[c]['bookr'][1][t]= docs1[c]['bookr'][1][t+1];
             }
             else{
  docs1[c]['bookr'][0][t]="";
  docs1[c]['bookr'][1][t]="";             
             }
           }
         }
         docs1[c]['bookr'][0]=docs1[c]['bookr'][0].filter(x=>x!="");
         docs1[c]['bookr'][1]=docs1[c]['bookr'][1].filter(x=>x!="");
       }    */  
       
 db.collection('book').update({name: docs1[c].name},{$set:{name:docs1[c]['name'], fullname:docs1[c]['fullname'], city:docs1[c]['city'], state:docs1[c]['state'], address:docs1[c]['address'], booka:docs1[c]['booka'], bookr:docs1[c]['bookr'], bookt:docs1[c]['bookt']}},function(err,docs){

 })   
     
     
   
     }

   }
 })

  
  res.redirect('/user/profile.html')
  
});


app.get('/logout', function(req, res){
  req.logout();
  req.session.destroy();
  res.redirect('/');
});
          
      
}    
})     

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});





function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/views/login.html')
}
