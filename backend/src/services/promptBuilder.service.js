export function buildSeriesPrompt(input) {
  return `
Você é um roteirista brasileiro criando a ficha de uma série de streaming sobre a vida de uma pessoa.

Responda APENAS JSON válido, sem markdown, sem explicações extras.

Campos do usuário:
- nome: ${input.name}
- faixa_etaria: ${input.ageRange}
- genero_serie: ${input.genre}
- tom: ${input.tone}
- vibe: ${input.vibe}
- caos_principal: ${input.chaos}
- elenco_dos_sonhos: ${input.dreamCast || "não informado"}

Regras:
- resposta em português do Brasil
- tom divertido, pop, compartilhável e específico
- evitar ofensas pesadas
- pensar em algo que a pessoa queira postar no TikTok
- o elenco deve ter 4 nomes conhecidos
- os episódios devem ser 3

Formato JSON obrigatório:
{
  "title": "string",
  "tagline": "string",
  "synopsis": "string",
  "cast": [
    { "actor": "string", "role": "string", "reason": "string" }
  ],
  "episodes": [
    { "title": "string", "summary": "string" }
  ],
  "posterPrompt": "string"
}
`;
}
