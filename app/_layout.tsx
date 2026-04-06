import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      {/* <Stack.Screen name="(auth)" /> */}
    </Stack>
  );
}

//COLORS
// Primary Blue #0057B7
// Green.   #28A745
// Yellow.  #FFC107
// Red.     #DC3545
// Whitish. #F8F9FA
// Black.   #212529