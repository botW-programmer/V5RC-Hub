import { createClient } from '@supabase/supabase-js'

// 1. Replace the URL below with the one from your Data API page
const supabaseUrl = 'https://gfvidqheuypixapnkahb.supabase.co'

// 2. Replace the Key below with the sb_publishable... key from your screenshot
const supabaseKey = 'sb_publishable_JatjCNbUbLPw2pZV3_Rblw_knuS6jOn'

export const supabase = createClient(supabaseUrl, supabaseKey)