import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

export default function MobileChatScreen() {
  const rooms = [
    {
      id: "1",
      name: 'Andika "ViperML"',
      role: "Joki MLBB (TUG-JKI-2025-000112)",
      lastMsg: "Siap mas, sudah win streak 4x nih di Legend II.",
      time: "11:45",
      unread: 1,
    },
    {
      id: "2",
      name: "CS TopUpGame Support",
      role: "Bantuan Resmi 24 Jam",
      lastMsg: "Ada kendala yang bisa kami bantu mas?",
      time: "Kemarin",
      unread: 0,
    },
  ];

  return (
    <ScrollView className="flex-1 bg-[#121217] p-4">
      <Text className="text-white font-bold text-base mb-3">
        Pusat Percakapan
      </Text>

      {rooms.map((r) => (
        <TouchableOpacity
          key={r.id}
          className="p-3.5 bg-[#1c1c24] border border-[#272733] rounded-2xl mb-2.5 flex-row items-center gap-3"
        >
          <View className="h-10 w-10 rounded-full bg-[#7c3aed]/20 items-center justify-center">
            <Text className="text-[#7c3aed] font-bold text-xs">
              {r.name.slice(0, 2).toUpperCase()}
            </Text>
          </View>
          <View className="flex-1">
            <View className="flex-row justify-between">
              <Text className="text-white font-bold text-xs">{r.name}</Text>
              <Text className="text-gray-400 text-[10px]">{r.time}</Text>
            </View>
            <Text className="text-[#06b6d4] text-[10px]">{r.role}</Text>
            <Text className="text-gray-400 text-xs truncate mt-0.5">
              {r.lastMsg}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
