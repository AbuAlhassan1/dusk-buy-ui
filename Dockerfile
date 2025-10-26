FROM node:20

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.4.0 --activate

WORKDIR /app

# Copy everything before install
COPY . .

RUN rm -rf node_modules && pnpm install --frozen-lockfile

# ✅ Fix permissions for all .vue files in /app/pages
RUN npm run build

# Clean install with lockfile

EXPOSE 3000

# Start dev server
CMD ["node", ".output/server/index.mjs"]