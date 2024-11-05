import { model, Schema } from "mongoose";

const meetingSchema=new Schema({
    userId:{type:String},
    meeting:{type:String,required:true},
    date:{type:String,default:Date.now,required:true}
})
const meeting=new model("meeting",meetingSchema);
export {meeting};