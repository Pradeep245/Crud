const User = require("../model/User")
const jwt = require("jsonwebtoken");
const {promisify} = require('util');

const GlobalError = require('../middlewares/Custom-error');

const asyncerror = require('../middlewares/async');

const sign = id =>{
    return jwt.sign({id},process.env.SECRET,{
        expiresIn:'1d'
    })
}

const createSendtoken = (user,code,res)=>{
    const token = sign(user._id);
    res.status(code).json({
        status:"success",
        token,
        data:{
            user
        }
    })
}



exports.signup = asyncerror(async(req,res,next)=>{
    const newUser = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm
    });

    createSendtoken(newUser,201,res);
})

exports.login = asyncerror(async(req,res,next)=>{
    const {email,password}= req.body;

    if(!email || !password){
        
        next(new GlobalError("Please provide email and password"))
    }
    const user = await User.findOne({email}).select('+password');
    if(!user || !(await user.checkpwd(password,user.password))){
        next( new GlobalError("incorrect email or password"));

    }


    createSendtoken(user,200,res);
})

exports.getAllUsers = asyncerror(async(req,res,next)=>{
    const users = await User.find();

    res.status(200).json({
        status:'success',
        totalusers:users.length,
        data:{
            users

        }
    })
})

exports.singleuser = asyncerror(async(req,res,next)=>{
const email = req.query.email;
if(!email){
    next( new GlobalError('please provide a email'))
}

    const users = await User.findOne({email});

    if(!users){
        next( new GlobalError("User Details not found"));
    }


    res.status(200).json({
        status:'success',
        data:{
            users

        }
    })
})
exports.protect = asyncerror(async(req,res,next)=>{
    let token;
    if(
        req.headers.authorization && req.headers.authorization.startsWith('Bearer')
    ){
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token){
        next(new GlobalError('please login in'));
    }

    const decoded = await promisify(jwt.verify)(token,process.env.SECRET);

    const currentuser = await User.findById(decoded.id);
    if(!currentuser){
        next( new GlobalError("wrong token"));
    }
    req.user = currentuser;
    next();

});


exports.updatePassword = asyncerror(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select('+password');

    if(!(await user.checkpwd(req.body.passwordCurrent,user.password))){
        next( new GlobalError("curent password is wrong"));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    createSendtoken(user,200,res);
})

exports.updateprofile = asyncerror(async(req,res,next)=>{

    if(req.body.password || req.body.passwordConfirm){
        next( new GlobalError('password update  is not allowed'))
    }
    const data = req.body.name;
    
    const updateuser = await User.findByIdAndUpdate(req.user.id,{"name":data},{
        new:true,
        runValidators:true
    })

    res.status(200).json({
        status:'success',
        data:{
            users:updateuser

        }
    })



})

exports.deleteuser = asyncerror(async(req,res,next)=>{
    // findByIdAndDelete()
    const deleteuser = await User.findByIdAndDelete(req.user.id)

    res.status(200).json({
        status:'success',
        data:{
            users:deleteuser

        }
    })
})