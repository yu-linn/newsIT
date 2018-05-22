const Users = require('../models/login');
exports.addOne = function addUser(req, res) {
  console.log('addOne');
  console.log(req.body);
  const newCourse = new Course(req.body);
  newCourse.save((err) => {
    if (err) throw err;

    res.redirect('/courses');
  });
};