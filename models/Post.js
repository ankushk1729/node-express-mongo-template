const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    body:{
        type:String,
        maxlength:400
    },
    image:{
        type:String,
    },
    likes:{
        type:Array,
    },

    createdBy:{
        type:String,
        required:[true,'Please provide user']
    },
    
    numOfComments:{
        type:Number,
        default:0
    }
},{timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}})

PostSchema.virtual('user',{
    ref:'User',
    localField:'createdBy',
    foreignField:'username',
    justOne:false
})
PostSchema.pre('remove', async function(){
    await this.model('Comment').deleteMany({post:this._id})

})

module.exports = mongoose.model('Post',PostSchema)
