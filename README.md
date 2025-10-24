# Projeto PIX Nuvende

Este projeto permite criar cobranças PIX usando a API da Nuvende.  
Frontend em **React** com **Inertia.js**, backend em **Laravel 12**.

Tudo rodando via **Docker**, sem precisar instalar nada na máquina local.

---

## Funcionalidades

- Criar cobranças PIX com:
  - Nome da cobrança
  - Valor
  - Expiração (em horas)
  - Nome e CPF do pagador
- Geração de QR Code
- Contagem regressiva do tempo restante para pagamento
- Cópia do QR Code para clipboard
- Validação de formulário no frontend e backend
- Código limpo separado por controllers, services e views
- Feito testes de integração para a criação de cobrança

---

## Tecnologias

- **Laravel 12** (backend)
- **React + Inertia.js** (frontend)
- **Docker** para ambiente completo
- **TailwindCSS** para UI

---

## Variáveis de ambiente

Antes de rodar, configure suas variáveis da Nuvende no arquivo `.env`:

```env
NUVENDE_BASE_URL=
NUVENDE_CLIENT_ID=
NUVENDE_CLIENT_SECRET=
NUVENDE_PIX_KEY=
```

## Como rodar

Tudo pronto com um comando:

```
docker-compose up -d --build
```
