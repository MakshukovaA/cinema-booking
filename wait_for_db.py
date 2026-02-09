import os
import time
from urllib.parse import urlparse
import psycopg2


def parse_database_url(url: str):

    parsed = urlparse(url)
    if parsed.scheme not in ("postgres", "postgresql"):
        raise ValueError(f"Unsupported URL scheme: {parsed.scheme}")

    user = parsed.username
    password = parsed.password
    host = parsed.hostname or "localhost"
    port = parsed.port or 5432
    dbname = parsed.path.lstrip("/")

    return {
        "host": host,
        "port": port,
        "dbname": dbname,
        "user": user,
        "password": password,
    }


def wait_for_db(database_url: str, retry_interval: float = 1.0, timeout_seconds: int | None = None):
    cfg = parse_database_url(database_url)

    start_time = time.time()
    while True:
        try:
            conn = psycopg2.connect(
                dbname=cfg["dbname"],
                user=cfg["user"],
                password=cfg["password"],
                host=cfg["host"],
                port=cfg["port"],
                connect_timeout=5,
            )
            conn.close()
            print("Database is ready")
            return True
        except Exception as e:
            print(f"Waiting for database... {e}")
            time.sleep(retry_interval)
            if timeout_seconds is not None and (time.time() - start_time) > timeout_seconds:
                raise SystemExit("Timed out waiting for database")


if __name__ == "__main__":
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        print("DATABASE_URL environment variable is not set")
        raise SystemExit(1)
    wait_for_db(db_url)