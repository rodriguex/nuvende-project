import { useState } from "react";
import axios from "axios";
import QRCode from "qrcode";

const CLIENT_ID = "de846a35-d51d-42c6-9ffe-b5a71a0685dd";
const CLIENT_SECRET = "teste2025";

async function getAccessToken() {
  const base64Data = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

  const response = await axios.post(
    "https://api-h.nuvende.com.br/api/v2/auth/login",
    {
      grant_type: "client_credentials",
      scope:
        "kyc.background-check.natural-person kyc.background-check.legal-person cob.write cob.read webhooks.read webhooks.write merchants.read merchants.write terminals.read terminals.write transactions.read transactions.write",
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${base64Data}`,
      },
    }
  );

  return response.data.access_token;
}

/**
 * Hook that handles Pix payment creation.
 */
export function usePixPayment() {
  const [accessToken, setAccessToken] = useState(null);
  const [payment, setPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function createPixPayment() {
    setIsLoading(true);
    setError(null);
    setPayment(null);

    try {
      const token = accessToken || (await getAccessToken());
      if (!accessToken) setAccessToken(token);

      const data = {
        chave: "59ba4ca7-e1d4-433f-8dbf-77e692434a69",
        solicitacaoPagador: "testando PIX Nuvende",
        nomeRecebedor: "João da Silva",
        calendario: { expiracao: 3600 },
        valor: { original: "20.00", modalidadeAlteracao: 0 },
        devedor: { nome: "Maria Santos", cpf: "40352056053", cnpj: null },
      };

      const res = await axios.post(
        "https://api-h.nuvende.com.br/api/v2/cobranca/cob",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const payload = res.data;
      const qrImage = await QRCode.toDataURL(payload.qrCode);

      setPayment({
        status: payload.status,
        qrCode: qrImage,
        price: Number(payload.valor.original).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        billName: payload.solicitacaoPagador,
        expiration: payload.calendario.expiracao,
      });
    } catch (err) {
      console.error(err);
      setError("Falha ao gerar pagamento Pix.");
    } finally {
      setIsLoading(false);
    }
  }

  return { createPixPayment, payment, isLoading, error };
}
