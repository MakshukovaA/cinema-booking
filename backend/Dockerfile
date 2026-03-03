FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN echo '#!/bin/bash\n\
set -e\n\
\n\
echo "=== Starting Django Backend ==="\n\
echo "Waiting for database..."\n\
\n\
# Ждём БД\n\
python wait_for_db.py\n\
\n\
# Миграции\n\
echo "Applying migrations..."\n\
python manage.py migrate\n\
\n\
# Суперпользователь\n\
echo "Creating superuser..."\n\
python -c "\n\
import os\n\
os.environ.setdefault(\"DJANGO_SETTINGS_MODULE\", \"cinemaBooking.settings\")\n\
import django\n\
django.setup()\n\
from django.contrib.auth import get_user_model\n\
User = get_user_model()\n\
try:\n\
    if not User.objects.filter(username=os.environ.get(\"DJANGO_SUPERUSER_USERNAME\", \"admin\")).exists():\n\
        User.objects.create_superuser(\n\
            username=os.environ.get(\"DJANGO_SUPERUSER_USERNAME\", \"admin\"),\n\
            email=os.environ.get(\"DJANGO_SUPERUSER_EMAIL\", \"admin@example.com\"),\n\
            password=os.environ.get(\"DJANGO_SUPERUSER_PASSWORD\", \"admin123\")\n\
        )\n\
        print(\"✅ Superuser created\")\n\
    else:\n\
        print(\"✅ Superuser already exists\")\n\
except Exception as e:\n\
    print(f\"⚠️ Could not create superuser: {e}\")\n\
"\n\
\n\
# Запуск сервера\n\
echo "Starting Django server..."\n\
exec python manage.py runserver 0.0.0.0:8000\n\
' > /entrypoint.sh && chmod +x /entrypoint.sh

RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]