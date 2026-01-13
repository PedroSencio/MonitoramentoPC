const elTemp = document.getElementById("temp");
const elMemory = document.getElementById("memory");
const elCpu = document.getElementById("cpu");
const elHd = document.getElementById("hd");
const elDisk = document.getElementById("disk");
const elDownload = document.getElementById("down");
const cpuCanvas = document.getElementById("cpu-chart");
const cpuCtx = cpuCanvas?.getContext("2d");
const cpuHistory = [];
const MAX_POINTS = 60;
const hdBar = document.getElementById("hd-bar");

function drawCpuChart() {
  if (!cpuCtx || !cpuCanvas) return;
  const dpr = window.devicePixelRatio || 1;
  const { width: cssW, height: cssH } = cpuCanvas.getBoundingClientRect();
  cpuCanvas.width = cssW * dpr;
  cpuCanvas.height = cssH * dpr;
  cpuCtx.scale(dpr, dpr);

  cpuCtx.clearRect(0, 0, cssW, cssH);

  // Eixo de base
  cpuCtx.strokeStyle = "rgba(255,255,255,0.25)";
  cpuCtx.lineWidth = 1;
  cpuCtx.beginPath();
  cpuCtx.moveTo(0, cssH - 12);
  cpuCtx.lineTo(cssW, cssH - 12);
  cpuCtx.stroke();

  if (cpuHistory.length < 2) return;

  const max = 100;
  const min = 0;
  const stepX = cssW / Math.max(cpuHistory.length - 1, 1);

  cpuCtx.strokeStyle = "#0ea5e9";
  cpuCtx.lineWidth = 2;
  cpuCtx.beginPath();
  cpuHistory.forEach((value, idx) => {
    const clamped = Math.min(Math.max(value, min), max);
    const norm = (clamped - min) / (max - min);
    const x = idx * stepX;
    const y = cssH - 12 - norm * (cssH - 24);
    if (idx === 0) cpuCtx.moveTo(x, y);
    else cpuCtx.lineTo(x, y);
  });
  cpuCtx.stroke();
}

async function consultarAPI() {
  try {
    const res = await fetch("http://192.168.15.47:5005");
    const data = await res.json();

    const hd_livre = 100 - data.HD;
    const Download_mb = data.Download / 1024;
    const cpuValue = Number(data.CPU) || 0;

    elTemp.textContent = Number(data.temp);
    elMemory.textContent = Number(data.Memoria);
    elCpu.textContent = cpuValue;
    const hdValue = Number(hd_livre);
    elHd.textContent = hdValue;
    elDisk.textContent = Number(data.Escrita_KB_s);
    elDownload.textContent = Number(Download_mb);

    if (hdBar) {
      const pct = Math.max(0, Math.min(hdValue, 100));
      hdBar.style.height = `${pct}%`;
    }

    cpuHistory.push(cpuValue);
    if (cpuHistory.length > MAX_POINTS) cpuHistory.shift();
    drawCpuChart();
  } catch (error) {
    console.warn("Erro ao consultar API", error);
  }
}

setInterval(consultarAPI, 1000);
