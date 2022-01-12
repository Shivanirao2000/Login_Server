queries = {};

queries.auth = {
  signincheck:(username)=> `SELECT * from users WHERE username = '${username}' LIMIT 1;`,

  signinupdate: `UPDATE users SET lastlogged = now(), osname= $2, osversion= $3, token= $4, mobilemodel= $5 WHERE employeeid = $1`
        
        ,

  signupcheck(username){ return `SELECT employeeid FROM users WHERE username = '${username}';`},

  passwordchangecheck: `SELECT employeeid FROM users WHERE employeeid = $1;`,

  passwordupdate: `UPDATE users SET password = ? WHERE employeeid = $1;`,

  signupinsert(username,employeeid,password,mobilenumber,email){return  `INSERT INTO users (username, employeeid, password, mobilenumber, email) values ('${username}','${employeeid}','${password}','${mobilenumber}','${email}');`},

  getusers: `Select * from users;`,
  getuser: `Select * from users where employeeid = $1 LIMIT 1;`,
};



module.exports = queries;
