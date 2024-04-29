FROM <image>

ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY . .

WORKDIR /app/src<workdir>

<build_command>
CMD <start_command>