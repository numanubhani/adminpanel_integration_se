import { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

/**
 * Example smoke signals data.
 * Channels are ONLY Email or SMS.
 * Replace this with your API/DB results.
 */
const initialSignals = [
  { id: 1, sender: "Aaron Barne", channel: "Email", status: "Delivered", timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000 + 4 * 60 * 1000).toISOString(), message: "msg1" },
  { id: 2, sender: "Charlotte Gray", channel: "SMS", status: "Delivered", timestamp: new Date(Date.now() - 2.7 * 60 * 60 * 1000).toISOString(), message: "msg2" },
  { id: 3, sender: "James Whitaker", channel: "Email", status: "Failed", timestamp: new Date(Date.now() - 2.4 * 60 * 60 * 1000).toISOString(), message: "msg3" },
  { id: 4, sender: "Olivia Bennett", channel: "Email", status: "Delivered", timestamp: new Date(Date.now() - 2.2 * 60 * 60 * 1000).toISOString(), message: "msg1" },
  { id: 5, sender: "Henry Cooper", channel: "SMS", status: "Delivered", timestamp: new Date(Date.now() - 2.1 * 60 * 60 * 1000).toISOString(), message: "msg2" },
  { id: 6, sender: "Aaron Barne", channel: "Email", status: "Pending", timestamp: new Date(Date.now() - 2.0 * 60 * 60 * 1000 + 12 * 60 * 1000).toISOString(), message: "msg4" },
  { id: 7, sender: "Charlotte Gray", channel: "Email", status: "Delivered", timestamp: new Date(Date.now() - 1.8 * 60 * 60 * 1000).toISOString(), message: "msg5" },
  { id: 8, sender: "James Whitaker", channel: "SMS", status: "Delivered", timestamp: new Date(Date.now() - 1.4 * 60 * 60 * 1000).toISOString(), message: "msg2" },
  { id: 9, sender: "Olivia Bennett", channel: "SMS", status: "Failed", timestamp: new Date(Date.now() - 1.2 * 60 * 60 * 1000).toISOString(), message: "msg1" },
  { id: 10, sender: "Henry Cooper", channel: "Email", status: "Delivered", timestamp: new Date(Date.now() - 1.0 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(), message: "msg2" },
  { id: 11, sender: "Aaron Barne", channel: "SMS", status: "Delivered", timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString(), message: "msg5" },
  { id: 12, sender: "Charlotte Gray", channel: "Email", status: "Delivered", timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), message: "msg6" },
  { id: 13, sender: "James Whitaker", channel: "Email", status: "Pending", timestamp: new Date(Date.now() - 32 * 60 * 1000).toISOString(), message: "msg7" },
  { id: 14, sender: "Olivia Bennett", channel: "SMS", status: "Delivered", timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(), message: "msg8" },
  { id: 15, sender: "Henry Cooper", channel: "Email", status: "Delivered", timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(), message: "msg9" },
];

/** Helpers */
const hourLabel = (d) => d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

const dayLabel = (d) => d.toLocaleDateString(undefined, { month: "short", day: "numeric" });

/**
 * Build buckets for either '24h' (hourly, 24 buckets ending at NOW)
 * or '7d' (daily, 7 buckets ending today).
 * Each bucket tracks counts per channel and total.
 */
function buildBuckets(signals, range) {
  const now = new Date();

  if (range === "24h") {
    // Buckets end at NOW so current-hour events are included.
    const buckets = [];
    for (let i = 23; i >= 0; i--) {
      const end = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000); // oldest -> newest
      const start = new Date(end.getTime() - 60 * 60 * 1000);
      buckets.push({
        label: `${hourLabel(start)}-${hourLabel(end)}`,
        start,
        end,
        email: 0,
        sms: 0,
        total: 0,
      });
    }

    signals.forEach((s) => {
      const t = new Date(s.timestamp).getTime();
      for (const b of buckets) {
        if (t > b.start.getTime() && t <= b.end.getTime()) {
          if (s.channel === "Email") b.email += 1;
          else if (s.channel === "SMS") b.sms += 1;
          b.total += 1;
          break;
        }
      }
    });

    return buckets;
  }

  // 7d: daily buckets (inclusive of today), end of each bucket is 23:59:59 of that day
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  const buckets = [];
  for (let i = 6; i >= 0; i--) {
    const end = new Date(endOfToday);
    end.setDate(end.getDate() - (6 - i));
    const start = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 0, 0, 0, 0);
    buckets.push({
      label: dayLabel(start), // e.g., "Jul 31"
      start,
      end,
      email: 0,
      sms: 0,
      total: 0,
    });
  }

  signals.forEach((s) => {
    const t = new Date(s.timestamp).getTime();
    for (const b of buckets) {
      if (t >= b.start.getTime() && t <= b.end.getTime()) {
        if (s.channel === "Email") b.email += 1;
        else if (s.channel === "SMS") b.sms += 1;
        b.total += 1;
        break;
      }
    }
  });

  return buckets;
}

export default function SmokeSignalDashboard() {
  const [signals] = useState(initialSignals);
  const [range, setRange] = useState("24h"); // "24h" or "7d"

  // Calculate frequency of each message
  const messageFrequency = signals.reduce((acc, signal) => {
    const key = signal.message; // Use message ID as key
    if (acc[key]) {
      acc[key] += 1;
    } else {
      acc[key] = 1;
    }
    return acc;
  }, {});

  // Define recent to get the 10 most recent signals
  const recent = useMemo(
    () =>
      [...signals]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort by timestamp
        .slice(0, 10), // Get the most recent 10 signals
    [signals]
  );

  const metrics = useMemo(() => {
    const total = signals.length;
    const delivered = signals.filter((s) => s.status === "Delivered").length;
    const failed = signals.filter((s) => s.status === "Failed").length;
    const pending = signals.filter((s) => s.status === "Pending").length;
    const uniqueSenders = new Set(signals.map((s) => s.sender)).size;
    const emailTotal = signals.filter((s) => s.channel === "Email").length;
    const smsTotal = signals.filter((s) => s.channel === "SMS").length;

    const buckets = buildBuckets(signals, range);
    const sum = buckets.reduce((acc, b) => acc + b.total, 0);
    const avg = range === "24h" ? sum / 24 : sum / 7; // per hour vs per day

    return {
      total,
      delivered,
      failed,
      pending,
      uniqueSenders,
      emailTotal,
      smsTotal,
      avg,
      buckets,
    };
  }, [signals, range]);

  const maxCount = Math.max(...metrics.buckets.map((b) => Math.max(b.email, b.sms, b.total)), 1);
  const avgLabel = range === "24h" ? "Avg/hour" : "Avg/day";
  const subtitle =
    range === "24h"
      ? "Frequency — Messages per Hour (Last 24h)"
      : "Frequency — Messages per Day (Last 7d)";

  // Graph data for each message frequency
  const graphData = Object.keys(messageFrequency).map((msg) => ({
    message: msg,
    frequency: messageFrequency[msg],
  }));

  return (
    <div className="flex bg-black min-h-screen">
      {/* Sidebar */}
      <div className="hidden lg:block fixed top-0 left-0 h-full w-64 z-10">
        <Sidebar />
      </div>

      {/* Main */}
      <div className="flex-1 lg:ml-64 bg-black min-h-screen flex flex-col">
        <Topbar />

        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-[#ceb46a]">Smoke Signals Dashboard</h1>

            <div className="flex gap-2">
              <button
                className={`px-3 py-1 rounded border ${
                  range === "24h"
                    ? "border-[#ceb46a] text-[#ceb46a]"
                    : "border-[#2a2a2a] text-gray-300"
                }`}
                onClick={() => setRange("24h")}
              >
                Last 24h
              </button>
              <button
                className={`px-3 py-1 rounded border ${
                  range === "7d"
                    ? "border-[#ceb46a] text-[#ceb46a]"
                    : "border-[#2a2a2a] text-gray-300"
                }`}
                onClick={() => setRange("7d")}
              >
                Last 7d
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 mb-8">
            <KPI label="Total Sent" value={metrics.total} />
            <KPI label="Delivered" value={metrics.delivered} />
            <KPI label="Failed" value={metrics.failed} />
            <KPI label="Pending" value={metrics.pending} />
            <KPI label="Unique Senders" value={metrics.uniqueSenders} />
            <KPI label="Email Total" value={metrics.emailTotal} />
            <KPI label="SMS Total" value={metrics.smsTotal} />
          </div>

          {/* Message Frequency Graph */}
          <div className="bg-[#1c1c1e] border border-[#ceb46a] rounded p-4 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Message Frequency</h2>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Frequency per Message</span>
            </div>

            {/* Bar Chart for Message Frequency */}
            <div className="h-56 flex items-end gap-1 relative">
              {graphData.map((data, idx) => {
                const height = (data.frequency / Math.max(...graphData.map(d => d.frequency))) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center relative">
                    <div
                      style={{ height: `${height}%`, backgroundColor: "#ceb46a" }}
                      className="w-full rounded-t"
                      title={`${data.message}: ${data.frequency}`}
                    />
                    <div className="mt-1 text-[10px] text-gray-500">{data.message}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-[#1c1c1e] border border-[#ceb46a] rounded p-4">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Signals</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="text-gray-300 text-sm">
                    <th className="py-2 pr-4 font-medium">Sender</th>
                    <th className="py-2 pr-4 font-medium">Channel</th>
                    <th className="py-2 pr-4 font-medium">Time</th>
                    <th className="py-2 pr-4 font-medium">Status</th>
                    <th className="py-2 pr-4 font-medium">Frequency</th> {/* New Column for Frequency */}
                  </tr>
                </thead>
                <tbody>
                  {recent.map((s) => {
                    const frequency = messageFrequency[s.message];
                    return (
                      <tr key={s.id} className="border-t border-[#2a2a2a] text-white">
                        <td className="py-2 pr-4">{s.sender}</td>
                        <td className="py-2 pr-4 text-gray-300">{s.channel}</td>
                        <td className="py-2 pr-4 text-gray-300">
                          {new Date(s.timestamp).toLocaleString()}
                        </td>
                        <td className="py-2 pr-4">
                          <StatusPill status={s.status} />
                        </td>
                        <td className="py-2 pr-4 text-gray-300">
                          Frequency: {frequency}
                        </td>
                      </tr>
                    );
                  })}
                  {recent.length === 0 && (
                    <tr>
                      <td className="py-3 text-gray-400" colSpan={5}>
                        No signals yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Presentational subcomponents (no TypeScript annotations) */
function KPI({ label, value }) {
  return (
    <div className="bg-[#1c1c1e] border border-[#ceb46a] rounded p-4">
      <div className="text-gray-300 text-sm">{label}</div>
      <div className="text-2xl font-bold text-white mt-1">{value}</div>
    </div>
  );
}

function StatusPill({ status }) {
  const base = "text-xs px-2 py-1 rounded font-medium border";
  const cls =
    status === "Delivered"
      ? "border-[#ceb46a] text-[#ceb46a]"
      : status === "Failed"
      ? "border-red-400 text-red-400"
      : "border-yellow-400 text-yellow-400";
  return <span className={`${base} ${cls}`}>{status}</span>;
}
