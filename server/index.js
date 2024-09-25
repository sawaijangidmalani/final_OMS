// import express from "express";
// import cors from "cors";
// import bodyParser from "body-parser";
// import { authRoutes } from "./routes/auth.js";
// import { customerRouter } from "./routes/customer.js";
// import { supplierRouter } from "./routes/suppliers.js";
// import { itemRouter } from "./routes/item.js";
// import { porouter } from "./routes/purchaseorder.js";
// import { customerPo } from "./routes/customerpo.js";

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(bodyParser.json());

// app.use("/auth",authRoutes);
// app.use("/customer",customerRouter);
// app.use("/supplier",supplierRouter);
// app.use("/item",itemRouter);
// app.use("/po",porouter);
// app.use("/customerPo",customerPo);

// const PORT = process.env.PORT || 8000;

// app.listen(PORT, () => {
//     console.log(`App is listing at ${PORT}`);
// })




import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { authRoutes } from "./routes/auth.js";
import { customerRouter } from "./routes/customer.js";
import { supplierRouter } from "./routes/suppliers.js";
import { itemRouter } from "./routes/item.js";
import { porouter } from "./routes/purchaseorder.js";
import { customerPo } from "./routes/customerpo.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/customer", customerRouter);
app.use("/supplier", supplierRouter);
app.use("/item", itemRouter);
app.use("/po", porouter);
app.use("/customerPo", customerPo);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`App is listing at ${PORT}`);
});
