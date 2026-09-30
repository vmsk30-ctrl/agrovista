import { NextRequest, NextResponse } from 'next/server';
import { globalStore } from '@/lib/database/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const farmerId = searchParams.get('farmerId') || undefined;

    let products = farmerId
      ? globalStore.getFarmerProducts(farmerId)
      : globalStore.getProducts(category, search);

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      farmer_id,
      crop_name,
      category,
      description,
      image_url,
      quantity_available,
      unit,
      farmer_price,
      market_reference_price,
      is_organic,
    } = body;

    // Server-side validation
    if (!crop_name || !farmer_price || !quantity_available) {
      return NextResponse.json(
        { success: false, message: 'Crop name, quantity, and price are required fields.' },
        { status: 400 }
      );
    }

    const newProduct = globalStore.addProduct({
      farmer_id: farmer_id || 'f1',
      crop_name: crop_name.trim(),
      category: category || 'VEGETABLES',
      description: description || 'Direct harvested from Telangana farm.',
      image_url:
        image_url ||
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
      quantity_available: Number(quantity_available),
      unit: unit || 'kg',
      farmer_price: Number(farmer_price),
      market_reference_price: Number(market_reference_price || farmer_price * 1.15),
      status: 'AVAILABLE',
      harvest_date: new Date().toISOString().split('T')[0],
      is_organic: Boolean(is_organic),
    });

    return NextResponse.json({
      success: true,
      message: 'Produce listed successfully on AgroVista marketplace.',
      product: newProduct,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to add product.' },
      { status: 500 }
    );
  }
}
