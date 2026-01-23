import { SymbolView, SymbolViewProps, SymbolWeight } from "expo-symbols";
import { JSX } from "react";
import { StyleProp, ViewStyle } from "react-native";

interface IconSymbolProps {
  name: SymbolViewProps["name"];
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}

/**
 * Icon symbol component
 * @param {IconSymbolProps} props - The properties for the icon symbol component
 * @returns {JSX.Element} The rendered icon symbol component
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = "regular",
}: IconSymbolProps): JSX.Element {
  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}
