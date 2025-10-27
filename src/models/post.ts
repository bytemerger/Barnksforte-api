import { model, Schema, Document } from 'mongoose';

export interface IPost extends Document {
  id: string,
  content: string,
  author: string,
  sharedWith?: string[],
  createdAt: Date,
  updatedAt: Date,
}

const PostSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sharedWith: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc: any, ret: any) {
      delete ret.__v;
      delete ret._id;
      return ret;
    }
  },
  toObject: { virtuals: true },
})

const Post = model<IPost>('Post', PostSchema);
export default Post;