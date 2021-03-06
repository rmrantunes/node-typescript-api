import mongoose, { Schema, Document, Model } from "mongoose";

export enum GeoPosition {
  N = "N",
  S = "S",
  W = "W",
  E = "E",
}

export interface Beach {
  _id?: string;
  lat: number;
  lng: number;
  name: string;
  user: string;
  position: GeoPosition;
}

const beachSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    name: { type: String, required: true },
    position: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

interface BeachModel extends Omit<Beach, "_id">, Document {}
export const Beach: Model<BeachModel> = mongoose.model("Beach", beachSchema);
