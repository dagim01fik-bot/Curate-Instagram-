import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal,
  Animated, TouchableWithoutFeedback, Dimensions,
} from 'react-native';
import { colors } from '../../constants/colors';

interface BottomSheetOption {
  label: string;
  icon?: string;
  onPress: () => void;
  destructive?: boolean;
}

interface BottomSheetProps {
  visible: boolean;
  title: string;
  options: BottomSheetOption[];
  onClose: () => void;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

export function BottomSheet({ visible, title, options, onClose }: BottomSheetProps) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
        <View style={styles.handle} />
        <Text style={styles.title}>{title}</Text>
        {options.map((opt, i) => (
          <TouchableOpacity
            key={i}
            style={styles.option}
            onPress={() => { opt.onPress(); onClose(); }}
            activeOpacity={0.7}
          >
            {opt.icon ? <Text style={styles.optionIcon}>{opt.icon}</Text> : null}
            <Text style={[styles.optionLabel, opt.destructive && { color: colors.negative }]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={[styles.option, styles.cancelOption]} onPress={onClose}>
          <Text style={[styles.optionLabel, { color: colors.textSecondary }]}>Cancel</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surfaceHigh,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 36,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 12,
  },
  optionIcon: {
    fontSize: 18,
  },
  optionLabel: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  cancelOption: {
    marginTop: 8,
    borderTopColor: colors.border,
  },
});
