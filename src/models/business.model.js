import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },
  },
  { _id: false }
);

const businessSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    businessName: { type: String, required: true, trim: true },
    businessType: {
      type: String,
      required: true,
      enum: ["restaurant", "salon", "gym"],
    },
    phone: { type: String, required: true },
    address: { type: addressSchema, default: () => ({}) },
    googlePlaceId: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Business", businessSchema);
