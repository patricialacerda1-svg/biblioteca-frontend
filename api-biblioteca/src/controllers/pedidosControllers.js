import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* =========================
   LISTAR TODOS
========================= */
export async function getAllPedidos(req, res) {
  try {
    const pedidos = await prisma.pedidos.findMany({
      orderBy: { id: "asc" },
    });

    return res.json(pedidos);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

/* =========================
   LISTAR POR ID
========================= */
export async function getPedidoById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const pedido = await prisma.pedidos.findUnique({
      where: { id },
    });

    if (!pedido) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    return res.json(pedido);
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

/* =========================
   CRIAR PEDIDO (REGRA 1 RESERVA)
========================= */
export async function createPedido(req, res) {
  try {
    const usuarioId = req.usuario?.userId;
    const { livroId } = req.body;

    if (!usuarioId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    if (!livroId) {
      return res.status(400).json({ error: "livroId é obrigatório" });
    }

    // 🔥 REGRA: 1 reserva ativa por usuário
    const reservaAtiva = await prisma.pedidos.findFirst({
      where: {
        usuario_id: usuarioId,
        status: "ativo",
      },
    });

    if (reservaAtiva) {
      return res.status(400).json({
        error:
          "Reserva indisponivel até a devolução do livro reservado",
      });
    }

    // 🔒 status do usuário vindo do token
    if (req.usuario?.status !== "ativo") {
      return res.status(403).json({ error: "Usuário inativo" });
    }

    const hoje = new Date();
    const dataPrevista = new Date();
    dataPrevista.setDate(hoje.getDate() + 7);

    const novoPedido = await prisma.pedidos.create({
      data: {
        livro_id: livroId,
        usuario_id: usuarioId,
        data_inicio: hoje,
        data_prevista: dataPrevista,
        status: "ativo",
      },
    });

    return res.status(201).json(novoPedido);
  } catch (error) {
    console.error("🔥 ERRO CREATE PEDIDO:", error);
    return res.status(500).json({
      error: "Erro interno ao criar pedido",
    });
  }
}

/* =========================
   ATUALIZAR
========================= */
export async function updatePedido(req, res) {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const { livroId, usuarioId, data_inicio, data_prevista } =
      req.body;

    const pedidoAtualizado = await prisma.pedidos.update({
      where: { id },
      data: {
        livro_id: livroId,
        usuario_id: usuarioId,
        data_inicio,
        data_prevista,
      },
    });

    return res.json(pedidoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar pedido:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

/* =========================
   DELETAR
========================= */
export async function deletePedido(req, res) {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const pedidoExistente = await prisma.pedidos.findUnique({
      where: { id },
    });

    if (!pedidoExistente) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    await prisma.pedidos.delete({
      where: { id },
    });

    return res.status(200).json(pedidoExistente);
  } catch (error) {
    console.error("Erro ao deletar pedido:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}