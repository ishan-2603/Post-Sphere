const Post=require('../../models/Post');
const checkAuth=require('../../utils/check-auth');
const {AuthenticationError,UserInputError}=require('apollo-server');

module.exports={
  Query : {
      async getPosts(){
        try{
          const posts= await Post.find().sort({ createdAt : -1});
          return posts;
        }catch(err){
          throw new Error(err);
        }
      },
      async getPost(_,{ postId }){
        try{
          const post=await Post.findById(postId);
          if(post){
            return post;
          } else {
            throw new Error('Post not found');
          }
        } catch(err){
          throw new Error(err);
        }
      }
    },
  Mutation : {
    async createPost(_,{ body},context){
      const user=checkAuth(context);

      if(body.trim()===''){
        throw new UserInputError('Post body must not be empty');
      }

      console.log(user);
      const newPost=new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      });
      const post=await newPost.save();
      context.pubsub.publish('NEW_POST',{
        newPost : post
      })
      return post;
    },
    async deletePost(_,{postId},context){
      const user=checkAuth(context);
      // console.log(user);
      try{
        const post=await Post.findById(postId);
        if(user.username===post.username){
          await post.deleteOne();
          return 'Post deleted successfully';
        } else{
          throw new AuthenticationError('Action not allowed');
        } 
      }catch(err){
          throw new Error(err);
      }
    },
    async likePost(_,{postId},context){
      const {username}=checkAuth(context);
      const post=await Post.findById(postId);
      if(post){
        if(post.likes.find(like => like.username===username)){
          //Post already liked,unlike it
          post.likes=post.likes.filter(like => like.username !=username);
          await post.save();
        } else{
          //Not liked, like post
          post.likes.push({
            username,
            createdAt : new Date().toISOString()
          })
        }
        await post.save();
        return post;
      } else{
        throw new UserInputError('Post not found');
      }
    } 
  },
  Subscription: {
    newPost:{
      subscribe: (_,__,{pubsub}) => pubsub.asyncIterator('NEW_POST')
    }
  }
}