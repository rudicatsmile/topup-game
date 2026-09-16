import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { Link } from "expo-router";

export default function MobileHomeScreen() {
  const games = [
    { id: "1", name: "Mobile Legends", slug: "mobile-legends", category: "MOBA" },
    { id: "2", name: "Free Fire", slug: "free-fire", category: "Battle Royale" },
    { id: "3", name: "Valorant", slug: "valorant", category: "FPS" },
    { id: "4", name: "PUBG Mobile", slug: "pubg-mobile", category: "Battle Royale" },
    { id: "5", name: "Genshin Impact", slug: "genshin-impact", category: "RPG" },
    { id: "6", name: "Honor of Kings", slug: "honor-of-kings", category: "MOBA" },
  ];

  return (
    <ScrollView className="flex-1 bg-[#121217] p-4">
      {/* Banner Promo */}
      <View className="p-5 rounded-2xl bg-[#7c3aed]/20 border border-[#7c3aed]/40 mb-6">
        <Text className="text-[#06b6d4] text-xs font-bold uppercase tracking-wider mb-1">
          FLASH SALE HARI INI
        </Text>
        <Text className="text-white text-xl font-bold mb-2">
          Weekly Diamond Pass Hanya Rp 29.500
        </Text>
        <Text className="text-gray-400 text-xs mb-3">
          Top-up kilat hitungan detik via QRIS &amp; e-Wallet langsung masuk.
        </Text>
        <TouchableOpacity className="bg-[#7c3aed] py-2.5 px-4 rounded-xl self-start">
          <Text className="text-white font-bold text-xs">Top-Up Sekarang</Text>
        </TouchableOpacity>
      </View>

      {/* Game Populer */}
      <Text className="text-white font-bold text-base mb-3">
        Game Terpopuler
      </Text>
      <View className="flex-row flex-wrap justify-between">
        {games.map((g) => (
          <Link key={g.id} href={`/topup/${g.slug}`} asChild>
            <TouchableOpacity className="w-[48%] bg-[#1c1c24] border border-[#272733] p-3 rounded-2xl mb-3 items-center">
              <View className="h-16 w-16 bg-[#272733] rounded-xl mb-2 items-center justify-center">
                <Text className="text-[#7c3aed] font-bold text-xs">
                  {g.slug.slice(0, 3).toUpperCase()}
                </Text>
              </View>
              <Text className="text-white font-bold text-xs text-center">
                {g.name}
              </Text>
              <Text className="text-gray-400 text-[10px]">{g.category}</Text>
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}
