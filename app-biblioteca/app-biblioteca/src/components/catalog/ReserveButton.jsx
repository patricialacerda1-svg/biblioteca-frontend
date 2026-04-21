import { useState } from "react";
import { Button } from "../ui/Button";
import { createPedido } from "../../services/pedidosService";

export function ReserveButton({
  disponivel,
  user,
  livroId,
  onReserveSuccess,
  setToast,
}) {
  const [loading, setLoading] = useState(false);

  const podeReservar =
    user?.status === "ativo" && disponivel > 0 && !loading;

  const handleReserve = async (e) => {
    if (e) e.preventDefault();

    console.log("🔥 CLICK RESERVAR");

    if (!livroId || !user?.userId) return;

    setLoading(true);

    try {
      const hoje = new Date();
      const dataPrevista = new Date();
      dataPrevista.setDate(hoje.getDate() + 7);

      const pedidoData = {
        livroId,
        usuarioId: user.userId,
        data_inicio: hoje.toISOString().split("T")[0],
        data_prevista: dataPrevista.toISOString().split("T")[0],
        status: "ativo",
      };

      console.log("📦 PEDIDO:", pedidoData);

      await createPedido(pedidoData);

      setToast("✔ Livro reservado com sucesso! Você tem 7 dias para retirada.");

      setTimeout(() => {
        if (onReserveSuccess) onReserveSuccess();
      }, 1000);

    } catch (error) {
      console.log("❌ ERRO:", error);

      const msg = error?.response?.data?.error;

      if (msg?.includes("Reserva indisponivel")) {
        setToast("❌ Você já possui um livro reservado. Devolva para reservar outro.");
      } else {
        setToast(msg || "Erro ao reservar livro");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      disabled={!podeReservar}
      style={{ width: "100%" }}
      onClick={handleReserve}
    >
      {loading ? "Reservando..." : "Reservar"}
    </Button>
  );
}