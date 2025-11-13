import {Schema, Types, model, Document} from 'mongoose';

export interface IComment extends Document {
    text: string;
    user: Types.ObjectId;
    featureRequest: Types.ObjectId;
    createdAt: Date;
    
}

const commentSchema = new Schema<IComment>({
    text: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    featureRequest: { type: Schema.Types.ObjectId, ref: 'FeatureRequest', required: true },
    createdAt: { type: Date, default: Date.now },
})

export default model<IComment>('Comment', commentSchema);