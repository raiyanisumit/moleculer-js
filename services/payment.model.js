const mongoose = require("mongoose");

// const StudentSchema = mongoose.Schema({
//     fname:String,
//     lname:String,
//     r_num:{
//         type : Number,
//         unique : true
//     },
// })
// module.exports = mongoose.model('StudentSchema',StudentSchema)


const Schema = mongoose.Schema;

const orderModel = () => {
    const model = new Schema({
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


    });

    return mongoose.model('order', model);
};
module.exports = orderModel;
