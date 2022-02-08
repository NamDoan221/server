module.exports.errors = function(req) {
    let errors = [];
    if (!req.body.name) {
      errors.push("Name is required.");
    }

    return errors;
}