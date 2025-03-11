const mongoose=require("mongoose")


const fileSchema = new mongoose.Schema({


    name:
    {      
    type:String,
    lowercase:true,
    required:true 
    },
    path:{
        type:String,
        lowercase:true,
        required:true 

    },
    type:
    {
        type:String,
        required:true,
        enum: ["pdf", "audio", "image", "video" ,"mp3", "wav","txt", "doc","docx",]
    },
    size:
    {
        type:String,
        required:true
    },
 title: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Title"
    }
},{})


module.exports=mongoose.model("File",fileSchema)