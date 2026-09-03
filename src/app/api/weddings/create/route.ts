import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { hashPassword } from '@/lib/password-utils';
import { checkDistributedRateLimit } from '@/lib/rate-limiter';
import { signAdminCookie } from '@/lib/auth-cookie';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

    // Rate Limit: 10 creations per 15 minutes per IP
    const rateLimit = await checkDistributedRateLimit(`wedding_create:${ip}`, {
      intervalMs: 15 * 60 * 1000,
      maxRequests: 10
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyiniz.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const {
      bride_name,
      groom_name,
      slug,
      template_id,
      admin_password,
      event_type,
      primary_color,
      text_color,
      envelope_bg_color,
      envelope_color,
      seal_type,
      seal_style,
      font_family,
      names_font_family,
      background_animation,
      effect_type,
      custom_overrides,
      venue_name,
      venue_address,
      entrance_type,
      entrance_animation,
      envelope_flap_type,
      envelope_style
    } = body;

    if (!bride_name || !admin_password || !slug) {
      return NextResponse.json({ success: false, error: 'Gerekli alanlar eksik.' }, { status: 400 });
    }

    // Hash the admin password with scrypt before persistence
    const hashedPassword = hashPassword(admin_password);
    const cleanSlug = String(slug).toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    const supabaseAdmin = getSupabaseAdmin();

    // Check slug uniqueness
    const { data: existing } = await supabaseAdmin
      .from('weddings')
      .select('id')
      .eq('slug', cleanSlug)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ success: false, error: 'Bu bağlantı adı (slug) zaten kullanımda.' }, { status: 409 });
    }

    const payload = {
      bride_name: String(bride_name).trim(),
      groom_name: groom_name ? String(groom_name).trim() : '',
      bride_parents: '',
      groom_parents: '',
      slug: cleanSlug,
      template_id: template_id || 'modern-minimalist',
      primary_color: primary_color || '#d4af37',
      text_color: text_color || '#1a1a1a',
      envelope_bg_color: envelope_bg_color || '#ffffff',
      envelope_color: envelope_color || '#f5f5f5',
      seal_type: seal_type || 'heart',
      seal_style: seal_style || 'heart',
      font_family: font_family || 'Playfair Display',
      names_font_family: names_font_family || 'Great Vibes',
      background_animation: background_animation || 'none',
      effect_type: effect_type || 'none',
      custom_overrides: custom_overrides || {},
      admin_password: hashedPassword,
      event_type: event_type || 'wedding',
      venue_name: venue_name || 'Modern Sanatlar Merkezi',
      wedding_date: null,
      venue_address: venue_address || 'İstanbul',
      google_maps_url: '',
      custom_message: '',
      is_paid: false,
      is_active: true,
      entrance_type: entrance_type || 'envelope',
      entrance_animation: entrance_animation || 'envelope',
      envelope_flap_type: envelope_flap_type || 'classic',
      envelope_style: envelope_style || 'classic',
      show_program: false
    };

    const { data: createdWedding, error } = await supabaseAdmin
      .from('weddings')
      .insert([payload])
      .select('id, slug')
      .single();

    if (error || !createdWedding) {
      return NextResponse.json({ success: false, error: 'Kayıt oluşturulamadı.' }, { status: 500 });
    }

    // Set signed admin authentication cookie
    const cookieStore = await cookies();
    const signedValue = signAdminCookie(createdWedding.id);
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7,
    };

    cookieStore.set(`admin_auth_${createdWedding.id}`, signedValue, cookieOptions);
    cookieStore.set(`admin_auth_${createdWedding.slug}`, signedValue, cookieOptions);

    return NextResponse.json({ success: true, wedding: createdWedding });
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
