import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Nano Banana Clone",
  },
});

export async function POST(request: Request) {
  try {
    console.log('Starting request...');
    
    const { image, prompt } = await request.json();
    console.log('Request data parsed', { hasImage: !!image, promptLength: prompt?.length });

    if (!image || !prompt) {
      console.error('Missing required data', { hasImage: !!image, hasPrompt: !!prompt });
      return new Response(
        JSON.stringify({ error: 'Missing image or prompt' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if API key exists
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('API key not found in environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error: API key missing' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('API key found in environment variables');
    console.log('Starting image generation request...');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes timeout

    try {
      console.log('Making API call to OpenRouter...');
      
      const completion = await openai.chat.completions.create({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: image,
                },
              },
            ],
          },
        ],
      }, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log('API call completed successfully');
      console.log('API response received:', completion);

      const message = completion.choices[0]?.message;
      
      let imageUrl = null;
      
      if (message?.images && message.images.length > 0) {
        imageUrl = message.images[0].image_url.url;
      } else if (message?.image_url) {
        imageUrl = message.image_url.url || message.image_url;
      } else if (typeof message?.content === 'string') {
        const urlMatch = message.content.match(/https?:\/\/[^\s,\)]+\.(?:png|jpg|jpeg|gif|webp)/i);
        if (urlMatch) {
          imageUrl = urlMatch[0];
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          imageUrl: imageUrl,
          message: message
        }),
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );

    } catch (apiError) {
      clearTimeout(timeoutId);
      
      if (apiError.name === 'AbortError') {
        console.error('Request timed out after 5 minutes');
        return new Response(
          JSON.stringify({ 
            error: 'Request timed out after 5 minutes',
            details: 'The image generation request took too long to complete'
          }),
          { 
            status: 408, 
            headers: { 'Content-Type': 'application/json' } 
          }
        );
      }
      
      throw apiError;
    }

  } catch (error) {
    console.error('Error generating image:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate image',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}