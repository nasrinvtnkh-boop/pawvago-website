import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const SecureStoreAdapter={getItem:key=>SecureStore.getItemAsync(key),setItem:(key,value)=>SecureStore.setItemAsync(key,value),removeItem:key=>SecureStore.deleteItemAsync(key)};
export const supabase=createClient('https://zlwxnycvdihxnfsoobjl.supabase.co','sb_publishable_xMRGDw5Z8nLRBDLOMFTCFw_Yu3yB7BV',{auth:{storage:SecureStoreAdapter,autoRefreshToken:true,persistSession:true,detectSessionInUrl:false}});

export async function loadDashboard(userId){
 const [{data:pet,error:petError},{data:trip,error:tripError}]=await Promise.all([
  supabase.from('pets').select('*').eq('user_id',userId).order('created_at',{ascending:true}).limit(1).maybeSingle(),
  supabase.from('trips').select('*').eq('user_id',userId).order('created_at',{ascending:false}).limit(1).maybeSingle()
 ]);
 if(petError) throw petError;if(tripError) throw tripError;
 return {pet,trip:trip?{...trip,from:trip.origin_city||trip.origin_country,to:trip.destination_city||trip.destination_country,date:trip.travel_date}:null};
}