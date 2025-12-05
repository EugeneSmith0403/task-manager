# GitHub Actions Workflows

Этот репозиторий содержит CI/CD workflows для автоматизации проверки кода и деплоя.

## CI Workflow (`.github/workflows/ci.yml`)

Автоматически запускается при:
- Push в ветки `main` или `develop`
- Создании Pull Request в ветки `main` или `develop`

### Что делает:
1. **Lint** - проверяет код на соответствие стандартам
2. **Test** - запускает тесты с использованием PostgreSQL и Redis
3. **Build** - собирает проект и сохраняет артефакты

## CD Workflow (`.github/workflows/cd.yml`)

Автоматически запускается при:
- Push в ветку `main`
- Создании тега версии (например, `v1.0.0`)

### Что делает:
1. **Build and Push** - собирает Docker образ и публикует его в GitHub Container Registry (ghcr.io)
2. **Deploy** - опционально деплоит на сервер через SSH

### Настройка деплоя

Для использования автоматического деплоя нужно настроить следующие secrets в GitHub:

1. Перейдите в Settings → Secrets and variables → Actions
2. Добавьте следующие secrets:
   - `SSH_HOST` - IP адрес или домен сервера
   - `SSH_USERNAME` - имя пользователя для SSH
   - `SSH_PRIVATE_KEY` - приватный SSH ключ
   - `SSH_PORT` (опционально) - порт SSH (по умолчанию 22)
   - `DEPLOY_PATH` (опционально) - путь к директории проекта на сервере (по умолчанию `/opt/task-manager`)
   - `DEPLOY_URL` (опционально) - URL продакшн окружения

### Использование Docker образа

После успешной сборки образ будет доступен в GitHub Container Registry:
```
ghcr.io/<ваш-username>/<название-репозитория>:latest
```

Для использования в `docker-compose.prod.yml` обновите секцию `app`:

```yaml
app:
  image: ghcr.io/<ваш-username>/<название-репозитория>:latest
  # вместо build: ...
```

### Отключение деплоя

Если вы не хотите использовать автоматический деплой, просто не настраивайте SSH secrets. Workflow будет собирать и публиковать образ, но пропустит шаг деплоя.

