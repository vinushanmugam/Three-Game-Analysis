import { useState } from "react";

// ─── RAW GAME DATA ────────────────────────────────────────────────────────────
const GAMES = {
  detVsNyk: {
    label: "DET vs NYK",
    date: "Feb 19 @ MSG",
    home: "NYK", away: "DET",
    score: { DET: 126, NYK: 111 },
    quarters: { DET: [28,30,32,36], NYK: [26,22,31,32] },
    winner: "DET",
    notes: "Cade 42pts/13ast — near triple-double. Detroit dominated all 4 quarters. Paint control 58-56, Cade 50% FG.",
    keyStats: {
      cade:     { pts:42, ast:13, reb:8, fgPct:50.0, paintPts:16, to:5 },
      ausar:    { pts:10, ast:4,  reb:5, stl:3, fgPct:50.0 },
      reed:     { pts:18, fgPct:77.8 },
      brunson:  { pts:33, fgPct:60.0 },
    },
    teamDET: { fgPct:51.6, threePct:43.3, paintPts:58, fastBreak:18, ast:30, to:15, rimPct:60.0 },
    teamNYK: { fgPct:47.1, threePct:22.9, paintPts:56, fastBreak:16, ast:24, to:12, rimPct:64.5 },
  },
  nykVsSas: {
    label: "NYK vs SAS",
    date: "Mar 1 @ MSG",
    home: "NYK", away: "SAS",
    score: { NYK: 114, SAS: 89 },
    quarters: { NYK:[22,29,29,34], SAS:[21,20,28,20] },
    winner: "NYK",
    notes: "Knicks suffocated the Spurs — 22 SAS turnovers. Wemby had 7 TOs alone. NYK 13 steals, 24pts off turnovers. Bridges 25pts, 5 stl.",
    keyStats: {
      wemby:    { pts:25, reb:13, blk:4, to:7, fgPct:47.1 },
      fox:      { pts:7,  ast:6,  fgPct:30.0, to:2 },
      castle:   { pts:13, ast:4,  fgPct:38.5 },
      brunson:  { pts:24, ast:7,  fgPct:43.8 },
      bridges:  { pts:25, stl:5,  fgPct:58.8 },
    },
    teamNYK: { fgPct:44.3, threePct:35.4, stl:13, ptsTurnovers:24, fastBreak:23, ast:27 },
    teamSAS: { fgPct:41.6, threePct:26.5, to:22, rimPct:65.4 },
  },
  detVsSas: {
    label: "DET vs SAS",
    date: "Mar 5 @ SA",
    home: "SAS", away: "DET",
    score: { DET: 106, SAS: 121 },
    quarters: { DET:[23,32,30,21], SAS:[38,33,22,28] },
    winner: "SAS",
    notes: "Wemby 38/16/5blk. Cade 26pts on 26 shots, 44% rim rate. Castle 12 AST. First quarter massacre — SAS 38-23.",
    keyStats: {
      wemby:  { pts:38, reb:16, blk:5, fgPct:50.0, to:0 },
      fox:    { pts:29, fgPct:54.5 },
      castle: { pts:11, ast:12, fgPct:50.0 },
      cade:   { pts:26, ast:8,  reb:4, fgPct:38.5, paintPct:25.0, to:4 },
      levert: { pts:0,  fgPct:0 },
    },
    teamDET: { fgPct:40.2, threePct:42.9, paintPts:36, rimPct:44.1, to:10, benchPts:51 },
    teamSAS: { fgPct:50.0, paintPts:52, fastBreak:16, rimPct:71.0, ast:24 },
  },
};

// ─── WHAT KNICKS DID TO SPURS — THE BLUEPRINT ────────────────────────────────
const BLUEPRINT = [
  { id:"press", label:"Full-court pressure + traps", impact:"22 SAS TOs → 24 pts off turnovers", applicable: true },
  { id:"wemby", label:"Force Wemby into decisions early", impact:"Wemby 7 TOs — highest of season", applicable: true },
  { id:"bridges", label:"Bridges-style perimeter wolf pack", impact:"13 NYK steals, 5 from Bridges alone", applicable: true },
  { id:"pace",  label:"Punish in transition", impact:"23 NYK fast break pts vs SAS's weak recovery", applicable: true },
  { id:"space", label:"Space floor — 48 three-point attempts", impact:"Pulled Wemby away from rim", applicable: true },
  { id:"bully", label:"Offensive rebounding blitz", impact:"22 second-chance pts — relentless", applicable: true },
];

// ─── PISTONS ASSETS / LIABILITIES VS SPURS ───────────────────────────────────
const DET_ASSETS = [
  { label:"Cade's vision", detail:"13 AST vs NYK — can generate the same 4-on-3s that NYK exploited" },
  { label:"Ausar Thompson's athleticism", detail:"Elite lateral speed — mirror of Bridges as a perimeter disruptor" },
  { label:"Holland II motor", detail:"Crashes glass relentlessly — 4 offensive rebounds vs SAS on limited mins" },
  { label:"Paint dominance vs NYK", detail:"58 pts in paint vs NYK — the engine works when not Wemby-blocked" },
  { label:"Bench depth", detail:"51 bench pts vs SAS even in a loss — unit can sustain pressure" },
];

const DET_GAPS = [
  { label:"No trap setter like Hart", detail:"Knicks used Hart's hustle to set traps. DET lacks that specific role player." },
  { label:"Zero perimeter wolves", detail:"NYK had Bridges (5 stl), Anunoby. DET's best defender (Ausar) was injured vs SAS." },
  { label:"Paint conversion without spacing", detail:"44% at rim vs SAS — Wemby too comfortable. Need more catch-and-shoot threats." },
  { label:"LeVert as PnR initiator", detail:"0pts/0-5 FG vs SAS. NYK's Brunson had no equivalent dead zone." },
  { label:"Turnover susceptibility", detail:"15 TOs vs NYK, 10 vs SAS — NYK forced 22 SAS TOs. DET can't afford same." },
];

// ─── COLORS ──────────────────────────────────────────────────────────────────
const C = {
  bg: "#070b14", card: "#0d1423", border: "#1a2540",
  det: "#1D42BA", detL: "#4a6cf7", detGlow: "#1D42BA44",
  sas: "#C4CED4", sasD: "#7a8896",
  nyk: "#f58426", nykD: "#c4631a",
  text: "#dce8f5", muted: "#4a6080", dim: "#2a3a5a",
  green: "#36d68a", red: "#f05a6e", yellow: "#f5c842", purple: "#a78bfa",
  accent: "#00d4ff",
};

const mono = "'Space Mono', monospace";
const display = "'Bebas Neue', cursive";

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────
function Tag({ color, children }) {
  return (
    <span style={{
      display:"inline-block", padding:"2px 8px", borderRadius:99,
      background:`${color}18`, border:`1px solid ${color}55`,
      color, fontSize:9, fontFamily:mono, letterSpacing:1,
    }}>{children}</span>
  );
}

function GameCard({ game, gameKey, active, onClick }) {
  const winner = game.winner;
  const detWon = winner === "DET";
  const sasWon = winner === "SAS";
  const nykWon = winner === "NYK";

  const homeTeam = game.home;
  const awayTeam = game.away;
  const homeScore = game.score[homeTeam];
  const awayScore = game.score[awayTeam];

  const teamColor = (t) => t === "DET" ? C.detL : t === "NYK" ? C.nyk : C.sas;

  return (
    <div onClick={onClick} style={{
      cursor:"pointer", padding:16, borderRadius:10,
      background: active ? C.card : "#09101e",
      border:`1px solid ${active ? C.accent+"66" : C.border}`,
      boxShadow: active ? `0 0 20px ${C.accent}18` : "none",
      transition:"all 0.25s",
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <div>
          <div style={{ color:C.muted, fontSize:9, fontFamily:mono, letterSpacing:2 }}>{game.date}</div>
          <div style={{ color:C.text, fontSize:11, fontFamily:mono, fontWeight:"bold", marginTop:2 }}>{game.label}</div>
        </div>
        <Tag color={winner === "DET" ? C.detL : winner === "NYK" ? C.nyk : C.sas}>{winner} WIN</Tag>
      </div>

      <div style={{ display:"flex", justifyContent:"space-around", marginBottom:10 }}>
        {[awayTeam, homeTeam].map((t, i) => (
          <div key={t} style={{ textAlign: i===0?"right":"left" }}>
            <div style={{ color:C.muted, fontSize:9, fontFamily:mono, letterSpacing:1 }}>{t}</div>
            <div style={{
              fontSize:32, fontFamily:display, letterSpacing:2,
              color: game.winner===t ? teamColor(t) : C.muted,
            }}>{game.score[t]}</div>
          </div>
        ))}
      </div>

      {/* quarter dots */}
      <div style={{ display:"flex", gap:3 }}>
        {[0,1,2,3].map(q => {
          const aw = game.quarters[awayTeam]?.[q] ?? 0;
          const hw = game.quarters[homeTeam]?.[q] ?? 0;
          const det = awayTeam==="DET" ? aw : homeTeam==="DET" ? hw : null;
          const sas = awayTeam==="SAS" ? aw : homeTeam==="SAS" ? hw : null;
          const nyk = awayTeam==="NYK" ? aw : homeTeam==="NYK" ? hw : null;
          const detQ = game.quarters["DET"]?.[q];
          const oppQ = awayTeam!=="DET" ? game.quarters[awayTeam]?.[q] : game.quarters[homeTeam]?.[q];
          const detWonQ = detQ > oppQ;
          return (
            <div key={q} style={{
              flex:1, height:3, borderRadius:1,
              background: gameKey==="nykVsSas"
                ? (game.quarters["NYK"][q] > game.quarters["SAS"][q] ? C.nyk+"aa" : C.sas+"44")
                : (detWonQ ? C.detL+"aa" : C.red+"44"),
            }} />
          );
        })}
      </div>
      <div style={{ color:C.muted, fontSize:8, fontFamily:mono, marginTop:3 }}>QUARTERS</div>
    </div>
  );
}

function StatRow({ label, val, compare, higherBetter=true, unit="" }) {
  const diff = val - compare;
  const better = higherBetter ? diff > 0 : diff < 0;
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"5px 0", borderBottom:`1px solid ${C.border}` }}>
      <span style={{ color:C.muted, fontSize:10, fontFamily:mono }}>{label}</span>
      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
        <span style={{ color:C.text, fontSize:11, fontFamily:mono }}>{val}{unit}</span>
        {diff !== 0 && (
          <span style={{ color:better?C.green:C.red, fontSize:9, fontFamily:mono }}>
            {diff>0?"+":""}{diff.toFixed(unit==="%"?1:0)}{unit}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── SCENARIO BUILDER ─────────────────────────────────────────────────────────
const SCENARIOS = {
  base: { label:"Actual Game (Mar 5)", detScore:106, sasScore:121, color:C.red },
  ausar: { label:"+ Healthy Ausar (30 min)", detScore:112, sasScore:117, color:C.yellow },
  blueprint: { label:"Apply NYK Blueprint", detScore:117, sasScore:112, color:C.yellow },
  full: { label:"Blueprint + Ausar + Rotation Fix", detScore:121, sasScore:113, color:C.green },
  cade: { label:"Cade replicates NYK performance", detScore:125, sasScore:114, color:C.green },
};

const SCENARIO_DETAIL = {
  base: {
    cade: "26pts/26 shots/38.5% FG/25% paint conversion",
    wemby: "38pts/16reb/5blk — unrestricted rim protection",
    defense: "SAS only 9 TOs — zero pressure generated",
    bench: "LeVert 0pts — no secondary creator",
    key: "Detroit never solved Wemby's rim protection. Q1 deficit (38-23) was insurmountable.",
  },
  ausar: {
    cade: "~30pts/improved FG% — Wemby split focus",
    wemby: "~28pts — forced to guard Ausar's cuts off-ball",
    defense: "Ausar as perimeter disruptor adds 2-3 SAS TOs",
    bench: "Thompson 12-15pts, Holland/Reed sustained",
    key: "Ausar's two-way presence splits Wemby's attention. Closer game, DET competitive but still faces Q1 hole.",
  },
  blueprint: {
    cade: "~30pts/10ast — becomes the trap-trigger like Brunson",
    wemby: "~30pts but 5-6 TOs (NYK forced 7 from Wemby alone at MSG)",
    defense: "Pressure scheme: target Fox & Castle as ball-handlers in pick-and-roll",
    bench: "Green elevated as Bridges-style perimeter wolf: 4-5 stl projection",
    key: "Apply NYK's trap-heavy scheme. Fox shot 30% vs NYK. Make him earn every possession. Flood rotations with athleticism.",
  },
  full: {
    cade: "~33pts/11ast — operates like Brunson did vs SAS (24pts/7ast)",
    wemby: "~26pts/6 TOs — scheme + Ausar neutralizes dominance",
    defense: "Ausar + Green + Holland = three perimeter wolves rotating",
    bench: "Robinson/Huerter spacing pulls Wemby out of paint — 3s punish help rotations",
    key: "The full package: healthy rotation + trap scheme + spacing. Detroit's best realistic path to a win.",
  },
  cade: {
    cade: "42pts/13ast — his NYK performance transplanted to SAS game",
    wemby: "~28pts — can't focus solely on Cade with open shooters",
    defense: "Cade's vision creates open 3s (DET shot 43% from 3 vs NYK)",
    bench: "NYK-style role players (Reed 77% FG, Huerter 75%) emerge in supportive structure",
    key: "Peak Cade with proper spacing is genuinely elite. The question: can he replicate NYK performance against Wemby's rim presence?",
  },
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeGame, setActiveGame] = useState("detVsSas");
  const [activeScenario, setActiveScenario] = useState("base");
  const [activeTab, setActiveTab] = useState("breakdown"); // breakdown | blueprint | scenario

  const game = GAMES[activeGame];
  const scen = SCENARIOS[activeScenario];
  const detail = SCENARIO_DETAIL[activeScenario];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:C.text, fontFamily:mono, padding:20 }}>
      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <div style={{ color:C.accent, fontSize:9, letterSpacing:3, marginBottom:4 }}>TACTICAL ANALYSIS · 2025-26 NBA</div>
        <h1 style={{ margin:0, fontFamily:display, fontSize:28, letterSpacing:3, color:C.text }}>
          HOW DO THE PISTONS BEAT THE SPURS?
        </h1>
        <div style={{ color:C.muted, fontSize:10, letterSpacing:1, marginTop:4 }}>
          Cross-referencing 3 games · Knicks blueprint · Detroit scenario modeling
        </div>
      </div>

      {/* Game Cards Row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:24 }}>
        {Object.entries(GAMES).map(([key, g]) => (
          <GameCard key={key} game={g} gameKey={key} active={activeGame===key} onClick={()=>{ setActiveGame(key); setActiveTab("breakdown"); }} />
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:4, marginBottom:16 }}>
        {[
          { id:"breakdown", label:"GAME BREAKDOWN" },
          { id:"blueprint", label:"NYK BLUEPRINT" },
          { id:"scenario",  label:"SCENARIO SIMULATOR" },
        ].map(t => (
          <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{
            padding:"8px 16px", borderRadius:6, border:`1px solid ${activeTab===t.id ? C.accent : C.border}`,
            background: activeTab===t.id ? `${C.accent}18` : "transparent",
            color: activeTab===t.id ? C.accent : C.muted,
            cursor:"pointer", fontSize:9, fontFamily:mono, letterSpacing:2,
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── BREAKDOWN TAB ── */}
      {activeTab==="breakdown" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {/* Left: narrative */}
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:20 }}>
            <div style={{ fontSize:9, letterSpacing:2, color:C.muted, marginBottom:12 }}>GAME NARRATIVE</div>
            <div style={{ fontSize:12, color:C.text, lineHeight:1.9, marginBottom:16 }}>{game.notes}</div>

            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:20 }}>
              {activeGame==="detVsNyk" && <><Tag color={C.detL}>DET DOMINANT</Tag><Tag color={C.purple}>CADE MASTERCLASS</Tag><Tag color={C.green}>PAINT CONTROL</Tag></>}
              {activeGame==="nykVsSas" && <><Tag color={C.nyk}>22 SAS TURNOVERS</Tag><Tag color={C.red}>WEMBY 7 TOs</Tag><Tag color={C.green}>TRAP SCHEME</Tag></>}
              {activeGame==="detVsSas" && <><Tag color={C.red}>Q1 MASSACRE</Tag><Tag color={C.sas}>WEMBY UNLEASHED</Tag><Tag color={C.yellow}>CADE CHOKED</Tag></>}
            </div>

            {/* Quarter-by-quarter */}
            <div style={{ fontSize:9, letterSpacing:2, color:C.muted, marginBottom:10 }}>QUARTER FLOW</div>
            {[0,1,2,3].map(q => {
              const teams = activeGame==="nykVsSas" ? ["NYK","SAS"] : ["DET", activeGame==="detVsNyk"?"NYK":"SAS"];
              const t1 = teams[0]; const t2 = teams[1];
              const s1 = game.quarters[t1]?.[q]??0;
              const s2 = game.quarters[t2]?.[q]??0;
              const max = Math.max(s1,s2,38);
              const col1 = t1==="DET"?C.detL:t1==="NYK"?C.nyk:C.sas;
              const col2 = t2==="DET"?C.detL:t2==="NYK"?C.nyk:C.sas;
              return (
                <div key={q} style={{ marginBottom:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                    <span style={{ color:C.muted, fontSize:9 }}>Q{q+1}</span>
                    <span style={{ color:s1>s2?col1:col2, fontSize:10 }}>{s1} – {s2}</span>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:3 }}>
                    <div style={{ background:C.dim, borderRadius:2, height:6, overflow:"hidden" }}>
                      <div style={{ width:`${(s1/max)*100}%`, height:"100%", background:col1, borderRadius:2 }} />
                    </div>
                    <div style={{ background:C.dim, borderRadius:2, height:6, overflow:"hidden" }}>
                      <div style={{ width:`${(s2/max)*100}%`, height:"100%", background:col2, borderRadius:2 }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: key stats */}
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:20 }}>
            <div style={{ fontSize:9, letterSpacing:2, color:C.muted, marginBottom:12 }}>KEY PLAYER PERFORMANCES</div>
            {Object.entries(game.keyStats).map(([player, stats]) => (
              <div key={player} style={{
                padding:"10px 12px", borderRadius:8, marginBottom:8,
                background:"#09101e", border:`1px solid ${C.border}`,
              }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontSize:11, color:C.text, fontWeight:"bold", textTransform:"uppercase", letterSpacing:1 }}>{player}</span>
                  <span style={{ fontSize:13, fontFamily:display, letterSpacing:2, color:
                    ["cade"].includes(player)?C.detL:
                    ["brunson","bridges"].includes(player)?C.nyk:
                    ["wemby","fox","castle"].includes(player)?C.sas:C.muted
                  }}>{stats.pts ?? "—"} PTS</span>
                </div>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  {stats.ast   && <span style={{ color:C.muted, fontSize:9 }}>{stats.ast} AST</span>}
                  {stats.reb   && <span style={{ color:C.muted, fontSize:9 }}>{stats.reb} REB</span>}
                  {stats.stl   && <span style={{ color:C.green, fontSize:9 }}>{stats.stl} STL</span>}
                  {stats.blk   && <span style={{ color:C.purple, fontSize:9 }}>{stats.blk} BLK</span>}
                  {stats.to    && <span style={{ color:C.red, fontSize:9 }}>{stats.to} TO</span>}
                  {stats.fgPct && <span style={{ color:C.accent, fontSize:9 }}>{stats.fgPct}% FG</span>}
                  {stats.paintPts && <span style={{ color:C.yellow, fontSize:9 }}>{stats.paintPts} PAINT</span>}
                  {stats.paintPct && <span style={{ color:C.yellow, fontSize:9 }}>{stats.paintPct}% PAINT</span>}
                </div>
              </div>
            ))}

            {/* Team comparison */}
            {activeGame==="detVsSas" && (
              <div style={{ marginTop:12 }}>
                <div style={{ fontSize:9, letterSpacing:2, color:C.muted, marginBottom:8 }}>TEAM COMPARISON</div>
                <StatRow label="FG%" val={GAMES.detVsSas.teamDET.fgPct} compare={GAMES.detVsSas.teamSAS.fgPct} unit="%" />
                <StatRow label="Paint Pts" val={GAMES.detVsSas.teamDET.paintPts} compare={GAMES.detVsSas.teamSAS.paintPts} />
                <StatRow label="At-Rim %" val={GAMES.detVsSas.teamDET.rimPct} compare={GAMES.detVsSas.teamSAS.rimPct} unit="%" />
                <StatRow label="Turnovers" val={GAMES.detVsSas.teamDET.to} compare={GAMES.detVsSas.teamSAS.to} higherBetter={false} />
                <StatRow label="Fast Break" val={GAMES.detVsSas.teamDET.fastBreak} compare={GAMES.detVsSas.teamSAS.fastBreak} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── BLUEPRINT TAB ── */}
      {activeTab==="blueprint" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <div style={{ background:C.card, border:`1px solid ${C.nyk}33`, borderRadius:12, padding:20 }}>
            <div style={{ fontSize:9, letterSpacing:2, color:C.nyk, marginBottom:4 }}>WHAT KNICKS DID TO SPURS (MAR 1)</div>
            <div style={{ color:C.muted, fontSize:10, marginBottom:16 }}>NYK 114 – SAS 89 · 25pt blowout at MSG</div>
            {BLUEPRINT.map(b => (
              <div key={b.id} style={{
                padding:"10px 14px", borderRadius:8, marginBottom:8,
                background:"#09101e", border:`1px solid ${C.nyk}22`,
              }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ color:C.text, fontSize:11, fontWeight:"bold" }}>{b.label}</span>
                  <Tag color={C.green}>APPLICABLE</Tag>
                </div>
                <div style={{ color:C.muted, fontSize:10 }}>{b.impact}</div>
              </div>
            ))}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div style={{ background:C.card, border:`1px solid ${C.detL}33`, borderRadius:12, padding:20 }}>
              <div style={{ fontSize:9, letterSpacing:2, color:C.detL, marginBottom:12 }}>DETROIT ASSETS THAT MAP TO THE BLUEPRINT</div>
              {DET_ASSETS.map((a,i) => (
                <div key={i} style={{ display:"flex", gap:10, marginBottom:8, alignItems:"flex-start" }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:C.green, marginTop:4, flexShrink:0 }} />
                  <div>
                    <div style={{ color:C.text, fontSize:11, fontWeight:"bold" }}>{a.label}</div>
                    <div style={{ color:C.muted, fontSize:9, marginTop:2 }}>{a.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background:C.card, border:`1px solid ${C.red}33`, borderRadius:12, padding:20 }}>
              <div style={{ fontSize:9, letterSpacing:2, color:C.red, marginBottom:12 }}>GAPS DETROIT MUST CLOSE</div>
              {DET_GAPS.map((g,i) => (
                <div key={i} style={{ display:"flex", gap:10, marginBottom:8, alignItems:"flex-start" }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:C.red, marginTop:4, flexShrink:0 }} />
                  <div>
                    <div style={{ color:C.text, fontSize:11, fontWeight:"bold" }}>{g.label}</div>
                    <div style={{ color:C.muted, fontSize:9, marginTop:2 }}>{g.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SCENARIO TAB ── */}
      {activeTab==="scenario" && (
        <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:16 }}>
          {/* Scenario selector */}
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <div style={{ fontSize:9, letterSpacing:2, color:C.muted, marginBottom:4 }}>SELECT SCENARIO</div>
            {Object.entries(SCENARIOS).map(([key, s]) => (
              <button key={key} onClick={()=>setActiveScenario(key)} style={{
                padding:"12px 14px", borderRadius:8, textAlign:"left", cursor:"pointer",
                background: activeScenario===key ? `${s.color}12` : "#09101e",
                border:`1px solid ${activeScenario===key ? s.color+"66" : C.border}`,
                color: activeScenario===key ? s.color : C.muted,
                fontFamily:mono, fontSize:10, letterSpacing:1, transition:"all 0.2s",
              }}>
                <div style={{ fontWeight:"bold", marginBottom:4 }}>{s.label}</div>
                <div style={{ display:"flex", gap:8 }}>
                  <span style={{ color:C.detL }}>DET {s.detScore}</span>
                  <span style={{ color:C.muted }}>–</span>
                  <span style={{ color:C.sasD }}>SAS {s.sasScore}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Scenario detail */}
          <div>
            {/* Score display */}
            <div style={{ background:C.card, border:`1px solid ${scen.color}44`, borderRadius:12, padding:24, marginBottom:16, boxShadow:`0 0 30px ${scen.color}10` }}>
              <div style={{ fontSize:9, letterSpacing:2, color:C.muted, marginBottom:16 }}>SIMULATED RESULT</div>
              <div style={{ display:"flex", alignItems:"center", gap:32 }}>
                <div>
                  <div style={{ color:C.muted, fontSize:9, letterSpacing:2 }}>DETROIT</div>
                  <div style={{ fontFamily:display, fontSize:56, color:scen.detScore>scen.sasScore?C.detL:C.muted, lineHeight:1 }}>{scen.detScore}</div>
                </div>
                <div style={{ textAlign:"center" }}>
                  <div style={{
                    padding:"6px 16px", borderRadius:99, fontFamily:display, fontSize:18, letterSpacing:2,
                    background:`${scen.color}18`, border:`1px solid ${scen.color}44`, color:scen.color,
                  }}>
                    {scen.detScore > scen.sasScore ? "DET WINS" : "SAS WINS"}
                  </div>
                  <div style={{ color:C.muted, fontSize:10, marginTop:8 }}>
                    {Math.abs(scen.detScore-scen.sasScore)} pt margin
                  </div>
                </div>
                <div>
                  <div style={{ color:C.muted, fontSize:9, letterSpacing:2 }}>SAN ANTONIO</div>
                  <div style={{ fontFamily:display, fontSize:56, color:scen.sasScore>scen.detScore?C.sas:C.muted, lineHeight:1 }}>{scen.sasScore}</div>
                </div>
              </div>
            </div>

            {/* Detail breakdown */}
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:20 }}>
              <div style={{ fontSize:9, letterSpacing:2, color:C.muted, marginBottom:16 }}>SCENARIO BREAKDOWN</div>
              {[
                { label:"CADE CUNNINGHAM", val:detail?.cade, color:C.detL },
                { label:"VICTOR WEMBANYAMA", val:detail?.wemby, color:C.sas },
                { label:"DET DEFENSE", val:detail?.defense, color:C.green },
                { label:"BENCH / ROTATION", val:detail?.bench, color:C.purple },
              ].map(row => (
                <div key={row.label} style={{
                  display:"grid", gridTemplateColumns:"140px 1fr", gap:12,
                  padding:"10px 0", borderBottom:`1px solid ${C.border}`,
                }}>
                  <span style={{ color:row.color, fontSize:9, letterSpacing:1, paddingTop:2 }}>{row.label}</span>
                  <span style={{ color:C.text, fontSize:11, lineHeight:1.6 }}>{row.val}</span>
                </div>
              ))}
              <div style={{
                marginTop:16, padding:"14px", borderRadius:8,
                background:`${scen.color}0c`, border:`1px solid ${scen.color}33`,
              }}>
                <div style={{ color:scen.color, fontSize:9, letterSpacing:2, marginBottom:6 }}>KEY INSIGHT</div>
                <div style={{ color:C.text, fontSize:11, lineHeight:1.7 }}>{detail?.key}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
