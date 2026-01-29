
// Agentic AI Food Rescue Dashboard
// Single-file React component (default export). Built with Tailwind CSS + shadcn/ui style + recharts + framer-motion.
// Usage: paste into a React app (Vite/Next.js) with Tailwind configured and these deps installed:
// react, react-dom, framer-motion, recharts, lucide-react, @radix-ui/react-popover (optional)
// This file is intentionally self-contained and uses mock data + simulated "agents" to demonstrate orchestration.

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Truck, MapPin, CheckCircle, Box } from "lucide-react";

export default function FoodRescueDashboard() {
  // Form state for "Donate Food"
  const [donationForm, setDonationForm] = useState({ type: "Perishable", name: "Mixed Veg Box", quantity: 12, unit: "boxes" });
  const [feedLog, setFeedLog] = useState([]);

  // Agent states
  const [detected, setDetected] = useState(null);
  const [predictedDemand, setPredictedDemand] = useState([]);
  const [route, setRoute] = useState(null);
  const [matching, setMatching] = useState([]);
  const [impactSeries, setImpactSeries] = useState(generateInitialImpact());
  const [busy, setBusy] = useState(false);

  // Mock map centering (static)
  const mapCenter = { lat: 1.3521, lng: 103.8198 };

  function generateInitialImpact() {
    // generates 12 weeks of mock rescued kg
    const base = 800;
    return Array.from({ length: 12 }).map((_, i) => ({ week: `W${i + 1}`, rescued_kg: Math.max(100, Math.round(base + (Math.sin(i / 2) * 120) + Math.random() * 200)) }));
  }

  // Simulated agents
  async function runAgents(form) {
    setBusy(true);
    const logEntry = { time: new Date().toLocaleTimeString(), form };

    // 1. Detection Agent: categorise
    setDetected(null); setPredictedDemand([]); setRoute(null); setMatching([]);
    await sleep(700);
    const detection = detectionAgent(form);
    setDetected(detection);

    // 2. Demand Agent: predict receivers
    await sleep(700);
    const demand = demandAgent(detection);
    setPredictedDemand(demand);

    // 3. Logistics Agent: route
    await sleep(700);
    const routeRes = logisticsAgent(demand, mapCenter);
    setRoute(routeRes);

    // 4. Matching Agent: allocate
    await sleep(700);
    const allocation = matchingAgent(demand, detection);
    setMatching(allocation);

    // 5. Impact Agent: update charts
    await sleep(400);
    const newImpact = impactAgent(impactSeries, form.quantity);
    setImpactSeries(newImpact);

    setFeedLog(prev => [ { time: new Date().toLocaleString(), summary: `${form.quantity} ${form.unit} of ${form.name} donated — allocated to ${allocation.length} receivers` }, ...prev ].slice(0, 10));

    setBusy(false);
  }

  // agents implementation (mock but plausible)
  function detectionAgent(form) {
    // categorize based on type and name; estimate weight (kg)
    const perishabilityScore = (form.type === "Perishable") ? 0.9 : 0.2;
    const estimatedKg = Math.max(1, Math.round(form.quantity * (form.unit === "boxes" ? 4 : 1) * (perishabilityScore + 0.5)));
    return { category: form.type, name: form.name, qty: form.quantity, unit: form.unit, est_kg: estimatedKg, expirySensitivity: perishabilityScore };
  }

  function demandAgent(detection) {
    // returns a ranked list of recipients with needs and distance (mock)
    const facilities = [
      { id: "F1", name: "Community Kitchen - Tanjong", need_score: randBetween(0.6, 0.95), lat: 1.300, lng: 103.80, capacity: 40 },
      { id: "F2", name: "Shelter Hope - Central", need_score: randBetween(0.4, 0.8), lat: 1.35, lng: 103.82, capacity: 30 },
      { id: "F3", name: "ElderCare Hub - West", need_score: randBetween(0.3, 0.7), lat: 1.34, lng: 103.75, capacity: 20 },
      { id: "F4", name: "Food Bank Express - North", need_score: randBetween(0.2, 0.6), lat: 1.42, lng: 103.78, capacity: 50 }
    ];
    // score combines need & compatibility
    return facilities
      .map(f => ({ ...f, score: parseFloat((f.need_score * (1 + detection.expirySensitivity * 0.8)).toFixed(3)) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }

  function logisticsAgent(demandList, origin) {
    // create a polyline-like route visiting top demand points
    const points = [origin, ...demandList.map(d => ({ lat: d.lat, lng: d.lng }))];
    // approximate distance and ETA
    const legs = points.slice(1).map((p, i) => ({ from: i === 0 ? origin : points[i], to: p, eta_min: randBetween(5, 25) }));
    return { vehicle: "Van-42", eta_total: legs.reduce((s, l) => s + l.eta_min, 0), legs };
  }

  function matchingAgent(demandList, detection) {
    // allocate proportions based on capacity and score
    const totalCap = demandList.reduce((s, d) => s + d.capacity, 0);
    let remainingKg = detection.est_kg;
    const allocations = demandList.map(d => {
      const proportion = d.capacity / totalCap;
      const allocated = Math.max(1, Math.round(proportion * detection.est_kg));
      remainingKg -= allocated;
      return { facility: d.name, id: d.id, allocated_kg: allocated };
    });
    // put leftovers to highest score
    if (remainingKg > 0 && allocations.length) allocations[0].allocated_kg += remainingKg;
    return allocations;
  }

  function impactAgent(series, donatedQty) {
    // appends a small bump and shifts data
    const newSeries = series.slice(1).concat([{ week: `W${series.length + 1}`, rescued_kg: Math.max(50, series[series.length - 1].rescued_kg + Math.round(donatedQty * 3 + randBetween(-30, 80))) }]);
    return newSeries;
  }

  // helpers
  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
  function randBetween(a, b) { return Math.random() * (b - a) + a; }

  // Form submit
  function handleDonate(e) {
    e.preventDefault();
    runAgents(donationForm);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100 p-6">
      <header className="max-w-7xl mx-auto flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3"><Box className="inline-block" /> Orchestrating Surplus to Sustainability</h1>
          <p className="text-slate-400">Agentic AI for Food Rescue & Urban Liveability</p>
        </div>
        <nav className="space-x-3 text-sm text-slate-300">
          <button className="px-3 py-2 bg-slate-700 rounded-md">Overview</button>
          <button className="px-3 py-2 bg-transparent border border-slate-700 rounded-md">Operations</button>
          <button className="px-3 py-2 bg-transparent rounded-md">Logs</button>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        {/* Left column: form + agents */}
        <section className="col-span-4 space-y-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-slate-850 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold">Donate Food</h2>
            <form onSubmit={handleDonate} className="mt-3 space-y-3">
              <div>
                <label className="text-sm text-slate-400">Type</label>
                <select className="w-full p-2 rounded-md bg-slate-900" value={donationForm.type} onChange={e => setDonationForm({ ...donationForm, type: e.target.value })}>
                  <option>Perishable</option>
                  <option>Non-perishable</option>
                  <option>Prepared Meal</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400">Item Name</label>
                <input className="w-full p-2 rounded-md bg-slate-900" value={donationForm.name} onChange={e => setDonationForm({ ...donationForm, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm text-slate-400">Quantity</label>
                  <input type="number" min={1} className="w-full p-2 rounded-md bg-slate-900" value={donationForm.quantity} onChange={e => setDonationForm({ ...donationForm, quantity: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="text-sm text-slate-400">Unit</label>
                  <select className="w-full p-2 rounded-md bg-slate-900" value={donationForm.unit} onChange={e => setDonationForm({ ...donationForm, unit: e.target.value })}>
                    <option>boxes</option>
                    <option>kg</option>
                    <option>packs</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button type="submit" disabled={busy} className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-900 font-semibold disabled:opacity-50">Donate</button>
                {busy ? <div className="text-sm text-slate-300">Processing agents...</div> : <div className="text-sm text-slate-400">Ready</div>}
              </div>
            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-slate-850 shadow-lg">
            <h3 className="font-semibold">Detection Agent</h3>
            <div className="mt-2 text-sm text-slate-300">
              {detected ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2"><MapPin /> <strong>{detected.name}</strong> — {detected.category}</div>
                  <div>Estimated weight: {detected.est_kg} kg</div>
                  <div>Expiry sensitivity: {(detected.expirySensitivity * 100).toFixed(0)}%</div>
                </div>
              ) : (
                <div className="text-slate-500">Awaiting donation...</div>
              )}
            </div>
          </motion.div>

          <motion.div className="p-4 rounded-2xl bg-slate-850 shadow-lg">
            <h3 className="font-semibold">Demand Agent</h3>
            <div className="mt-2 space-y-2 text-sm">
              {predictedDemand.length ? predictedDemand.map(d => (
                <div key={d.id} className="flex items-center justify-between bg-slate-900 p-2 rounded-lg">
                  <div>
                    <div className="font-medium">{d.name}</div>
                    <div className="text-xs text-slate-400">Score: {d.score.toFixed(2)} • Capacity: {d.capacity}</div>
                  </div>
                  <div className="text-xs">ETA: {Math.round(randBetween(10, 40))}m</div>
                </div>
              )) : <div className="text-slate-500">No predictions yet</div>}
            </div>
          </motion.div>

          <motion.div className="p-4 rounded-2xl bg-slate-850 shadow-lg">
            <h3 className="font-semibold">Matching Agent</h3>
            <div className="mt-2 text-sm">
              {matching.length ? matching.map(m => (
                <div key={m.id} className="flex items-center gap-2 justify-between bg-slate-900 p-2 rounded-lg">
                  <div className="flex items-center gap-2"><CheckCircle /> <div>{m.facility}</div></div>
                  <div className="font-medium">{m.allocated_kg} kg</div>
                </div>
              )) : <div className="text-slate-500">Idle</div>}
            </div>
          </motion.div>
        </section>

        {/* Right column: map + analytics */}
        <section className="col-span-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <motion.div className="p-4 rounded-2xl bg-slate-850 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Logistics Agent (Route)</h3>
                <div className="text-sm text-slate-400">Vehicle: {route ? route.vehicle : '—'}</div>
              </div>

              <div className="mt-3 h-44 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* Simple SVG map mockup with route polyline */}
                <svg viewBox="0 0 300 180" className="w-full h-full">
                  <defs>
                    <linearGradient id="g1" x1="0" x2="1"><stop offset="0%" stopColor="#06b6d4" /><stop offset="100%" stopColor="#7c3aed" /></linearGradient>
                  </defs>
                  <rect width="100%" height="100%" fill="transparent" />
                  {/* origin */}
                  <circle cx="40" cy="30" r="6" fill="#34d399" />
                  <text x="50" y="34" fontSize="10" fill="#cbd5e1">Donor</text>
                  {/* targets (mock positions) */}
                  <circle cx="120" cy="70" r="5" fill="#f97316" />
                  <text x="130" y="74" fontSize="10" fill="#cbd5e1">F1</text>
                  <circle cx="200" cy="90" r="5" fill="#f97316" />
                  <text x="210" y="94" fontSize="10" fill="#cbd5e1">F2</text>
                  <circle cx="250" cy="45" r="5" fill="#f97316" />
                  <text x="260" y="49" fontSize="10" fill="#cbd5e1">F3</text>

                  {/* route polyline */}
                  <polyline points="40,30 120,70 200,90 250,45" fill="none" stroke="url(#g1)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {!route && <div className="absolute text-slate-500 text-xs top-3 left-3">No route planned</div>}
                {route && <div className="absolute text-xs right-3 bottom-3 bg-slate-900/70 p-1 rounded">ETA {route.eta_total} min</div>}
              </div>

            </motion.div>

            <motion.div className="p-4 rounded-2xl bg-slate-850 shadow-lg">
              <h3 className="font-semibold">Impact Agent</h3>
              <div className="mt-3 h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={impactSeries} margin={{ top: 10, right: 0, left: -20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="week" tick={{ fill: '#9ca3af' }} />
                    <YAxis tick={{ fill: '#9ca3af' }} />
                    <Tooltip wrapperStyle={{ background: '#0f172a', borderRadius: 6 }} />
                    <Line type="monotone" dataKey="rescued_kg" stroke="#34d399" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 text-sm text-slate-400">Shows weekly rescued kilograms (simulated). Use this to measure liveability impact over time.</div>
            </motion.div>
          </div>

          <motion.div className="p-4 rounded-2xl bg-slate-850 shadow-lg">
            <h3 className="font-semibold">Operations Console</h3>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-900 rounded-lg text-sm">
                <div className="text-slate-400">Active Vehicles</div>
                <div className="text-lg font-medium">3</div>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg text-sm">
                <div className="text-slate-400">Pending Donations</div>
                <div className="text-lg font-medium">{feedLog.length}</div>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg text-sm">
                <div className="text-slate-400">Estimated Weekly Impact</div>
                <div className="text-lg font-medium">{impactSeries.reduce((s, x) => s + x.rescued_kg, 0)}</div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium">Recent Activity</h4>
              <div className="mt-2 space-y-2 text-sm text-slate-300">
                {feedLog.length ? feedLog.map((f, idx) => (
                  <div key={idx} className="p-2 bg-slate-900 rounded flex items-center justify-between">
                    <div>{f.time}</div>
                    <div className="text-slate-400">{f.summary}</div>
                  </div>
                )) : <div className="text-slate-500">No activity yet</div>}
              </div>
            </div>
          </motion.div>

          <motion.div className="p-4 rounded-2xl bg-slate-850 shadow-lg">
            <h3 className="font-semibold">Analytics Snapshot</h3>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-900 rounded-lg">
                <div className="text-xs text-slate-400">Rescued kg per week (preview)</div>
                <div style={{ height: 120 }}>
                  <ResponsiveContainer width="100%" height={120}>
                    <BarChart data={impactSeries} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis dataKey="week" tick={{ fill: '#9ca3af' }} />
                      <YAxis tick={{ fill: '#9ca3af' }} />
                      <Tooltip wrapperStyle={{ background: '#0f172a', borderRadius: 6 }} />
                      <Bar dataKey="rescued_kg" barSize={12} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg">
                <div className="text-xs text-slate-400">Recipient Distribution</div>
                <div className="mt-2 text-sm text-slate-200">Top recipients dynamically ranked in the Demand panel.</div>
              </div>
            </div>
          </motion.div>

        </section>
      </main>

      <footer className="max-w-7xl mx-auto mt-6 text-center text-slate-400 text-sm">Demo only — Connect real APIs for scanning, routing, and live data. Built for education and prototyping.</footer>
    </div>
  );
}
