import React from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Link } from "expo-router";

export default function MobileKatalogScreen() {
  const games = [
    { id: "1", name: "Mobile Legends: Bang Bang", slug: "mobile-legends", platform: "Mobile" },
    { id: "2", name: "Free Fire", slug: "free-fire", platform: "Mobile" },
    { id: "3", name: "Valorant", slug: "valorant", platform: "PC" },
    { id: "4", name: "PUBG Mobile", slug: "pubg-mobile", platform: "Mobile" },
    { id: "5", name: "Genshin Impact", slug: "genshin-impact", platform: "Multi" },
    { id: "6", name: "Honor of Kings", slug: "honor-of-kings", platform: "Mobile" },
  ];

  return (
    <ScrollView className="flex-1 bg-[#121217] p-4">
      <View className="mb-4">
        <TextInput
          placeholder="Cari game..."
          placeholderTextColor="#8b8b9e"
          className="h-11 bg-[#1c1c24] border border-[#272733] rounded-xl px-4 text-white text-xs"
        />
      </View>

      <Text className="text-white font-bold text-sm mb-3">
        Daftar Semua Game
      </Text>

      {games.map((g) => (
        <Link key={g.id} href={`/topup/${g.slug}`} asChild>
          <TouchableOpacity className="flex-row items-center justify-between p-3.5 bg-[#1c1c24] border border-[#272733] rounded-2xl mb-2.5">
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 bg-[#272733] rounded-xl items-center justify-center">
                <Text className="text-[#06b6d4] font-bold text-xs">
                  {g.slug.slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <View>
                <Text className="text-white font-bold text-xs">{g.name}</Text>
                <Text className="text-gray-400 text-[10px]">{g.platform}</Text>
              </View>
            </View>
            <Text className="text-[#7c3aed] font-bold text-xs">Buka &rarr;</Text>
          </TouchableOpacity>
        </Link>
      ))}
    </ScrollView>
  );
}
