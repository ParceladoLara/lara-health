import { Button } from "@/common/components/shadcn/ui/button";
import { Input } from "@/common/components/shadcn/ui/input";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import "./login.css";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);

    const response = await fetch(
      "https://dev.gql.parceladolara.com.br/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
          mutation Login($data: LoginInput!) {
            login(data: $data) {
              access_token
            }
          }
        `,
          variables: {
            data: { login, password },
          },
        }),
      },
    );

    const result = await response.json();
    const token = result?.data?.login?.access_token;

    if (token) {
      setLoading(false);
      localStorage.setItem("@Clinicorp:token", token);
      window.location.href = "/home";
    } else {
      setLoading(false);
      alert("Login inválido.");
    }

    setLoading(false);
  }

  return (
    <div className="page">
      <div className="form">
        <h1>Login</h1>
        <Input
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleLogin} disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </div>
    </div>
  );
}
