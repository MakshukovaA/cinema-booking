import os
import time
import psycopg2
from psycopg2 import OperationalError

def wait_for_db():
    max_retries = 30
    retry_interval = 2
    
    db_config = {
        'dbname': os.environ.get('POSTGRES_DB', 'cinema_booking'),
        'user': os.environ.get('POSTGRES_USER', 'cinema_user'),
        'password': os.environ.get('POSTGRES_PASSWORD', 'strongpassword'),
        'host': os.environ.get('POSTGRES_HOST', 'localhost'),
        'port': os.environ.get('POSTGRES_PORT', '5432')
    }
    
    print(f"🔄 Waiting for database at {db_config['host']}:{db_config['port']}...")
    
    for i in range(max_retries):
        try:
            conn = psycopg2.connect(**db_config)
            conn.close()
            print("✅ Database connection successful!")
            return True
        except OperationalError as e:
            if i < max_retries - 1:
                print(f"⏳ Database not ready yet... ({i+1}/{max_retries})")
                time.sleep(retry_interval)
            else:
                print(f"❌ Failed to connect to database after {max_retries} attempts")
                print(f"Error: {e}")
                return False
    
    return False

if __name__ == "__main__":
    wait_for_db()