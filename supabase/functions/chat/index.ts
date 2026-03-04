import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DEMO_CURRICULUM = `
# Introduction to Biology - Sample Curriculum

## Chapter 1: Cell Biology
Cells are the basic unit of life. All living organisms are made up of cells. There are two main types: prokaryotic (no nucleus, like bacteria) and eukaryotic (with nucleus, like plant and animal cells).

Key organelles: nucleus (DNA storage), mitochondria (energy/ATP production), ribosomes (protein synthesis), endoplasmic reticulum (protein processing), Golgi apparatus (packaging/shipping), cell membrane (selective barrier).

## Chapter 2: Photosynthesis
Photosynthesis is the process by which plants convert light energy into chemical energy (glucose). It occurs in chloroplasts.

Light-dependent reactions: Occur in thylakoid membranes. Water is split, O2 is released, ATP and NADPH are produced.
Calvin Cycle (light-independent): Occurs in stroma. CO2 is fixed into glucose using ATP and NADPH.

Overall equation: 6CO2 + 6H2O + light energy → C6H12O6 + 6O2

## Chapter 3: DNA and Genetics
DNA (deoxyribonucleic acid) is a double helix molecule that carries genetic information. It consists of nucleotides with bases: Adenine-Thymine, Guanine-Cytosine.

DNA Replication: Semi-conservative process. Helicase unwinds, primase adds RNA primer, DNA polymerase synthesizes new strand, ligase seals fragments.

Transcription: DNA → mRNA in the nucleus. RNA polymerase reads template strand.
Translation: mRNA → protein at ribosomes. tRNA brings amino acids matching codons.

## Chapter 4: Cell Division
Mitosis: One cell divides into two identical daughter cells. Phases: Prophase, Metaphase, Anaphase, Telophase.
Purpose: Growth, repair, asexual reproduction.

Meiosis: One cell divides into four genetically unique haploid cells. Two divisions (meiosis I and II).
Purpose: Production of gametes (sex cells). Crossing over creates genetic diversity.
`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, courseId, isDemo, isStuck } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    let curriculumContext = "";
    let strictness = 5;

    if (isDemo) {
      curriculumContext = DEMO_CURRICULUM;
    } else if (courseId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Get course settings
      const { data: course } = await supabase
        .from("courses").select("socratic_strictness").eq("id", courseId).single();
      if (course) strictness = course.socratic_strictness;

      // Get curriculum documents
      const { data: docs } = await supabase
        .from("curriculum_documents").select("title, content").eq("course_id", courseId);
      if (docs && docs.length > 0) {
        curriculumContext = docs.map((d: any) => `## ${d.title}\n${d.content}`).join("\n\n");
      }
    }

    const strictnessGuide = strictness <= 3
      ? "You may provide gentle hints and nudge students toward the answer. You can confirm when they're on the right track."
      : strictness <= 6
      ? "Use a balanced Socratic approach. Ask guiding questions but don't give answers. Provide moderate hints when students are stuck."
      : "Be strictly Socratic. NEVER give any part of the answer. Only respond with questions that force the student to think deeper. Even when they're stuck, respond with questions.";

    const stuckAddendum = isStuck
      ? "\n\nThe student has indicated they are stuck. You may provide a slightly more direct hint — but still do NOT give the answer. Break the problem into a smaller sub-question they can answer."
      : "";

    const systemPrompt = `You are Neural Layer, a Socratic AI tutor. Your ABSOLUTE rules:

1. NEVER give direct answers to academic questions
2. ALWAYS respond with guiding questions that lead students to discover answers themselves
3. Reference ONLY the curriculum materials provided below — do not use outside knowledge
4. If a question falls outside the curriculum scope, say: "That's an interesting question, but it's outside the scope of our current materials. Let's focus on what we're studying."
5. Be encouraging and patient, but firm about not giving away answers
6. Use the student's own reasoning to build understanding
7. When a student gives a correct answer, celebrate it and ask a follow-up that deepens understanding

Socratic Strictness Level: ${strictness}/10
${strictnessGuide}
${stuckAddendum}

=== CURRICULUM MATERIALS ===
${curriculumContext || "No curriculum materials have been uploaded for this course yet. Inform the student that the teacher hasn't added materials yet."}
=== END CURRICULUM ===

Remember: You are a guide, not an answer machine. Your goal is to develop critical thinking.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((m: any) => ({ role: m.role, content: m.content })),
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
