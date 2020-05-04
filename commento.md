# Commento

<https://docs.commento.io>

## Using docker

You can use docker-compose to quickly start up commento with a postgres instance.

```yaml
version: "3"

services:
  server:
    image: registry.gitlab.com/commento/commento
    ports:
      - 80:8080
    environment:
      COMMENTO_ORIGIN: localhost
      COMMENTO_PORT: 8080
      COMMENTO_POSTGRES: postgres://postgres:postgres@db:5432/commento?sslmode=disable
    depends_on:
      - db
  db:
    image: postgres
    environment:
      POSTGRES_DB: commento
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data_volume:/var/lib/postgresql/data

volumes:
  postgres_data_volume:
```
