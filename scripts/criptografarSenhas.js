import bcrypt from "bcrypt";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();
const saltRounds = 10;

async function criptografarSenhas() {
  const usuarios = await prisma.usuarios.findMany();
  for (const usuario of usuarios) {
    // Só criptografa se a senha não estiver criptografada (exemplo: tamanho pequeno)
    if (usuario.senha.length < 20) {
      const hash = await bcrypt.hash(usuario.senha, saltRounds);
      await prisma.usuarios.update({
        where: { id: usuario.id },
        data: { senha: hash },
      });
      console.log(`Senha do usuário ${usuario.email} criptografada!`);
    }
  }
  console.log("Processo finalizado!");
  await prisma.$disconnect();
}

criptografarSenhas();
