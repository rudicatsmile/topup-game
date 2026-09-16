import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#121217" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
          contentStyle: { backgroundColor: "#121217" },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="topup/[slug]"
          options={{ title: "Detail Top-Up Game", headerBackTitle: "Kembali" }}
        />
        <Stack.Screen
          name="auth/login"
          options={{ title: "Masuk Akun", presentation: "modal" }}
        />
      </Stack>
    </>
  );
}
