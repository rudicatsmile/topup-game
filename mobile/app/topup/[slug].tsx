import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function MobileTopupDetailScreen() {
  const { slug } = useLocalSearchParams();
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [selectedNominal, setSelectedNominal] = useState("172 Diamonds");
  const [selectedPrice, setSelectedPrice] = useState("Rp 43.000");

  const nominals = [
    { label: "86 Diamonds", price: "Rp 22.000" },
    { label: "172 Diamonds", price: "Rp 43.000" },
    { label: "257 Diamonds", price: "Rp 64.500" },
    { label: "706 Diamonds", price: "Rp 175.000" },
    { label: "Weekly Diamond Pass", price: "Rp 29.500" },
  ];

  const handleCheckout = () => {
    if (!userId.trim()) {
      Alert.alert("Perhatian", "Silakan masukkan User ID Game Anda.");
      return;
    }
    Alert.alert(
      "Konfirmasi Pembayaran",
      `Order ${selectedNominal} untuk ID ${userId} (${selectedPrice}) berhasil dibuat!`,
      [{ text: "OK", onPress: () => router.push("/order") }]
    );
  };

  return (
    <ScrollView className="flex-1 bg-[#121217] p-4 space-y-4">
      {/* 1. Input ID */}
      <View className="p-4 bg-[#1c1c24] border border-[#272733] rounded-2xl space-y-3">
        <Text className="text-white font-bold text-sm">
          1. Masukkan Data Akun Game
        </Text>
        <TextInput
          placeholder="User ID (Contoh: 84729104)"
          placeholderTextColor="#8b8b9e"
          value={userId}
          onChangeText={setUserId}
          keyboardType="numeric"
          className="h-11 bg-[#121217] border border-[#272733] rounded-xl px-3 text-white text-xs"
        />
        <TextInput
          placeholder="Zone ID (Contoh: 2104)"
          placeholderTextColor="#8b8b9e"
          value={zoneId}
          onChangeText={setZoneId}
          keyboardType="numeric"
          className="h-11 bg-[#121217] border border-[#272733] rounded-xl px-3 text-white text-xs"
        />
      </View>

      {/* 2. Pilih Nominal */}
      <View className="p-4 bg-[#1c1c24] border border-[#272733] rounded-2xl space-y-3">
        <Text className="text-white font-bold text-sm">
          2. Pilih Nominal Diamond
        </Text>
        <View className="flex-row flex-wrap justify-between">
          {nominals.map((item, idx) => {
            const isSelected = selectedNominal === item.label;
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                  setSelectedNominal(item.label);
                  setSelectedPrice(item.price);
                }}
                className={`w-[48%] p-3 rounded-xl border mb-2.5 ${
                  isSelected
                    ? "bg-[#7c3aed]/20 border-[#7c3aed]"
                    : "bg-[#121217] border-[#272733]"
                }`}
              >
                <Text className="text-white font-bold text-xs">
                  {item.label}
                </Text>
                <Text className="text-[#06b6d4] font-bold text-xs mt-1">
                  {item.price}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 3. Tombol Bayar */}
      <View className="p-4 bg-[#1c1c24] border border-[#272733] rounded-2xl space-y-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-400 text-xs">Total Pembayaran:</Text>
          <Text className="text-[#06b6d4] font-bold text-lg">
            {selectedPrice}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleCheckout}
          className="h-12 bg-[#7c3aed] rounded-xl items-center justify-center shadow-lg"
        >
          <Text className="text-white font-bold text-sm">
            Bayar Sekarang (QRIS / VA)
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
