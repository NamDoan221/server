module.exports.errors = function(req) {
    let errors = [];
    if (!req.body.name) {
      errors.push("Name is required.");
    }
  
    if (!req.body.phone) {
      errors.push("Phone is required.");
    }

    return errors;
}

var a = {
	"key": "value"
}

console.log(a.key);