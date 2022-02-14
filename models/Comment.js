const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    text:{
        type:String,
        required:[true,'Please provide comment text'],
        maxlength:200
    },
    user:{
        type:String,
        required:[true,"Please provide comment's user"]
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
        required:[true,"Please provide comment's user"]
    },
    likes:{
        type:Array
    }
},{timestamps:true})

CommentSchema.statics.calculateNumOfComments = async function(postId){
    const result = await this.aggregate([
        {$match:{post:postId}},
        {$group:{
            _id:null,
            numOfComments:{$sum:1}
        }}
    ])
    try {
        await this.model('Post').findOneAndUpdate({_id:postId},
            {numOfComments:result[0]?.numOfComments || 0 }
        )
    } catch (error) {
        console.log(error)
    }
}

CommentSchema.post('save',async function(){
    await this.model('Comment').calculateNumOfComments(this.post)
})

CommentSchema.post('remove',async function(){
    await this.model('Comment').calculateNumOfComments(this.post)
})

module.exports = mongoose.model('Comment',CommentSchema)