import { CountdownDisplay } from "./CountdownDisplay";

export function PaymentCard({ payment, countdown }) {
  if (!payment) return null;

  return (
    <div className="mt-6 flex flex-col items-center gap-2">
      <img src={payment.qrCode} alt="QR Code Pix" className="w-64 h-64" />
      <div className="flex flex-col items-center">
        <p>Conta: {payment.billName}</p>
        <p>Status: {payment.status}</p>
        <p>Valor: {payment.price}</p>
        <CountdownDisplay
          minutes={countdown.minutes}
          remaining={countdown.remaining}
        />
      </div>
    </div>
  );
}
