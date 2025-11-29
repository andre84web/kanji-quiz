// App.js
// Kanji Quiz Offline - stile "The Kana Quiz"
// Mostra un kanji e 3–4 opzioni in hiragana, basato sui gruppi selezionati.

import React, { useState, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList
} from 'react-native';
import { KANJI_GROUPS } from './kanjiData';

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getRandomItem(array) {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

// Crea una domanda: 1 kanji + 3–4 opzioni in hiragana
function createQuestion(pool) {
  if (!pool || pool.length === 0) return null;

  const correct = getRandomItem(pool);

  // raccogli letture diverse per le opzioni sbagliate
  const otherReadings = pool
    .filter((item) => item.kanji !== correct.kanji)
    .map((item) => item.reading);

  // togli duplicati
  const uniqueOther = Array.from(new Set(otherReadings));

  // scegli 2-3 letture sbagliate
  const wrongOptions = shuffleArray(uniqueOther).slice(0, 3);

  // inserisci quella corretta e mischia
  const options = shuffleArray([correct.reading, ...wrongOptions]).slice(0, 4);

  return {
    kanji: correct.kanji,
    correctReading: correct.reading,
    options
  };
}

export default function App() {
  const [selectedGroupIds, setSelectedGroupIds] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [lastAnswer, setLastAnswer] = useState(null); // 'correct' | 'wrong' | null
  const [lastSelectedOption, setLastSelectedOption] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(1);

  // pool di kanji basato sui gruppi selezionati
  const kanjiPool = useMemo(() => {
    const groups = KANJI_GROUPS.filter((g) =>
      selectedGroupIds.includes(g.id)
    );
    return groups.flatMap((g) => g.items);
  }, [selectedGroupIds]);

  function toggleGroup(id) {
    setSelectedGroupIds((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  }

  function startQuiz() {
    if (kanjiPool.length < 3) {
      // servono almeno 3 kanji per avere opzioni decenti
      alert(
        'Seleziona gruppi con almeno 3 kanji in totale per iniziare il quiz.'
      );
      return;
    }
    const q = createQuestion(kanjiPool);
    setCurrentQuestion(q);
    setLastAnswer(null);
    setLastSelectedOption(null);
    setQuestionIndex(1);
    setQuizStarted(true);
  }

  function goBackToSelection() {
    setQuizStarted(false);
    setCurrentQuestion(null);
    setLastAnswer(null);
    setLastSelectedOption(null);
    setQuestionIndex(1);
  }

  function nextQuestion() {
    const q = createQuestion(kanjiPool);
    setCurrentQuestion(q);
    setLastAnswer(null);
    setLastSelectedOption(null);
    setQuestionIndex((prev) => prev + 1);
  }

  function handleAnswer(option) {
    if (!currentQuestion) return;
    if (lastAnswer !== null) return; // evita doppio tap sulla stessa domanda

    const isCorrect = option === currentQuestion.correctReading;
    setLastSelectedOption(option);
    setLastAnswer(isCorrect ? 'correct' : 'wrong');
  }

  if (!quizStarted) {
    // SCHERMATA SELEZIONE GRUPPI
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Kanji Quiz Offline</Text>
        <Text style={styles.subtitle}>
          Seleziona uno o più gruppi di kanji, poi premi "Inizia".
        </Text>

        <FlatList
          data={KANJI_GROUPS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.groupsList}
          renderItem={({ item }) => {
            const selected = selectedGroupIds.includes(item.id);
            return (
              <TouchableOpacity
                style={[
                  styles.groupButton,
                  selected && styles.groupButtonSelected
                ]}
                onPress={() => toggleGroup(item.id)}
              >
                <Text
                  style={[
                    styles.groupButtonText,
                    selected && styles.groupButtonTextSelected
                  ]}
                >
                  {selected ? '✓ ' : ''}{item.label}
                </Text>
                <Text style={styles.groupCount}>
                  {item.items.length} kanji
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        <TouchableOpacity
          style={[
            styles.startButton,
            kanjiPool.length < 3 && styles.startButtonDisabled
          ]}
          onPress={startQuiz}
        >
          <Text style={styles.startButtonText}>Inizia il quiz</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // SCHERMATA QUIZ
  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Kanji Quiz Offline</Text>
        <Text>Caricamento domanda...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.quizHeader}>
        <TouchableOpacity onPress={goBackToSelection}>
          <Text style={styles.backText}>{'<'} Indietro</Text>
        </TouchableOpacity>
        <Text style={styles.questionCounter}>Domanda #{questionIndex}</Text>
      </View>

      <View style={styles.kanjiBox}>
        <Text style={styles.kanjiText}>{currentQuestion.kanji}</Text>
      </View>

      <Text style={styles.instructions}>
        Scegli la lettura corretta in hiragana:
      </Text>

      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option) => {
          const isSelected = option === lastSelectedOption;
          let optionStyle = styles.optionButton;
          let optionTextStyle = styles.optionText;

          if (lastAnswer && isSelected) {
            if (lastAnswer === 'correct') {
              optionStyle = [styles.optionButton, styles.optionCorrect];
              optionTextStyle = [styles.optionText, styles.optionTextSelected];
            } else {
              optionStyle = [styles.optionButton, styles.optionWrong];
              optionTextStyle = [styles.optionText, styles.optionTextSelected];
            }
          }

          return (
            <TouchableOpacity
              key={option}
              style={optionStyle}
              onPress={() => handleAnswer(option)}
            >
              <Text style={optionTextStyle}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.feedbackContainer}>
        {lastAnswer === 'correct' && (
          <Text style={styles.feedbackCorrect}>Corretto!</Text>
        )}
        {lastAnswer === 'wrong' && (
          <Text style={styles.feedbackWrong}>
            Sbagliato… risposta giusta: {currentQuestion.correctReading}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.nextButton,
          lastAnswer === null && styles.nextButtonDisabled
        ]}
        onPress={nextQuestion}
        disabled={lastAnswer === null}
      >
        <Text style={styles.nextButtonText}>Prossima domanda</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1020',
    paddingHorizontal: 16,
    paddingTop: 24
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 16
  },
  groupsList: {
    paddingBottom: 16
  },
  groupButton: {
    backgroundColor: '#1c2333',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2f3950'
  },
  groupButtonSelected: {
    backgroundColor: '#30415a',
    borderColor: '#4fc3f7'
  },
  groupButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500'
  },
  groupButtonTextSelected: {
    color: '#e0f7fa'
  },
  groupCount: {
    color: '#aaaaaa',
    fontSize: 12,
    marginTop: 4
  },
  startButton: {
    marginTop: 8,
    backgroundColor: '#4fc3f7',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center'
  },
  startButtonDisabled: {
    opacity: 0.5
  },
  startButtonText: {
    color: '#001018',
    fontWeight: '700',
    fontSize: 16
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  backText: {
    color: '#4fc3f7',
    fontSize: 14
  },
  questionCounter: {
    color: '#ffffff',
    fontSize: 14
  },
  kanjiBox: {
    backgroundColor: '#111827',
    borderRadius: 16,
    paddingVertical: 32,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151'
  },
  kanjiText: {
    fontSize: 64,
    color: '#ffffff',
    fontWeight: '700'
  },
  instructions: {
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 12
  },
  optionsContainer: {
    marginBottom: 16
  },
  optionButton: {
    backgroundColor: '#1f2937',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#374151'
  },
  optionCorrect: {
    backgroundColor: '#16a34a',
    borderColor: '#22c55e'
  },
  optionWrong: {
    backgroundColor: '#b91c1c',
    borderColor: '#f87171'
  },
  optionText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center'
  },
  optionTextSelected: {
    fontWeight: '700'
  },
  feedbackContainer: {
    minHeight: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  feedbackCorrect: {
    color: '#4ade80',
    fontSize: 16,
    fontWeight: '600'
  },
  feedbackWrong: {
    color: '#fecaca',
    fontSize: 14
  },
  nextButton: {
    backgroundColor: '#4fc3f7',
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
    marginBottom: 12
  },
  nextButtonDisabled: {
    opacity: 0.4
  },
  nextButtonText: {
    color: '#001018',
    fontWeight: '700',
    fontSize: 16
  }
});
