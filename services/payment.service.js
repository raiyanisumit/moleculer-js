const Razorpay = require("razorpay");
const { MoleculerError } = require("moleculer").Errors;
const mongoose = require("mongoose");
const orderModel = require("./payment.model");
const MongooseDbAdapter = require("moleculer-db-adapter-mongoose");
const DbMixin = require("../mixins/db.mixin");

const razorpayInstance = new Razorpay({
	key_id: "rzp_test_ezDhfGwsDYmY7i",
	key_secret: "Q66SB8KONh3z3Uqjqj7PpN3Q",
});

module.exports = {
	name: "payments",
  mixins: [DbMixin("moleculer-crud")],
  adapter: new MongooseDbAdapter(mongoose.connect("mongodb://127.0.0.1:27017/moleculer-authentication", { useNewUrlParser: true })),
	model : mongoose.model("test", mongoose.Schema({
    success:Boolean,
    msg:String,
    order_id:{
        type : String,
        unique : true
    },
    amount : Number,
    key_id :String,
    product_name :String,
    description :String,
    contact :String,
    name :String,
    email :String,


})),
  actions: {
		createOrder: {
			async handler(ctx) {
				try {
					const { amount, name, description } = ctx.params;
					const amountInPaise = amount * 100;

					const options = {
						amount: amountInPaise,
						currency: "INR",
						receipt: "razorUser@gmail.com",
					};

					const order = await new Promise((resolve, reject) => {
						// Simulating asynchronous Razorpay API call
						razorpayInstance.orders.create(
							options,
							(err, order) => {
								if (err) {
									reject(
										new MoleculerError(
											"Something went wrong!",
											400,
											"ORDER_ERROR"
										)
									);
								} else {
									resolve(order);
								}
							}
						);
					});
          const doc = await this.adapter.insert(
            {
              success: true,
              msg: "Order Created",
              order_id: order.id,
              amount: amountInPaise,
              key_id: "rzp_test_ezDhfGwsDYmY7i",
              product_name: name,
              description,
              contact: "8567345632",
              name: "Sumit Patel",
              email: "test123456789@gmail.com",
          }
        );
        console.log("doc------------->",doc);
					return  doc
				} catch (error) {
					throw new MoleculerError(
						error.message,
						500,
						"INTERNAL_ERROR"
					);
				}
			},
		},
	},
};
