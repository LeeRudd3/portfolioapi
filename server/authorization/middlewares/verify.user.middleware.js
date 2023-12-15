const UserModel = require('../../users/model/user.model');
const crypto = require('crypto');

exports.hasAuthValidFields = (req, res, next) => {
    let errors = [];
    if (req.body) {
        if (!req.body.email) {
            errors.push('Missing email field');
        }
        if (!req.body.password) {
            errors.push('Missing password field');
        }

        if (errors.length) {
            console.log(errors.join(','));
            return res.status(400).send({errors: errors.join(',')});
        } else {
            console.log("Moving on from hasAuthValidFields");
            return next();
        }
    } else {
        return res.status(400).send({errors: 'Missing email and password fields'});
    }
};

exports.isPasswordAndUserMatch = (req, res, next) => {
    UserModel.findByEmail(req.body.email)
        .then((user)=>{
            if(!user){
                console.log("Error in user and password match");
                res.status(404).send({errors: ['Email Not Found']});
            }else{
                let passwordFields = user.password.split('$');
                let salt = passwordFields[0];
                console.log(`password is ${req.body.password}`)
                let hash = crypto.createHmac('sha512', salt)
                                 .update(req.body.password)
                                 .digest("base64");
                if (hash === passwordFields[1]) {
                    req.body = {
                        userId: user._id,
                        email: user.email,
                        permissionLevel: user.permissionLevel,
                        provider: 'email',
                        name: user.firstName + ' ' + user.lastName,
                    };
                    console.log("Username and Password Match");
                    return next();
                } else {
                    return res.status(401).send({errors: ['Invalid email or password']});
                }
            }
        });
 };