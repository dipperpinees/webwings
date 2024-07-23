FROM <image>
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

COPY . .

WORKDIR /app/src<workdir>

RUN yarn

<build_command>

ENV PORT=8000
CMD <start_command>