export function sendError(res, error, fallbackMessage = "Erro interno do servidor.") {
  const status = error.status || 500;
  return res.status(status).json({ error: error.message || fallbackMessage });
}
