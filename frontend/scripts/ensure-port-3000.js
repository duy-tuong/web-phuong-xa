/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const PORT = 3000;

function unique(values) {
  return [...new Set(values)];
}

function getPidsOnPortWindows(port) {
  try {
    const output = execSync("netstat -ano -p tcp", { encoding: "utf8" });
    return unique(
      output
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.includes(`:${port}`) && line.includes("LISTENING"))
        .map((line) => line.split(/\s+/).pop())
        .filter(Boolean)
        .map((pid) => Number(pid))
        .filter((pid) => Number.isInteger(pid) && pid > 0),
    );
  } catch (error) {
    console.warn(`[port-guard] Skipping netstat check: ${error.message}`);
    return [];
  }
}

function getPidsOnPortUnix(port) {
  try {
    const output = execSync(`lsof -ti tcp:${port} -sTCP:LISTEN`, { encoding: "utf8" });
    return unique(
      output
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((pid) => Number(pid))
        .filter((pid) => Number.isInteger(pid) && pid > 0),
    );
  } catch {
    return [];
  }
}

function killPidWindows(pid) {
  execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
}

function killPidUnix(pid) {
  execSync(`kill -9 ${pid}`, { stdio: "ignore" });
}

function pidExists(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function getWorkspaceNextPidsWindows(workspacePath) {
  let output = "";
  try {
    output = execSync(
      "powershell -NoProfile -Command \"Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'node.exe' } | Select-Object ProcessId,CommandLine | ConvertTo-Json -Compress\"",
      { encoding: "utf8" },
    );
  } catch {
    return [];
  }

  const normalizedWorkspace = workspacePath.toLowerCase().replace(/\//g, "\\");
  let processes = [];

  try {
    const parsed = JSON.parse(output.trim());
    processes = Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [];
  }

  return unique(
    processes
      .map((proc) => {
        const pid = Number(proc.ProcessId);
        const commandLine = String(proc.CommandLine || "").toLowerCase();
        return { pid, commandLine };
      })
      .filter(Boolean)
      .filter(({ pid }) => Number.isInteger(pid) && pid > 0 && pid !== process.pid)
      .filter(({ commandLine }) => commandLine.includes(normalizedWorkspace))
      .filter(({ commandLine }) =>
        commandLine.includes("next\\dist\\bin\\next") ||
        commandLine.includes("next\\dist\\server\\lib\\start-server.js") ||
        commandLine.includes(".next\\dev\\"),
      )
      .map(({ pid }) => pid),
  );
}

function getWorkspaceNextPidsUnix(workspacePath) {
  let output = "";
  try {
    output = execSync("ps -axo pid=,command=", { encoding: "utf8" });
  } catch {
    return [];
  }

  return unique(
    output
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const match = line.match(/^(\d+)\s+(.*)$/);
        if (!match) {
          return null;
        }
        return { pid: Number(match[1]), commandLine: match[2] };
      })
      .filter(Boolean)
      .filter(({ pid }) => Number.isInteger(pid) && pid > 0 && pid !== process.pid)
      .filter(({ commandLine }) => commandLine.includes(workspacePath))
      .filter(({ commandLine }) =>
        commandLine.includes("next/dist/bin/next") ||
        commandLine.includes("next/dist/server/lib/start-server.js") ||
        commandLine.includes(".next/dev/"),
      )
      .map(({ pid }) => pid),
  );
}

function removeStaleDevLock(workspacePath) {
  const lockFile = path.join(workspacePath, ".next", "dev", "lock");
  if (!fs.existsSync(lockFile)) {
    return;
  }

  try {
    fs.rmSync(lockFile, { force: true });
    console.log("[port-guard] Removed stale .next/dev/lock file.");
  } catch (error) {
    console.warn(`[port-guard] Could not remove lock file: ${error.message}`);
  }
}

function main() {
  const isWindows = process.platform === "win32";
  const workspacePath = process.cwd();
  const byPort = isWindows ? getPidsOnPortWindows(PORT) : getPidsOnPortUnix(PORT);
  const workspaceNextPids = isWindows
    ? getWorkspaceNextPidsWindows(workspacePath)
    : getWorkspaceNextPidsUnix(workspacePath);
  const pids = unique([...byPort, ...workspaceNextPids]).filter((pid) => pid !== process.pid);

  if (!pids.length) {
    console.log(`[port-guard] Port ${PORT} is free.`);
    removeStaleDevLock(workspacePath);
    return;
  }

  console.log(`[port-guard] Cleaning conflicting process(es): ${pids.join(", ")}.`);

  for (const pid of pids) {
    if (!pidExists(pid)) {
      console.log(`[port-guard] PID ${pid} already exited.`);
      continue;
    }

    try {
      if (isWindows) {
        killPidWindows(pid);
      } else {
        killPidUnix(pid);
      }
      console.log(`[port-guard] Stopped PID ${pid}.`);
    } catch (error) {
      if (pidExists(pid)) {
        console.error(`[port-guard] Failed to stop PID ${pid}:`, error.message);
        process.exitCode = 1;
      } else {
        console.log(`[port-guard] PID ${pid} exited while cleaning.`);
      }
    }
  }

  removeStaleDevLock(workspacePath);
}

main();
