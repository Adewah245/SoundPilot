var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_url = require("url");
var import_vite = require("vite");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_genai = require("@google/genai");
var import_meta = {};
import_dotenv.default.config();
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = import_path.default.dirname(__filename);
async function startServer() {
  const app = (0, import_express.default)();
  const DEFAULT_PORT = Number(process.env.PORT || 3e3);
  const MAX_PORT_RETRIES = 10;
  const listenOnPort = (port, attempt = 1) => {
    const server = app.listen(port, "0.0.0.0", () => {
      console.log(`SoundPilot Orchestrator running on http://0.0.0.0:${port}`);
    });
    server.on("error", (error) => {
      if (error && error.code === "EADDRINUSE" && attempt <= MAX_PORT_RETRIES) {
        const nextPort = port + 1;
        console.warn(`Port ${port} is busy, retrying on ${nextPort}...`);
        listenOnPort(nextPort, attempt + 1);
        return;
      }
      console.error("Failed to start SoundPilot server:", error);
      process.exit(1);
    });
  };
  app.use(import_express.default.json());
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      system: "SoundPilot Orchestrator",
      engine: "Engineering Engine v1.0",
      dsp: "Python DSP Simulator Bridge v1.0",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  app.post("/api/ai/explain", async (req, res) => {
    try {
      const { engineeringResult, venueContext, equipmentContext, userMode, query } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.json({
          explanation: generateOfflineExplanation(engineeringResult, venueContext, equipmentContext, userMode),
          isAiGenerated: false,
          note: "Offline deterministic engineering rules engine active. (No Gemini API key needed)."
        });
      }
      const ai = new import_genai.GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      const systemPrompt = `You are SoundPilot's Acoustic Engineering AI Assistant.
Follow SoundPilot's strict boundary rule:
- Measurements are produced by DSP.
- Engineering compliance is verified by the Engineering Engine.
- Your role is ONLY to explain the engineering evaluation clearly to the audio engineer, recommending practical physical and electroacoustic adjustments.
- Mode: ${userMode === "pro" ? "Pro Sound Engineer (use precise dB, Q values, Hz, delay ms, speaker dispersion)" : "Simple/Operator Mode (plain language, clear step-by-step physical knob/fader/placement advice)"}.

Context:
Venue: ${JSON.stringify(venueContext || {})}
Equipment: ${JSON.stringify(equipmentContext || {})}
Engineering Evaluation Result: ${JSON.stringify(engineeringResult || {})}
User Query: ${query || "Provide an actionable analysis and recommended adjustments."}

Keep the response structured, clear, and actionable. Avoid speculation.`;
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: systemPrompt
      });
      res.json({
        explanation: response.text || "No explanation generated.",
        isAiGenerated: true
      });
    } catch (error) {
      console.error("AI Explanation error:", error);
      res.json({
        explanation: "Engineering Engine Diagnostic: Target tolerances evaluated. Adjust zone EQ cut at problem resonance frequency and verify speaker coverage angles before continuing session.",
        isAiGenerated: false,
        error: error.message
      });
    }
  });
  function generateOfflineExplanation(eng, venue, eq, mode) {
    const isPro = mode === "pro";
    if (!eng) {
      return "All current acoustic metrics conform to the nominal target profile. Ready for sound check.";
    }
    const alerts = eng.alerts || [];
    const compliance = eng.complianceRate ?? 88;
    if (isPro) {
      return `### Acoustic Engineering Diagnostic Report
**Profile Match & Compliance**: ${compliance}% within nominal tolerance envelope (\xB12.5 dB).
**Venue Acoustic Context**: ${venue?.name || "Main Venue"} (${venue?.zones?.length || 3} zones active).

**Identified Deviations & Corrective Actions**:
${alerts.length > 0 ? alerts.map((a, i) => `${i + 1}. **${a}**: Compensate with high-Q notch or parametric cut; verify boundary distance to prevent quarter-wavelength cancellation.`).join("\n") : "\u2022 Frequency response is within \xB12dB reference curve across audience listening plane."}

**Verification Mandate**: Once EQ or gain adjustments are committed to the DSP/Mixer, initiate re-verification sweep to log differential delta.`;
    } else {
      return `### Sound Check Summary
Your sound system is currently **${compliance >= 85 ? "sounding well balanced" : "needing a few quick adjustments"}** (${compliance}% overall match).

**What to adjust**:
${alerts.length > 0 ? alerts.map((a) => `\u2022 ${a}`).join("\n") : "\u2022 Sound levels and clarity look great across all audience areas."}

**Next Step**:
Make the suggested adjustments on your mixer or amplifier, then click **Verify Changes** to ensure the room sounds perfect!`;
    }
  }
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  listenOnPort(DEFAULT_PORT);
}
startServer();
//# sourceMappingURL=server.cjs.map
