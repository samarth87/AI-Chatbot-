"""
AI Info Generator - Application Launcher
Builds frontend if needed and launches the FastAPI server.
"""
import os, sys, subprocess, webbrowser, time

def main():
    print("=" * 65)
    print("✦ AI Info Generator (React + FastAPI)")
    print("=" * 65)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    dist_dir = os.path.join(base_dir, "frontend", "dist")

    # Build React frontend if dist does not exist
    if not os.path.exists(dist_dir):
        print("\n📦 Building React frontend...")
        npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
        subprocess.run([npm_cmd, "run", "build"], cwd=os.path.join(base_dir, "frontend"), check=True)

    from backend.config import HOST, PORT
    url = f"http://127.0.0.1:{PORT}"

    print(f"\n🚀 Server running at: {url}")
    print("💡 Open this URL in your web browser. Press Ctrl+C to stop.\n")

    # Automatically open default browser after a brief delay
    def open_browser():
        time.sleep(1.2)
        webbrowser.open(url)

    import threading
    threading.Thread(target=open_browser, daemon=True).start()

    import uvicorn
    uvicorn.run("backend.main:app", host=HOST, port=PORT, reload=False)

if __name__ == "__main__":
    main()