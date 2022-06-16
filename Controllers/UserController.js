import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";

// get a user
export const getUSer = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await UserModel.findById(id);

    if (user) {
      const { password, ...otherDetails } = user._doc;
      res.status(200).json(otherDetails);
    } else {
      res.status(404).json("user not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//update a user

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, currentUserAdminStatus, password } = req.body;

  if (id === currentUserId || currentUserAdminStatus) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }
      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  else {
    res.status(403).json("Access Denied! you can only update your own profile")
  }
};


//Delete user 
export const deleteUser = async (req, res)=> {
    const id = req.params.id

    const {currentUserId, currentUserAdminStatus} = req.body
    
    if(currentUserId=== id || currentUserAdminStatus)
    {
        try {
            
            await UserModel.findByIdAndDelete(id)
            res.status(200).json("user deleted successfully")
        } catch (error) {
            res.status(500).json(error);
            
        }
    }
    else{
        res.status(403).json("Access Denied! you can only delete your own profile")
    }
};


// Follow a user 
export const followUSer = async(req, res) =>{
    const id = req.params.id

    const {currentUserId} = req.body

    if(currentUserId === id)
    {
        res.status(403).json("Action forbidden")
    }
    else{
        try {
            const followUSer = UserModel.findById(followUSer)
            const followingUser = UserModel.findById(currentUserId)

            if(!followUSer.followers.includes(currentUserId))
            {
                await followUSer.updateOne({$push : (currentUserId)})
                await followUSer.updateOne({$push: {following: id}})
                res.status(200).json("User followed!")
            }
            else{
                res.status(403).json("user is already followed by you")
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
}