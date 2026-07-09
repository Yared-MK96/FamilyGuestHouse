import os
import time
import urllib.request
import logging

logging.basicConfig(format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO)
logger = logging.getLogger("keep_alive")

def ping_self():
    # Use RENDER_EXTERNAL_URL if set (external ping), otherwise default to localhost on the assigned PORT
    port = os.environ.get("PORT", "8080")
    url = os.environ.get("RENDER_EXTERNAL_URL", f"http://localhost:{port}")
    
    logger.info(f"Starting keep-alive pinger targeting: {url}")
    
    while True:
        try:
            # Add a 10s timeout to prevent hanging requests
            with urllib.request.urlopen(url, timeout=10) as response:
                if response.status == 200:
                    logger.info("Keep-alive ping successful.")
                else:
                    logger.warning(f"Keep-alive ping returned status: {response.status}")
        except Exception as e:
            logger.error(f"Keep-alive ping failed: {e}")
        
        # Sleep for 20 seconds
        time.sleep(20)

if __name__ == "__main__":
    ping_self()
