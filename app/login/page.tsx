"use client";

import Button from "@/components/Button";
import Form from "@/components/form/Form";
import Input from "@/components/form/Input";
import InputGroup from "@/components/form/InputGroup";
import FlipContainer from "@/components/panel/FlipContainer";
import Panel from "@/components/panel/Panel";
import { IdCard, Mail, SquareAsterisk, User } from "lucide-react";
import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [isFlipped, setIsFlipped] = useState(false);

  const [formData, setFormData] = useState({
   name: "",
   email: "",
   cpf: "",
   password: "",
   confirmPassword: "",
   roles: ["CUSTOMER"],
  });

  const [nameFields, setNameFields] = useState({
    firstName: "",
    lastName: "",
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNameFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async () => {
    const fullName = `${nameFields.firstName.trim()} ${nameFields.lastName.trim()}`;
    try {
      await axios.post("http://localhost:8081/usuarios/cadastrar", {
        ...formData,
        name: fullName,
      });
      alert("Usuário cadastrado com sucesso!");
      setIsFlipped(false);
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          alert("Erro ao cadastrar usuário: " + err.response?.data?.message || "");
        } else {
          console.error("Erro desconhecido", err);
          alert("Ocorreu um erro inesperado.");
        }
      }      
  };

  return (
    <main className="flex-1 p-8 relative">
      <div className="panel-size absolute left-1/2 -translate-x-1/2 sm:top-1/4">
        <FlipContainer isFlipped={isFlipped}>
          {/* Painel de Login */}
          <Panel flip={true}>
            <h2 className="text-3xl font-bold">Login</h2>
            <p className="text-xl">Acesse sua conta</p>
            <Form>
              <Input
                icon={<Mail />}
                placeholder="Email"
                type="email"
                name="loginEmail"
              />
              <Input
                icon={<SquareAsterisk />}
                placeholder="Senha"
                type="password"
                name="loginPassword"
              />
              <Button variant="secondary" className="p-2 hover:bg-accent/80">
                Entrar
              </Button>
            </Form>
            <p className="text-sm text-foreground/40 text-center">
              Não possui uma conta?{" "}
              <a className="underline font-bold" onClick={() => setIsFlipped(true)}>
                Cadastre-se
              </a>
            </p>
          </Panel>

          {/* Painel de Cadastro */}
          <Panel flip={true} flipClassName="rotate-y-180">
            <h2 className="text-3xl font-bold">Cadastre-se</h2>
            <p className="text-xl">Crie sua conta agora</p>
            <Form>
              {/* Nome e sobrenome */}
              <InputGroup>
                <Input
                  icon={<User />}
                  placeholder="Nome"
                  type="text"
                  name="firstName"
                  value={nameFields.firstName}
                  onChange={handleNameChange}
                />
                <Input
                  icon={<User />}
                  placeholder="Sobrenome"
                  type="text"
                  name="lastName"
                  value={nameFields.lastName}
                  onChange={handleNameChange}
                />
              </InputGroup>

              {/* Email */}
              <Input
                icon={<Mail />}
                placeholder="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />

              {/* CPF com máscara */}
              <Input
                icon={<IdCard />}
                placeholder="CPF"
                type="text"
                name="cpf"
                mask="999.999.999-99"
                value={formData.cpf}
                onChange={handleChange}
              />

              {/* Senhas */}
              <InputGroup>
                <Input
                  icon={<SquareAsterisk />}
                  placeholder="Senha"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <Input
                  icon={<SquareAsterisk />}
                  placeholder="Confirmar senha"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </InputGroup>

              <Button
                variant="secondary"
                className="p-2 hover:bg-accent/80"
                onClick={handleRegister}
              >
                Cadastrar
              </Button>
            </Form>
            <p className="text-sm text-foreground/40 text-center">
              Já possui uma conta?{" "}
              <a className="underline font-bold" onClick={() => setIsFlipped(false)}>
                Log In
              </a>
            </p>
          </Panel>
        </FlipContainer>
      </div>
    </main>
  );
}
