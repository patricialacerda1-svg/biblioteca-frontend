import express from "express";
import {
  getAllPedidos,
  getPedidoById,
  createPedido,
  updatePedido,
  deletePedido,
} from "../controllers/pedidosControllers.js";
import { validateToken } from "../controllers/validateTokenControllers.js";
import { validateAdmin } from "../helpers/common.js";

const router = express.Router();

// 🔓 Usuários logados podem ver
router.get("/", validateToken, getAllPedidos);
router.get("/:id", validateToken, getPedidoById);

// 🔓 Usuários logados podem reservar
router.post("/", validateToken, createPedido);

// 🔒 Apenas admin
router.put("/:id", validateToken, validateAdmin, updatePedido);
router.delete("/:id", validateToken, validateAdmin, deletePedido);

export default router;