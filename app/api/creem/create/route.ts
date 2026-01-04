import { NextRequest, NextResponse } from 'next/server';
import { createCreem } from 'creem_io';

export async function POST(request: NextRequest) {
  try {
    console.log('Payment API called with Creem SDK');
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    const { productId, planType, userId, amount, currency = 'USD' } = body;

    // 从环境变量获取Creem配置
    const creemApiKey = process.env.CREEM_API_KEY;
    
    if (!creemApiKey) {
      console.error('Creem API key not configured');
      return NextResponse.json({ error: 'Creem API key not configured' }, { status: 500 });
    }

    console.log('Initializing Creem SDK...');
    
    // 初始化Creem SDK
    const creem = createCreem({
      apiKey: creemApiKey,
      testMode: true, // 测试模式
      webhookSecret: process.env.CREEM_WEBHOOK_SECRET,
    });

    // 根据计划类型获取实际的产品ID
    const getProductId = (planId: string) => {
      switch (planId) {
        case 'pro-plan':
          return process.env.CREEM_PRO_PLAN_ID || 'prod_3fqtMm657p4aD7QANJELAS';
        case 'enterprise-plan':
          return process.env.CREEM_ENTERPRISE_PLAN_ID || 'prod_enterprise_default';
        default:
          throw new Error('Invalid plan ID');
      }
    };

    const actualProductId = getProductId(productId);
    console.log('Using product ID:', actualProductId);

    // 构建成功URL，用于支付完成后的重定向
    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`;

    console.log('Creating checkout session...');

    // 使用SDK创建支付会话
            const checkout = await creem.checkouts.create({
              requestId: `req_${Date.now()}_${userId}`, // 生成唯一的请求ID
              productId: actualProductId,
              units: 1,
              successUrl: successUrl,
              customer: {
                // 可以从请求中获取用户信息
                email: `user_${userId}@example.com`, // 临时邮箱，实际项目中应该获取真实邮箱
              },
              metadata: {
                userId: userId,
                planType: planType,
                planId: productId,
                planName: productId === 'pro-plan' ? 'Pro Plan' : 'Enterprise Plan'
              },
            });

    console.log('Checkout session created successfully:', {
      checkoutId: checkout.id,
      checkoutUrl: checkout.checkoutUrl,
      status: checkout.status,
    });

    // 返回结账URL
    return NextResponse.json({ 
      checkoutUrl: checkout.checkoutUrl,
      sessionId: checkout.id,
      checkout: checkout, // 返回完整的checkout对象用于调试
    });

  } catch (error) {
    console.error('Creem payment error:', error);
    
    // 处理SDK错误
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      return NextResponse.json({ 
        error: 'Payment processing error',
        details: error.message
      }, { status: 500 });
    }

    return NextResponse.json({ 
      error: 'Payment processing error',
      details: 'Unknown error occurred'
    }, { status: 500 });
  }
}