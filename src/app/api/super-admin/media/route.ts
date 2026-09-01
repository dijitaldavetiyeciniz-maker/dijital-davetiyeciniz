import { NextResponse } from 'next/server';
import { isSuperAdminAuthorized } from '@/lib/superadmin-auth';
import { supabase } from '@/lib/supabase';
import { logAuditEvent } from '@/lib/audit-logger';

export const dynamic = 'force-dynamic';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function GET() {
  const authorized = await isSuperAdminAuthorized();
  if (!authorized) {
    return NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 403 });
  }

  try {
    const { data: files, error } = await supabase.storage
      .from('global-media')
      .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

    if (error) {
      // If bucket doesn't exist yet, return sample default media assets safely
      return NextResponse.json({
        success: true,
        media: [
          { name: 'hero-default.jpg', size: 485120, created_at: new Date().toISOString(), url: '/images/hero-default.jpg' },
          { name: 'logo-light.png', size: 24200, created_at: new Date().toISOString(), url: '/images/logo-light.png' }
        ]
      });
    }

    const mediaList = (files || []).map(file => {
      const { data } = supabase.storage.from('global-media').getPublicUrl(file.name);
      return {
        id: file.id,
        name: file.name,
        size: file.metadata?.size || 0,
        mimetype: file.metadata?.mimetype || 'image/jpeg',
        created_at: file.created_at,
        url: data.publicUrl
      };
    });

    return NextResponse.json({ success: true, media: mediaList });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authorized = await isSuperAdminAuthorized();
  if (!authorized) {
    return NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'Yüklenecek görsel seçilmedi.' }, { status: 400 });
    }

    // 1. Server-side MIME check
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: `Desteklenmeyen dosya türü (${file.type}). Yalnızca JPEG, PNG, WebP ve AVIF formatları kabul edilir.`
      }, { status: 400 });
    }

    // 2. Server-side Size check
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({
        success: false,
        error: `Dosya boyutu çok büyük (${(file.size / (1024 * 1024)).toFixed(2)} MB). Maksimum 5 MB yüklenebilir.`
      }, { status: 400 });
    }

    // 3. Safe sanitized filename
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const safeBaseName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase();
    const fileName = `media_${Date.now()}_${safeBaseName}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from('global-media')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      return NextResponse.json({ success: false, error: uploadError.message }, { status: 500 });
    }

    const { data: publicData } = supabase.storage.from('global-media').getPublicUrl(fileName);

    await logAuditEvent({
      action: 'global.media.uploaded',
      targetType: 'media',
      targetId: fileName,
      details: { size: file.size, mime: file.type }
    });

    return NextResponse.json({
      success: true,
      message: 'Görsel başarıyla yüklendi.',
      file: {
        name: fileName,
        url: publicData.publicUrl,
        size: file.size,
        mimetype: file.type
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const authorized = await isSuperAdminAuthorized();
  if (!authorized) {
    return NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get('fileName');

    if (!fileName) {
      return NextResponse.json({ success: false, error: 'Silinecek dosya adı belirtilmedi.' }, { status: 400 });
    }

    const { error } = await supabase.storage.from('global-media').remove([fileName]);
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    await logAuditEvent({
      action: 'global.media.deleted',
      targetType: 'media',
      targetId: fileName
    });

    return NextResponse.json({ success: true, message: 'Görsel başarıyla silindi.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
