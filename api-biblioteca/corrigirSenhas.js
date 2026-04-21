import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function corrigirSenhas() {
  try {
    console.log("🔄 Iniciando correção de senhas...");

    const usuarios = await prisma.usuarios.findMany();

    for (const usuario of usuarios) {
      // ⚠️ evita criptografar novamente se já estiver criptografada
      if (usuario.senha.startsWith("$2b$")) {
        console.log(
          `⏭️ Usuário ${usuario.email} já está com senha criptografada`,
        );
        continue;
      }

      const hash = await bcrypt.hash(usuario.senha, 10);

      await prisma.usuarios.update({
        where: { id: usuario.id },
        data: { senha: hash },
      });

      console.log(`✅ Senha atualizada para: ${usuario.email}`);
    }

    console.log("🎉 Todas as senhas foram corrigidas!");
  } catch (error) {
    console.error("❌ Erro ao corrigir senhas:", error);
  } finally {
    await prisma.$disconnect();
  }
}

corrigirSenhas();
