import UserModel from '../Models/UserModels.js';
import bcrypt from 'bcrypt';

export const getUser = async (req, res) => {
  const id = req.params.id;
  
  try {
    const user = await UserModel.findById(id) // Use lean() for plain JavaScript object
    if (user) {
    const {password,...others}=user._doc;
    res.status(200).json(others);
    } else {
      res.status(404).json({ message: "User Not Found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { currentUserId, currentUserAdminStatus, password, ...otherDetails } = req.body;

  // Check if the user has permission to update
  if (id === currentUserId || currentUserAdminStatus) {
    try {
      // If password is being updated, hash it before saving
      if (password) {
        const salt = await bcrypt.genSalt(10);
        otherDetails.password = await bcrypt.hash(password, salt);
      }

      // Find the user by id and update with new data
      const updatedUser = await UserModel.findByIdAndUpdate(id, otherDetails, { new: true });

      // Check if the user was found and updated
      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res.status(404).json({ message: "User Not Found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(403).json({ message: "You don't have permission to update this user" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const { currentUserId, currentUserAdminStatus } = req.body;
// console.log(currentUserId,id);
  // Check if the user has permission to delete
  if (id === currentUserId || currentUserAdminStatus) {
    try {
      // Find the user by id and delete
      const deletedUser = await UserModel.findByIdAndDelete(id);

      // Check if the user was found and deleted
      if (deletedUser) {
        res.status(200).json({ message: "User deleted successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(403).json({ message: "You don't have permission to delete this user" });
  }
};

export const followUser=async(req,res)=>{
  const {id}=req.params;
  const {currentUserId}=req.body;
  if(currentUserId==id){
    res.status(403).json("Action Forbidden");
  }
  try {
    const followUser=await UserModel.findById(id);
    const followingUser=await UserModel.findById(currentUserId);
    
    if(!followUser.followers.includes(currentUserId)){
      await followUser.updateOne({$push:{followers:currentUserId}});
      await followingUser.updateOne({$push:{following:id}});
      res.status(200).json("User followed");
    }
    else{
      res.status(403).json("User already followed by you");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
export const UnfollowUser=async(req,res)=>{
  const {id}=req.params;
  const {currentUserId}=req.body;
  if(currentUserId==id){
    res.status(403).json("Action Forbidden");
  }
  try {
    const followUser=await UserModel.findById(id);
    const followingUser=await UserModel.findById(currentUserId);

    if(followUser.followers.includes(currentUserId)){
      await followUser.updateOne({$pull:{followers:currentUserId}});
      await followingUser.updateOne({$pull:{following:id}});
      res.status(200).json("User unfollowed");
    }
    else{
      res.status(403).json("You are not following him/her");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
