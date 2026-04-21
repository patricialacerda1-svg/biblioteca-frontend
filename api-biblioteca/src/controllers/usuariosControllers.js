import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

/* =========================
   LISTAR USUÁRIOS
========================= */
export async function getUsuarios(req, res) {
  try {
    const usuarios = await prisma.usuarios.findMany();
    res.json(usuarios);
  } catch (err) {
    console.error("Erro ao buscar usuários:", err);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
}

/* =========================
   BUSCAR POR ID
========================= */
export async function getUsuarioById(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const usuario = await prisma.usuarios.findUnique({
      where: { id },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(usuario);
  } catch (err) {
    console.error("Erro ao buscar usuário:", err);
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
}

/* =========================
   CRIAR USUÁRIO
========================= */
export async function createUsuario(req, res) {
  const {
    nome,
    matricula,
    perfil,
    curso,
    cpf,
    data_nascimento,
    email,
    senha,
    status,
  } = req.body;

  // validação obrigatória
  if (
    !nome ||
    !cpf ||
    !email ||
    !senha ||
    !perfil ||
    !status ||
    !data_nascimento
  ) {
    return res.status(400).json({
      error:
        "Campos obrigatórios: nome, cpf, email, senha, perfil, status, data_nascimento",
    });
  }

  // valida email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Email inválido" });
  }

  // valida CPF
  const cpfLimpo = cpf.replace(/\D/g, "");
  if (cpfLimpo.length !== 11) {
    return res.status(400).json({ error: "CPF deve conter 11 números" });
  }

  // valida senha
  if (senha.length < 6) {
    return res.status(400).json({
      error: "Senha deve ter no mínimo 6 caracteres",
    });
  }

  const hashedPassword = await bcrypt.hash(senha, 10);

  try {
    const usuario = await prisma.usuarios.create({
      data: {
        nome,
        matricula,
        perfil,
        curso,
        cpf: cpfLimpo,
        data_nascimento: new Date(data_nascimento),
        email,
        senha: hashedPassword,
        status,
      },
    });

    res.status(201).json(usuario);
  } catch (err) {
    console.error("Erro ao criar usuário:", err);

    if (err.code === "P2002") {
      return res.status(400).json({
        error: "Já existe um usuário com este CPF, Email ou Matrícula.",
      });
    }

    res.status(500).json({ error: "Erro ao criar usuário" });
  }
}

/* =========================
   ATUALIZAR USUÁRIO
========================= */
export async function updateUsuario(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "ID inválido" });
  }

  const {
    nome,
    matricula,
    perfil,
    curso,
    cpf,
    data_nascimento,
    email,
    senha,
    status,
  } = req.body;

  try {
    // valida email (se vier)
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Email inválido" });
      }
    }

    // valida CPF (se vier)
    const cpfLimpo = cpf ? cpf.replace(/\D/g, "") : undefined;

    if (cpf && cpfLimpo.length !== 11) {
      return res.status(400).json({
        error: "CPF deve conter 11 números",
      });
    }

    // valida senha (se vier)
    const senhaHash =
      senha && senha.length >= 6
        ? await bcrypt.hash(senha, 10)
        : undefined;

    const usuario = await prisma.usuarios.update({
      where: { id },
      data: {
        nome,
        matricula,
        perfil,
        curso,
        cpf: cpfLimpo,
        data_nascimento: data_nascimento
          ? new Date(data_nascimento)
          : undefined,
        email,
        senha: senhaHash,
        status,
      },
    });

    res.json(usuario);
  } catch (err) {
    console.error("Erro ao atualizar usuário:", err);

    if (err.code === "P2002") {
      return res.status(400).json({
        error: "Já existe um usuário com este CPF, Email ou Matrícula.",
      });
    }

    if (err.code === "P2025") {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
}

/* =========================
   DELETAR USUÁRIO
========================= */
export async function deleteUsuario(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    await prisma.usuarios.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (err) {
    console.error("Erro ao deletar usuário:", err);

    if (err.code === "P2025") {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
}