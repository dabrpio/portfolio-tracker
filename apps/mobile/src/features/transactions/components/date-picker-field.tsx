import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker, {
  type DateTimePickerChangeEvent,
} from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DatePickerFieldProps {
  value: string; // ISO datetime string
  onChange: (isoDate: string) => void;
  error?: string;
  label?: string;
}

export function DatePickerField({
  value,
  onChange,
  error,
  label = 'Transaction date',
}: DatePickerFieldProps) {
  const currentDate = value ? new Date(value) : new Date();
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(currentDate);

  function handleAndroidValueChange(
    _event: DateTimePickerChangeEvent,
    selectedDate: Date,
  ) {
    setShowPicker(false);
    if (selectedDate) {
      onChange(selectedDate.toISOString());
    }
  }

  function handleAndroidDismiss() {
    setShowPicker(false);
  }

  function handleIOSConfirm() {
    onChange(tempDate.toISOString());
    setShowPicker(false);
  }

  function handleOpenPicker() {
    setTempDate(value ? new Date(value) : new Date());
    setShowPicker(true);
  }

  const formattedDate = currentDate.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <Pressable
        style={({ pressed }) => [
          styles.input,
          error ? styles.inputError : null,
          pressed ? styles.inputPressed : null,
        ]}
        onPress={handleOpenPicker}
      >
        <Text style={styles.dateText}>{formattedDate}</Text>
        <MaterialCommunityIcons
          name="calendar-month-outline"
          size={20}
          color="#64748b"
        />
      </Pressable>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {showPicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={currentDate}
          mode="date"
          display="default"
          onValueChange={handleAndroidValueChange}
          onDismiss={handleAndroidDismiss}
        />
      )}

      {showPicker && Platform.OS !== 'android' && (
        <Modal
          visible={showPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPicker(false)}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowPicker(false)}
          >
            <Pressable
              style={styles.modalContent}
              onPress={(e) => e.stopPropagation()}
            >
              <SafeAreaView edges={['bottom']}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select date</Text>
                  <Pressable onPress={handleIOSConfirm} hitSlop={8}>
                    <Text style={styles.doneButtonText}>Done</Text>
                  </Pressable>
                </View>

                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onValueChange={(_e, d) => {
                    if (d) setTempDate(d);
                  }}
                  style={styles.iosPicker}
                />
              </SafeAreaView>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  inputPressed: {
    backgroundColor: '#f8fafc',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  dateText: {
    fontSize: 16,
    color: '#0f172a',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
  },
  iosPicker: {
    height: 200,
  },
});
