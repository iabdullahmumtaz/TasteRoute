import mongoose, { HydratedDocument, Model, Schema } from 'mongoose';

export interface IMenuItem {
  _id?: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
}

export interface IRestaurant {
  name: string;
  cuisine?: string;
  rating: number;
  deliveryTime: string;
  image?: string;
  menu: IMenuItem[];
}

export type IRestaurantDocument = HydratedDocument<IRestaurant>;
export type RestaurantModel = Model<IRestaurant>;

const menuItemSchema = new Schema<IMenuItem>(
  { name: { type: String, required: true }, description: String, price: { type: Number, required: true }, image: String, category: String },
  { _id: true }
);

const restaurantSchema = new Schema<IRestaurant>(
  {
    name: { type: String, required: true },
    cuisine: String,
    rating: { type: Number, default: 4.5 },
    deliveryTime: { type: String, default: '25-35 min' },
    image: String,
    menu: [menuItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IRestaurant, RestaurantModel>('Restaurant', restaurantSchema);
