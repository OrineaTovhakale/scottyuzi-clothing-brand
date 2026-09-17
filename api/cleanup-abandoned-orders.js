// api/cleanup-cancelled-orders.js
// Automatically DELETES cancelled orders that are older than 24 hours
// This runs as a scheduled Vercel Cron Job every 6 hours

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Security: Only allow POST requests (from Vercel Cron)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Optional: Add a secret token for security
  const cronSecret = req.headers.authorization;
  if (cronSecret !== `Bearer ${process.env.CRON_SECRET}`) {
    console.log('❌ Unauthorized cron request');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  console.log('🗑️ Starting cleanup of old cancelled orders...');

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Supabase credentials missing');
      return res.status(500).json({ error: 'Database not configured' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Calculate cutoff time (24 hours ago)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    console.log(`🔍 Looking for cancelled orders created before: ${twentyFourHoursAgo}`);

    // Find all cancelled orders older than 24 hours
    const { data: cancelledOrders, error: fetchError } = await supabase
      .from('orders')
      .select('id, payment_id, email, created_at, first_name')
      .eq('status', 'cancelled')
      .lt('created_at', twentyFourHoursAgo);

    if (fetchError) {
      console.error('❌ Error fetching cancelled orders:', fetchError);
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (!cancelledOrders || cancelledOrders.length === 0) {
      console.log('✅ No old cancelled orders to delete');
      return res.status(200).json({ 
        message: 'No cancelled orders to delete',
        deleted: 0
      });
    }

    console.log(`📝 Found ${cancelledOrders.length} old cancelled orders to delete`);

    const orderIds = cancelledOrders.map(o => o.id);

    // STEP 1: Delete associated order_items first (foreign key constraint)
    const { error: itemsDeleteError } = await supabase
      .from('order_items')
      .delete()
      .in('order_id', orderIds);

    if (itemsDeleteError) {
      console.error('❌ Error deleting order items:', itemsDeleteError);
      return res.status(500).json({ error: 'Failed to delete order items' });
    }

    console.log(`✅ Deleted order items for ${cancelledOrders.length} orders`);

    // STEP 2: Delete the orders themselves
    const { data: deletedOrders, error: deleteError } = await supabase
      .from('orders')
      .delete()
      .in('id', orderIds)
      .select();

    if (deleteError) {
      console.error('❌ Error deleting orders:', deleteError);
      return res.status(500).json({ error: 'Failed to delete orders' });
    }

    console.log(`✅ Successfully deleted ${deletedOrders.length} cancelled orders`);
    
    // Log each deleted order
    deletedOrders.forEach(order => {
      console.log(`   - ${order.payment_id} (${order.email}) - Created: ${new Date(order.created_at).toLocaleDateString()}`);
    });

    return res.status(200).json({
      message: 'Cleanup completed successfully',
      deleted: deletedOrders.length,
      orders: deletedOrders.map(o => o.payment_id)
    });

  } catch (error) {
    console.error('❌ Cleanup error:', error);
    return res.status(500).json({ 
      error: 'Cleanup failed',
      details: error.message 
    });
  }
}