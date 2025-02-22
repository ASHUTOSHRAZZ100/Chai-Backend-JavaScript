import { Schema, model } from "mongoose";
import mongooesAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commeentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

commeentSchema.plugin(mongooesAggregatePaginate);
export const Comment = model("Comment", commeentSchema);
