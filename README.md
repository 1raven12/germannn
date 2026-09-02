# NACHTSCHICHT

A German-learning romance visual novel. Every scene is generated live by the Anthropic API from your actual save state, so the story never repeats and never ends. Each scene teaches four words, drills one grammar point, and forces one romantic decision that moves relationship values. Progress persists in your browser across sessions.

You work the night shift at Kolibri, a small bar in Cologne's Belgisches Viertel. Five people drift through it. What happens between you and them depends on what you choose, and whether you can read the German fast enough to choose it.

![screenshot placeholder](docs/screenshot.png)

## Local setup

```
npm install
cp .env.example .env
# put your Anthropic key in .env
npm run dev
```

## Getting an API key

Create one at [console.anthropic.com](https://console.anthropic.com/settings/keys) and paste it into `.env` as `ANTHROPIC_API_KEY`. The key stays server-side — it is read only inside `api/szene.js` and never shipped to the browser.

## Deploying

Push this repo to GitHub, then import it on [Vercel](https://vercel.com/new). Set `ANTHROPIC_API_KEY` as an environment variable in the Vercel project settings. Nothing else is required — `api/szene.js` deploys as a serverless function automatically.

## Changing the cast and the setting

- The five characters live in `src/data/cast.js`. Each has an id, name, age, role, and a temperament line that steers how the model writes them. Add or remove entries there; the id is also the key used for relationship values.
- The bar, city, and recurring locations live in the `WORLD` block at the top of `src/engine/prompt.js`. Rewrite it to move the story anywhere.
- Grammar topics and their unlock levels live in `src/engine/topics.js`. The offline reference content in `src/data/reference.js` is independent of the topic list and can be extended separately.

## How it works

Nothing is cached or scripted. On each scene, `src/engine/client.js` builds a prompt from your save state — your name, level, relationship values, chronicle of past scenes, and vocabulary already taught — and sends it to `api/szene.js`, a serverless proxy that calls the Anthropic API and returns the raw text. The client extracts and validates the JSON scene, then renders it. Your save lives entirely in `localStorage`; there is no database and no account.

## License

MIT, see [LICENSE](LICENSE).
