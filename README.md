# AGEC Finances - Monorepo

Monorepo Turborepo regroupant le site marketing, un dashboard CRM et les
services backend du flux **Mail Delivery Clôture** (récupération Pennylane ->
ZIP -> envoi Resend).

## Structure

```
apps/
  site/         Site marketing Next.js (export statique, Firebase Hosting)
  dashboard/    Dashboard CRM Next.js (déclenche les envois de clôture)
  api-gateway/  Service Render (orchestration + persistance des jobs)
  mailing/      Service Render (assemblage ZIP + envoi Resend)
packages/
  shared/       Types, schémas Zod, helpers d'env partagés
  pennylane/    Client typé de l'API Pennylane v2
```

## Flux fonctionnel

1. Le dashboard liste les exercices fiscaux (via l'api-gateway -> Pennylane).
2. Cocher "Mail Delivery Clôture" appelle `POST /api/deliveries` (exercice choisi).
3. L'api-gateway crée un job et déclenche le service de mailing.
4. Le mailing récupère **FEC + Grand Livre + justificatifs PDF** de l'exercice,
   assemble un ZIP et l'envoie via **Resend** à `tom@yapio.io`.
5. Si le ZIP dépasse ~40 Mo, il est uploadé (Supabase Storage) et un lien est
   envoyé à la place de la pièce jointe.
6. Le mailing rappelle l'api-gateway pour mettre à jour le statut affiché.

## Développement

```bash
npm install
npm run build        # build de tous les workspaces (Turbo)

# Lancer les services backend (dans des terminaux séparés, après avoir rempli .env)
npm run dev -w @agec/api-gateway
npm run dev -w @agec/mailing
npm run dev -w @agec/dashboard
```

Copier `.env.example` -> `.env` à la racine pour les services backend, et
`apps/dashboard/.env.example` -> `apps/dashboard/.env.local` pour le dashboard.

## Limites connues de l'API Pennylane

- Pas de webhooks natifs : le déclencheur vit dans le dashboard, pas dans Pennylane.
- La "Plaquette des Comptes Annuels" et le "Dossier de Travail" ne sont pas
  exposés par l'API publique (ajout manuel possible ultérieurement).
- Les justificatifs sont récupérés facture par facture (pas de bundle natif).

## Sécurité

- La clé Pennylane initialement partagée a été exposée : **la regénérer**.
- Les clés ne vivent que côté serveur (api-gateway / mailing), jamais dans le navigateur.

## Déploiement

- Backend : `render.yaml` (Blueprint) déploie `agec-api-gateway` et `agec-mailing`.
  Renseigner les secrets du groupe `agec-secrets` dans le dashboard Render.
  Si persistance Supabase : exécuter `apps/api-gateway/db/delivery_jobs.sql`.
- Site marketing : `npm run deploy:site` (build + Firebase Hosting).
- Dashboard : déployable sur Vercel/Render (variables `API_GATEWAY_URL`,
  `GATEWAY_PUBLIC_TOKEN`).
