import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

export default function MobileProfileScreen() {
  return (
    <ScrollView className="flex-1 bg-[#121217] p-4">
      <View className="items-center p-6 bg-[#1c1c24] border border-[#272733] rounded-3xl mb-5 space-y-2">
        <View className="h-20 w-20 rounded-full bg-[#7c3aed]/30 items-center justify-center border-2 border-[#7c3aed]">
          <Text className="text-[#7c3aed] font-bold text-2xl">RA</Text>
        </View>
        <Text className="text-white font-bold text-lg">
          Rizky Aditya Pratama
        </Text>
        <Text className="text-gray-400 text-xs">rizky.aditya@example.com</Text>
        <View className="flex-row gap-2 mt-1">
          <View className="px-3 py-1 rounded-full bg-emerald-500/20">
            <Text className="text-emerald-400 text-[10px] font-bold">
              ✓ Verified User
            </Text>
          </View>
          <View className="px-3 py-1 rounded-full bg-[#7c3aed]/20">
            <Text className="text-[#7c3aed] text-[10px] font-bold">
              1.250 Poin
            </Text>
          </View>
        </View>
      </View>

      <View className="bg-[#1c1c24] border border-[#272733] rounded-2xl p-2 space-y-1">
        <TouchableOpacity className="p-3 border-b border-[#272733] flex-row justify-between">
          <Text className="text-white text-xs">Edit Profil &amp; Nomor WhatsApp</Text>
          <Text className="text-gray-400 text-xs">&rarr;</Text>
        </TouchableOpacity>
        <TouchableOpacity className="p-3 border-b border-[#272733] flex-row justify-between">
          <Text className="text-white text-xs">Voucher Diskon Saya</Text>
          <Text className="text-gray-400 text-xs">&rarr;</Text>
        </TouchableOpacity>
        <TouchableOpacity className="p-3 border-b border-[#272733] flex-row justify-between">
          <Text className="text-white text-xs">Pusat Bantuan (FAQ)</Text>
          <Text className="text-gray-400 text-xs">&rarr;</Text>
        </TouchableOpacity>
        <TouchableOpacity className="p-3 flex-row justify-between">
          <Text className="text-red-400 text-xs font-bold">Keluar Akun</Text>
          <Text className="text-red-400 text-xs">&rarr;</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
