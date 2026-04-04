#!/usr/bin/env python3
"""
Seiko Quartz & Digital Watch Documents Downloader
Downloads all PDF manuals from myretrowatches.co.uk
"""

import os
import sys
import time
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

# Configuration
DOWNLOAD_DIR = Path("seiko_manuals")
MAX_WORKERS = 5  # Number of parallel downloads
RETRY_ATTEMPTS = 3
DELAY_BETWEEN_REQUESTS = 0.5  # Seconds

# Create download directory
DOWNLOAD_DIR.mkdir(exist_ok=True)


def download_file(url: str, filepath: Path) -> bool:
    """Download a single file with retry logic."""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    for attempt in range(RETRY_ATTEMPTS):
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=30) as response:
                with open(filepath, 'wb') as f:
                    f.write(response.read())
            return True
        except Exception as e:
            if attempt < RETRY_ATTEMPTS - 1:
                time.sleep(1)
            else:
                print(f"  Failed to download {url}: {e}")
                return False
    return False


def download_manual(url: str) -> tuple[str, bool]:
    """Download a single manual PDF."""
    filename = url.split('/')[-1]
    filepath = DOWNLOAD_DIR / filename
    
    # Skip if already downloaded
    if filepath.exists():
        return (filename, True)
    
    success = download_file(url, filepath)
    time.sleep(DELAY_BETWEEN_REQUESTS)
    return (filename, success)


def main():
    # Read URLs from file
    url_file = Path("pdf_urls.txt")
    if not url_file.exists():
        print("Error: pdf_urls.txt not found!")
        print("Please run the curl command first to generate the URL list.")
        sys.exit(1)
    
    with open(url_file, 'r') as f:
        urls = [line.strip() for line in f if line.strip()]
    
    total = len(urls)
    print(f"Found {total} PDF files to download")
    print(f"Download directory: {DOWNLOAD_DIR.absolute()}")
    print(f"Parallel workers: {MAX_WORKERS}")
    print("-" * 50)
    
    successful = 0
    failed = 0
    skipped = 0
    
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        future_to_url = {executor.submit(download_manual, url): url for url in urls}
        
        for i, future in enumerate(as_completed(future_to_url), 1):
            url = future_to_url[future]
            filename, success = future.result()
            
            if success:
                if (DOWNLOAD_DIR / filename).exists():
                    successful += 1
                    status = "OK"
                else:
                    skipped += 1
                    status = "SKIPPED (already exists)"
            else:
                failed += 1
                status = "FAILED"
            
            progress = f"[{i}/{total}]"
            print(f"{progress} {filename}: {status}")
    
    print("-" * 50)
    print(f"Download complete!")
    print(f"  Successful: {successful}")
    print(f"  Skipped (already exists): {skipped}")
    print(f"  Failed: {failed}")
    print(f"Total files in directory: {len(list(DOWNLOAD_DIR.glob('*.pdf')))}")


if __name__ == "__main__":
    main()
