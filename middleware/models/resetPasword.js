import User from "../middleware/models/UserSchema.js";

router.post("/reset-password/:token", async (req,res)=>{

const {password} = req.body

const user = await User.findOne({
resetPasswordToken:req.params.token,
resetPasswordExpire:{$gt:Date.now()}
})

if(!user){
return res.json({
status:"01",
message:"Invalid or expired token"
})
}

user.password = password

user.resetPasswordToken = undefined
user.resetPasswordExpire = undefined

await user.save()

res.json({
status:"00",
message:"Password reset successful"
})

})