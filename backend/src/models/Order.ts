import mongoose, { HydratedDocument, Model, Schema, Types } from 'mongoose';

export type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface IOrderItem {
  menuItemId?: Types.ObjectId;
  name?: string;
  price?: number;
  quantity: number;
}

export interface IOrder {
  user: Types.ObjectId;
  restaurant: Types.ObjectId;
  items: IOrderItem[];
  subtotal?: number;
  deliveryFee: number;
  total?: number;
  status: OrderStatus;
  deliveryAddress?: string;
}

export type IOrderDocument = HydratedDocument<IOrder>;
export type OrderModel = Model<IOrder>;

const orderItemSchema = new Schema<IOrderItem>(
  { menuItemId: Schema.Types.ObjectId, name: String, price: Number, quantity: { type: Number, default: 1 } },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: [orderItemSchema],
    subtotal: Number,
    deliveryFee: { type: Number, default: 2.99 },
    total: Number,
    status: {
      type: String,
      enum: ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'placed',
    },
    deliveryAddress: String,
  },
  { timestamps: true }
);

export default mongoose.model<IOrder, OrderModel>('Order', orderSchema);
