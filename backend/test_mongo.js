const mongoose = require('mongoose'); 
 mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://Meet:Meet%400811P_@shoefiecluster.cormt6o.mongodb.net/shoefie?retryWrites=true&w=majority').then(() => {console.log('connected'); process.exit(0)}).catch(e => {console.error(e); process.exit(1)});
