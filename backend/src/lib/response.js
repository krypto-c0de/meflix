export function sendError(res, error, fallbackMessage = "Erro interno do servidor.") {
  const status = error.status || 500;

  console.error("[meflix-api]", {
    status,
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
  });

  return res.status(status).json({ error: error.message || fallbackMessage });
}
