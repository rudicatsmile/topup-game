import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

export default function MobileOrderScreen() {
  const orders = [
    {
      id: "1",
      invoice: "TUG-2025-000431",
      game: "Mobile Legends",
      item: "172 Diamonds",
      total: "Rp 39.000",
      status: "SUKSES",
    },
    {
      id: "2",
      invoice: "TUG-JKI-2025-000112",
      game: "Mobile Legends Joki",
      item: "Legend V → Mythic",
      total: "Rp 137.500",
      status: "ON PROGRESS (85%)",
    },
    {
      id: "3",
      invoice: "TUG-2025-000430",
      game: "Valorant",
      item: "1.375 VP",
      total: "Rp 136.500",
      status: "DIPROSES",
    },
  ];

  return (
    <ScrollView className="flex-1 bg-[#121217] p-4">
      <Text className="text-white font-bold text-base mb-3">
        Pesanan Saya
      </Text>

      {orders.map((o) => (
        <View
          key={o.id}
          className="p-4 bg-[#1c1c24] border border-[#272733] rounded-2xl mb-3 space-y-1.5"
        >
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-[#7c3aed] font-mono font-bold text-xs">
              {o.invoice}
            </Text>
            <View className="px-2 py-0.5 rounded-full bg-[#7c3aed]/20">
              <Text className="text-[#06b6d4] font-bold text-[10px]">
                {o.status}
              </Text>
            </View>
          </View>
          <Text className="text-white font-bold text-sm">{o.game}</Text>
          <Text className="text-gray-400 text-xs">{o.item}</Text>
          <View className="flex-row justify-between items-center pt-2 border-t border-[#272733]">
            <Text className="text-gray-400 text-xs">Total Pembayaran:</Text>
            <Text className="text-[#06b6d4] font-bold text-sm">{o.total}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
