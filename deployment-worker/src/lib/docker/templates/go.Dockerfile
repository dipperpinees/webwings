FROM <image>
WORKDIR /app
COPY . .
RUN go mod download

RUN <build_command>

RUN <start_command>