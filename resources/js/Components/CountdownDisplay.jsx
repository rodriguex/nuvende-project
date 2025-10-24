export function CountdownDisplay({ minutes, remaining }) {
  return (
    <span className="text-lg font-mono">
      Tempo restante: {minutes}:{remaining.toString().padStart(2, "0")}
    </span>
  );
}
