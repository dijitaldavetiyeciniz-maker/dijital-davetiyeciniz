import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { getUserEntitlements, canPublish } from '@/lib/entitlements';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: weddingId } = await params;
    const body = await req.json().catch(() => ({}));
    const supabase = getSupabaseAdmin();

    // 1. Fetch current wedding record
    const { data: wedding, error: fetchError } = await supabase
      .from('weddings')
      .select('*')
      .or(`id.eq.${weddingId},slug.eq.${weddingId}`)
      .single();

    if (fetchError || !wedding) {
      return NextResponse.json({ error: 'Davetiye bulunamadı.' }, { status: 404 });
    }

    // 2. Validate essential fields based on event type
    const isCorporate = wedding.event_type === 'corporate' || wedding.event_type === 'Kurumsal';
    if (!isCorporate && !wedding.bride_name && !wedding.groom_name) {
      return NextResponse.json({ error: 'Davetiye yayınlamak için isim alanı zorunludur.' }, { status: 400 });
    }

    // 3. Prepare immutable publication snapshot from current draft or wedding state
    const currentDraft = wedding.draft_data || wedding.custom_overrides?.draft_data || {};
    const snapshot = {
      template_id: currentDraft.template_id || wedding.template_id,
      primary_color: currentDraft.primary_color || wedding.primary_color,
      text_color: currentDraft.text_color || wedding.text_color,
      envelope_color: currentDraft.envelope_color || wedding.envelope_color,
      envelope_bg_color: currentDraft.envelope_bg_color || wedding.envelope_bg_color,
      envelope_flap_type: currentDraft.envelope_flap_type || wedding.envelope_flap_type,
      seal_type: currentDraft.seal_type || wedding.seal_type,
      seal_color: currentDraft.seal_color || wedding.seal_color,
      seal_style: currentDraft.seal_style || wedding.seal_style,
      entrance_type: currentDraft.entrance_type || wedding.entrance_type,
      effect_type: currentDraft.effect_type || wedding.effect_type,
      font_family: currentDraft.font_family || wedding.font_family,
      names_font_family: currentDraft.names_font_family || wedding.names_font_family,
      background_image_url: currentDraft.background_image_url || wedding.background_image_url,
      use_envelope: currentDraft.use_envelope !== undefined ? currentDraft.use_envelope : wedding.use_envelope,
      event_type: currentDraft.event_type || wedding.event_type,
      bride_name: currentDraft.bride_name || wedding.bride_name,
      groom_name: currentDraft.groom_name || wedding.groom_name,
      bride_parents: currentDraft.bride_parents || wedding.bride_parents,
      groom_parents: currentDraft.groom_parents || wedding.groom_parents,
      wedding_date: currentDraft.wedding_date || wedding.wedding_date,
      venue_name: currentDraft.venue_name || wedding.venue_name,
      venue_address: currentDraft.venue_address || wedding.venue_address,
      google_maps_url: currentDraft.google_maps_url || wedding.google_maps_url,
      custom_message: currentDraft.custom_message || wedding.custom_message,
      music_url: currentDraft.music_url || wedding.music_url,
      music_autoplay: currentDraft.music_autoplay !== undefined ? currentDraft.music_autoplay : wedding.music_autoplay,
      show_photos: currentDraft.show_photos !== undefined ? currentDraft.show_photos : wedding.show_photos,
      show_rsvp: currentDraft.show_rsvp !== undefined ? currentDraft.show_rsvp : wedding.show_rsvp,
      show_comments: currentDraft.show_comments !== undefined ? currentDraft.show_comments : wedding.show_comments,
      show_countdown: currentDraft.show_countdown !== undefined ? currentDraft.show_countdown : wedding.show_countdown,
      background_animation: currentDraft.background_animation || wedding.background_animation,
      entrance_animation: currentDraft.entrance_animation || wedding.entrance_animation,
      envelope_style: currentDraft.envelope_style || wedding.envelope_style,
      countdown_style: currentDraft.countdown_style || wedding.countdown_style,
      is_dark_mode: currentDraft.is_dark_mode !== undefined ? currentDraft.is_dark_mode : wedding.is_dark_mode,
      custom_overrides: currentDraft.custom_overrides || wedding.custom_overrides,
      published_at: new Date().toISOString()
    };

    // 4. Server-Side Entitlement Check
    const userEntitlements = await getUserEntitlements(wedding.user_id);
    const publishCheck = canPublish(userEntitlements.planTier, {
      is_paid: wedding.is_paid,
      template_id: snapshot.template_id,
      entrance_animation: snapshot.entrance_animation
    });

    if (!publishCheck.allowed) {
      return NextResponse.json({
        error: publishCheck.error,
        upgrade_required: true,
        current_plan: userEntitlements.planName
      }, { status: 403 });
    }

    const newVersionNumber = (wedding.published_version_number || 0) + 1;

    // 5. Update wedding table with published snapshot & active status
    const overrides = {
      ...(wedding.custom_overrides || {}),
      published_snapshot: snapshot,
      is_published: true,
      published_version_number: newVersionNumber,
      has_unpublished_changes: false,
      published_at: new Date().toISOString()
    };

    const basePayload: any = {
      ...snapshot,
      is_paid: true,
      custom_overrides: overrides
    };

    let updateError: any = null;
    const { error: fullError } = await supabase
      .from('weddings')
      .update({
        ...basePayload,
        is_published: true,
        published_snapshot: snapshot,
        published_version_number: newVersionNumber,
        has_unpublished_changes: false,
        published_at: new Date().toISOString()
      })
      .eq('id', wedding.id);

    if (fullError) {
      const { error: fallbackError } = await supabase
        .from('weddings')
        .update(basePayload)
        .eq('id', wedding.id);
      updateError = fallbackError;
    }

    if (updateError) {
      return NextResponse.json({ error: 'Yayınlama işlemi gerçekleştirilemedi: ' + updateError.message }, { status: 500 });
    }

    // 6. Create immutable version history record
    try {
      await supabase.from('invitation_versions').insert([
        {
          wedding_id: wedding.id,
          version_number: newVersionNumber,
          version_type: 'published',
          is_published: true,
          summary: body.summary || `Sürüm ${newVersionNumber} Yayını`,
          snapshot: snapshot,
          created_by: wedding.user_id || null,
          created_at: new Date().toISOString()
        }
      ]);
    } catch (verErr) {
      console.warn('Version recording warning:', verErr);
    }

    // 7. Security & Audit log
    try {
      await supabase.from('security_events').insert([
        {
          event_type: 'INVITATION_PUBLISHED',
          actor_email: wedding.user_id,
          details: { wedding_id: wedding.id, slug: wedding.slug, version: newVersionNumber }
        }
      ]);
    } catch {}

    return NextResponse.json({
      success: true,
      message: 'Davetiye başarıyla yayına alındı.',
      version_number: newVersionNumber,
      published_at: overrides.published_at,
      snapshot
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Yayınlama hatası: ' + err.message }, { status: 500 });
  }
}
