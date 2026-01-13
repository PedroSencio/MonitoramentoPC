from flask import Flask, jsonify
from flask_cors import CORS
import psutil
import time

app = Flask(__name__)
CORS(app)

@app.get("/")
def home():
    io1 = psutil.disk_io_counters()
    net1 = psutil.net_io_counters()
    time.sleep(1)
    net2 = psutil.net_io_counters()
    io2 = psutil.disk_io_counters()

    escrita = io2.write_bytes - io1.write_bytes
    upload_bps = net2.bytes_sent - net1.bytes_sent
    download_bps = net2.bytes_recv - net1.bytes_recv

    mem_percent = psutil.virtual_memory().percent
    cpu = psutil.cpu_percent(interval=0.2)  # bem mais rápido
    hd = psutil.disk_usage("/").percent

    return jsonify({
        "CPU": cpu,
        "Memoria": mem_percent,
        "HD": hd,
        "Escrita_KB_s": round(escrita / 1024, 2),
        "Download": download_bps
    })

if __name__ == "__main__":
    app.run(debug=True, port=5005, host="0.0.0.0")
