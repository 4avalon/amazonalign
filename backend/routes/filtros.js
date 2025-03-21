const express = require("express");
const { 
    ordenarPedidos
} = require("../controllers/filtrosController");
const { autenticarToken } = require("../middlewares/auth");

const router = express.Router();


router.get("/ordenacao", autenticarToken, ordenarPedidos);


module.exports = router;
