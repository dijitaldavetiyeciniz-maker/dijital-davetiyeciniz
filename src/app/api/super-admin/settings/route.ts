import { NextResponse } from 'next/server';
import { isSuperAdminAuthorized } from '@/lib/superadmin-auth';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: settings } = await supabase
      .from('platform_settings')
      .select('*')
      .eq('id', 'default')
      .maybeSingle();

    const defaultSettings = {
      maintenance_enabled: false,
      maintenance_scope: 'platform', // 'platform' or 'full'
      maintenance_message: 'Sistemlerimizde kısa süreli bir bakım çalışması gerçekleştirilmektedir. Anlayışınız için teşekkür ederiz.',
      maintenance_until: null,
      announcement_enabled: false,
      announcement_message: '',
      announcement_type: 'info',
      contact_email: 'dijitaldavetiyeciniz@gmail.com',
      contact_phone: '+90 555 000 0000',
      contact_address: 'Levent, Büyükdere Cad. No: 199, Şişli / İstanbul'
    };

    return NextResponse.json({
      success: true,
      settings: settings || defaultSettings
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authorized = await isSuperAdminAuthorized();
  if (!authorized) {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      maintenance_enabled,
      maintenance_scope,
      maintenance_message,
      maintenance_until,
      announcement_enabled,
      announcement_message,
      announcement_type,
      contact_email,
      contact_phone,
      contact_address
    } = body;

    const payload: any = {
      id: 'default',
      updated_at: new Date().toISOString(),
      updated_by: 'Super Admin'
    };

    if (maintenance_enabled !== undefined) payload.maintenance_enabled = maintenance_enabled;
    if (maintenance_scope !== undefined) payload.maintenance_scope = maintenance_scope;
    if (maintenance_message !== undefined) payload.maintenance_message = maintenance_message;
    if (maintenance_until !== undefined) payload.maintenance_until = maintenance_until;
    if (announcement_enabled !== undefined) payload.announcement_enabled = announcement_enabled;
    if (announcement_message !== undefined) payload.announcement_message = announcement_message;
    if (announcement_type !== undefined) payload.announcement_type = announcement_type;
    if (contact_email !== undefined) payload.contact_email = contact_email;
    if (contact_phone !== undefined) payload.contact_phone = contact_phone;
    if (contact_address !== undefined) payload.contact_address = contact_address;

    const { data, error } = await supabase
      .from('platform_settings')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.warn('Upsert platform settings warning:', error.message);
    }

    // Determine audit action
    let auditAction = 'settings_updated';
    if (maintenance_enabled !== undefined) {
      auditAction = maintenance_enabled ? 'maintenance_mode_enabled' : 'maintenance_mode_disabled';
    } else if (announcement_enabled !== undefined) {
      auditAction = announcement_enabled ? 'announcement_enabled' : 'announcement_disabled';
    }

    await supabase.from('super_admin_audit_logs').insert([
      {
        action: auditAction,
        actor_email: 'Super Admin',
        details: payload
      }
    ]);

    return NextResponse.json({
      success: true,
      message: 'Platform ayarları başarıyla güncellendi.',
      settings: data || payload
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
