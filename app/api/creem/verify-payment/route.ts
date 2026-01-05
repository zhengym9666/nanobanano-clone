import { NextRequest, NextResponse } from 'next/server';
import { createCreem } from 'creem_io';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;
    
    if (!sessionId) {
      console.error('No session ID provided');
      return NextResponse.json({ 
        success: false, 
        message: 'Session ID is required' 
      }, { status: 400 });
    }

    // 从环境变量获取Creem API密钥
    const creemApiKey = process.env.CREEM_API_KEY;
    const webhookSecret = process.env.CREEM_WEBHOOK_SECRET;
    
    if (!creemApiKey) {
      console.error('Creem API key not configured');
      return NextResponse.json({ 
        success: false, 
        message: 'Creem API key not configured' 
      }, { status: 500 });
    }

    // 初始化Creem客户端
    const creem = createCreem({
      apiKey: creemApiKey,
      webhookSecret: webhookSecret,
      testMode: true, // 在测试环境中使用
    });

    // 使用会话ID获取支付详情
    console.log('Retrieving checkout session:', sessionId);
    
    const checkout = await creem.checkouts.get({
      checkoutId: sessionId,
    });

    console.log('Checkout session retrieved:', {
      id: checkout.id,
      status: checkout.status,
      amount: checkout.amount,
      currency: checkout.currency,
    });

    // 检查支付状态
    const isPaymentSuccessful = checkout.status === 'completed' || checkout.status === 'paid';
    
    if (!isPaymentSuccessful) {
      return NextResponse.json({
        success: false,
        message: `Payment status is ${checkout.status}, not completed`,
        checkout: {
          id: checkout.id,
          status: checkout.status,
          amount: checkout.amount,
          currency: checkout.currency,
        }
      });
    }

    // 获取产品信息
    let product = null;
    try {
      if (checkout.product_id) {
        const productData = await creem.products.get({
          productId: checkout.product_id,
        });
        product = {
          id: productData.id,
          name: productData.name,
          price: productData.price,
          currency: productData.currency,
        };
      }
    } catch (productError) {
      console.warn('Could not fetch product details:', productError);
      // 继续处理，不因为获取产品详情失败而中断
    }

    // 返回成功的支付验证结果
    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      checkout: {
        id: checkout.id,
        status: checkout.status,
        amount: checkout.amount,
        currency: checkout.currency,
        created_at: checkout.created_at,
      },
      product: product,
      customer: checkout.customer ? {
        email: checkout.customer.email,
        name: checkout.customer.name,
      } : null,
    });
    
  } catch (error) {
    console.error('Payment verification error:', error);
    
    // 处理不同类型的错误
    if (error instanceof Error) {
      if (error.message.includes('not found') || error.message.includes('404')) {
        return NextResponse.json({
          success: false,
          message: 'Payment session not found',
          details: error.message,
        }, { status: 404 });
      }
      
      return NextResponse.json({
        success: false,
        message: 'Payment verification failed',
        details: error.message,
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Payment verification failed',
      details: 'Unknown error occurred',
    }, { status: 500 });
  }
}