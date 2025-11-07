
const {registerUser,loginUser, keyMatrixService, GetTotalusers} = require("../service/user.service")



const register = async (req, res) => {
  const { name, email, password ,number,age,gender} = req.body;
  try {

    const {newUser,token} = await registerUser({ name, email, password ,number,age,gender});


    // res.cookie("token", token, {
    //   httpOnly: true,          
    //   secure: process.env.NODE_ENV === "production", 
    //   sameSite: "strict",      
    //   maxAge: 7 * 24 * 60 * 60 * 1000, 
    // });

//     res.cookie("token", token, {
//   httpOnly: true,
//   secure: false,        
//   sameSite: "lax",        
//   path: "/",
//   maxAge: 7 * 24 * 60 * 60 * 1000,
// });

    return res.status(201).json({
      success: true,
      msg: "user created successfully",
      data: newUser.userName,
      userId:newUser?._id,
      token:token
    });
  } catch (error) {
    console.error(" Error in register:", error);
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};


const login= async(req,res)=>{
    try {
        const {email,password}=req.body;

const {verifyUser, token}=await loginUser({email,password})

return res.status(201).json({
  success:true,
  msg:'login successfull',
  Name:verifyUser?.userName,
   userId:verifyUser?._id,
  token:token
})
    } catch (error) {
        console.error(" Error in login:", error);
    res.status(500).json({
      success: false,
      msg: error.message,
    });
    }
}


const userKeyMetrics = async (req, res) => {
  try {
    const { totalUser, newUser, activeCount,totalRevenue } = await keyMatrixService();

    res.status(200).json({
      success: true,
      totalUser,
      newUser,
      activeCount,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

const GetTotalUserData=async(req,res)=>{
  try {
    const data= await GetTotalusers()
       res.status(200).json({
      success: true,
     data
    });
  } catch (error) {
        res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
}

module.exports = { register ,login,userKeyMetrics,GetTotalUserData};
