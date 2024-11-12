const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const Razorpay = require("razorpay");
const moment = require('moment');
const { Console } = require('console');
const Schema = mongoose.Schema;

const app = express();
const PORT = 5000; // You can change this port number if needed

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all requests

const razorpay = new Razorpay({
    key_id: "rzp_test_8NokNgt8cA3Hdv",
    key_secret: "xPzG53EXxT8PKr34qT7CTFm9",
});


// Set up express-fileupload
app.use(fileUpload({
    createParentPath: true,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    },
}));

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// MongoDB connection string (replace with your actual credentials)
const MONGO_URI = 'mongodb+srv://sevagsuresh:sevagsuresh@cluster0.xlsogrh.mongodb.net/';

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// User schema and model
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String, // 'admin', 'hosteler', 'staff', or 'student'
    hostelNumber: String, // Optional, only for hostelers
    paymentStatus: String,
});

const User = mongoose.model('User', UserSchema);

// Hosteler schema and model
const HostelerSchema = new mongoose.Schema({
    name: String,  /// swag
    hostelNumber: String,  // 201
    messCut: { type: Boolean, default: false }, //true
    messCutStartDate: Date, // 5
    messCutEndDate: Date, // 7
    paid_status:String,
    daily_amount:Number,
    notification: String,

});


const Hosteler = mongoose.model('Hosteler', HostelerSchema);

// Registration route
app.post('/api/register', async (req, res) => {
    const { name, email, password, role, hostelNumber } = req.body;

    // Basic validation
    if (!name || !email || !password || !role) {
        return res.json({ success: false, message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: 'Email already in use' });
        }

        const newUser = new User({
            name,
            email,
            password,
            role,
            hostelNumber: role === 'hosteler' ? hostelNumber : undefined, // Only for hostelers
        });

        await newUser.save();
        res.json({ success: true, message: 'Registration successful' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Login route
app.post('/api/login', async (req, res) => {

   // console.log("iam loggggggggggg ")
    const { email, password } = req.body;
  
    // Basic validation
    if (!email || !password) {
        return res.json({ success: false, message: 'All fields are required' });
    }

    try {
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.json({ success: false, message: 'Invalid email or password' });
        }

        // If the user is an admin
        if (user.role === 'admin') {
            return res.json({ 
                success: true, 
                message: 'Admin login successful', 
                role: 'admin', 
                user,
                redirectUrl: '/admin' // Admin dashboard or any other admin-specific URL
            });
        }

        // If the user is a hosteler
        if (user.role === 'hosteler') {
            return res.json({ 
                success: true, 
                message: 'Hosteler login successful', 
                role: 'hosteler', 
                user,
                redirectUrl: '/dashboard' // Hosteler dashboard or any other hosteler-specific URL
            });
        }

        // If the user is staff
        if (user.role === 'staff') {
            return res.json({
                success: true,
                message: 'Staff login successful',
                role: 'staff',
                user,
                redirectUrl: '/dashboard-staff' // Staff dashboard URL
            });
        }

        // If the user is a student
        if (user.role === 'student') {
            return res.json({
                success: true,
                message: 'Student login successful',
                role: 'student',
                user,
                redirectUrl: '/dashboard-staff' // Student dashboard URL
            });
        }

        // Default if the role doesn't match
        res.json({ success: false, message: 'Invalid role' });
    } catch (error) {
       // console.log(error, "from back")
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Route to get all users
app.get('/api/admin/manage-users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Server error');
    }
});

// Mess Cut route
app.post('/api/mess-cut/:hostelNumber', async (req, res) => {
    const { hostelNumber } = req.params;
    const { messCut, startDate, endDate, name } = req.body;

    console.log(req.body,"mess-cut----",messCut, startDate, endDate, name,hostelNumber)
    try {
        // First, check if the hosteler exists
        const hosteler = await Hosteler.findOne({ hostelNumber: hostelNumber});

        if (hosteler) {
            // If hosteler exists, update the mess cut status
            hosteler.messCut = messCut;
            hosteler.messCutStartDate = startDate;
            hosteler.messCutEndDate = endDate;
            console.log("updated")
            await hosteler.save();
            res.json({ message: 'Mess cut status updated successfully', hosteler });
        } else {
            // If hosteler doesn't exist, create a new entry
            const newHosteler = new Hosteler({
                name,
                hostelNumber,
                messCut,
                messCutStartDate: startDate,
                messCutEndDate: endDate,
            });
            console.log("new",newHosteler)
            await newHosteler.save();
            res.json({ message: 'New hosteler created with mess cut details', newHosteler });
        }
    } catch (error) {
        console.error('Error updating mess cut:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



app.get('/api/all-hostelers', async (req, res) => {
    console.log("hhhhhhhhiiiiiiiihhhhhhhhhhffffffffff")
 

    try {
        const hosteler = await Hosteler.find({});
        if (!hosteler) {
            return res.status(404).json({ message: 'Hosteler not found' });
        }
        res.json(hosteler);
    } catch (error) {
        console.error('Error fetching hosteler:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}); 
//notification
// Endpoint to send a notification message to a hosteler
app.post('/api/send-message', async (req, res) => {
    const { hostelerId, message } = req.body;
    console.log("hos",hostelerId, message)
  
    if (!hostelerId || !message) {
      return res.status(400).json({ error: 'Hosteler ID and message are required' });
    }
  
    try {
      // Update only the notification field of the hosteler
      console.log("hospppppppppppp")
      await Hosteler.findByIdAndUpdate(hostelerId, { notification: message });
      console.log("hospppppppppppp**********************")
      res.status(200).json({ message: 'Notification sent successfully!' });
    } catch (error) {
      console.error('Error updating notification:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.get('/api/hosteler/:id/notification', async (req, res) => {
    const  hostelNumber = req.params.id;
  
    try {
     const hosteler = await Hosteler.findOne({ hostelNumber }, 'notification');
     console.log(hosteler,"lkkkkkkk")
      res.status(200).json({ notification: hosteler.notification });
    } catch (error) {
      console.error('Error fetching notification:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Endpoint to clear the notification when viewed by the hosteler
  app.post('/api/clear-notification', async (req, res) => {
    const { hostelNumber } = req.body;
  
    if (!hostelNumber) {
      return res.status(400).json({ error: 'Hosteler ID is required' });
    }
  
    try {
      // Clear the notification field of the hosteler
      const hosteler = await Hosteler.findOneAndUpdate(
        { hostelNumber },
        { notification: '' },
        { new: true }
      );
  
      res.status(200).json({ message: 'Notification cleared successfully!' });
    } catch (error) {
      console.error('Error clearing notification:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

app.put('/api/hostelers/update-daily-bill/:id', async (req, res) => {
    const { id } = req.params;
    const { dailyBill, messCut } = req.body;
      console.log("lllyyyyy",dailyBill, messCut,"qqqqqqqqqqqqqqqq")

    try {
        const hosteler = await Hosteler.findById(id);
        if (!hosteler) {
            return res.status(404).json({ message: 'Hosteler not found' });
        }

        if (typeof hosteler.daily_amount === 'undefined') {
            hosteler.daily_amount = 0;  
        }
        const dailyBillNumber = Number(dailyBill);

        if (typeof hosteler.paid_status === 'undefined' || 'paid') {
            hosteler.paid_status = 'unpaid';  
        }

       
        if (hosteler.paid_status === 'unpaid') {
            hosteler.daily_amount +=  dailyBillNumber;
        } else {
            hosteler.daily_amount =  dailyBillNumber;
        }

       
        hosteler.messCut = messCut;
      

        await hosteler.save();
        res.json({ success: true, message: 'Hosteler updated successfully', hosteler });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update hosteler' });
    }
});

app.put('/api/hostelers/update-monthly-bill/:id', async (req, res) => {
    const { id } = req.params;
    const { monthlyBill, messCut } = req.body;
      console.log("mmmmmmmmmyyyyy",monthlyBill, messCut,"qqqqqqqqqqqqqqqq")

    try {
        const hosteler = await Hosteler.findById(id);
        if (!hosteler) {
            return res.status(404).json({ message: 'Hosteler not found' });
        }

        if (typeof hosteler.daily_amount === 'undefined') {
            hosteler.daily_amount = 0;  
        }
        const dailyBillNumber = Number(monthlyBill);
        if (typeof hosteler.paid_status === 'undefined') {
            hosteler.paid_status = 'unpaid';  
        }

       
        if (hosteler.paid_status === 'unpaid') {
            hosteler.daily_amount +=  dailyBillNumber;
        } else {
            hosteler.daily_amount =  dailyBillNumber;
        }
       
        hosteler.messCut = messCut;
      

        await hosteler.save();
        res.json({ success: true, message: 'Hosteler updated successfully', hosteler });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update hosteler' });
    }
});

app.get('/api/hosteler/bill/:id', async (req, res) => {
     
    const { id } = req.params;
    
      try { 
        const hosteler = await Hosteler.findOne({hostelNumber:id});
  
          if (!hosteler || hosteler.length === 0) {
              return res.json([]);
              //return res.status(404).json({ message: 'No hostlers with mess cut today' });
          }
   
       
          res.json(hosteler);
      } catch (error) {
          console.error('Error fetching hosteler:', error);
          res.status(500).json({ message: 'Internal server error' });
      }
  });

app.get('/api/hostelers/outstanding', async (req, res) => {
    //  console.log("qqqqqqqqqqqqqqqqqqqqqqqqq")
  
      try {
          const today = moment.utc().startOf('day').toDate(); // Start of today in UTC
          
          const hosteler = await Hosteler.find({});
        //  console.log(today ,"yyyy", hosteler)
  
          if (!hosteler || hosteler.length === 0) {
              return res.json([]);
              //return res.status(404).json({ message: 'No hostlers with mess cut today' });
          }
   
          res.json(hosteler);
      } catch (error) {
          console.error('Error fetching hosteler:', error);
          res.status(500).json({ message: 'Internal server error' });
      }
  });
app.get('/api/hostelers/messcutinfo', async (req, res) => {
  //  console.log("qqqqqqqqqqqqqqqqqqqqqqqqq")

    try {
        const today = moment.utc().startOf('day').toDate(); // Start of today in UTC
        
        const hosteler = await Hosteler.find({
            messCutStartDate: { $lte: today },  // Mess cut started before or on today
            messCutEndDate: { $gte: today }     // Mess cut ends after or on today
        });
      //  console.log(today ,"yyyy", hosteler)

        if (!hosteler || hosteler.length === 0) {
            return res.json([]);
            //return res.status(404).json({ message: 'No hostlers with mess cut today' });
        }
 
        res.json(hosteler);
    } catch (error) {
        console.error('Error fetching hosteler:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



// Menu schema and model
const MenuSchema = new mongoose.Schema({
    foodName: { type: String, required: true },
    foodImage: { type: String, required: true }, // This will store the image URL
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    category:{ type: String, required: true },
    isSpecial:{type: String, required: true },
    isOutOfStock: { type: Boolean, default: false },
});

const Menu = mongoose.model('Menu', MenuSchema);

// Route for updating menu in your backend
app.post('/api/update-menu', async (req, res) => {
    try {
        const { name, price, quantity, category, isSpecial } = req.body;

        // First, create the Menu document without the image
        const newItem = new Menu({
            foodName: name,
            foodImage: 'img', // This will be updated after saving the file
            price: Number(price),
            quantity: Number(quantity),
            category,
            isSpecial: isSpecial === 'true'
        });

        // Save the document to get an ID
        await newItem.save();

        // Now handle the file upload using the document ID
        if (!req.files || !req.files.image) {
            // If no image, delete the document and return error
            await Menu.findByIdAndDelete(newItem._id);
            return res.status(400).json({ message: 'No image uploaded' });
        }

        const imageFile = req.files.image;
        const fileExtension = path.extname(imageFile.name); // Get the file extension
        const fileName = `${newItem._id}.jpg`;
        
        // Move the file to public/images directory
        const uploadPath = path.join(__dirname, 'public/images', fileName);
        await imageFile.mv(uploadPath);
        
        // Update the document with the image filename
        newItem.foodImage = fileName;
        await newItem.save();

        res.status(200).json({ 
            message: 'Menu item added successfully.',
            item: newItem
        });
    } catch (error) {
        console.error('Error in update-menu:', error);
        res.status(500).json({ message: 'Error updating menu.', error: error.message });
    }
});
// app.post('/api/update-menu', async (req, res) => {
//     console.log(req.body,"******************")
//     const { name, price, quantity, category, isSpecial } = req.body;
//     const imagePath = req.file ? req.file.filename : null;

//     try {
//         const newItem = new Menu({foodName:name, foodImage: imagePath,price, quantity, category,isSpecial});
//         await newItem.save();

//         console.log(newItem,"savvvvvvvvvvvvvvvvvvvvvvjjjj")
//         res.status(200).json({ message: 'Menu item added successfully.' });
//     } catch (error) {
//         console.log(error,"jjjj")
//         res.status(500).json({ message: 'Error updating menu.' });
//     }
// });


app.get('/api/menu', async (req, res) => {
    try {
        const menus = await Menu.find();
     
        res.json({ success: true, menus });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
});





const OrderSchema = new mongoose.Schema({
    foodId: { type: Schema.Types.ObjectId, ref: 'Menu', required: true },
    foodName: { type: String, required: true },
    price: { type: Number, required: true },
    hostelNumber: { type: String, required: true },
    token: { type: String, required: true },
    orderStatus: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'confirmed' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'paid' },
    paymentId: { type: String, required: true },
    quantity: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', OrderSchema);

app.post('/api/book', async (req, res) => {
    const { foodId, hostelNumber } = req.body;

  
    try {
        // Fetch the food item
        const foodItem = await Menu.findById(foodId);

        if (!foodItem || foodItem.quantity <= 0) {
            return res.status(400).json({ message: 'Item is out of stock.' });
        }

        // Generate token: first letter of foodName + quantity
        const token = foodItem.foodName.charAt(0).toUpperCase() + foodItem.quantity;

        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount: foodItem.price * 100, // amount in paise
            currency: 'INR',
            receipt: `rec_${foodId.substring(0, 10)}_${Date.now()}`,
        });

        // Return the orderId, token, and Razorpay key
        res.json({
            orderId: order.id,
            key: "rzp_test_8NokNgt8cA3Hdv",
            token,
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
app.post('/api/staff-book', async (req, res) => {
    const { foodId, Id } = req.body;

   // console.log("boooook",req.body)
    try {
        // Fetch the food item
        const foodItem = await Menu.findById(foodId);

        if (!foodItem || foodItem.quantity <= 0) {
            return res.status(400).json({ message: 'Item is out of stock.' });
        }

        // Generate token: first letter of foodName + quantity
        const token = foodItem.foodName.charAt(0).toUpperCase() + foodItem.quantity;

        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount: foodItem.price * 100, // amount in paise
            currency: 'INR',
            receipt: `rec_${foodId.substring(0, 10)}_${Date.now()}`,
        });

        // Return the orderId, token, and Razorpay key
        res.json({
            orderId: order.id,
            key: "rzp_test_8NokNgt8cA3Hdv",
            token,
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/create-payment', async (req, res) => {
    const { amount } = req.body;
    const options = {
        amount: amount * 100, // Amount in paise (INR)
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json({ success: true, order });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

app.post('/api/payment-bill-success', async (req, res) => {
    const { bill, hostelNumber } = req.body;
    console.log("host pay succccesssss^^^^^^^^^^^",hostelNumber)

    try {
        // Fetch the food item details
        const hosteler = await Hosteler.findOneAndUpdate(
            { hostelNumber },
            { daily_amount: 0,
              paid_status:"paid",
            },
            { new: true }
          );
      
          res.status(200).json({ message: 'Notification cleared successfully!',success:true });
       
    } catch (error) {
        console.error('Error handling payment success:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/payment-success', async (req, res) => {
    const { paymentId, orderId, foodId, hostelNumber, token } = req.body;
   // console.log("host",hostelNumber)

    try {
        // Fetch the food item details
        const foodItem = await Menu.findById(foodId);
        if (!foodItem || foodItem.quantity <= 0) {
            return res.status(400).json({ message: 'Item is out of stock.' });
        }

        // Deduct 1 from the quantity
        foodItem.quantity -= 1;
        await foodItem.save();

        // Create a new order and save it to the database
        const newOrder = new Order({
            foodId: foodItem._id,
            foodName: foodItem.foodName,
            price: foodItem.price,
            hostelNumber,
            token,
            paymentId,
            quantity: 1, // Assuming one item is booked at a time
            orderStatus: 'confirmed',
            paymentStatus: 'paid',
        });

        await newOrder.save();

        res.json({ success: true, message: 'Booking successful', order: newOrder });
    } catch (error) {
        console.error('Error handling payment success:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin route (for managing users)
app.get('/api/admin/manage-users', async (req, res) => {
    try {
        const users = await User.find();
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
});

// Admin route to update a user's role or information
app.put('/api/admin/manage-users/:id', async (req, res) => {
    const { id } = req.params;
    const { role, name, email } = req.body;

    try {
        const user = await User.findByIdAndUpdate(id, { role, name, email }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ success: true, message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update user' });
    }
});

// Admin route to delete a user
app.delete('/api/admin/manage-users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete user' });
    }
});


// Route to fetch today's orders
app.get('/api/orders/today', async (req, res) => {
    
    try {
        // Use moment to get the start and end of today's date (in UTC).
        const todayStart = moment.utc().startOf('day').toDate(); // Start of today in UTC
        const todayEnd = moment.utc().endOf('day').toDate(); // End of today in 

        const orders = await Order.find({
            date: { $gte: todayStart, $lte: todayEnd }
        });
       // console.log(orders,todayStart,todayEnd,"kkkk")
        res.json(orders);
    } catch (error) {
        console.error('Error fetching today\'s orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to approve an order (mark as completed)
app.patch('/orders/:id/approve', async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update the order status to completed
        order.orderStatus = 'completed';
        await order.save();

        res.json({ message: 'Order approved and dispatched' });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Sample route
app.get('/', (req, res) => {
    res.send('Server is running on port 5000');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
