FROM <image>
WORKDIR /app
COPY . .

WORKDIR /app/src<workdir>
RUN go mod download

<build_command>

ENV PORT=:8000
CMD <start_command>