# gh-analyzer — React frontend

Frontend moderno para o GitHub Analyzer, usando React + Vite + TypeScript + Tailwind CSS.

## Requisitos

- Node.js 18+
- Spring Boot API rodando em `http://localhost:8080`

## Instalação

```bash
npm install
npm run dev
```

Por padrão, o frontend chama:

```text
GET http://localhost:8080/analyzer/ai/{username}
```

Para mudar a URL da API:

```bash
cp .env.example .env
```

e altere:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## Build

```bash
npm run build
npm run preview
```

## Observação sobre CORS

Como Vite normalmente roda em outra porta (ex.: `5173`), o Spring Boot precisa permitir CORS para o frontend durante desenvolvimento.

Exemplo:

```java
@CrossOrigin(origins = "http://localhost:5173")
```

ou configure CORS globalmente no backend.
