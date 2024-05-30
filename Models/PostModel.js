import mongoose from "mongoose";

const postSchema=mongoose.Schema({
    userId:{
        type:String,
        require:true
    },
    desc:String,
    likes:[],
    img:String
},  
{
    timestamps:true
}
)

export const postModel=mongoose.model("Posts",postSchema);