import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";

export function UsuarioForm({ usuario, onSave, onClose }) {
  const [form, setForm] = useState({
    nome: usuario?.nome ?? "",
    matricula: usuario?.matricula ?? "",
    perfil: usuario?.perfil ?? "aluno",
    curso: usuario?.curso ?? "",
    cpf: usuario?.cpf ?? "",
    data_nascimento: usuario?.data_nascimento
      ? usuario.data_nascimento.split("T")[0]
      : "",
    email: usuario?.email ?? "",
    senha: "",
    status: usuario?.status ?? "ativo",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async () => {
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const cpfLimpo = form.cpf.replace(/\D/g, "");

      // 🔥 valida obrigatórios
      if (
        !form.nome ||
        !form.email ||
        !form.cpf ||
        !form.data_nascimento
      ) {
        setError("Nome, email, CPF e data de nascimento são obrigatórios.");
        return;
      }

      // 🔥 valida email
      if (!emailRegex.test(form.email)) {
        setError("Email inválido.");
        return;
      }

      // 🔥 valida CPF
      if (cpfLimpo.length !== 11) {
        setError("CPF deve conter exatamente 11 números.");
        return;
      }

      // 🔥 valida senha (somente criação)
      if (!usuario && (!form.senha || form.senha.length < 6)) {
        setError("Senha deve ter no mínimo 6 caracteres.");
        return;
      }

      const payload = {
        ...form,
        cpf: cpfLimpo,
      };

      // remove senha vazia no update
      if (!payload.senha) delete payload.senha;

      await onSave(payload);
      onClose();
    } catch (e) {
      setError(e.response?.data?.error ?? "Erro ao salvar usuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={usuario ? "Editar Usuário" : "Novo Usuário"}
      onClose={onClose}
      onConfirm={handleSave}
    >
      <Input
        label="Nome"
        value={form.nome}
        onChange={set("nome")}
        required
      />

      <Input
        label="Email"
        type="email"
        value={form.email}
        onChange={set("email")}
        required
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
        }}
      >
        <Input
          label="Matrícula"
          value={form.matricula}
          onChange={set("matricula")}
        />

        <Input
          label="CPF (11 dígitos)"
          value={form.cpf}
          onChange={set("cpf")}
          required
        />

        <Input
          label="Data de Nascimento"
          type="date"
          value={form.data_nascimento}
          onChange={set("data_nascimento")}
          required
        />

        <Input
          label="Curso"
          value={form.curso}
          onChange={set("curso")}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Perfil</label>
          <select
            value={form.perfil}
            onChange={set("perfil")}
          >
            <option value="aluno">aluno</option>
            <option value="admin">admin</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Status</label>
          <select
            value={form.status}
            onChange={set("status")}
          >
            <option value="ativo">ativo</option>
            <option value="inativo">inativo</option>
          </select>
        </div>
      </div>

      <Input
        label={
          usuario
            ? "Nova senha (opcional)"
            : "Senha"
        }
        type="password"
        value={form.senha}
        onChange={set("senha")}
        required={!usuario}
      />

      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          {error}
        </p>
      )}

      {loading && (
        <p style={{ color: "#666" }}>
          Salvando usuário...
        </p>
      )}
    </Modal>
  );
}