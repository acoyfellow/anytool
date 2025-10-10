import alchemy from "alchemy";
import { Worker, WorkerLoader, R2Bucket, Ai } from "alchemy/cloudflare";

const projectName = "anytool";
const password = process.env.ALCHEMY_PASSWORD || projectName;

const project = await alchemy(projectName, { password });

const OPENAI_API_KEY = alchemy.secret(process.env.OPENAI_API_KEY);

const AI_BINDING = Ai();

const LOADER = WorkerLoader();

const TOOL_CACHE = await R2Bucket("tool-cache", {
  name: "anytool-cache",
  adopt: true,
});

export const worker = await Worker("anytool", {
  name: "anytool",
  entrypoint: "src5/worker.tsx",
  compatibilityDate: "2025-10-01",
  compatibilityFlags: ["nodejs_compat"],
  observability: { enabled: true },
  adopt: true,
  bindings: {
    TOOL_CACHE,
    AI: AI_BINDING,
    LOADER,
    OPENAI_API_KEY,
  },
});

console.log(worker);

await project.finalize();

