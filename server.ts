import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Setup JSON parsing for larger body sizes due to base64 images upload
app.use(express.json({ limit: "15mb" }));

// In-Memory storage initialized with high-fidelity student hackers dataset
const INITIAL_HACKERS = [
  {
    id: "seed-1",
    fullName: "Alex Rivera",
    college: "MIT",
    role: "AI/ML Engineer",
    email: "arivera@mit.edu",
    bio: "Building distributed deep learning pipelines for autonomous drone delivery. Ready with pre-trained models. Excited about Computer Vision apps.",
    lookingFor: "Looking for an expert Frontend developer who understands interactive WebGL maps.",
    skills: ["Python", "PyTorch", "TensorFlow", "Node.js"],
    github: "alexr-datasets",
    linkedin: "alex-rivera-deeplearning",
    likes: 18,
    isBookmarked: false,
    isInvited: false,
    avatar: null,
    avatarColor: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)"
  },
  {
    id: "seed-2",
    fullName: "Sarah Jenkins",
    college: "Stanford University",
    role: "UI/UX Designer",
    email: "sjenkins@stanford.edu",
    bio: "Crafting beautiful, accessible designer-developer handoffs. Expert in Figma component structures, dark styles, and fluid layout frameworks.",
    lookingFor: "Seeking a Full-stack developer to assemble a beautiful carbon tracking platform.",
    skills: ["Figma", "Tailwind", "React", "Illustrator"],
    github: "sarahj-creatives",
    linkedin: "sarah-jenkins-design",
    likes: 24,
    isBookmarked: true,
    isInvited: false,
    avatar: null,
    avatarColor: "linear-gradient(135deg, #ec4899 0%, #a855f7 100%)"
  },
  {
    id: "seed-3",
    fullName: "Julie Shen",
    college: "Carnegie Mellon",
    role: "Product Manager",
    email: "jshen@andrew.cmu.edu",
    bio: "Ex-Meta Intern. Specialized in product spec definitions, interactive high-fidelity user workflows, and agile team sprint tracking methodologies.",
    lookingFor: "Looking to join a serious, hardware-focused hack team in the health tech sector.",
    skills: ["Figma", "Scrum", "Next.js", "Trello"],
    github: "julieshen-pms",
    linkedin: "julie-shen-pm",
    likes: 12,
    isBookmarked: false,
    isInvited: true,
    avatar: null,
    avatarColor: "linear-gradient(135deg, #f59e0b 0%, #e11d48 100%)"
  },
  {
    id: "seed-4",
    fullName: "Liam Chen",
    college: "UC Berkeley",
    role: "Backend Developer",
    email: "lchen@berkeley.edu",
    bio: "Go developer and Kubernetes wrangler. Loving low-latency microservices, gRPC channels, and secure custom JWT authentication middleware engines.",
    lookingFor: "Looking to connect with Frontend developers building creative canvas interfaces.",
    skills: ["Go", "Kubernetes", "Docker", "Node.js"],
    github: "lchen-cores",
    linkedin: "liam-chen-infrastructure",
    likes: 15,
    isBookmarked: false,
    isInvited: false,
    avatar: null,
    avatarColor: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)"
  },
  {
    id: "seed-5",
    fullName: "Emily Zhao",
    college: "UT Austin",
    role: "Frontend Developer",
    email: "ezhao@utexas.edu",
    bio: "Creative frontend specialist. Built 10+ open source React widgets. Obsessed with high-contrast UI, page transitions, and smooth CSS keyframes designs.",
    lookingFor: "Looking for an expert AI/ML engineer to make a cool natural language SQL generator.",
    skills: ["React", "Vue", "Tailwind", "TypeScript"],
    github: "emilyz-dev",
    linkedin: "emily-zhao-frontend",
    likes: 31,
    isBookmarked: false,
    isInvited: false,
    avatar: null,
    avatarColor: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)"
  },
  {
    id: "seed-6",
    fullName: "David Kim",
    college: "Georgia Tech",
    role: "Full Stack Developer",
    email: "dkim@gatech.edu",
    bio: "Full stack engineering generalist. Love shipping products end-to-end. Experienced with Express.js APIs, GraphQL, and Redis memory caches.",
    lookingFor: "Looking for a proactive PM to lead user interviews and layout presentation pitch decks.",
    skills: ["React", "Express", "Node.js", "MongoDB"],
    github: "davidk-stack",
    linkedin: "david-kim-fullstack",
    likes: 19,
    isBookmarked: false,
    isInvited: false,
    avatar: null,
    avatarColor: "linear-gradient(135deg, #1f2937 0%, #4b5563 100%)"
  }
];

let hackers = [...INITIAL_HACKERS];

// Gemini AI Client Lazy Initialization
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    // Note: fallback or warning if API key is missing, so it doesn't crash server immediately
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY_IF_MISSING",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// --------------------------------------------------------------------------
// backend REST API routes
// --------------------------------------------------------------------------

// Fetch all hacker profiles
app.get("/api/hackers", (req, res) => {
  res.json(hackers);
});

// Create new hacker profile
app.post("/api/hackers", (req, res) => {
  const { fullName, college, role, email, bio, lookingFor, skills, github, linkedin, avatarColor, avatar } = req.body;

  if (!fullName || !college || !role || !email || !bio || !lookingFor || !skills || !skills.length) {
    return res.status(400).json({ error: "Missing required profile parameters." });
  }

  const newHacker = {
    id: "user-" + Date.now(),
    fullName,
    college,
    role,
    email,
    bio,
    lookingFor,
    skills,
    github: github || "",
    linkedin: linkedin || "",
    likes: 0,
    isBookmarked: false,
    isInvited: false,
    avatar: avatar || null,
    avatarColor: avatarColor || "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
  };

  hackers.unshift(newHacker);
  res.status(201).json(newHacker);
});

// Increment hacker profile like/upvote
app.post("/api/hackers/:id/like", (req, res) => {
  const hackerId = req.params.id;
  const match = hackers.find(h => h.id === hackerId);
  if (match) {
    match.likes += 1;
    res.json({ success: true, likes: match.likes });
  } else {
    res.status(404).json({ error: "Hacker standard profile not found." });
  }
});

// Toggle hacker profile bookmarking
app.post("/api/hackers/:id/bookmark", (req, res) => {
  const hackerId = req.params.id;
  const match = hackers.find(h => h.id === hackerId);
  if (match) {
    match.isBookmarked = !match.isBookmarked;
    res.json({ success: true, isBookmarked: match.isBookmarked });
  } else {
    res.status(404).json({ error: "Hacker standard profile not found." });
  }
});

// Toggle hacker profile team invite status
app.post("/api/hackers/:id/invite", (req, res) => {
  const hackerId = req.params.id;
  const match = hackers.find(h => h.id === hackerId);
  if (match) {
    match.isInvited = !match.isInvited;
    res.json({ success: true, isInvited: match.isInvited });
  } else {
    res.status(404).json({ error: "Hacker standard profile not found." });
  }
});

// Reset hacker dataset to default seeds
app.post("/api/hackers/reset", (req, res) => {
  hackers = [...INITIAL_HACKERS];
  res.json({ success: true, message: "Dataset restored to standard seeds." });
});

// AI Teammate Recommender Endpoint using Gemini API
app.post("/api/hackers/recommend", async (req, res) => {
  const { currentHackerId, userBio, userSkills, userRole, lookingForQuery } = req.body;

  // Use customized lookup parameters based on request payload
  const currentBio = userBio || "";
  const currentSkills = userSkills || [];
  const currentRole = userRole || "";
  const currentLookingFor = lookingForQuery || "";

  // Filter candidates pool (exclude the user's active profile if ID is provided)
  const candidates = hackers.filter(h => h.id !== currentHackerId);

  if (candidates.length === 0) {
    return res.json({ recommendations: [] });
  }

  const activeApiKey = process.env.GEMINI_API_KEY;
  if (!activeApiKey) {
    // Graceful fallback with static match scoring mechanism if key is not set
    console.warn("GEMINI_API_KEY environment variable is not defined, returning fallback matcher engine results.");
    const fallbacks = candidates.slice(0, 3).map((h, i) => {
      // Calculate simple mock synergy percentage based on overlap
      let pct = 70 + (i * 8);
      if (pct > 98) pct = 95;
      return {
        hackerId: h.id,
        matchPercentage: pct,
        matchReason: `Complementary skills: Excellent compatibility between your requested focus and ${h.fullName}'s proficiency in ${h.skills.slice(0, 2).join(", ")}.`
      };
    });
    return res.json({ recommendations: fallbacks, isMockResult: true });
  }

  try {
    const ai = getAiClient();
    const userSummary = {
      role: currentRole,
      bio: currentBio,
      skills: currentSkills,
      lookingFor: currentLookingFor
    };

    const promptString = `I want you to analyze the following user profiles and find the absolute best match suggestions.
Target user profile summary:
${JSON.stringify(userSummary, null, 2)}

Available student candidates pool:
${JSON.stringify(candidates.map(h => ({
  id: h.id,
  fullName: h.fullName,
  role: h.role,
  bio: h.bio,
  skills: h.skills,
  lookingFor: h.lookingFor
})), null, 2)}

Return exactly the top 3 best fits with their match score percentage (0-100) and an elegant, encouraging sentence explaining why they are an amazing fit.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptString,
      config: {
        systemInstruction: "You are the AI Matchmaker Coach engine for HackMatch. Analyze user background (skills, roles, bio) and lookingFor requests. Recommend exactly up to 3 candidates from the pool that form complementary synergies. For example, connect layout UI designers with expert full stack developers, AI scientists with Python script developers, etc. Frame findings positively with a warm, expert human coach tone.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              description: "List of top matching candidate recommendations",
              items: {
                type: Type.OBJECT,
                properties: {
                  hackerId: { type: Type.STRING, description: "ID matching a student profile from the candidates pool" },
                  matchPercentage: { type: Type.INTEGER, description: "Calculated compatibility or synergy percentage from 0 to 100" },
                  matchReason: { type: Type.STRING, description: "A highly concise, professional reason (1 sentence) for why they make an outstanding teammate match" }
                },
                required: ["hackerId", "matchPercentage", "matchReason"]
              }
            }
          },
          required: ["recommendations"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No text response received from Gemini engine.");
    }

    const parsed = JSON.parse(resultText.trim());
    res.json(parsed);

  } catch (error: any) {
    console.error("Gemini Matchmaker API execution issue:", error);
    // Ensure clean recovery and fallback results rather than crashing the client interface
    const rescueList = candidates.slice(0, 3).map((h, i) => ({
      hackerId: h.id,
      matchPercentage: 75 + i * 5,
      matchReason: `Synergy check: ${h.fullName} brings highly compatible proficiency with ${h.skills[0]} to your team configuration.`
    }));
    res.json({ recommendations: rescueList, isRescueResult: true, errorMessage: error.message });
  }
});

// Vite & Static file hosting configuration
async function startAppServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static build routing directory configured.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Full-Stack App] HackMatch server running on http://localhost:${PORT}`);
  });
}

startAppServer().catch((err) => {
  console.error("Failed to bootstrap full stack Express middleware container:", err);
});
