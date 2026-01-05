import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 验证Webhook签名(实际部署时需要实现)
    const signature = request.headers.get('creem-signature');
    // const webhookSecret = process.env.CREEM_WEBHOOK_SECRET;
    
    // 验证签名逻辑(实际部署时需要实现)
    // if (!verifySignature(request.body, signature, webhookSecret)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    // 解析Webhook载荷
    const event = await request.json();
    
    // 根据事件类型处理不同的支付事件
    switch (event.type) {
      case 'payment.succeeded':
        // 支付成功处理逻辑
        console.log('Payment succeeded:', event.data);
        break;
      case 'payment.failed':
        // 支付失败处理逻辑
        console.log('Payment failed:', event.data);
        break;
      case 'subscription.created':
        // 订阅创建处理逻辑
        console.log('Subscription created:', event.data);
        break;
      case 'subscription.updated':
        // 订阅更新处理逻辑
        console.log('Subscription updated:', event.data);
        break;
      case 'subscription.cancelled':
        // 订阅取消处理逻辑
        console.log('Subscription cancelled:', event.data);
        break;
      default:
        console.log('Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 });
  }
}