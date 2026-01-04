import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const creemApiKey = process.env.CREEM_API_KEY;
    
    console.log('Testing Creem API connection...');
    console.log('API Key exists:', !!creemApiKey);
    
    if (!creemApiKey) {
      return NextResponse.json({ 
        error: 'Creem API key not configured',
        hasApiKey: false
      }, { status: 500 });
    }

    // 测试不同的API端点（包括测试模式）
    const endpoints = [
      'https://test-api.creem.io/health',
      'https://test-api.creem.io/v1/health',
      'https://api.creem.io/health',
      'https://api.creem.io/v1/health'
    ];

    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Testing endpoint: ${endpoint}`);
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'x-api-key': creemApiKey,
            'Authorization': `Bearer ${creemApiKey}`
          }
        });
        
        const text = await response.text();
        console.log(`${endpoint} - Status: ${response.status}`);
        console.log(`${endpoint} - Response: ${text}`);
        
        results.push({
          endpoint,
          status: response.status,
          response: text.substring(0, 200) // 限制响应长度
        });
      } catch (error) {
        console.error(`Error testing ${endpoint}:`, error);
        results.push({
          endpoint,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    return NextResponse.json({
      message: 'Creem API connection test completed',
      hasApiKey: true,
      apiKeyPrefix: creemApiKey.substring(0, 10) + '...',
      results
    });
  } catch (error) {
    console.error('Creem test error:', error);
    return NextResponse.json({ 
      error: 'Test failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}