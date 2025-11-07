const express=require("express")
const { register, login, userKeyMetrics, GetTotalUserData } = require("../controller/user.controller")
const AuthenticationMiddleware = require("../middleware/Authenticate.middleware")

const Router=express.Router()

Router.post(`/register`,register)
Router.post('/login',login)

Router.get('/keyMatrics',AuthenticationMiddleware,userKeyMetrics)

Router.get("/userData",AuthenticationMiddleware,GetTotalUserData)

module.exports=Router