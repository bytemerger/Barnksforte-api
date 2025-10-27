import { model, Schema, Document } from 'mongoose';

export interface IUser extends Document {
  id: string,
  email: string,
  password: string,
  block: {
    isBlocked: boolean,
    reason: string,
    blockedAt: Date 
  }
}

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: String,
    block: {
      isBlocked: { type: Boolean, default: false },
      reason: { type: String },
      blockedAt: { type: Date },
    }
  },
  {
    timestamps: true,
    toJSON: { 
      virtuals: true,
      transform: function(doc: any, ret: any) {
        delete ret.password;
        delete ret.__v;
        delete ret._id;
        return ret;
      }
    },
    toObject: { virtuals: true },
  });

const User = model<IUser>('User', UserSchema);

export default User;