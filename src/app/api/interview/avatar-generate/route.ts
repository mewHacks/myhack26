import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type AvatarGenerateBody = {
  image?: string;
  investorName?: string;
};

function extractBase64Payload(dataUrl: string) {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) return null;
  return { mimeType: match[1], data: match[2] };
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.POLLINATIONS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Missing POLLINATIONS_API_KEY. Pollinations image generation now requires an API key from enter.pollinations.ai.",
      },
      { status: 500 }
    );
  }

  const body = (await request.json()) as AvatarGenerateBody;
  const parsedImage = body.image ? extractBase64Payload(body.image) : null;

  if (!parsedImage) {
    return NextResponse.json({ error: "A valid uploaded image is required." }, { status: 400 });
  }

  const investorName = body.investorName?.trim() || "investor";
  const prompt = [
    `Create a polished AI avatar portrait for ${investorName}.`,
    "Keep the face identity recognizable from the uploaded image.",
    "Make the subject front-facing, professional, centered, and suitable for an interview preview UI.",
    "Use a clean soft background, natural lighting, and crisp facial details.",
    "Preserve the hairstyle, face shape, and skin tone from the source image.",
    "Return only one image.",
  ].join(" ");

  const formData = new FormData();
  const imageBuffer = Buffer.from(parsedImage.data, "base64");
  const imageBlob = new Blob([imageBuffer], { type: parsedImage.mimeType });
  const extension = parsedImage.mimeType.includes("png") ? "png" : "jpg";

  formData.append("model", "p-image-edit");
  formData.append("prompt", prompt);
  formData.append("image", imageBlob, `investor-avatar.${extension}`);
  formData.append("n", "1");
  formData.append("size", "1024x1024");
  formData.append("quality", "medium");
  formData.append("response_format", "b64_json");
  formData.append("safe", "true");
  formData.append("user", "covalent-ai-interview");

  const response = await fetch(`https://gen.pollinations.ai/v1/images/edits?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  const data = (await response.json()) as {
    data?: Array<{
      b64_json?: string;
      url?: string;
      revised_prompt?: string;
    }>;
    error?: { message?: string; code?: string };
    message?: string;
  };

  if (!response.ok) {
    return NextResponse.json(
      { error: data.error?.message || data.message || "Avatar generation failed." },
      { status: response.status || 500 }
    );
  }

  const encodedImage = data.data?.[0]?.b64_json;
  if (!encodedImage) {
    const imageUrl = data.data?.[0]?.url;
    if (imageUrl) {
      return NextResponse.json({ image: imageUrl });
    }
    return NextResponse.json({ error: "Pollinations did not return an image." }, { status: 502 });
  }

  return NextResponse.json({
    image: `data:image/png;base64,${encodedImage}`,
  });
}
