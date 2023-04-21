
# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY . .
RUN npm --legacy-peer-deps install
RUN npm run build

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "run", "start"]