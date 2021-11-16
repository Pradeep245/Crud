const mongooes = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongooes.Schema({
    name:{
        type:String,
        required:[true, 'must provide name'],
        trim:true,
        maxlength: [20, 'name can not be more than 20 characters']
    },
    email:{
        type:String,
        required:[true, 'must provide email'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,"must provide a valid email"]
    },
    password:{
        type:String,
        required:[true,'must provide a password'],
        minlength:8,
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,'must provide a confirm password'],
        validate:{
            validator:function(e){
                return e === this.password;
            }
        }
        
    }


})

UserSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,12);
    this.passwordConfirm = undefined;
    next()

})

UserSchema.methods.checkpwd = async function(currentpassword,userpassword){
    return await bcrypt.compare(currentpassword,userpassword);
}

const User = mongooes.model('User',UserSchema);
module.exports = User;