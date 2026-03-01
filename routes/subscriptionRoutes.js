// const express = require("express");
// const router = express.Router();
// const db = require("../config/db");

// router.get("/",async(req,res) => {
   
//     try{
//         const [rows] = await db.query("SELECT * FROM subscriptions");
//         res.json(rows);
//     }catch(error){
//         console.log(error);
//         res.status(500).json({message:"Server error"});
//     }
    
// });

// router.post("/", async (req,res) => {
//   try{
//     const {
//         user_email,
//         plan_name,
//         start_date,
//         end_date,
//         monthly_cost,
//         status
//     } = req.body;
  
//     //validation
//     if(!user_email || !plan_name || !start_date || !end_date || !monthly_cost || !status){
//         return res.status(400).json({message:"All fileds are required"});
//     } 
//    const query = `INSERT INTO subscriptions 
//    (user_email,plan_name,start_date,end_date,monthly_cost,status) 
//    VALUES (?, ?, ?, ?, ?, ?)`;

//    await db.query(query,[
//         user_email,
//         plan_name,
//         start_date,
//         end_date,
//         monthly_cost,
//         status
//    ]);
//  res.status(201).json({massage:"Subscription created successfully"});

//   }catch(error){
//     console.log(error);
//     res.status(500).json({message : "server error"});
//   }
// });


// //get dingle subscription by id

// router.get("/:id", async (req,res) =>{
//     try{
//         const {id} = req.params;

//         const [rows] = await db.query(
//             "SELECT * FROM subscriptions WHERE subscription_id = ?",[id]
//         );
//         if(rows.length === 0){
//             return res.status(404).json({message : "subscription not found "});
//         }
//         res.json(rows[0]);

//     }catch(error){
//         console.log(error);
//       res.status(500).json({message:"server error"});
//     }
// });


// //update subscription (put)

// router.put("/:id",async(req,res) =>{
//     try{
//         const {id} = req.params;
//         const {
//            user_email,
//             plan_name,
//             start_date,
//             end_date,
//             monthly_cost,
//             status  
//         } = req.body;

//         const query = 
//         `UPDATE subscriptions 
//         SET user_email = ?,
//             plan_name = ?,
//             start_date = ?,
//             end_date = ?,
//             monthly_cost = ?,
//             status = ?
//         WHERE subscription_id = ?`;

//       const [result] = await db.query(query,[
//         user_email,
//         plan_name,
//         start_date,
//         end_date,
//         monthly_cost,
//         status,
//         id
//       ]) ;
      
//       if(result.affectedRows === 0){
//         return res.status(404).json({message:"subscrition not found"});

//       }
      
//       res.json({message:"subscription updated successfullt"});
            
//     }catch(error){
//         console.log(error);
//         res.status(500).json({message:"sever error"});
//     }
// });


// //delete route 
// router.delete("/:id", async (req, res) => {
//     try {
//         const { id } = req.params;

//         const [result] = await db.query(
//             "DELETE FROM subscriptions WHERE subscription_id = ?",
//             [id]
//         );

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ message: "Subscription not found" });
//         }

//         res.json({ message: "Subscription deleted successfully" });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Server Error" });
//     }
// });


// module.exports = router;



// const express = require("express");
// const router = express.Router();
// const controller = require("../controllers/subscriptionController");
// const authMiddleware = require("../middleware/authMiddleware");


// router.get("/",authMiddleware, controller.getAll);
// router.get("/:id",authMiddleware, controller.getById);
// router.post("/",authMiddleware, controller.create);
// router.put("/:id", authMiddleware ,controller.update);
// router.delete("/:id", authMiddleware,controller.remove);

// module.exports = router;
const express = require("express");
const router = express.Router();
const controller = require("../controllers/subscriptionController");
const authMiddleware = require("../middleware/authMiddleware");
const { body } = require("express-validator");
const HTTP = require("../config/httpStatus");

// GET all subscriptions
router.get("/", authMiddleware, controller.getAll);

// GET subscription by ID
router.get("/:id", authMiddleware, controller.getById);

// CREATE subscription
router.post(
  "/",
  authMiddleware,
  [
    body("plan_name").notEmpty().withMessage("Plan name is required"),
    body("start_date").isDate().withMessage("Start date must be valid"),
    body("end_date").isDate().withMessage("End date must be valid"),
    body("monthly_cost").isFloat({ gt: 0 }).withMessage("Monthly cost must be > 0"),
    body("status").isIn(["Active", "Cancelled"]).withMessage("Status must be Active or Cancelled")
  ],
  controller.create
);

// UPDATE subscription
router.put(
  "/:id",
  authMiddleware,
  [
    body("plan_name").notEmpty().withMessage("Plan name is required"),
    body("start_date").isDate().withMessage("Start date must be valid"),
    body("end_date").isDate().withMessage("End date must be valid"),
    body("monthly_cost").isFloat({ gt: 0 }).withMessage("Monthly cost must be > 0"),
    body("status").isIn(["Active", "Cancelled"]).withMessage("Status must be Active or Cancelled")
  ],
  controller.update
);

// DELETE subscription
router.delete("/:id", authMiddleware, controller.remove);

module.exports = router;
