/**
 * Canonical C8 Test Publishing Helpers
 * Ensures test fixtures conform to the C8 Draft/Published isolation model
 * with graceful fallback for environments before migration 013 is applied.
 */

export function makePublishedSnapshot(data: Record<string, any>): Record<string, any> {
  return {
    template_id: data.template_id || 'template1',
    primary_color: data.primary_color,
    text_color: data.text_color,
    envelope_color: data.envelope_color,
    envelope_bg_color: data.envelope_bg_color,
    envelope_flap_type: data.envelope_flap_type,
    seal_type: data.seal_type,
    seal_color: data.seal_color,
    seal_style: data.seal_style,
    entrance_type: data.entrance_type,
    effect_type: data.effect_type,
    font_family: data.font_family,
    names_font_family: data.names_font_family,
    background_image_url: data.background_image_url,
    use_envelope: data.use_envelope,
    event_type: data.event_type || 'wedding',
    bride_name: data.bride_name !== undefined ? data.bride_name : 'Test Bride',
    groom_name: data.groom_name !== undefined ? data.groom_name : 'Test Groom',
    bride_parents: data.bride_parents,
    groom_parents: data.groom_parents,
    wedding_date: data.wedding_date !== undefined ? data.wedding_date : '2027-10-15T19:00:00.000Z',
    venue_name: data.venue_name || 'Test Venue',
    venue_address: data.venue_address,
    google_maps_url: data.google_maps_url,
    custom_message: data.custom_message,
    music_url: data.music_url,
    music_autoplay: data.music_autoplay,
    show_photos: data.show_photos,
    show_rsvp: data.show_rsvp,
    show_comments: data.show_comments,
    show_countdown: data.show_countdown,
    background_animation: data.background_animation,
    entrance_animation: data.entrance_animation,
    envelope_style: data.envelope_style,
    countdown_style: data.countdown_style,
    is_dark_mode: data.is_dark_mode,
    custom_overrides: data.custom_overrides,
    published_at: data.published_at || new Date().toISOString()
  };
}

export function buildPublishedWeddingRecord(data: Record<string, any>): Record<string, any> {
  const snapshot = makePublishedSnapshot(data);
  const overrides = {
    ...(data.custom_overrides || {}),
    published_snapshot: snapshot,
    is_published: true
  };

  return {
    ...data,
    is_paid: data.is_paid !== undefined ? data.is_paid : true,
    is_published: true,
    published_version_number: data.published_version_number || 1,
    published_snapshot: snapshot,
    custom_overrides: overrides
  };
}

export function buildPublishedWeddingFallbackRecord(data: Record<string, any>): Record<string, any> {
  const snapshot = makePublishedSnapshot(data);
  const overrides = {
    ...(data.custom_overrides || {}),
    published_snapshot: snapshot,
    is_published: true
  };

  const { is_published, published_version_number, published_snapshot, ...rest } = data;
  return {
    ...rest,
    is_paid: rest.is_paid !== undefined ? rest.is_paid : true,
    custom_overrides: overrides
  };
}

export function buildPublishedWeddingUpdate(data: Record<string, any>): Record<string, any> {
  const snapshot = makePublishedSnapshot(data);
  return {
    ...data,
    is_published: true,
    published_version_number: data.published_version_number || 1,
    published_snapshot: snapshot,
    custom_overrides: {
      ...(data.custom_overrides || {}),
      published_snapshot: snapshot,
      is_published: true
    }
  };
}

export function buildPublishedWeddingFallbackUpdate(data: Record<string, any>): Record<string, any> {
  const snapshot = makePublishedSnapshot(data);
  const { is_published, published_version_number, published_snapshot, ...rest } = data;
  return {
    ...rest,
    custom_overrides: {
      ...(data.custom_overrides || {}),
      published_snapshot: snapshot,
      is_published: true
    }
  };
}

export async function insertPublishedWedding(supabase: any, recordOrRecords: any | any[]) {
  const isArray = Array.isArray(recordOrRecords);
  const records = isArray ? recordOrRecords : [recordOrRecords];

  const fullRecords = records.map(r => buildPublishedWeddingRecord(r));
  const res = await supabase.from('weddings').insert(fullRecords);

  if (res.error && (res.error.message?.includes('is_published') || res.error.message?.includes('schema cache') || res.error.message?.includes('column'))) {
    const fallbackRecords = records.map(r => buildPublishedWeddingFallbackRecord(r));
    return await supabase.from('weddings').insert(fallbackRecords);
  }

  return res;
}

export async function updatePublishedWedding(supabase: any, updateData: any, matchQuery: { column: string; value: any }) {
  const fullPayload = buildPublishedWeddingUpdate(updateData);
  const res = await supabase.from('weddings').update(fullPayload).eq(matchQuery.column, matchQuery.value);

  if (res.error && (res.error.message?.includes('is_published') || res.error.message?.includes('schema cache') || res.error.message?.includes('column'))) {
    const fallbackPayload = buildPublishedWeddingFallbackUpdate(updateData);
    return await supabase.from('weddings').update(fallbackPayload).eq(matchQuery.column, matchQuery.value);
  }

  return res;
}
