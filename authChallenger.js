// //fs
// const fs = require("fs");

// //AuthChallenger function 
// function AuthChallenger(username, password, callback) {
//     const users = fs.readFileSync('./stores/users.json','utf-8',async(err,data)=>{
//       if (err){
//         throw err
//       }
//       return await data
//     });
//     let parsed = JSON.parse(users);
//     let user = parsed.users.filter((user)=> user.username === username);
//     if (user[0].username === username && user[0].password === password){
//       return callback(null,true);
//     } 
//     else{
//       return callback(null,false);
//     }
//   };

const AuthChallenger = (users) => {
  return (username, password) =>{
    // users.JSON.parse(users);
    return(
      typeof users[username] !== 'undefined' && users[username] == password
    );
  };
};
  //exporting AuthChallenger
  module.exports = AuthChallenger;
  