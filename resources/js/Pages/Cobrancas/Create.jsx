import axios from "axios";
import { useState, useEffect } from "react";
import QRCode from "qrcode";

export default function CreateCobranca() {
  const [form, setForm] = useState({
    bill_name: "",
    amount: "",
    expiration_hours: 1,
    payer_name: "",
    payer_cpf: "",
  });

  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState(null);
  const [errors, setErrors] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    let interval;
    if (secondsLeft > 0) {
      interval = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setPayment(null);
    setSecondsLeft(0);

    try {
      const payload = {
        ...form,
        expiration: Number(form.expiration_hours) * 3600,
      };

      const response = await axios.post("/cobrancas", payload);
      if (response.data.success) {
        setPayment({
          ...response.data.payment,
          qrCode: await QRCode.toDataURL(response.data.payment.qrCode),
        });

        setSecondsLeft(payload.expiration);
        setForm({
          bill_name: "",
          amount: "",
          expiration_hours: 1,
          payer_name: "",
          payer_cpf: "",
        });
      }
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        alert("Erro ao criar cobrança.");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Criar Cobrança PIX</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block mb-1 font-semibold">Nome da cobrança</label>
          <input
            type="text"
            name="bill_name"
            value={form.bill_name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          {errors.bill_name && (
            <span className="text-red-500">{errors.bill_name}</span>
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Valor (R$)</label>
          <input
            type="number"
            step="0.01"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          {errors.amount && (
            <span className="text-red-500">{errors.amount}</span>
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Expiração (horas)</label>
          <input
            type="number"
            min="1"
            name="expiration_hours"
            value={form.expiration_hours}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          {errors.expiration && (
            <span className="text-red-500">{errors.expiration}</span>
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Nome do pagador</label>
          <input
            type="text"
            name="payer_name"
            value={form.payer_name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          {errors.payer_name && (
            <span className="text-red-500">{errors.payer_name}</span>
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold">CPF do pagador</label>
          <input
            type="text"
            name="payer_cpf"
            value={form.payer_cpf}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          {errors.payer_cpf && (
            <span className="text-red-500">{errors.payer_cpf}</span>
          )}
        </div>

        <button
          type="submit"
          className={`mt-4 p-2 bg-green-600 text-white font-bold rounded ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Criando..." : "Criar Cobrança"}
        </button>
      </form>

      {payment && (
        <div className="mt-6 text-center">
          <h2 className="font-bold mb-2">{payment.solicitacaoPagador}</h2>
          <p>Valor: R${payment.valor.original}</p>
          <img
            src={payment.qrCode}
            alt="PIX QR Code"
            className="mx-auto mt-4"
          />

          {secondsLeft > 0 ? (
            <p className="mt-2 text-red-600 font-bold">
              Tempo restante: {formatTime(secondsLeft)}
            </p>
          ) : (
            <p className="mt-2 text-gray-500 font-bold">Cobranca expirada</p>
          )}

          <button
            onClick={() => {
              navigator.clipboard.writeText(payment.qrCode);
              alert("QR code copiado!");
            }}
            className="mt-3 p-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition"
          >
            Copiar QR Code
          </button>
        </div>
      )}
    </div>
  );
}
