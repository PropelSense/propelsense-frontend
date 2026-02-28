"use client";

import { useState } from "react";

// ─── Section definitions ───────────────────────────────────────────────────────
const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "getting-started", label: "Getting Started" },
  { id: "power-prediction", label: "Power Prediction" },
  { id: "sea-trials", label: "Sea Trials" },
  { id: "ocean-analytics", label: "Ocean Analytics" },
  { id: "vessel-traffic", label: "Vessel Traffic" },
  { id: "ml-model", label: "ML Model Details" },
  { id: "glossary", label: "Glossary" },
];

// ─── Sub-components ────────────────────────────────────────────────────────────
function SectionHeading({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="text-xl font-bold text-white flex items-center gap-3 scroll-mt-6"
    >
      {children}
    </h2>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-base font-semibold text-zinc-200 mt-5 mb-2">
      {children}
    </h3>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-zinc-400 leading-relaxed">{children}</p>;
}

function InfoCard({
  icon,
  title,
  desc,
  accent = "blue",
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  accent?: "blue" | "emerald" | "amber" | "violet" | "cyan";
}) {
  const colors: Record<string, string> = {
    blue: "border-blue-500/20 bg-blue-600/10 text-blue-400",
    emerald: "border-emerald-500/20 bg-emerald-600/10 text-emerald-400",
    amber: "border-amber-500/20 bg-amber-600/10 text-amber-400",
    violet: "border-violet-500/20 bg-violet-600/10 text-violet-400",
    cyan: "border-cyan-500/20 bg-cyan-600/10 text-cyan-400",
  };
  return (
    <div className="flex gap-4 p-4 rounded-xl border border-zinc-700/40 bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors">
      <div
        className={`w-10 h-10 shrink-0 rounded-lg border flex items-center justify-center ${colors[accent]}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-zinc-200">{title}</p>
        <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function StepCard({
  step,
  title,
  desc,
}: {
  step: number;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
        {step}
      </div>
      <div>
        <p className="text-sm font-semibold text-zinc-200">{title}</p>
        <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function Badge({
  children,
  color = "blue",
}: {
  children: React.ReactNode;
  color?: "blue" | "emerald" | "amber";
}) {
  const map = {
    blue: "bg-blue-600/20 text-blue-300 border-blue-500/20",
    emerald: "bg-emerald-600/20 text-emerald-300 border-emerald-500/20",
    amber: "bg-amber-600/20 text-amber-300 border-amber-500/20",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${map[color]}`}
    >
      {children}
    </span>
  );
}

function Divider() {
  return <div className="border-t border-zinc-800 my-8" />;
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function Documentation() {
  const [activeSection, setActiveSection] = useState("overview");

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex gap-8 max-w-6xl mx-auto">
      {/* Sticky sidebar TOC */}
      <aside className="hidden lg:block w-52 shrink-0">
        <div className="sticky top-8 space-y-0.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600 px-3 mb-3">
            On this page
          </p>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                activeSection === s.id
                  ? "bg-blue-600/15 text-blue-400 border-l-2 border-blue-500"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </aside>

      {/* Content */}
      <article className="flex-1 min-w-0 space-y-0 pb-20">
        {/* ── Overview ─────────────────────────────────────────────────── */}
        <section id="overview" className="scroll-mt-6">
          {/* Hero banner */}
          <div className="rounded-xl border border-blue-500/20 bg-linear-to-br from-blue-600/10 via-zinc-900/80 to-zinc-900/60 p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">PropelSense</h1>
                <p className="text-xs text-zinc-500">
                  AI-Powered Vessel Propulsion Intelligence
                </p>
              </div>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed max-w-2xl">
              PropelSense is an intelligent maritime decision-support platform
              that leverages machine learning to predict vessel propulsion power
              requirements in real time. By combining live ocean conditions,
              vessel trim data, and environmental parameters, it helps operators
              and engineers optimise fuel consumption, plan voyages more
              efficiently, and benchmark performance against sea trial
              baselines.
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              <Badge color="blue">XGBoost · R² 0.978</Badge>
              <Badge color="emerald">19 Prediction Features</Badge>
              <Badge color="amber">Real-time Weather Integration</Badge>
            </div>
          </div>

          <SectionHeading id="overview">Platform Modules</SectionHeading>
          <p className="text-sm text-zinc-400 mt-2 mb-5 leading-relaxed">
            PropelSense is organised into focused modules. Each module can be
            accessed from the left sidebar.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoCard
              accent="blue"
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              }
              title="Power Prediction"
              desc="Predict shaft/propulsion power using the onboard XGBoost model. Input vessel conditions and receive an instant kW estimate with confidence range."
            />
            <InfoCard
              accent="cyan"
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 7h6m-6 4h6"
                  />
                </svg>
              }
              title="Sea Trials"
              desc="Browse and analyse historical sea trial records. Compare predicted power against measured trial data to validate model accuracy."
            />
            <InfoCard
              accent="violet"
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              }
              title="Ocean Analytics"
              desc="Live and forecast marine weather data, wave height, swell period, current vectors, and wind from the Open-Meteo Marine API."
            />
            <InfoCard
              accent="emerald"
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              }
              title="Vessel Traffic"
              desc="Live AIS vessel positions on an interactive map. Monitor nearby traffic, vessel identities, speed, and course in real time."
            />
            <InfoCard
              accent="amber"
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
              }
              title="Weather Details"
              desc="Atmospheric forecast including wind speed and direction, temperature, pressure, and precipitation from OpenWeather and Open-Meteo."
            />
          </div>
        </section>

        <Divider />

        {/* ── Getting Started ───────────────────────────────────────────── */}
        <section id="getting-started" className="scroll-mt-6">
          <SectionHeading id="getting-started">Getting Started</SectionHeading>
          <p className="text-sm text-zinc-400 mt-2 mb-6 leading-relaxed">
            New to PropelSense? Follow these steps to make your first power
            prediction and explore the platform.
          </p>
          <div className="space-y-5">
            <StepCard
              step={1}
              title="Create an account or sign in"
              desc="Register with your email and password. A verification email will be sent, click the link to activate your account, then sign in."
            />
            <StepCard
              step={2}
              title="Open the Power Prediction module"
              desc={`Click "New Prediction" in the left sidebar. This is the core feature of PropelSense, you can run instant ML predictions from here.`}
            />
            <StepCard
              step={3}
              title="Fill in vessel conditions"
              desc="Enter your current vessel parameters: draft readings, speed through water, wind components, current vectors, wave height, and time since dry dock."
            />
            <StepCard
              step={4}
              title="Run the prediction"
              desc={`Click "Run Prediction". The XGBoost model processes your 10 inputs, derives 9 additional features, and returns the estimated propulsion power in kilowatts within milliseconds.`}
            />
            <StepCard
              step={5}
              title="Review the result"
              desc="The result banner shows the power estimate in kW and MW, an efficiency zone indicator (Efficient / Moderate / High Load), and a summary of your key inputs."
            />
            <StepCard
              step={6}
              title="Explore history and analytics"
              desc={`Enable "Save to History" to build a record of predictions. Switch to the History tab to compare runs over time. Visit Ocean Analytics and Vessel Traffic for environmental context.`}
            />
          </div>
        </section>

        <Divider />

        {/* ── Power Prediction ──────────────────────────────────────────── */}
        <section id="power-prediction" className="scroll-mt-6">
          <SectionHeading id="power-prediction">
            Power Prediction
          </SectionHeading>
          <p className="text-sm text-zinc-400 mt-2 mb-5 leading-relaxed">
            The Power Prediction module is the centrepiece of PropelSense. It
            uses a trained XGBoost regression model to estimate the propulsive
            power a vessel requires under given sea and operational conditions.
          </p>

          <SubHeading>Input Fields</SubHeading>
          <div className="overflow-x-auto rounded-xl border border-zinc-700/40">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-700/40 bg-zinc-800/50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 w-48">
                    Field
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400">
                    Description
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 w-20">
                    Unit
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {[
                  [
                    "Aft Draft",
                    "Aft draft reading from the draft telegram",
                    "m",
                  ],
                  [
                    "Fore Draft",
                    "Forward draft reading from the draft telegram",
                    "m",
                  ],
                  [
                    "Speed Through Water (STW)",
                    "Vessel speed through water measured by the log",
                    "kn",
                  ],
                  [
                    "SOG–STW Diff",
                    "Difference between speed over ground and STW, acts as a current proxy",
                    "kn",
                  ],
                  [
                    "Wind V-component",
                    "North/south component of apparent wind velocity",
                    "m/s",
                  ],
                  [
                    "Wind U-component",
                    "East/west component of apparent wind velocity",
                    "m/s",
                  ],
                  [
                    "Current V-component",
                    "North/south component of residual ocean current",
                    "m/s",
                  ],
                  [
                    "Current U-component",
                    "East/west component of residual ocean current",
                    "m/s",
                  ],
                  [
                    "Wave Height",
                    "Combined wind and swell significant wave height",
                    "m",
                  ],
                  [
                    "Time Since Dry Dock",
                    "Days elapsed since last dry dock, proxy for hull fouling",
                    "days",
                  ],
                ].map(([name, desc, unit]) => (
                  <tr
                    key={name}
                    className="hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="px-4 py-2.5">
                      <code className="text-xs text-blue-300">{name}</code>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-zinc-400">
                      {desc}
                    </td>
                    <td className="px-4 py-2.5 text-xs font-mono text-zinc-500">
                      {unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <SubHeading>Derived Features</SubHeading>
          <p className="text-sm text-zinc-400 mb-3 leading-relaxed">
            The model internally computes 9 additional features from your 10
            inputs. You never need to calculate these, they are handled
            automatically.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              ["stw_cubed", "STW³", "Cubic drag resistance"],
              ["stw_squared", "STW²", "Quadratic drag component"],
              ["mean_draft", "(aft+fore)/2", "Average vessel draft"],
              ["trim", "aft − fore", "Longitudinal vessel trim"],
              ["wind_magnitude", "√(u²+v²)", "Total apparent wind speed"],
              ["wind_angle", "atan2(v,u)", "Apparent wind direction"],
              ["current_magnitude", "√(u²+v²)", "Total current speed"],
              ["current_angle", "atan2(v,u)", "Current direction"],
              [
                "speed_wind_interaction",
                "stw × wind",
                "Cross-term: speed × wind",
              ],
            ].map(([name, formula, desc]) => (
              <div
                key={name}
                className="rounded-lg border border-zinc-700/30 bg-zinc-800/30 px-3 py-2.5"
              >
                <code className="text-xs text-emerald-300 block">{name}</code>
                <code className="text-xs text-zinc-500">{formula}</code>
                <p className="text-xs text-zinc-600 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>

          <SubHeading>Prediction History</SubHeading>
          <Prose>
            When <em className="text-zinc-300">Save to History</em> is enabled
            (default: on), each prediction is stored against your account.
            Switch to the <em className="text-zinc-300">History</em> tab to
            browse past runs, view timestamps, input parameters, and predicted
            power values. You can delete individual records or clear all history
            at any time.
          </Prose>

          <SubHeading>Efficiency Zones</SubHeading>
          <div className="flex flex-wrap gap-3 mt-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-500/20 bg-emerald-600/10">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="text-xs text-emerald-300 font-medium">
                Efficient
              </span>
              <span className="text-xs text-zinc-500">
                Below 40% of max rated power
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-amber-500/20 bg-amber-600/10">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className="text-xs text-amber-300 font-medium">
                Moderate
              </span>
              <span className="text-xs text-zinc-500">
                40–65% of max rated power
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-orange-500/20 bg-orange-600/10">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400"></span>
              <span className="text-xs text-orange-300 font-medium">
                High Load
              </span>
              <span className="text-xs text-zinc-500">
                Above 65% of max rated power
              </span>
            </div>
          </div>
        </section>

        <Divider />

        {/* ── Sea Trials ────────────────────────────────────────────────── */}
        <section id="sea-trials" className="scroll-mt-6">
          <SectionHeading id="sea-trials">Sea Trials</SectionHeading>
          <p className="text-sm text-zinc-400 mt-2 mb-5 leading-relaxed">
            The Sea Trials module provides access to historical performance
            trial records. Sea trials are standardised tests conducted under
            controlled conditions to measure a vessel&apos;s actual propulsion
            performance, they serve as the ground truth against which model
            predictions can be validated.
          </p>
          <div className="space-y-3">
            <InfoCard
              accent="cyan"
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              }
              title="Trial Records"
              desc="Browse individual sea trial runs with full parameter sets: speed, power, RPM, draft, sea state, and environmental conditions at time of trial."
            />
            <InfoCard
              accent="cyan"
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
              }
              title="Performance Curves"
              desc="Visualise speed–power relationships across trial conditions. Compare across different loading conditions, hull states, and environmental situations."
            />
            <InfoCard
              accent="cyan"
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              }
              title="Model Validation"
              desc="Use sea trial data to cross-check prediction accuracy. High agreement between predicted and trial power confirms the model is well-calibrated for your vessel."
            />
          </div>
        </section>

        <Divider />

        {/* ── Ocean Analytics ───────────────────────────────────────────── */}
        <section id="ocean-analytics" className="scroll-mt-6">
          <SectionHeading id="ocean-analytics">Ocean Analytics</SectionHeading>
          <p className="text-sm text-zinc-400 mt-2 mb-5 leading-relaxed">
            Ocean Analytics provides a comprehensive marine weather dashboard
            powered by the{" "}
            <em className="text-zinc-300">Open-Meteo Marine API</em>. It
            delivers real-time and forecast ocean conditions relevant to
            propulsion planning.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              [
                "Wave Height",
                "Significant wave height (combined wind and swell), the primary sea state indicator used by the prediction model.",
                "violet",
              ],
              [
                "Swell Period",
                "Dominant swell period in seconds. Longer periods indicate ocean swell from distant storms; shorter periods indicate local wind-driven chop.",
                "violet",
              ],
              [
                "Wind Waves",
                "Locally generated wind wave height, direction, and peak period at current position.",
                "violet",
              ],
              [
                "Ocean Currents",
                "Surface current speed and direction vectors, directly feed into the power prediction model as U/V components.",
                "violet",
              ],
            ].map(([title, desc, accent]) => (
              <InfoCard
                key={title}
                accent={accent as "violet"}
                title={title}
                desc={desc}
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                }
              />
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg border border-blue-500/20 bg-blue-600/10 flex gap-3 items-start">
            <svg
              className="w-4 h-4 text-blue-400 mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-xs text-blue-300 leading-relaxed">
              <strong>Tip:</strong> Use the Ocean Analytics page to read live
              wave height and current values, then copy them directly into the
              Power Prediction form for a condition-accurate estimate.
            </p>
          </div>
        </section>

        <Divider />

        {/* ── Vessel Traffic ────────────────────────────────────────────── */}
        <section id="vessel-traffic" className="scroll-mt-6">
          <SectionHeading id="vessel-traffic">Vessel Traffic</SectionHeading>
          <p className="text-sm text-zinc-400 mt-2 mb-5 leading-relaxed">
            The Vessel Traffic module displays live AIS (Automatic
            Identification System) vessel positions on an interactive map. AIS
            is the international standard for vessel tracking and collision
            avoidance, broadcasting vessel identity, position, speed, and
            course.
          </p>
          <div className="space-y-3">
            <InfoCard
              accent="emerald"
              title="Live AIS Positions"
              desc="Real-time vessel positions updated from AIS feeds. Markers show vessel type, name, MMSI, speed over ground (SOG), and course over ground (COG)."
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              }
            />
            <InfoCard
              accent="emerald"
              title="Vessel Details"
              desc="Click any vessel on the map to see full details: ship name, flag, type, dimensions, destination, and ETA if broadcast."
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />
            <InfoCard
              accent="emerald"
              title="Zone Monitoring"
              desc="The default view centres on the Turku/SW Finland maritime zone. Pan and zoom freely to monitor any area of interest."
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              }
            />
          </div>
        </section>

        <Divider />

        {/* ── ML Model Details ──────────────────────────────────────────── */}
        <section id="ml-model" className="scroll-mt-6">
          <SectionHeading id="ml-model">ML Model Details</SectionHeading>
          <p className="text-sm text-zinc-400 mt-2 mb-5 leading-relaxed">
            The power prediction model is an{" "}
            <em className="text-zinc-300">
              XGBoost gradient-boosted regressor
            </em>{" "}
            trained on real-world vessel operational data combined with
            synthetic augmentation to improve generalisation.
          </p>

          <div className="grid sm:grid-cols-3 gap-3 mb-6">
            {[
              [
                "R² Score",
                "0.978",
                "Proportion of variance explained by the model, 1.0 is perfect.",
              ],
              ["MAE", "±866 kW", "Mean absolute error on the validation set."],
              [
                "Features",
                "19 total",
                "10 raw inputs + 9 engineered features.",
              ],
            ].map(([label, value, desc]) => (
              <div
                key={label}
                className="rounded-xl border border-zinc-700/40 bg-zinc-800/30 p-4 text-center"
              >
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs font-semibold text-zinc-300 mt-1">
                  {label}
                </p>
                <p className="text-xs text-zinc-600 mt-1 leading-snug">
                  {desc}
                </p>
              </div>
            ))}
          </div>

          <SubHeading>Training Data</SubHeading>
          <Prose>
            The model was trained on a combined dataset of real sea trial
            records and synthetic data generated to cover a wide range of
            operating conditions. Features were carefully engineered to capture
            the dominant physical relationships in marine propulsion: cubic
            speed resistance, hull trim effects, and wind/current vector
            interactions.
          </Prose>

          <SubHeading>Model Hosting</SubHeading>
          <Prose>
            The trained model artifacts (XGBoost model, feature scaler, target
            scaler) are hosted on{" "}
            <em className="text-zinc-300">Hugging Face Hub</em> under the
            PropelSense organisation and loaded at backend startup. Predictions
            are served via the FastAPI backend at sub-100 ms latency.
          </Prose>

          <SubHeading>Limitations</SubHeading>
          <div className="mt-2 space-y-2">
            {[
              "Predictions assume a single vessel type. Accuracy may vary for vessels with significantly different hull forms.",
              "Hull fouling proxy (time since dry dock) is a simplification, actual fouling depends on paint type, operating waters, and speed profile.",
              "The model does not account for machinery condition degradation beyond hull fouling.",
              "Wave height input represents significant wave height, swell direction relative to the vessel heading is not currently a feature.",
            ].map((item) => (
              <div
                key={item}
                className="flex gap-3 items-start text-xs text-zinc-500"
              >
                <span className="text-amber-500 mt-0.5 shrink-0">⚠</span>
                {item}
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ── Glossary ──────────────────────────────────────────────────── */}
        <section id="glossary" className="scroll-mt-6">
          <SectionHeading id="glossary">Glossary</SectionHeading>
          <p className="text-sm text-zinc-400 mt-2 mb-5 leading-relaxed">
            Key terms used throughout the platform.
          </p>
          <div className="space-y-0 divide-y divide-zinc-800/60 border border-zinc-700/40 rounded-xl overflow-hidden">
            {[
              [
                "AIS",
                "Automatic Identification System, a transponder system used by vessels to broadcast their position, identity, and voyage data.",
              ],
              [
                "Draft",
                "Vertical distance between the waterline and the lowest point of the vessel's hull (keel).",
              ],
              [
                "STW",
                "Speed Through Water, vessel speed relative to the water mass, as opposed to SOG which is relative to the seabed.",
              ],
              [
                "SOG",
                "Speed Over Ground, vessel speed measured relative to the earth, typically by GPS.",
              ],
              [
                "Trim",
                "The longitudinal inclination of a vessel, the difference between aft and fore drafts.",
              ],
              [
                "Significant Wave Height (Hs)",
                "The average height of the highest one-third of waves in a sea state, the standard wave height measurement.",
              ],
              [
                "Swell",
                "Long-period waves generated by distant wind systems, as opposed to locally generated wind waves.",
              ],
              [
                "Apparent Wind",
                "Wind speed and direction as experienced on a moving vessel, the vector sum of the true wind and the headwind caused by vessel motion.",
              ],
              [
                "Residual Current",
                "The net ocean current after tidal components are removed, represents the long-term drift of the water mass.",
              ],
              [
                "XGBoost",
                "Extreme Gradient Boosting, an ensemble machine learning algorithm that builds many decision trees sequentially to minimise prediction error.",
              ],
              [
                "R² Score",
                "Coefficient of determination, measures how well the model predictions match the observed data. 1.0 = perfect fit, 0 = no better than predicting the mean.",
              ],
              [
                "MAE",
                "Mean Absolute Error, the average magnitude of prediction errors, expressed in the same unit as the target (kW).",
              ],
              [
                "Dry Dock",
                "A period when a vessel is taken out of the water for hull inspection, cleaning, and repainting. Reduces hull fouling and restores propulsive efficiency.",
              ],
              [
                "Hull Fouling",
                "The accumulation of marine organisms (barnacles, algae) on the hull over time, which increases drag and raises propulsion power demand.",
              ],
            ].map(([term, def]) => (
              <div
                key={term}
                className="px-4 py-3 flex gap-4 hover:bg-zinc-800/30 transition-colors"
              >
                <span className="text-sm font-semibold text-zinc-200 w-44 shrink-0">
                  {term}
                </span>
                <span className="text-sm text-zinc-500 leading-relaxed">
                  {def}
                </span>
              </div>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
