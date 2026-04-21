import { useState, useEffect, useCallback } from "react";
import { Navbar } from "../components/layout/Navbar";
import { Sidebar } from "../components/layout/Sidebar";
import { CatalogFilters } from "../components/catalog/CatalogFilters";
import { BookGrid } from "../components/catalog/BookGrid";
import { getLivros } from "../services/livrosService";
import { getAutores } from "../services/autoresService";
import { getCategorias } from "../services/categoriasService";
import { getPedidos } from "../services/pedidosService";
import { useAuth } from "../hooks/useAuth";

export default function CatalogPage() {
  const { user } = useAuth();

  const [livros, setLivros] = useState([]);
  const [autores, setAutores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  const [busca, setBusca] = useState("");
  const [autorId, setAutorId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");

  const [loading, setLoading] = useState(true);

  // 🔥 TOAST GLOBAL (mensagem fixa na tela)
  const [toast, setToast] = useState("");

  const refreshData = useCallback(() => {
    setLoading(true);

    Promise.all([getLivros(), getPedidos()])
      .then(([l, p]) => {
        setLivros(l.data);
        setPedidos(p.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    Promise.all([getLivros(), getAutores(), getCategorias(), getPedidos()])
      .then(([l, a, c, p]) => {
        setLivros(l.data);
        setAutores(a.data);
        setCategorias(c.data);
        setPedidos(p.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const livrosFiltrados = livros
    .filter((l) =>
      l.titulo?.toLowerCase().includes(busca.toLowerCase())
    )
    .filter((l) => !autorId || l.autorId === Number(autorId))
    .filter((l) => !categoriaId || l.categoriaId === Number(categoriaId));

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />

        <main style={{ flex: 1, padding: "1.5rem", background: "#f8fafc" }}>
          <h2 style={{ marginTop: 0, marginBottom: "1.5rem", color: "#1e293b" }}>
            Catálogo de Livros
          </h2>

          <CatalogFilters
            busca={busca}
            setBusca={setBusca}
            autorId={autorId}
            setAutorId={setAutorId}
            categoriaId={categoriaId}
            setCategoriaId={setCategoriaId}
            autores={autores}
            categorias={categorias}
          />

          {loading ? (
            <p style={{ color: "#6b7280" }}>Carregando...</p>
          ) : (
            <BookGrid
              livros={livrosFiltrados}
              pedidos={pedidos}
              user={user}
              onReserveSuccess={refreshData}
              setToast={setToast}   // 🔥 PASSA TOAST PARA BAIXO
            />
          )}
        </main>
      </div>

      {/* 🔥 TOAST GLOBAL FIXO */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            background: "#059669",
            color: "#fff",
            padding: "12px 16px",
            borderRadius: "8px",
            zIndex: 9999,
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}