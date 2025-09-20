import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, PanResponder } from "react-native";
import Svg, { Path } from "react-native-svg";
import { captureRef } from "react-native-view-shot";

const SignaturePad = ({ onChange }) => {
  const [paths, setPaths] = useState<string[]>([]);
  const currentPath = useRef<string>("");
  const svgRef = useRef<View>(null);

  // function to capture the current drawing
  const captureSignature = async (allPaths: string[]) => {
    if (svgRef.current) {
      const base64 = await captureRef(svgRef, {
        format: "png",
        quality: 0.9,
        result: "base64",
      });
      onChange && onChange(`data:image/png;base64,${base64}`);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        currentPath.current = `M${locationX} ${locationY}`;
        setPaths((prev) => {
          const updated = [...prev, currentPath.current];
          captureSignature(updated);
          return updated;
        });
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        currentPath.current += ` L${locationX} ${locationY}`;
        setPaths((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = currentPath.current;
          captureSignature(updated);
          return updated;
        });
      },
      onPanResponderRelease: () => {
        // do nothing (no auto-clear)
      },
    })
  ).current;

  const clear = () => {
    setPaths([]);
    onChange && onChange(null);
  };

  return (
    <View style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8 }}>
      <View
        ref={svgRef}
        {...panResponder.panHandlers}
        style={{ height: 200, backgroundColor: "#fff" }}
      >
        <Svg height="100%" width="100%">
          {paths.map((d, i) => (
            <Path
              key={i}
              d={d}
              stroke="black"
              strokeWidth={2}
              fill="none"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}
        </Svg>
      </View>

      <TouchableOpacity
        onPress={clear}
        style={{ padding: 10, alignItems: "center" }}
      >
        <Text style={{ color: "#ef4444" }}>Effacer</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignaturePad;
